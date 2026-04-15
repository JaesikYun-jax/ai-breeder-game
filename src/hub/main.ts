/**
 * ShortFactory — Project Hub
 * Routes:
 *   #/                        → Project list
 *   #/p/:projectId            → Project dashboard (novel + storyboard)
 *   #/p/:projectId/read/:id   → Novel reader
 *   #/p/:projectId/view/:id   → Storyboard viewer
 */

import './styles.css';
import { PROJECTS, getProject } from './projects';
import { ALL_CHAPTERS as CHAPTERS } from '../novel/chapters';
import { EPISODES } from '../storyboard/episodes';
import type { ChapterMeta } from '../novel/chapters';
import type { EpisodeEntry } from '../storyboard/types';

const app = document.getElementById('app')!;

let currentApp: string | null = null;
let cleanupFn: (() => void) | null = null;

// ─── Router ────────────────────────────────────────
interface Route {
  app: 'hub' | 'dashboard' | 'novel' | 'storyboard';
  projectId?: string;
  param?: string;
}

function getRoute(): Route {
  const hash = location.hash.slice(1) || '/';

  // #/p/:projectId/read/:chapterId
  const readMatch = hash.match(/^\/p\/([^/]+)\/read\/(.+)$/);
  if (readMatch) return { app: 'novel', projectId: readMatch[1], param: readMatch[2] };

  // #/p/:projectId/view/:episodeId
  const viewMatch = hash.match(/^\/p\/([^/]+)\/view\/(.+)$/);
  if (viewMatch) return { app: 'storyboard', projectId: viewMatch[1], param: viewMatch[2] };

  // #/p/:projectId
  const projMatch = hash.match(/^\/p\/([^/]+)$/);
  if (projMatch) return { app: 'dashboard', projectId: projMatch[1] };

  return { app: 'hub' };
}

