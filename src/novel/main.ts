/**
 * Reader — chapter view (Cartographer style)
 * Routes: #/p/:projectId/read/:chapterId
 * Mounted by the hub via initNovelApp(container, projectId).
 */

import './styles.css';
import { ALL_CHAPTERS as CHAPTERS, getChapter, updateChapterRaw } from './chapters';
import type { ChapterMeta } from './chapters';
import { renderChapterHTML } from './renderer';
import { feedbackToolbarHTML, initFeedback, destroyFeedback } from './feedback';
import { initEditor, destroyEditor, confirmDiscardIfDirty } from './editor';
import { getProject } from '../hub/projects';
import type { StoryProject } from '../hub/projects';
import { compassRoseSVG, atmosphereHTML } from '../hub/main';

let app: HTMLElement;
let projectId: string;
let project: StoryProject | null = null;
let hashChangeHandler: (() => void) | null = null;
let scrollHandler: (() => void) | null = null;
let scrollerEl: HTMLElement | null = null;

function projectChapters() {
  return CHAPTERS.filter((c) => c.projectId === projectId);
}

function getChapterId(): string | null {
  const hash = location.hash.slice(1) || '';
  const match = hash.match(/^\/p\/[^/]+\/read\/(.+)$/);
  return match ? match[1] : null;
}

function navigate(path: string) {
  location.hash = path;
}

function onRouteChange() {
  destroyFeedback();
  destroyEditor();
  detachScroll();
  const chapterId = getChapterId();
  if (chapterId) {
    renderReader(chapterId);
  } else {
    navigate(`/p/${projectId}`);
  }
  window.scrollTo(0, 0);
}

function detachScroll() {
  if (scrollerEl && scrollHandler) {
    scrollerEl.removeEventListener('scroll', scrollHandler);
  }
  scrollerEl = null;
  scrollHandler = null;
}

function renderReader(chapterId: string) {
  const ch = getChapter(chapterId, projectId);
  if (!ch || !ch.raw) {
    navigate(`/p/${projectId}`);
    return;
  }

  const titleMatch = ch.raw.match(/^# (.+)$/m);
  const displayTitle = (titleMatch ? titleMatch[1] : ch.title).replace(/^\d+화\.\s*/, '');

  const chapters = projectChapters();
  const idx = chapters.findIndex((c) => c.id === chapterId);
  const prev = idx > 0 ? chapters[idx - 1] : null;
  const next = idx < chapters.length - 1 ? chapters[idx + 1] : null;
  const accent = project?.color ?? 'var(--parchment)';
  const contentHTML = renderChapterHTML(ch.raw);
  const charCount = countChapterChars(ch.raw);

  const navHTML = (position: 'top' | 'bottom') => `
    <div class="reader-nav reader-nav--${position}">
      <button class="${!prev || !prev.raw ? 'disabled' : ''}" ${prev && prev.raw ? `data-action="read" data-chapter="${prev.id}"` : ''}>
        ← ${prev ? `CH ${String(prev.num).padStart(3, '0')}` : '이전 화'}
      </button>
      <button class="${!next || !next.raw ? 'disabled' : ''}" ${next && next.raw ? `data-action="read" data-chapter="${next.id}"` : ''}>
        ${next ? `CH ${String(next.num).padStart(3, '0')}` : '다음 화'} →
      </button>
    </div>
  `;

  app.innerHTML = `
    ${atmosphereHTML()}
    <div class="reader" style="--accent:${accent}">
      <div class="reader-top">
        <div class="cartouche">
          <span>
            <span class="cartouche-action" data-action="go-dashboard">← LOGBOOK</span>
            <span class="breadcrumb-sep">/</span>
            <span>CH ${String(ch.num).padStart(3, '0')}</span>
          </span>
          <span class="cartouche-right" style="display:flex;align-items:center;gap:18px;">
            <span>${escapeHtml(ch.arcLabel)}</span>
            <span class="cartouche-action" data-action="copy-body" id="copy-btn">⎘ <span id="copy-label">COPY</span></span>
            ${feedbackToolbarHTML()}
          </span>
        </div>
        <div class="reader-progress-track">
          <div class="reader-progress-fill" id="reader-progress" style="width:0%"></div>
        </div>
      </div>

      <div class="reader-scroller" id="reader-scroller">
        <div class="reader-page">
          ${navHTML('top')}

          <div class="reader-chapter-head">
            <div class="reader-chapter-eyebrow" style="color:${accent}">★ CHAPTER ${String(ch.num).padStart(3, '0')}</div>
            <h1 class="reader-chapter-title">${escapeHtml(displayTitle)}</h1>
            <div class="reader-chapter-rule">
              <span>━━━━</span>
              ${compassRoseSVG(36, 0.5)}
              <span>━━━━</span>
            </div>
            <div class="reader-chapter-meta">${formatThousands(charCount)} 자 · ${escapeHtml(ch.arcLabel)}</div>
            <div class="reader-actions">
              <button class="reader-copy-btn" type="button" data-action="copy-body">
                <span class="reader-copy-icon">⎘</span>
                <span class="reader-copy-label">본문 복사</span>
              </button>
            </div>
          </div>

          <div class="reader-body">${contentHTML}</div>

          <div class="reader-end">
            <div class="reader-end-label">— End of fragment —</div>
            <div class="reader-end-note">${next ? '다음 항해: ' + escapeHtml(next.title) : '다음 항해는 곧 작성됩니다.'}</div>
            <div class="reader-actions">
              <button class="reader-copy-btn" type="button" data-action="copy-body">
                <span class="reader-copy-icon">⎘</span>
                <span class="reader-copy-label">본문 복사</span>
              </button>
            </div>
          </div>

          ${navHTML('bottom')}
        </div>
      </div>

      <div class="meridian">
        <div id="meridian-pct">0°</div>
        <div class="meridian-line">
          <div class="meridian-dot" id="meridian-dot" style="top:0%"></div>
        </div>
        <div>0°</div>
      </div>
    </div>
  `;

  bindReaderEvents();
  initFeedback(`${projectId}/${chapterId}`, ch.num, ch.title);

  const bodyEl = document.querySelector<HTMLElement>('.reader-body');
  if (bodyEl && ch.raw) {
    initEditor({
      bodyEl,
      initialRaw: ch.raw,
      save: async (newRaw, originalRaw) => {
        try {
          const res = await fetch('/__episode', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              project: projectId,
              episodeId: chapterId,
              originalRaw,
              newRaw,
            }),
          });
          if (res.status === 409) return { status: 'conflict' };
          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            return { status: 'error', message: data?.error };
          }
          const data = (await res.json()) as { raw: string };
          return { status: 'ok', raw: data.raw };
        } catch {
          return { status: 'error' };
        }
      },
      onSaved: (newRaw) => applyNewRaw(chapterId, newRaw),
    });
  }
}

