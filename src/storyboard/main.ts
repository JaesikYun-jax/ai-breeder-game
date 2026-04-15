/**
 * Storyboard Viewer — Sub-app module
 * Routes: #/p/:projectId/view/:episodeId
 * Mounted by the hub via initStoryboardApp(container, projectId)
 */

import './styles.css';
import { EPISODES, getEpisode } from './episodes';
import { parseStoryboard } from './parser';
import { renderEpisodeHTML } from './renderer';
import { feedbackToolbarHTML, initFeedback, destroyFeedback } from './feedback';

let app: HTMLElement;
let projectId: string;
let hashChangeHandler: (() => void) | null = null;

function projectEpisodes() {
  return EPISODES.filter((e) => e.projectId === projectId);
}

// ─── Router ────────────────────────────────────────
function getEpisodeId(): string | null {
  const hash = location.hash.slice(1) || '';
  const match = hash.match(/^\/p\/[^/]+\/view\/(.+)$/);
  return match ? match[1] : null;
}

function navigate(path: string) {
  location.hash = path;
}

function onRouteChange() {
  destroyFeedback();
  const episodeId = getEpisodeId();
  if (episodeId) {
    renderViewer(episodeId);
  } else {
    navigate(`/p/${projectId}`);
  }
  window.scrollTo(0, 0);
}

// ─── Viewer Page ───────────────────────────────────
function renderViewer(episodeId: string) {
  const ep = getEpisode(episodeId);
  if (!ep || !ep.raw) {
    navigate(`/p/${projectId}`);
    return;
  }

  const episode = parseStoryboard(ep.raw);
  const contentHTML = renderEpisodeHTML(episode);

  const episodes = projectEpisodes();
  const idx = episodes.findIndex((e) => e.id === episodeId);
  const prev = idx > 0 ? episodes[idx - 1] : null;
  const next = idx < episodes.length - 1 ? episodes[idx + 1] : null;

  app.innerHTML = `
    <nav class="nav">
      <div class="nav-inner">
        <div class="nav-logo" data-action="go-dashboard">Short<span>Factory</span></div>
      </div>
    </nav>
    <div class="reading-progress" id="reading-progress"></div>

    <div class="storyboard-view">
      <div class="sb-toolbar">
        <div class="sb-toolbar-inner">
          <button class="sb-back" data-action="go-dashboard">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Dashboard
          </button>
          <div style="display:flex;align-items:center;gap:8px;">
            <span class="sb-episode-label">${ep.arcLabel}</span>
            ${feedbackToolbarHTML()}
          </div>
        </div>
      </div>

      <div class="storyboard-body">
        ${contentHTML}
      </div>

      <div class="sb-nav">
        <button class="sb-nav-btn ${!prev || !prev.raw ? 'disabled' : ''}" ${prev && prev.raw ? `data-action="view" data-episode="${prev.id}"` : ''}>
          &larr; Prev
        </button>
        <button class="sb-nav-btn ${!next || !next.raw ? 'disabled' : ''}" ${next && next.raw ? `data-action="view" data-episode="${next.id}"` : ''}>
          Next &rarr;
        </button>
      </div>
    </div>

    <button class="scroll-top" id="scroll-top" title="Top">&uarr;</button>
  `;

  bindViewerEvents();
  initFeedback(episodeId, ep.num, ep.title);
  initTimebarClicks();
}

function bindViewerEvents() {
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
    } else if (action === 'view') {
      const epId = target.dataset.episode;
      if (epId) navigate(`/p/${projectId}/view/${epId}`);
    }
  });

  scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initTimebarClicks() {
  const segments = app.querySelectorAll<HTMLElement>('.sb-timebar-segment');
  segments.forEach((seg) => {
    seg.addEventListener('click', () => {
      const cutIdx = seg.dataset.cut;
      if (cutIdx != null) {
        const card = document.getElementById(`cut-${cutIdx}`);
        card?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        card?.classList.add('sb-cut-highlight');
        setTimeout(() => card?.classList.remove('sb-cut-highlight'), 1500);
      }
    });
  });
}

// ─── Public API ────────────────────────────────────
export function initStoryboardApp(container: HTMLElement, projId: string): () => void {
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
