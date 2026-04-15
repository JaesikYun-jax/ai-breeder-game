/**
 * Inline Feedback System — 텍스트 선택 → 코멘트 → 로컬 JSON 저장
 *
 * 사용법:
 *   1. 리더 본문에서 텍스트 드래그
 *   2. "코멘트" 버튼 클릭
 *   3. 코멘트 입력 → 저장
 *   → docs/story/inline-feedback.json에 축적
 */

// ─── State ────────────────────────────────────────

let currentChapterId = '';
let currentChapterNum = 0;
let currentChapterTitle = '';
let feedbackCount = 0;

// ─── API ──────────────────────────────────────────

async function postFeedback(data: {
  chapterId: string;
  chapterNum: number;
  chapterTitle: string;
  quotedText: string;
  comment: string;
}) {
  const res = await fetch('/__feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

async function fetchFeedbacks() {
  const res = await fetch('/__feedback');
  return res.json() as Promise<
    Array<{
      id: string;
      chapterId: string;
      quotedText: string;
      comment: string;
      status: string;
      timestamp: string;
    }>
  >;
}

// ─── Selection Handler ────────────────────────────

function getSelectedText(): string {
  const sel = window.getSelection();
  if (!sel || sel.isCollapsed) return '';

  // Only capture selection within reader-body
  const range = sel.getRangeAt(0);
  const container = range.commonAncestorContainer;
  const readerBody =
    container instanceof HTMLElement
      ? container.closest('.reader-body')
      : container.parentElement?.closest('.reader-body');

  if (!readerBody) return '';
  return sel.toString().trim();
}

function getSelectionRect(): DOMRect | null {
  const sel = window.getSelection();
  if (!sel || sel.isCollapsed) return null;
  return sel.getRangeAt(0).getBoundingClientRect();
}

// ─── Floating Button ──────────────────────────────

function showFloatingButton(rect: DOMRect, selectedText: string) {
  removeFloatingButton();

  const btn = document.createElement('button');
  btn.id = 'fb-float-btn';
  btn.className = 'fb-float-btn';
  btn.textContent = '코멘트';
  btn.style.top = `${rect.bottom + window.scrollY + 8}px`;
  btn.style.left = `${rect.left + rect.width / 2}px`;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    removeFloatingButton();
    showCommentPopover(selectedText);
  });

  document.body.appendChild(btn);
}

function removeFloatingButton() {
  document.getElementById('fb-float-btn')?.remove();
}

// ─── Comment Popover ──────────────────────────────