function applyNewRaw(chapterId: string, newRaw: string) {
  updateChapterRaw(projectId, chapterId, newRaw);

  const ch = getChapter(chapterId, projectId);
  if (!ch) return;

  const bodyEl = document.querySelector<HTMLElement>('.reader-body');
  if (bodyEl) bodyEl.innerHTML = renderChapterHTML(newRaw);

  const titleEl = document.querySelector<HTMLElement>('.reader-chapter-title');
  if (titleEl) {
    const titleMatch = newRaw.match(/^# (.+)$/m);
    const displayTitle = (titleMatch ? titleMatch[1] : ch.title).replace(/^\d+화\.\s*/, '');
    titleEl.textContent = displayTitle;
  }

  const metaEl = document.querySelector<HTMLElement>('.reader-chapter-meta');
  if (metaEl) {
    const charCount = countChapterChars(newRaw);
    metaEl.textContent = `${formatThousands(charCount)} 자 · ${ch.arcLabel}`;
  }
}

function bindReaderEvents() {
  const scroller = document.getElementById('reader-scroller');
  const progress = document.getElementById('reader-progress');
  const meridianDot = document.getElementById('meridian-dot');
  const meridianPct = document.getElementById('meridian-pct');

  if (scroller) {
    scrollerEl = scroller;
    scrollHandler = () => {
      const max = scroller.scrollHeight - scroller.clientHeight;
      const pct = max > 0 ? scroller.scrollTop / max : 0;
      const pctTxt = Math.round(pct * 100);
      if (progress) progress.style.width = `${pctTxt}%`;
      if (meridianDot) meridianDot.style.top = `${pctTxt}%`;
      if (meridianPct) meridianPct.textContent = `${pctTxt}°`;
    };
    scroller.addEventListener('scroll', scrollHandler, { passive: true });
  }

  app.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement).closest<HTMLElement>('[data-action]');
    if (!target) return;
    const action = target.dataset.action;
    if (action === 'go-dashboard') {
      if (!confirmDiscardIfDirty()) return;
      navigate(`/p/${projectId}`);
    } else if (action === 'read') {
      if (!confirmDiscardIfDirty()) return;
      const chId = target.dataset.chapter;
      if (chId) navigate(`/p/${projectId}/read/${chId}`);
    } else if (action === 'copy-body') {
      copyChapterBody(target);
    }
  });
}

function chapterBodyToPlainText(raw: string): string {
  const sections = raw
    .split(/\n---\n/)
    .map((s) => s.replace(/^# .+\n*/m, '').trim())
    .map((s) => s.replace(/^\*[^*\n]*끝[^*\n]*\*\s*$/m, '').trim())
    .filter((s) => s.length > 0);
  return sections.join('\n\n* * *\n\n');
}

async function copyChapterBody(btn: HTMLElement) {
  const chapterId = getChapterId();
  if (!chapterId) return;
  const ch = getChapter(chapterId, projectId) as ChapterMeta | undefined;
  if (!ch || !ch.raw) return;

  const text = chapterBodyToPlainText(ch.raw);
  // Each copy button has its own label slot — find it inside the clicked button.
  const label =
    btn.querySelector<HTMLElement>('.reader-copy-label') ??
    btn.querySelector<HTMLElement>('#copy-label');
  const original = label?.textContent ?? '';
  const successText = label?.classList.contains('reader-copy-label') ? '복사됨' : 'COPIED!';

  let ok = true;
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    ok = document.execCommand('copy');
    document.body.removeChild(ta);
  }
  if (label) label.textContent = ok ? successText : 'FAILED';
  btn.classList.add('copied');
  setTimeout(() => {
    if (label) label.textContent = original;
    btn.classList.remove('copied');
  }, 1500);
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

function countChapterChars(raw: string): number {
  return raw
    .replace(/^# .+$/gm, '')
    .replace(/^---\s*$/gm, '')
    .replace(/^\*[^*\n]*끝[^*\n]*\*\s*$/gm, '')
    .replace(/\*([^*\n]+)\*/g, '$1')
    .replace(/[\n\r\t]/g, '').length;
}

function formatThousands(n: number): string {
  return n.toLocaleString('ko-KR');
}

export function initNovelApp(container: HTMLElement, projId: string): () => void {
  app = container;
  projectId = projId;
  project = getProject(projId) ?? null;

  hashChangeHandler = onRouteChange;
  window.addEventListener('hashchange', hashChangeHandler);

  onRouteChange();

  return () => {
    destroyFeedback();
    destroyEditor();
    detachScroll();
    if (hashChangeHandler) {
      window.removeEventListener('hashchange', hashChangeHandler);
      hashChangeHandler = null;
    }
  };
}
