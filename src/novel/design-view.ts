/**
 * Design Atlas — index + single-doc viewer.
 *
 * Routes (handled by hub/main.ts):
 *   #/p/:projectId/design               → category-grouped index of all design docs
 *   #/p/:projectId/design/:docKey       → single doc view + inline editor
 *
 * docKey may include slashes (e.g. 'blue/draft_azelia') because design files can
 * live in sub-folders. The hash router captures everything after 'design/' as docKey.
 *
 * Reuses renderer.ts (markdown → HTML) and editor.ts (full-raw textarea + Cmd+S).
 * Save endpoint: PUT /__design (handled by vite-plugin-design.ts).
 */

import './styles.css';
import {
  getDesignDoc,
  getDesignDocs,
  groupedDesignDocs,
  updateDesignDocRaw,
} from './design';
import type { DesignDocMeta } from './design';
import { renderChapterHTML } from './renderer';
import { initEditor, destroyEditor, confirmDiscardIfDirty } from './editor';
import { getProject } from '../hub/projects';
import type { StoryProject } from '../hub/projects';
import { compassRoseSVG, atmosphereHTML } from '../hub/main';

let app: HTMLElement;
let projectId: string;
let project: StoryProject | null = null;
let hashChangeHandler: (() => void) | null = null;
let scrollerEl: HTMLElement | null = null;
let scrollHandler: (() => void) | null = null;

function getDocKey(): string | null {
  const hash = location.hash.slice(1) || '';
  const m = hash.match(/^\/p\/[^/]+\/design\/(.+)$/);
  return m ? m[1] : null;
}

function navigate(path: string) {
  location.hash = path;
}

function detachScroll() {
  if (scrollerEl && scrollHandler) scrollerEl.removeEventListener('scroll', scrollHandler);
  scrollerEl = null;
  scrollHandler = null;
}

function onRouteChange() {
  destroyEditor();
  detachScroll();
  const docKey = getDocKey();
  if (docKey) renderDesignDoc(docKey);
  else renderDesignIndex();
  window.scrollTo(0, 0);
}

// ─── Index page ───────────────────────────────────
function renderDesignIndex() {
  if (!project) {
    navigate('/');
    return;
  }
  const groups = groupedDesignDocs(projectId);
  const total = getDesignDocs(projectId).length;
  const accent = project.color;

  const groupsHTML = groups.length === 0
    ? `<div class="design-empty">이 별의 설계 도서는 아직 정리되지 않았습니다.</div>`
    : groups
        .map(
          (g) => `
            <div class="design-group">
              <div class="design-group-head">
                <span class="design-group-eyebrow" style="color:${accent}">★ ${g.docs.length}</span>
                <span class="design-group-label">${escapeHtml(g.label)}</span>
                <span class="design-group-rule"></span>
              </div>
              <div class="design-card-grid">
                ${g.docs.map((d) => renderCard(d, accent)).join('')}
              </div>
            </div>
          `
        )
        .join('');

  app.innerHTML = `
    ${atmosphereHTML()}
    <div class="voyage" style="--accent:${accent}">
      <div class="cartouche">
        <span>
          <span class="cartouche-action" data-action="go-dashboard">← VOYAGE</span>
          <span class="breadcrumb-sep">/</span>
          <span>DESIGN ATLAS</span>
        </span>
        <span class="cartouche-right">${escapeHtml(project.region)}</span>
      </div>

      <div class="voyage-header">
        <div>
          <div class="voyage-header-eyebrow" style="color:${accent}">📐 SETTINGS BIBLE · ${escapeHtml(project.short.toUpperCase())}</div>
          <h1 class="voyage-title">설계 도서</h1>
          <p class="voyage-desc">캐릭터·세계관·플롯·복선의 모든 설정 문서. 클릭해서 읽고, ✏︎ 모드로 즉시 수정.</p>
          <div class="voyage-metrics">
            <div>
              <div class="voyage-metric-key">Documents</div>
              <div class="voyage-metric-val">${total}</div>
            </div>
            <div>
              <div class="voyage-metric-key">Categories</div>
              <div class="voyage-metric-val">${groups.length}</div>
            </div>
            <div>
              <div class="voyage-metric-key">Project</div>
              <div class="voyage-metric-val">${escapeHtml(project.short)}</div>
            </div>
          </div>
        </div>
        <div class="voyage-bearing">
          ${compassRoseSVG(140, 0.6)}
          <div class="voyage-bearing-label">DESIGN<br/>${escapeHtml(project.short.toUpperCase())}</div>
        </div>
      </div>

      <div class="design-body">
        ${groupsHTML}
      </div>
    </div>
  `;

  bindIndexEvents();
}

