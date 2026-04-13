/**
 * AI Breeder — Web Novel SPA
 * Hash-based routing: #/ (home), #/read/:chapterId (reader)
 */

import './styles.css';
import { CHAPTERS, getChapter } from './chapters';
import type { ChapterMeta } from './chapters';
import { renderChapterHTML } from './renderer';

const app = document.getElementById('app')!;

// ─── Router ────────────────────────────────────────
function getRoute(): { view: string; param?: string } {
  const hash = location.hash.slice(1) || '/';
  if (hash.startsWith('/read/')) {
    return { view: 'reader', param: hash.slice(6) };
  }
  return { view: 'home' };
}

function navigate(path: string) {
  location.hash = path;
}

function onRouteChange() {
  const route = getRoute();
  if (route.view === 'reader' && route.param) {
    renderReader(route.param);
  } else {
    renderHome();
  }
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', onRouteChange);

// ─── Home Page ─────────────────────────────────────
function renderHome() {
  app.innerHTML = `
    ${navHTML()}

    <section class="hero">
      <div class="hero-content">
        <span class="hero-badge fade-in">이세계 회귀 루프물</span>
        <h1 class="hero-title fade-in fade-in-delay-1">이세계 회귀</h1>
        <p class="hero-subtitle fade-in fade-in-delay-2">AI Breeder</p>
        <p class="hero-desc fade-in fade-in-delay-3">
          이세계물을 500편 읽은 28세 회사원 강지호.<br>
          트럭에 치여 죽었더니 진짜 이세계로 왔다.<br>
          그런데 여기서도 죽으면... 다시 돌아온다.
        </p>
        <button class="hero-cta fade-in fade-in-delay-4" data-action="read-first">
          1화부터 읽기
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </section>

    <section class="section" id="world">
      <p class="section-label">World</p>
      <h2 class="section-title">9개의 세계, 하나의 비밀</h2>
      <div class="info-grid">
        ${infoCardHTML('crown', '아젤리아 왕국', '클래식 이세계 판타지. 소환된 용사는 축복 의식을 받지만, 왕국의 진짜 목적은 다르다.')}
        ${infoCardHTML('swords', '카이젤 제국', '군사 대국. 용사 소환의 이면에 숨겨진 제국의 야망이 드러난다.')}
        ${infoCardHTML('sparkles', '솔라리스', '정령의 땅. 자연과 마법이 공존하는 이곳에서 세계의 균열이 보이기 시작한다.')}
      </div>
    </section>

    <section class="section" id="chapters">
      <p class="section-label">Chapters</p>
      <h2 class="section-title">연재 목록</h2>
      <div class="chapter-list">
        ${CHAPTERS.map(chapterItemHTML).join('')}
      </div>
    </section>

    <footer class="footer">
      <p class="footer-text">
        AI Breeder &mdash; 이세계 회귀 웹소설<br>
        <span style="color: var(--text-dim)">Powered by Vite + TypeScript</span>
      </p>
    </footer>
  `;

  bindHomeEvents();
}

function navHTML(): string {
  return `
    <nav class="nav">
      <div class="nav-inner">
        <div class="nav-logo" data-action="go-home">이세계<span>회귀</span></div>
        <ul class="nav-links">
          <li><a data-action="go-home">홈</a></li>
          <li><a data-action="go-world">세계관</a></li>
          <li><a data-action="go-chapters">연재 목록</a></li>
        </ul>
      </div>
    </nav>
  `;
}

function infoCardHTML(icon: string, title: string, desc: string): string {
  const icons: Record<string, string> = {
    crown: '\u{1F451}',
    swords: '\u{2694}\uFE0F',
    sparkles: '\u{2728}',
  };
  return `
    <div class="info-card">
      <span class="info-card-icon">${icons[icon] ?? ''}</span>
      <h3 class="info-card-title">${title}</h3>
      <p class="info-card-desc">${desc}</p>
    </div>
  `;
}

function chapterItemHTML(ch: ChapterMeta): string {
  const badge =
    ch.status === 'published'
      ? '<span class="chapter-badge new">NEW</span>'
      : '<span class="chapter-badge coming">Coming Soon</span>';

  const clickable = ch.status === 'published' ? `data-action="read" data-chapter="${ch.id}"` : '';

  return `
    <div class="chapter-item" ${clickable} style="${ch.status === 'coming' ? 'opacity: 0.45; cursor: default;' : ''}">
      <span class="chapter-num">${String(ch.num).padStart(2, '0')}</span>
      <div class="chapter-info">
        <div class="chapter-title">${ch.title} ${badge}</div>
        <div class="chapter-meta">${ch.arcLabel}</div>
      </div>
      <span class="chapter-arrow">\u2192</span>
    </div>
  `;
}

function bindHomeEvents() {
  app.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement).closest<HTMLElement>('[data-action]');
    if (!target) return;

    const action = target.dataset.action;
    if (action === 'read-first') {
      const first = CHAPTERS.find((c) => c.status === 'published');
      if (first) navigate(`/read/${first.id}`);
    } else if (action === 'read') {
      const chId = target.dataset.chapter;
      if (chId) navigate(`/read/${chId}`);
    } else if (action === 'go-home') {
      navigate('/');
    } else if (action === 'go-world') {
      document.getElementById('world')?.scrollIntoView({ behavior: 'smooth' });
    } else if (action === 'go-chapters') {
      document.getElementById('chapters')?.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

// ─── Reader Page ───────────────────────────────────
function renderReader(chapterId: string) {
  const ch = getChapter(chapterId);
  if (!ch || !ch.raw) {
    navigate('/');
    return;
  }

  // Extract title from markdown
  const titleMatch = ch.raw.match(/^# (.+)$/m);
  const displayTitle = titleMatch ? titleMatch[1] : ch.title;

  // Find prev/next
  const idx = CHAPTERS.findIndex((c) => c.id === chapterId);
  const prev = idx > 0 ? CHAPTERS[idx - 1] : null;
  const next = idx < CHAPTERS.length - 1 ? CHAPTERS[idx + 1] : null;

  const contentHTML = renderChapterHTML(ch.raw);

  app.innerHTML = `
    ${navHTML()}
    <div class="reading-progress" id="reading-progress"></div>

    <div class="reader-view">
      <div class="reader-toolbar">
        <div class="reader-toolbar-inner">
          <button class="reader-back" data-action="go-home">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            목록으로
          </button>
          <span class="reader-chapter-label">${ch.arcLabel}</span>
        </div>
      </div>

      <div class="reader-body">
        <h1 class="r-title">${displayTitle}</h1>
        <p class="r-arc">${ch.arcLabel}</p>
        ${contentHTML}
      </div>

      <div class="reader-nav">
        <button class="reader-nav-btn ${!prev || prev.status !== 'published' ? 'disabled' : ''}" ${prev && prev.status === 'published' ? `data-action="read" data-chapter="${prev.id}"` : ''}>
          \u2190 이전 화
        </button>
        <button class="reader-nav-btn ${!next || next.status !== 'published' ? 'disabled' : ''}" ${next && next.status === 'published' ? `data-action="read" data-chapter="${next.id}"` : ''}>
          다음 화 \u2192
        </button>
      </div>
    </div>

    <button class="scroll-top" id="scroll-top" title="맨 위로">\u2191</button>
  `;

  bindReaderEvents();
}

function bindReaderEvents() {
  const progressBar = document.getElementById('reading-progress');
  const scrollTopBtn = document.getElementById('scroll-top');

  function onScroll() {
    const scrolled = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrolled / docHeight) * 100 : 0;

    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    if (scrollTopBtn) {
      scrollTopBtn.classList.toggle('visible', scrolled > 400);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  app.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement).closest<HTMLElement>('[data-action]');
    if (!target) return;

    const action = target.dataset.action;
    if (action === 'go-home') {
      navigate('/');
    } else if (action === 'read') {
      const chId = target.dataset.chapter;
      if (chId) navigate(`/read/${chId}`);
    }
  });
}

// ─── Init ──────────────────────────────────────────
onRouteChange();
