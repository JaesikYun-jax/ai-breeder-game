/**
 * Episode Editor — full-raw markdown edit mode for the reader view.
 *
 * Toggle ON  → .reader-body is hidden, a <textarea> with raw markdown is mounted
 *              alongside it inside .reader-page. Floating buttons swap to [✓ 저장][✕ 취소].
 * Toggle OFF → textarea removed, body restored, floating button returns to ✏️.
 *
 * Save  → PUT /__episode with originalRaw equality check.
 *         On success, calls onSaved(newRaw) so the host (main.ts) can mutate the
 *         in-memory cache and re-render the body without a page reload.
 *
 * Comments coexist: while editing, the textarea lives outside .reader-body, so
 * the comment selection handler (which scopes to .reader-body) naturally ignores
 * it — no extra wiring needed here.
 */

export interface EditorOptions {
  projectId: string;
  episodeId: string;
  bodyEl: HTMLElement;
  initialRaw: string;
  onSaved: (newRaw: string) => void;
}

interface EditorState {
  opts: EditorOptions;
  active: boolean;
  saving: boolean;
  originalRaw: string;
  textareaEl: HTMLTextAreaElement | null;
  fabEl: HTMLElement;
}

let state: EditorState | null = null;
let keydownHandler: ((e: KeyboardEvent) => void) | null = null;
let beforeUnloadHandler: ((e: BeforeUnloadEvent) => void) | null = null;

// ─── Public API ───────────────────────────────────

export function initEditor(opts: EditorOptions): void {
  destroyEditor();

  const fabEl = createFab();
  document.body.appendChild(fabEl);

  state = {
    opts,
    active: false,
    saving: false,
    originalRaw: opts.initialRaw,
    textareaEl: null,
    fabEl,
  };

  renderFabOff();

  keydownHandler = onGlobalKeydown;
  document.addEventListener('keydown', keydownHandler);

  beforeUnloadHandler = (e: BeforeUnloadEvent) => {
    if (isEditorDirty()) {
      e.preventDefault();
      e.returnValue = '';
    }
  };
  window.addEventListener('beforeunload', beforeUnloadHandler);
}

export function destroyEditor(): void {
  if (!state) return;
  if (state.active) deactivate(true);
  state.fabEl.remove();
  state = null;
  if (keydownHandler) {
    document.removeEventListener('keydown', keydownHandler);
    keydownHandler = null;
  }
  if (beforeUnloadHandler) {
    window.removeEventListener('beforeunload', beforeUnloadHandler);
    beforeUnloadHandler = null;
  }
  document.getElementById('ed-toast')?.remove();
}

export function isEditorDirty(): boolean {
  if (!state || !state.active || !state.textareaEl) return false;
  return state.textareaEl.value !== state.originalRaw;
}

/**
 * Returns true if it's safe to navigate away (not dirty, or user confirmed
 * discarding changes). Call from route-change click handlers.
 */
export function confirmDiscardIfDirty(): boolean {
  if (!isEditorDirty()) return true;
  return window.confirm('편집 중인 내용이 사라집니다. 계속할까요?');
}

// ─── Toggle ───────────────────────────────────────

function activate(): void {
  if (!state || state.active) return;
  const { bodyEl, initialRaw } = state.opts;

  state.originalRaw = initialRaw;

  const textarea = document.createElement('textarea');
  textarea.className = 'ed-textarea';
  textarea.value = initialRaw;
  textarea.spellcheck = false;
  textarea.autocapitalize = 'off';
  textarea.setAttribute('autocomplete', 'off');

  bodyEl.style.display = 'none';
  bodyEl.parentElement?.insertBefore(textarea, bodyEl);

  textarea.addEventListener('input', renderFabOn);
  textarea.addEventListener('keydown', onTextareaKeydown);

  state.textareaEl = textarea;
  state.active = true;
  renderFabOn();

  // Place caret at start; user can scroll/click as needed.
  textarea.focus();
  textarea.setSelectionRange(0, 0);
}

function deactivate(silent = false): void {
  if (!state || !state.active) return;
  if (!silent && isEditorDirty() && !window.confirm('편집 중인 내용이 사라집니다. 취소할까요?')) {
    return;
  }
  const { bodyEl } = state.opts;
  state.textareaEl?.remove();
  state.textareaEl = null;
  bodyEl.style.display = '';
  state.active = false;
  renderFabOff();
}

