/**
 * Cartographer — Story Atlas
 * Routes:
 *   #/                        → Hub (atlas)
 *   #/p/:projectId            → Dashboard (voyage log)
 *   #/p/:projectId/read/:id   → Reader
 */

import './styles.css';
import { PROJECTS, getProject } from './projects';
import type { StoryProject, PillarProgress } from './projects';
import { ALL_CHAPTERS as CHAPTERS, getChapter } from '../novel/chapters';
import type { ChapterMeta } from '../novel/chapters';

const app = document.getElementById('app')!;

let currentApp: string | null = null;
let cleanupFn: (() => void) | null = null;

// ─── Atmosphere (vignette + paper grain) ───────────
function atmosphereHTML(): string {
  return `<div class="atmos-vignette"></div><div class="atmos-grain"></div>`;
}

// ─── Compass rose SVG ──────────────────────────────
function compassRoseSVG(size = 90, opacity = 0.4): string {
  return `
    <svg viewBox="0 0 100 100" style="width:${size}px;height:${size}px;opacity:${opacity}" aria-hidden="true">
      <circle cx="50" cy="50" r="40" fill="none" stroke="var(--parchment)" stroke-width="0.6" />
      <circle cx="50" cy="50" r="28" fill="none" stroke="var(--parchment)" stroke-width="0.4" stroke-dasharray="2 2" />
      <path d="M50,8 L54,50 L50,92 L46,50 Z" fill="var(--parchment)" opacity="0.7" />
      <path d="M8,50 L50,46 L92,50 L50,54 Z" fill="var(--parchment)" opacity="0.4" />
      <text x="50" y="6" font-family="var(--font-mono)" font-size="6" fill="var(--parchment)" text-anchor="middle">N</text>
      <text x="50" y="99" font-family="var(--font-mono)" font-size="6" fill="var(--parchment)" text-anchor="middle">S</text>
    </svg>
  `;
}