function showCommentPopover(quotedText: string) {
  removePopover();

  const overlay = document.createElement('div');
  overlay.id = 'fb-overlay';
  overlay.className = 'fb-overlay';

  // Truncate display quote if too long
  const displayQuote =
    quotedText.length > 200 ? quotedText.slice(0, 200) + '…' : quotedText;

  overlay.innerHTML = `
    <div class="fb-popover">
      <div class="fb-popover-header">
        <span class="fb-popover-title">코멘트 추가</span>
        <button class="fb-popover-close" id="fb-close">&times;</button>
      </div>
      <div class="fb-quote-box">
        <span class="fb-quote-label">인용</span>
        <p class="fb-quote-text">${escapeHtml(displayQuote)}</p>
      </div>
      <textarea
        class="fb-textarea"
        id="fb-comment"
        placeholder="이 부분을 어떻게 바꾸면 좋을지 적어주세요..."
        rows="4"
      ></textarea>
      <div class="fb-popover-actions">
        <button class="fb-btn fb-btn-cancel" id="fb-cancel">취소</button>
        <button class="fb-btn fb-btn-submit" id="fb-submit">저장</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Focus textarea
  const textarea = document.getElementById('fb-comment') as HTMLTextAreaElement;
  setTimeout(() => textarea?.focus(), 50);

  // Close handlers
  document.getElementById('fb-close')?.addEventListener('click', removePopover);
  document.getElementById('fb-cancel')?.addEventListener('click', removePopover);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) removePopover();
  });

  // Submit
  document.getElementById('fb-submit')?.addEventListener('click', async () => {
    const comment = textarea?.value.trim();
    if (!comment) {
      textarea?.classList.add('fb-shake');
      setTimeout(() => textarea?.classList.remove('fb-shake'), 400);
      return;
    }

    const submitBtn = document.getElementById('fb-submit') as HTMLButtonElement;
    submitBtn.disabled = true;
    submitBtn.textContent = '저장 중...';

    try {
      await postFeedback({
        chapterId: currentChapterId,
        chapterNum: currentChapterNum,
        chapterTitle: currentChapterTitle,
        quotedText,
        comment,
      });

      feedbackCount++;
      updateBadge();
      showToast('코멘트가 저장되었습니다');
      removePopover();
    } catch {
      submitBtn.disabled = false;
      submitBtn.textContent = '저장';
      showToast('저장 실패 — 개발 서버가 실행 중인지 확인하세요', true);
    }
  });

  // Ctrl+Enter to submit
  textarea?.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      document.getElementById('fb-submit')?.click();
    }
  });
}

function removePopover() {
  document.getElementById('fb-overlay')?.remove();
}

// ─── Toast ────────────────────────────────────────

function showToast(message: string, isError = false) {
  const existing = document.getElementById('fb-toast');
  existing?.remove();

  const toast = document.createElement('div');
  toast.id = 'fb-toast';
  toast.className = `fb-toast ${isError ? 'fb-toast-error' : ''}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add('fb-toast-show'), 10);
  setTimeout(() => {
    toast.classList.remove('fb-toast-show');
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// ─── Badge (피드백 카운터) ────────────────────────

function updateBadge() {
  const badge = document.getElementById('fb-badge');
  if (badge) {
    badge.textContent = `${feedbackCount}`;
    badge.style.display = feedbackCount > 0 ? 'flex' : 'none';
  }
}

// ─── Sidebar (현재 챕터 피드백 목록) ──────────────

async function toggleFeedbackPanel() {
  const existing = document.getElementById('fb-panel');
  if (existing) {
    existing.classList.remove('fb-panel-open');
    setTimeout(() => existing.remove(), 300);
    return;
  }

  const allFeedbacks = await fetchFeedbacks();
  const chapterFbs = allFeedbacks.filter(
    (f) => f.chapterId === currentChapterId
  );

  const panel = document.createElement('div');
  panel.id = 'fb-panel';
  panel.className = 'fb-panel';

  const statusLabel: Record<string, string> = {
    pending: '대기',
    applied: '적용됨',
    rejected: '반려',
    wontfix: '보류',
  };
  const statusClass: Record<string, string> = {
    pending: 'fb-status-pending',
    applied: 'fb-status-applied',
    rejected: 'fb-status-rejected',
    wontfix: 'fb-status-wontfix',
  };

  panel.innerHTML = `
    <div class="fb-panel-header">
      <span>코멘트 목록 (${chapterFbs.length})</span>
      <button class="fb-panel-close" id="fb-panel-close">&times;</button>
    </div>
    <div class="fb-panel-body">
      ${
        chapterFbs.length === 0
          ? '<p class="fb-panel-empty">이 챕터에 코멘트가 없습니다.</p>'
          : chapterFbs
              .map(
                (f) => `
            <div class="fb-panel-item">
              <div class="fb-panel-quote">"${escapeHtml(f.quotedText.length > 80 ? f.quotedText.slice(0, 80) + '…' : f.quotedText)}"</div>
              <div class="fb-panel-comment">${escapeHtml(f.comment)}</div>
              <div class="fb-panel-meta">
                <span class="fb-status ${statusClass[f.status] ?? ''}">${statusLabel[f.status] ?? f.status}</span>
                <span class="fb-panel-time">${new Date(f.timestamp).toLocaleDateString('ko-KR')}</span>
              </div>
            </div>
          `
              )
              .join('')
      }
    </div>
  `;

  document.body.appendChild(panel);
  requestAnimationFrame(() => panel.classList.add('fb-panel-open'));

  document.getElementById('fb-panel-close')?.addEventListener('click', () => {
    panel.classList.remove('fb-panel-open');
    setTimeout(() => panel.remove(), 300);
  });
}

// ─── Toolbar Button HTML ──────────────────────────

export function feedbackToolbarHTML(): string {
  return `
    <button class="fb-toolbar-btn" id="fb-toolbar-btn" title="코멘트 목록">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
      <span id="fb-badge" class="fb-badge" style="display:none">0</span>
    </button>
  `;
}

// ─── Init / Cleanup ───────────────────────────────

let mouseUpHandler: ((e: MouseEvent) => void) | null = null;
let mouseDownHandler: ((e: MouseEvent) => void) | null = null;

export async function initFeedback(
  chapterId: string,
  chapterNum: number,
  chapterTitle: string
) {
  currentChapterId = chapterId;
  currentChapterNum = chapterNum;
  currentChapterTitle = chapterTitle;

  // Load existing feedback count for this chapter
  try {
    const all = await fetchFeedbacks();
    feedbackCount = all.filter((f) => f.chapterId === chapterId).length;
    updateBadge();
  } catch {
    feedbackCount = 0;
  }

  // Selection → floating button
  mouseDownHandler = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('#fb-float-btn') || target.closest('.fb-overlay')) return;
    removeFloatingButton();
  };

  mouseUpHandler = () => {
    // Small delay to let selection finalize
    setTimeout(() => {
      const text = getSelectedText();
      if (!text || text.length < 2) {
        removeFloatingButton();
        return;
      }
      const rect = getSelectionRect();
      if (rect) showFloatingButton(rect, text);
    }, 10);
  };

  document.addEventListener('mousedown', mouseDownHandler);
  document.addEventListener('mouseup', mouseUpHandler);

  // Toolbar button
  document
    .getElementById('fb-toolbar-btn')
    ?.addEventListener('click', toggleFeedbackPanel);
}

export function destroyFeedback() {
  if (mouseUpHandler) document.removeEventListener('mouseup', mouseUpHandler);
  if (mouseDownHandler) document.removeEventListener('mousedown', mouseDownHandler);
  mouseUpHandler = null;
  mouseDownHandler = null;
  removeFloatingButton();
  removePopover();
  document.getElementById('fb-panel')?.remove();
  document.getElementById('fb-toast')?.remove();
}

// ─── Util ─────────────────────────────────────────

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