// ─── Save ─────────────────────────────────────────

async function save(): Promise<void> {
  if (!state || !state.active || state.saving || !state.textareaEl) return;

  const newRaw = state.textareaEl.value;
  if (newRaw.trim().length === 0) {
    showToast('빈 본문은 저장할 수 없습니다', true);
    return;
  }
  if (newRaw === state.originalRaw) {
    showToast('변경사항이 없습니다');
    return;
  }

  const { projectId, episodeId, onSaved } = state.opts;
  state.saving = true;
  renderFabOn();

  try {
    const res = await fetch('/__episode', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        project: projectId,
        episodeId,
        originalRaw: state.originalRaw,
        newRaw,
      }),
    });

    if (res.status === 409) {
      showToast('외부에서 수정됨 — 새로고침 후 다시 시도', true);
      return;
    }
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      showToast(data.error ? `저장 실패 — ${data.error}` : '저장 실패', true);
      return;
    }

    const data = (await res.json()) as { raw: string };
    state.originalRaw = data.raw;
    onSaved(data.raw);
    showToast('저장됨');
    deactivate(true);
  } catch {
    showToast('저장 실패 — 개발 서버 확인', true);
  } finally {
    if (state) {
      state.saving = false;
      if (state.active) renderFabOn();
    }
  }
}

// ─── FAB ──────────────────────────────────────────

function createFab(): HTMLElement {
  const fab = document.createElement('div');
  fab.id = 'ed-fab';
  fab.className = 'ed-fab';
  return fab;
}

function renderFabOff(): void {
  if (!state) return;
  state.fabEl.classList.remove('ed-fab-active');
  state.fabEl.innerHTML = `
    <button class="ed-fab-btn ed-fab-toggle" id="ed-toggle" title="에디터 모드 (Cmd+E)" aria-label="에디터 모드">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
    </button>
  `;
  state.fabEl.querySelector('#ed-toggle')?.addEventListener('click', activate);
}

function renderFabOn(): void {
  if (!state) return;
  const dirty = isEditorDirty();
  const saving = state.saving;
  state.fabEl.classList.add('ed-fab-active');
  state.fabEl.innerHTML = `
    <button class="ed-fab-btn ed-fab-save${dirty ? ' ed-fab-dirty' : ''}" id="ed-save"
            ${!dirty || saving ? 'disabled' : ''}
            title="저장 (Cmd+S)">
      ${saving ? '저장 중…' : '✓ 저장'}
    </button>
    <button class="ed-fab-btn ed-fab-cancel" id="ed-cancel"
            ${saving ? 'disabled' : ''}
            title="취소 (Esc)">
      ✕ 취소
    </button>
  `;
  state.fabEl.querySelector('#ed-save')?.addEventListener('click', () => {
    void save();
  });
  state.fabEl.querySelector('#ed-cancel')?.addEventListener('click', () => deactivate());
}

// ─── Keyboard ─────────────────────────────────────

function onGlobalKeydown(e: KeyboardEvent): void {
  if (!state) return;
  const meta = e.metaKey || e.ctrlKey;

  // Cmd+E — toggle (skip if user is typing in another input/textarea outside editor)
  if (meta && e.key.toLowerCase() === 'e') {
    const target = e.target as HTMLElement | null;
    const inOtherField =
      target &&
      (target.tagName === 'INPUT' ||
        (target.tagName === 'TEXTAREA' && target !== state.textareaEl));
    if (inOtherField) return;
    e.preventDefault();
    if (state.active) deactivate();
    else activate();
  }
}

function onTextareaKeydown(e: KeyboardEvent): void {
  if (!state) return;
  const meta = e.metaKey || e.ctrlKey;

  // Cmd+S — save
  if (meta && e.key.toLowerCase() === 's') {
    e.preventDefault();
    void save();
    return;
  }

  // Esc — cancel
  if (e.key === 'Escape') {
    e.preventDefault();
    deactivate();
  }
}

// ─── Toast ────────────────────────────────────────

function showToast(message: string, isError = false): void {
  document.getElementById('ed-toast')?.remove();
  const toast = document.createElement('div');
  toast.id = 'ed-toast';
  toast.className = `fb-toast ${isError ? 'fb-toast-error' : ''}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('fb-toast-show'), 10);
  setTimeout(() => {
    toast.classList.remove('fb-toast-show');
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}