// ─── Plain-text export (for clipboard copy) ─────────
function chapterBodyToPlainText(raw: string): string {
  const sections = raw
    .split(/\n---\n/)
    .map((s) => s.replace(/^# .+\n*/m, '').trim())
    .map((s) => s.replace(/^\*[^*\n]*끝[^*\n]*\*\s*$/m, '').trim())
    .filter((s) => s.length > 0);
  return sections.join('\n\n* * *\n\n');
}

async function copyChapterBody(chapterId: string, projectId: string, btn: HTMLElement) {
  const ch = getChapter(chapterId, projectId);
  if (!ch || !ch.raw) return;
  const text = chapterBodyToPlainText(ch.raw);
  const original = btn.textContent ?? '';
  try {
    await navigator.clipboard.writeText(text);
    btn.textContent = '✓';
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    btn.textContent = ok ? '✓' : '✗';
  }
  btn.classList.add('copied');
  setTimeout(() => {
    btn.textContent = original;
    btn.classList.remove('copied');
  }, 1400);
}

// ─── Char count from raw markdown ──────────────────
function countChapterChars(raw: string): number {
  return raw
    .replace(/^# .+$/gm, '')
    .replace(/^---\s*$/gm, '')
    .replace(/^\*[^*\n]*끝[^*\n]*\*\s*$/gm, '')
    .replace(/\*([^*\n]+)\*/g, '$1')
    .replace(/[\n\r\t]/g, '').length;
}

function projectChapterStats(projectId: string) {
  const list = CHAPTERS.filter((c) => c.projectId === projectId);
  const written = list.filter((c) => c.raw);
  const totalWords = written.reduce((sum, c) => sum + countChapterChars(c.raw!), 0);
  return { count: list.length, written: written.length, words: totalWords };
}

// ─── Router ────────────────────────────────────────
interface Route {
  app: 'hub' | 'dashboard' | 'novel';
  projectId?: string;
  param?: string;
}

function getRoute(): Route {
  const hash = location.hash.slice(1) || '/';
  const readMatch = hash.match(/^\/p\/([^/]+)\/read\/(.+)$/);
  if (readMatch) return { app: 'novel', projectId: readMatch[1], param: readMatch[2] };
  const projMatch = hash.match(/^\/p\/([^/]+)$/);
  if (projMatch) return { app: 'dashboard', projectId: projMatch[1] };
  return { app: 'hub' };
}

async function onRouteChange() {
  const route = getRoute();

  if (route.app === 'novel' && route.app === currentApp) return;

  if (cleanupFn) {
    cleanupFn();
    cleanupFn = null;
  }
  currentApp = route.app;

  if (route.app === 'novel' && route.projectId) {
    const { initNovelApp } = await import('../novel/main');
    cleanupFn = initNovelApp(app, route.projectId);
  } else if (route.app === 'dashboard' && route.projectId) {
    renderDashboard(route.projectId);
  } else {
    renderHub();
  }

  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', onRouteChange);

// ─── Hub: Atlas ────────────────────────────────────
function renderHub() {
  const W = 1000;
  const H = 700;

  const projectStats = PROJECTS.map((p) => ({ p, ...projectChapterStats(p.id) }));
  const totalChapters = projectStats.reduce((s, x) => s + x.count, 0);
  const totalWords = projectStats.reduce((s, x) => s + x.words, 0);

  // Constellation: lines between every star pair
  const constellationLines = PROJECTS.flatMap((p, i) =>
    PROJECTS.slice(i + 1).map(
      (q) =>
        `<line x1="${p.x * W}" y1="${p.y * H}" x2="${q.x * W}" y2="${q.y * H}" stroke="#9a8e74" stroke-width="0.4" stroke-dasharray="2 4" opacity="0.22" />`
    )
  ).join('');

  // Scattered background stars
  const bgStars = Array.from({ length: 120 })
    .map((_, i) => {
      const x = (i * 137.5) % W;
      const y = (i * 89.7) % H;
      const r = (i % 4) * 0.3 + 0.4;
      const op = 0.15 + (i % 4) * 0.08;
      return `<circle cx="${x}" cy="${y}" r="${r}" fill="#e6e2d2" opacity="${op}" />`;
    })
    .join('');

  // Longitude tick text
  const ticks = Array.from({ length: 8 })
    .map(
      (_, i) =>
        `<text x="${i * 125 + 10}" y="${H - 8}" font-family="var(--font-mono)" font-size="8" fill="#9a8e74" opacity="0.4">${i * 45 - 180}°</text>`
    )
    .join('');

  // Project stars
  const stars = PROJECTS.map((p, i) => {
    const cx = p.x * W;
    const cy = p.y * H;
    const r = p.mag * 7;
    // Stagger the pulse phase per star so they don't breathe in unison
    const delay = ((i * 0.7) % 4).toFixed(2);
    return `
      <g class="atlas-star-group" data-action="go-project" data-project="${p.id}" data-star="${p.id}" style="--star-color:${p.color}">
        <g class="atlas-star-body" style="transform-origin:${cx}px ${cy}px; animation-delay:${delay}s">
          <circle class="atlas-star-glow" cx="${cx}" cy="${cy}" r="${r * 6}" fill="url(#starGlow-${p.id})" style="animation-delay:${delay}s" />
          <circle class="atlas-star-core" cx="${cx}" cy="${cy}" r="${r}" fill="${p.color}" style="animation-delay:${delay}s" />
          <circle class="atlas-star-ring" cx="${cx}" cy="${cy}" r="${r + 7}" fill="none" stroke="${p.color}" stroke-width="0.6" />
        </g>
        <line x1="${cx + r + 4}" y1="${cy}" x2="${cx + 70}" y2="${cy}" stroke="${p.color}" stroke-width="0.6" opacity="0.55" />
        <text x="${cx + 76}" y="${cy - 7}" font-family="var(--font-serif)" font-size="14" fill="var(--ink)" font-weight="700">${escapeAttr(p.short)}</text>
        <text x="${cx + 76}" y="${cy + 9}" font-family="var(--font-mono)" font-size="9" fill="${p.color}" letter-spacing="1">★ MAG ${p.mag.toFixed(1)} · ${projectStats.find((s) => s.p.id === p.id)!.count} CH</text>
      </g>
    `;
  }).join('');

  const starGlowDefs = PROJECTS.map(
    (p) => `
      <radialGradient id="starGlow-${p.id}">
        <stop offset="0%" stop-color="${p.color}" stop-opacity="0.5" />
        <stop offset="100%" stop-color="${p.color}" stop-opacity="0" />
      </radialGradient>
    `
  ).join('');

  const indexCells = PROJECTS.map((p, i) => {
    const stats = projectStats.find((s) => s.p.id === p.id)!;
    return `
      <div class="atlas-index-cell" data-action="go-project" data-project="${p.id}">
        <div class="atlas-index-cell-eyebrow" style="color:${p.color}">★ № ${String(i + 1).padStart(2, '0')}</div>
        <div class="atlas-index-cell-title">${escapeHtml(p.short)}</div>
        <div class="atlas-index-cell-meta">${stats.count} ch · MAG ${p.mag.toFixed(1)}</div>
      </div>
    `;
  }).join('');

  app.innerHTML = `
    ${atmosphereHTML()}
    <div class="atlas">
      <div class="cartouche">
        <span><span class="cartouche-action" data-action="noop" style="cursor:default">✦ Story Atlas — Folio I · ${new Date().getFullYear()}</span></span>
        <span class="cartouche-right">Lat. 37°33′N · Long. 126°58′E · ${PROJECTS.length} stars charted</span>
      </div>

      <div class="atlas-canvas">
        <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">
          <defs>
            ${starGlowDefs}
            <pattern id="cartGrid" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(154,142,116,0.06)" stroke-width="0.5"/>
            </pattern>
          </defs>
          <rect width="${W}" height="${H}" fill="url(#cartGrid)" />
          ${constellationLines}
          ${bgStars}
          ${ticks}
          <g transform="translate(${W - 80}, ${H - 80})" opacity="0.4">
            <circle r="32" fill="none" stroke="#9a8e74" stroke-width="0.4" />
            <path d="M0,-32 L3,0 L0,32 L-3,0 Z" fill="var(--parchment)" opacity="0.7"/>
            <path d="M-32,0 L0,-3 L32,0 L0,3 Z" fill="#9a8e74" opacity="0.6"/>
            <text y="-37" font-family="var(--font-mono)" font-size="8" fill="#9a8e74" text-anchor="middle">N</text>
          </g>
          ${stars}
        </svg>

        <div class="atlas-cartouche">
          <div class="atlas-cartouche-eyebrow">The Author's Atlas</div>
          <h1 class="atlas-cartouche-title">${PROJECTS.length === 1 ? '하나의 별,<br/><span class="accent">하나의 세계.</span>' : `${koreanNumeral(PROJECTS.length)} 개의 별,<br/><span class="accent">${koreanNumeral(PROJECTS.length)} 개의 세계.</span>`}</h1>
          <p class="atlas-cartouche-desc">별을 클릭하면 그 세계의 항해 일지가 열립니다. 별의 밝기는 분량을 따릅니다.</p>
          <div class="atlas-cartouche-stats">
            <span>★ ${PROJECTS.length} stars</span>
            <span>● ${totalChapters} chapters</span>
            <span class="accent">≈ ${formatThousands(totalWords)} 자</span>
          </div>
        </div>

        <div class="atlas-preview" id="atlas-preview" style="display:none"></div>
      </div>

      <div class="atlas-index">
        <div class="atlas-index-label">— Index of stars</div>
        <div class="atlas-index-grid">${indexCells}</div>
      </div>
    </div>
  `;

  bindHubEvents(projectStats);
}

function bindHubEvents(stats: { p: StoryProject; count: number; written: number; words: number }[]) {
  const preview = document.getElementById('atlas-preview') as HTMLElement | null;

  function showPreview(p: StoryProject) {
    if (!preview) return;
    const s = stats.find((x) => x.p.id === p.id)!;
    preview.style.display = 'block';
    preview.style.borderColor = p.color;
    preview.style.boxShadow = `0 0 24px ${p.color}33`;
    preview.innerHTML = `
      <div class="atlas-preview-eyebrow" style="color:${p.color}">★ MAG ${p.mag.toFixed(1)} · ${escapeHtml(p.genre)}</div>
      <div class="atlas-preview-title">${escapeHtml(p.title)}</div>
      <div class="atlas-preview-desc">${escapeHtml(p.description)}</div>
      <div class="atlas-preview-foot">
        <span>● ${s.count} ch</span>
        <span>${formatThousands(s.words)} 자</span>
        <span style="color:${p.color}">open →</span>
      </div>
    `;
  }
  function hidePreview() {
    if (preview) preview.style.display = 'none';
  }

  app.addEventListener('mouseover', (e) => {
    const star = (e.target as HTMLElement).closest<SVGGElement>('[data-star]');
    if (star) {
      const id = star.getAttribute('data-star');
      const p = PROJECTS.find((x) => x.id === id);
      if (p) showPreview(p);
    }
  });
  app.addEventListener('mouseout', (e) => {
    const star = (e.target as HTMLElement).closest<SVGGElement>('[data-star]');
    if (star) hidePreview();
  });

  app.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement).closest<HTMLElement>('[data-action]');
    if (!target) return;
    if (target.dataset.action === 'go-project') {
      const id = target.dataset.project;
      if (id) location.hash = `/p/${id}`;
    }
  });
}

// ─── Dashboard: Voyage Log ─────────────────────────
function renderDashboard(projectId: string) {
  const project = getProject(projectId);
  if (!project) {
    location.hash = '/';
    return;
  }

  const allChapters = CHAPTERS.filter((c) => c.projectId === projectId);
  const stats = projectChapterStats(projectId);
  const hasUnfinished = allChapters.some((c) => c.status === 'writing' || c.status === 'coming');
  const projectStatus = hasUnfinished ? 'WRITING' : 'COMPLETE';

  app.innerHTML = `
    ${atmosphereHTML()}
    <div class="voyage" style="--accent:${project.color}">
      <div class="cartouche">
        <span>
          <span class="cartouche-action" data-action="go-hub">← ATLAS</span>
          <span class="breadcrumb-sep">/</span>
          <span>VOYAGE № ${escapeHtml(project.short.toUpperCase())}</span>
        </span>
        <span class="cartouche-right">${escapeHtml(project.region)}</span>
      </div>

      <div class="voyage-header">
        <div>
          <div class="voyage-header-eyebrow" style="color:${project.color}">★ ${escapeHtml(project.genre)} · MAG ${project.mag.toFixed(1)}</div>
          <h1 class="voyage-title">${escapeHtml(project.title)}</h1>
          <p class="voyage-desc">${escapeHtml(project.description)}</p>
          <div class="voyage-metrics">
            <div>
              <div class="voyage-metric-key">Chapters</div>
              <div class="voyage-metric-val">${stats.count}</div>
            </div>
            <div>
              <div class="voyage-metric-key">Words</div>
              <div class="voyage-metric-val">${formatThousands(stats.words)}</div>
            </div>
            <div>
              <div class="voyage-metric-key">Status</div>
              <div class="voyage-metric-val">${projectStatus}</div>
            </div>
            <div>
              <div class="voyage-metric-key">Region</div>
              <div class="voyage-metric-val">${escapeHtml(project.region.split(' / ')[0])}</div>
            </div>
          </div>
        </div>
        <div class="voyage-bearing">
          ${compassRoseSVG(140, 0.6)}
          <div class="voyage-bearing-label">BEARING<br/>${escapeHtml(project.short.toUpperCase())}</div>
        </div>
      </div>

      ${project.pillars ? renderPillarsHTML(project.pillars, project.color) : ''}

      ${renderLogbookHTML(allChapters, project)}
    </div>
  `;

  bindDashboardEvents(allChapters, project);
}

function renderPillarsHTML(pillars: PillarProgress[], color: string): string {
  const cells = pillars
    .map((pl) => {
      const cls = pl.pct === 100 ? 'pillar complete' : pl.pct === 0 ? 'pillar zero' : 'pillar';
      return `
        <div class="${cls}">
          <div class="pillar-name">${escapeHtml(pl.name)}</div>
          <div class="pillar-arc">${escapeHtml(pl.arc)}</div>
          <div class="pillar-bar"><div class="pillar-bar-fill" style="width:${pl.pct}%"></div></div>
          <div class="pillar-pct">${pl.pct}%</div>
        </div>
      `;
    })
    .join('');

  const completedNames = pillars.filter((p) => p.pct === 100).map((p) => p.name).join(' · ');
  const inProgress = pillars.find((p) => p.pct > 0 && p.pct < 100);
  const next = pillars.find((p) => p.pct === 0);
  const note = [
    completedNames ? `${completedNames} 정복 완료.` : null,
    inProgress ? `${inProgress.arc} 진입 (${inProgress.pct}%).` : null,
    next ? `다음 항해: ${next.name}.` : null,
  ]
    .filter(Boolean)
    .join(' ');

  void color;
  return `
    <div class="pillars">
      <div class="pillars-label">— The Nine Pillars · 진행 좌표</div>
      <div class="pillars-grid">${cells}</div>
      <div class="pillars-note">* ${escapeHtml(note)}</div>
    </div>
  `;
}

function renderLogbookHTML(chapters: ChapterMeta[], project: StoryProject): string {
  const arcs = ['all', ...Array.from(new Set(chapters.map((c) => c.arcLabel)))];
  // Render newest-first by chapter number
  const sorted = [...chapters].sort((a, b) => b.num - a.num);
  const filterButtons =
    arcs.length > 2
      ? `
    <div class="arc-filter" id="arc-filter">
      ${arcs
        .map(
          (a) => `
        <button class="${a === 'all' ? 'active' : ''}" data-arc="${escapeAttr(a)}">${a === 'all' ? 'All voyages' : escapeHtml(a.replace(' — ', ' · '))}</button>
      `
        )
        .join('')}
    </div>
  `
      : '';

  return `
    <div class="logbook">
      <div class="logbook-head">
        <div>
          <div class="logbook-eyebrow">— Captain's logbook · 항해 일지</div>
          <h2 class="logbook-title">Chapters &amp; milestones</h2>
        </div>
        ${filterButtons}
      </div>
      ${
        chapters.length === 0
          ? `<div class="logbook-empty">이 별의 항해 일지는 아직 정리되지 않았습니다.</div>`
          : `<div class="logbook-list" id="logbook-list">${renderLogEntries(sorted, project)}</div>`
      }
    </div>
  `;
}

function renderLogEntries(chapters: ChapterMeta[], project: StoryProject): string {
  let prevArc = '';
  return chapters
    .map((ch) => {
      const arcChange = prevArc !== ch.arcLabel;
      prevArc = ch.arcLabel;
      const sep = arcChange
        ? `<div class="arc-separator"><div class="arc-separator-label" style="color:${project.color}">★ ${escapeHtml(ch.arcLabel)}</div><div class="arc-separator-line"></div></div>`
        : '';
      const readable = !!ch.raw;
      const words = ch.raw ? formatThousands(countChapterChars(ch.raw)) : '—';
      const isWriting = ch.status === 'writing';
      const isComing = ch.status === 'coming';
      const statusText = isComing
        ? '○ planned'
        : isWriting
          ? '◐ in progress'
          : '● anchored';
      const statusCls = isWriting ? 'log-status writing' : 'log-status';
      const pill = isWriting
        ? `<span class="log-pill" style="background:${project.color}">WRITING</span>`
        : isComing
          ? `<span class="log-pill coming">SOON</span>`
          : '';
      const click = readable ? `data-action="open-chapter" data-id="${ch.id}"` : '';
      const copyBtn = readable
        ? `<button class="log-copy" type="button" data-action="copy-chapter" data-id="${ch.id}" title="본문 복사">⎘</button>`
        : `<span class="log-copy locked" aria-hidden="true">⎘</span>`;
      return `
        ${sep}
        <div class="log-entry ${readable ? '' : 'locked'}" ${click}>
          <div class="log-num">${String(ch.num).padStart(3, '0')}</div>
          <div class="log-title-cell"><span class="log-title">${escapeHtml(ch.title)}</span>${pill}</div>
          <div class="log-words">${words} 자</div>
          ${copyBtn}
          <div class="${statusCls}">${statusText}${readable ? ' →' : ''}</div>
        </div>
      `;
    })
    .join('');
}

function bindDashboardEvents(allChapters: ChapterMeta[], project: StoryProject) {
  const list = document.getElementById('logbook-list');
  const filter = document.getElementById('arc-filter');
  let activeArc: string = 'all';

  function applyFilter() {
    if (!list) return;
    const filtered =
      activeArc === 'all' ? allChapters : allChapters.filter((c) => c.arcLabel === activeArc);
    const sorted = [...filtered].sort((a, b) => b.num - a.num);
    list.innerHTML = renderLogEntries(sorted, project);
  }

  filter?.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('button[data-arc]');
    if (!btn) return;
    activeArc = btn.dataset.arc!;
    filter.querySelectorAll('button').forEach((b) => b.classList.toggle('active', b === btn));
    applyFilter();
  });

  app.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement).closest<HTMLElement>('[data-action]');
    if (!target) return;
    const action = target.dataset.action;
    if (action === 'go-hub') {
      location.hash = '/';
    } else if (action === 'open-chapter') {
      const id = target.dataset.id;
      if (id) location.hash = `/p/${project.id}/read/${id}`;
    } else if (action === 'copy-chapter') {
      e.stopPropagation();
      const id = target.dataset.id;
      if (id) copyChapterBody(id, project.id, target);
    }
  });
}

// ─── Helpers ───────────────────────────────────────
function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}
function escapeAttr(s: string): string {
  return escapeHtml(s);
}
function formatThousands(n: number): string {
  return n.toLocaleString('ko-KR');
}
function koreanNumeral(n: number): string {
  const map = ['영', '한', '두', '세', '네', '다섯', '여섯', '일곱', '여덟', '아홉', '열'];
  return map[n] ?? String(n);
}

// ─── Init ──────────────────────────────────────────
onRouteChange();

// Compass rose helper export (used by reader)
export { compassRoseSVG, atmosphereHTML };