function renderCard(d: DesignDocMeta, accent: string): string {
  const chars = countDocChars(d.raw);
  return `
    <div class="design-card" data-action="open-doc" data-key="${escapeAttr(d.docKey)}">
      <div class="design-card-eyebrow" style="color:${accent}">${escapeHtml(d.fileName)}</div>
      <div class="design-card-title">${escapeHtml(d.title)}</div>
      <div class="design-card-meta">${formatThousands(chars)} 자</div>
    </div>
  `;
}

function bindIndexEvents() {
  app.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement).closest<HTMLElement>('[data-action]');
    if (!target) return;
    const action = target.dataset.action;
    if (action === 'go-dashboard') {
      if (!confirmDiscardIfDirty()) return;
      navigate(`/p/${projectId}`);
    } else if (action === 'open-doc') {
      const key = target.dataset.key;
      if (key) navigate(`/p/${projectId}/design/${key}`);
    }
  });
}

// ─── Single doc page ──────────────────────────────
function renderDesignDoc(docKey: string) {
  if (!project) {
    navigate('/');
    return;
  }
  const doc = getDesignDoc(projectId, docKey);
  if (!doc) {
    navigate(`/p/${projectId}/design`);
    return;
  }

  const accent = project.color;
  const contentHTML = renderChapterHTML(doc.raw);
  const charCount = countDocChars(doc.raw);

  // Same-category sibling navigation
  const siblings = getDesignDocs(projectId).filter((d) => d.category === doc.category);
  const idx = siblings.findIndex((d) => d.docKey === doc.docKey);
  const prev = idx > 0 ? siblings[idx - 1] : null;
  const next = idx < siblings.length - 1 ? siblings[idx + 1] : null;

  const navHTML = (position: 'top' | 'bottom') => `
    <div class="reader-nav reader-nav--${position}">
      <button class="${prev ? '' : 'disabled'}" ${prev ? `data-action="open-doc" data-key="${escapeAttr(prev.docKey)}"` : ''}>
        ← ${prev ? escapeHtml(prev.fileName.replace(/\.md$/, '')) : '이전 문서'}
      </button>
      <button class="${next ? '' : 'disabled'}" ${next ? `data-action="open-doc" data-key="${escapeAttr(next.docKey)}"` : ''}>
        ${next ? escapeHtml(next.fileName.replace(/\.md$/, '')) : '다음 문서'} →
      </button>
    </div>
  `;

  app.innerHTML = `
    ${atmosphereHTML()}
    <div class="reader" style="--accent:${accent}">
      <div class="reader-top">
        <div class="cartouche">
          <span>
            <span class="cartouche-action" data-action="go-design-index">← DESIGN</span>
            <span class="breadcrumb-sep">/</span>
            <span>${escapeHtml(doc.fileName)}</span>
          </span>
          <span class="cartouche-right" style="display:flex;align-items:center;gap:18px;">
            <span>${escapeHtml(doc.docKey)}</span>
            <span class="cartouche-action" data-action="copy-body" id="copy-btn">⎘ <span id="copy-label">COPY</span></span>
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
            <div class="reader-chapter-eyebrow" style="color:${accent}">📐 ${escapeHtml(doc.fileName)}</div>
            <h1 class="reader-chapter-title">${escapeHtml(doc.title)}</h1>
            <div class="reader-chapter-rule">
              <span>━━━━</span>
              ${compassRoseSVG(36, 0.5)}
              <span>━━━━</span>
            </div>
            <div class="reader-chapter-meta">${formatThousands(charCount)} 자 · ${escapeHtml(doc.docKey)}</div>
          </div>

          <div class="reader-body">${contentHTML}</div>

          <div class="reader-end">
            <div class="reader-end-label">— End of document —</div>
            <div class="reader-end-note">${next ? '다음 문서: ' + escapeHtml(next.fileName) : '같은 분류의 마지막 문서입니다.'}</div>
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

  bindDocEvents(doc);

  const bodyEl = document.querySelector<HTMLElement>('.reader-body');
  if (bodyEl) {
    initEditor({
      bodyEl,
      initialRaw: doc.raw,
      save: async (newRaw, originalRaw) => {
        try {
          const res = await fetch('/__design', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              project: projectId,
              docKey: doc.docKey,
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
      onSaved: (newRaw) => applyNewDocRaw(doc.docKey, newRaw),
    });
  }
}

function applyNewDocRaw(docKey: string, newRaw: string) {
  updateDesignDocRaw(projectId, docKey, newRaw);
  const doc = getDesignDoc(projectId, docKey);
  if (!doc) return;
  const bodyEl = document.querySelector<HTMLElement>('.reader-body');
  if (bodyEl) bodyEl.innerHTML = renderChapterHTML(newRaw);
  const titleEl = document.querySelector<HTMLElement>('.reader-chapter-title');
  if (titleEl) titleEl.textContent = doc.title;
  const metaEl = document.querySelector<HTMLElement>('.reader-chapter-meta');
  if (metaEl) {
    metaEl.textContent = `${formatThousands(countDocChars(newRaw))} 자 · ${doc.docKey}`;
  }
}

function bindDocEvents(doc: DesignDocMeta) {
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
    if (action === 'go-design-index') {
      if (!confirmDiscardIfDirty()) return;
      navigate(`/p/${projectId}/design`);
    } else if (action === 'open-doc') {
      if (!confirmDiscardIfDirty()) return;
      const key = target.dataset.key;
      if (key) navigate(`/p/${projectId}/design/${key}`);
    } else if (action === 'copy-body') {
      void copyDocBody(doc, target);
    }
  });
}

async function copyDocBody(doc: DesignDocMeta, btn: HTMLElement) {
  const label =
    btn.querySelector<HTMLElement>('#copy-label') ?? btn.querySelector<HTMLElement>('.reader-copy-label');
  const original = label?.textContent ?? '';
  let ok = true;
  try {
    await navigator.clipboard.writeText(doc.raw);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = doc.raw;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    ok = document.execCommand('copy');
    document.body.removeChild(ta);
  }
  if (label) label.textContent = ok ? 'COPIED!' : 'FAILED';
  btn.classList.add('copied');
  setTimeout(() => {
    if (label) label.textContent = original;
    btn.classList.remove('copied');
  }, 1500);
}

// ─── Helpers ──────────────────────────────────────
function countDocChars(raw: string): number {
  return raw.replace(/[\n\r\t]/g, '').length;
}

function formatThousands(n: number): string {
  return n.toLocaleString('ko-KR');
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

function escapeAttr(s: string): string {
  return escapeHtml(s);
}

// ─── Init ─────────────────────────────────────────
export function initDesignApp(container: HTMLElement, projId: string): () => void {
  app = container;
  projectId = projId;
  project = getProject(projId) ?? null;

  hashChangeHandler = onRouteChange;
  window.addEventListener('hashchange', hashChangeHandler);

  onRouteChange();

  return () => {
    destroyEditor();
    detachScroll();
    if (hashChangeHandler) {
      window.removeEventListener('hashchange', hashChangeHandler);
      hashChangeHandler = null;
    }
  };
}
