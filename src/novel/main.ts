/**
 * Novel Reader — Sub-app module
 * Routes: #/p/:projectId/read/:chapterId
 * Mounted by the hub via initNovelApp(container, projectId)
 */

import './styles.css';
import { ALL_CHAPTERS as CHAPTERS, getChapter } from './chapters';
import { renderChapterHTML } from './renderer';
import { feedbackToolbarHTML, initFeedback, destroyFeedback } from './feedback';

let app: HTMLElement;
let projectId: string;
let hashChangeHandler: (() => void) | null = null;

function projectChapters() {
  return CHAPTERS.filter((c) => c.projectId === projectId);
}

// ─── Router ────────────────────────────────────────
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
  const chapterId = getChapterId();
  if (chapterId) {
    renderReader(chapterId);
  } else {
    navigate(`/p/${projectId}`);
  }
  window.scrollTo(0, 0);
}

// ─── Reader Page ───────────────────────────────────
function renderReader(chapterId: string) {
  const ch = getChapter(chapterId);
  if (!ch || !ch.raw) {
    navigate(`/p/${projectId}`);
    return;
  }

  const titleMatch = ch.raw.match(/^# (.+)$/m);
  const displayTitle = titleMatch ? titleMatch[1] : ch.title;

  const chapters = projectChapters();
  const idx = chapters.findIndex((c) => c.id === chapterId);
  const prev = idx > 0 ? chapters[idx - 1] : null;
  const next = idx < chapters.length - 1 ? chapters[idx + 1] : null;

  const contentHTML = renderChapterHTML(ch.raw);

  app.innerHTML = `
    <nav class="nav">
      <div class="nav-inner">
        <div class="nav-logo" data-action="go-dashboard">Short<span>Factory</span></div>
      </div>
    </nav>
    <div class="reading-progress" id="reading-progress"></div>

    <div class="reader-view">
      <div class="reader-toolbar">
        <div class="reader-toolbar-inner">
          <button class="reader-back" data-action="go-dashboard">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Dashboard
          </button>
          <div style="display:flex;align-items:center;gap:8px;">
            <span class="reader-chapter-label">${ch.arcLabel}</span>
            ${feedbackToolbarHTML()}
          </div>
        </div>
      </div>

      <div class="reader-body">
        <h1 class="r-title">${displayTitle}</h1>
        <p class="r-arc">${ch.arcLabel}</p>
        ${contentHTML}
      </div>

      <div class="reader-nav">
        <button class="reader-nav-btn ${!prev || !prev.raw ? 'disabled' : ''}" ${prev && prev.raw ? `data-action="read" data-chapter="${prev.id}"` : ''}>
          &larr; 이전 화
        </button>
        <button class="reader-nav-btn ${!next || !next.raw ? 'disabled' : ''}" ${next && next.raw ? `data-action="read" data-chapter="${next.id}"` : ''}>
          다음 화 &rarr;
        </button>
      </div>
    </div>

    <button class="scroll-top" id="scroll-top" title="맨 위로">&uarr;</button>
  `;

  bindReaderEvents();
  initFeedback(chapterId, ch.num, ch.title);
}

function bindReaderEvents() {
  const progressBar = document.getElementById('reading-progress');
  const scrollTopBtn = document.getElementById('scroll-top');

  function onScroll() {
    const scrolled = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrolled / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = `${progress}%`;
    if (scrollTopBtn) scrollTopBtn.classList.toggle('visible', scrolled > 400);
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  app.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement).closest<HTMLElement>('[data-action]');
    if (!target) return;

    const action = target.dataset.action;
    if (action === 'go-dashboard') {
      navigate(`/p/${projectId}`);
    } else if (action === 'read') {
      const chId = target.dataset.chapter;
      if (chId) navigate(`/p/${projectId}/read/${chId}`);
    }
  });

  scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ─── Public API ────────────────────────────────────
export function initNovelApp(container: HTMLElement, projId: string): () => void {
  app = container;
  projectId = projId;

  hashChangeHandler = onRouteChange;
  window.addEventListener('hashchange', hashChangeHandler);

  onRouteChange();

  return () => {
    destroyFeedback();
    if (hashChangeHandler) {
      window.removeEventListener('hashchange', hashChangeHandler);
      hashChangeHandler = null;
    }
  };
}