async function onRouteChange() {
  const route = getRoute();

  // If same sub-app with same project, let it handle internal routing
  if (
    (route.app === 'novel' || route.app === 'storyboard') &&
    route.app === currentApp
  ) {
    return;
  }

  // Unmount previous
  if (cleanupFn) {
    cleanupFn();
    cleanupFn = null;
  }
  currentApp = route.app;

  if (route.app === 'novel' && route.projectId) {
    const { initNovelApp } = await import('../novel/main');
    cleanupFn = initNovelApp(app, route.projectId);
  } else if (route.app === 'storyboard' && route.projectId) {
    const { initStoryboardApp } = await import('../storyboard/main');
    cleanupFn = initStoryboardApp(app, route.projectId);
  } else if (route.app === 'dashboard' && route.projectId) {
    renderDashboard(route.projectId);
  } else {
    renderHub();
  }

  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', onRouteChange);

// ─── Hub Page ──────────────────────────────────────
function renderHub() {
  const projectCards = PROJECTS.map((p) => {
    const chapterCount = CHAPTERS.filter((c) => c.projectId === p.id).length;
    const episodeCount = EPISODES.filter((e) => e.projectId === p.id).length;

    return `
      <div class="hub-card" data-action="go-project" data-project="${p.id}">
        <span class="hub-card-icon">${p.emoji}</span>
        <h2 class="hub-card-title">${p.title}</h2>
        <p class="hub-card-desc">${p.description}</p>
        <div class="hub-card-stats">
          <span class="hub-card-stat"><strong>${chapterCount}</strong> chapters</span>
          <span class="hub-card-stat"><strong>${episodeCount}</strong> episodes</span>
        </div>
        <span class="hub-card-arrow">&rarr;</span>
      </div>
    `;
  }).join('');

  app.innerHTML = `
    <div class="hub">
      <div class="hub-header">
        <span class="hub-badge">Creative Studio</span>
        <h1 class="hub-title">ShortFactory</h1>
        <p class="hub-desc">One source, multi use.</p>
      </div>
      <div class="hub-projects">
        ${projectCards}
      </div>
      <div class="hub-footer">
        ShortFactory &mdash; Powered by Vite + TypeScript
      </div>
    </div>
  `;

  app.addEventListener('click', hubClickHandler);
}

function hubClickHandler(e: MouseEvent) {
  const target = (e.target as HTMLElement).closest<HTMLElement>('[data-action]');
  if (!target) return;

  if (target.dataset.action === 'go-project') {
    const id = target.dataset.project;
    if (id) location.hash = `/p/${id}`;
  }
}

// ─── Dashboard Page ────────────────────────────────
function renderDashboard(projectId: string) {
  const project = getProject(projectId);
  if (!project) {
    location.hash = '/';
    return;
  }

  const chapters = CHAPTERS.filter((c) => c.projectId === projectId);
  const episodes = EPISODES.filter((e) => e.projectId === projectId);

  app.innerHTML = `
    <nav class="nav">
      <div class="nav-inner">
        <div class="nav-logo" data-action="go-hub">Short<span>Factory</span></div>
      </div>
    </nav>

    <div class="dash">
      <div class="dash-header">
        <span class="dash-emoji">${project.emoji}</span>
        <h1 class="dash-title">${project.title}</h1>
        <p class="dash-desc">${project.description}</p>
      </div>

      <div class="dash-grid">
        <!-- Novel Column -->
        <div class="dash-column">
          <div class="dash-column-header">
            <span class="dash-column-icon">&#x1F4D6;</span>
            <h2 class="dash-column-title">Novel</h2>
            <span class="dash-column-count">${chapters.length}</span>
          </div>
          <div class="dash-list">
            ${chapters.length === 0
              ? '<p class="dash-empty">No chapters yet.</p>'
              : chapters.map((ch) => chapterItemHTML(ch, projectId)).join('')}
          </div>
        </div>

        <!-- Storyboard Column -->
        <div class="dash-column">
          <div class="dash-column-header">
            <span class="dash-column-icon">&#x1F3AC;</span>
            <h2 class="dash-column-title">Short-Form</h2>
            <span class="dash-column-count">${episodes.length}</span>
          </div>
          <div class="dash-list">
            ${episodes.length === 0
              ? '<p class="dash-empty">No episodes yet.</p>'
              : episodes.map((ep) => episodeItemHTML(ep, projectId)).join('')}
          </div>
        </div>
      </div>
    </div>

    <footer class="footer">
      <p class="footer-text">
        <a data-action="go-hub" style="cursor:pointer;color:var(--accent);">&larr; All Projects</a>
      </p>
    </footer>
  `;

  app.addEventListener('click', dashClickHandler);
}

function chapterItemHTML(ch: ChapterMeta, projectId: string): string {
  const readable = !!ch.raw;
  const badgeMap: Record<string, string> = {
    published: '<span class="item-badge published">NEW</span>',
    writing: '<span class="item-badge writing">WRITING</span>',
    complete: '<span class="item-badge complete">COMPLETE</span>',
    coming: '<span class="item-badge coming">Soon</span>',
  };
  const badge = badgeMap[ch.status] ?? '';
  const clickable = readable
    ? `data-action="read" data-project="${projectId}" data-id="${ch.id}"`
    : '';

  return `
    <div class="dash-item" ${clickable} style="${!readable ? 'opacity:0.4;cursor:default;' : ''}">
      <span class="dash-item-num">${String(ch.num).padStart(2, '0')}</span>
      <div class="dash-item-info">
        <div class="dash-item-title">${ch.title} ${badge}</div>
        <div class="dash-item-meta">${ch.arcLabel}</div>
      </div>
    </div>
  `;
}

function episodeItemHTML(ep: EpisodeEntry, projectId: string): string {
  const readable = !!ep.raw;
  const badgeMap: Record<string, string> = {
    draft: '<span class="item-badge draft">DRAFT</span>',
    review: '<span class="item-badge review">REVIEW</span>',
    final: '<span class="item-badge final">FINAL</span>',
  };
  const badge = badgeMap[ep.status] ?? '';
  const clickable = readable
    ? `data-action="view" data-project="${projectId}" data-id="${ep.id}"`
    : '';

  return `
    <div class="dash-item" ${clickable} style="${!readable ? 'opacity:0.4;cursor:default;' : ''}">
      <span class="dash-item-num">EP${String(ep.num).padStart(2, '0')}</span>
      <div class="dash-item-info">
        <div class="dash-item-title">${ep.title} ${badge}</div>
        <div class="dash-item-meta">${ep.sourceChapter} &middot; ${ep.arcLabel}</div>
      </div>
    </div>
  `;
}

function dashClickHandler(e: MouseEvent) {
  const target = (e.target as HTMLElement).closest<HTMLElement>('[data-action]');
  if (!target) return;

  const action = target.dataset.action;
  const project = target.dataset.project;
  const id = target.dataset.id;

  if (action === 'read' && project && id) {
    location.hash = `/p/${project}/read/${id}`;
  } else if (action === 'view' && project && id) {
    location.hash = `/p/${project}/view/${id}`;
  } else if (action === 'go-hub') {
    location.hash = '/';
  }
}

// ─── Init ──────────────────────────────────────────
onRouteChange();
