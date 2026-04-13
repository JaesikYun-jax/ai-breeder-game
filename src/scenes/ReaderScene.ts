/**
 * ReaderScene — 웹소설 리더 UI
 *
 * 마크다운 챕터 파일을 HTML로 변환하여 Phaser DOM 오버레이로 렌더링.
 * 스크롤 기반 읽기, 씬 구분선, 독백 하이라이팅.
 */

import * as Phaser from 'phaser';
import ch001Raw from '../data/novel/arc1_azelia/ch001_truck.md?raw';
import ch002Raw from '../data/novel/arc1_azelia/ch002_palace_night.md?raw';
import ch003Raw from '../data/novel/arc1_azelia/ch003_hero_training.md?raw';
import ch004Raw from '../data/novel/arc1_azelia/ch004_no_convenience_store.md?raw';
import ch005Raw from '../data/novel/arc1_azelia/ch005_first_death.md?raw';

const CHAPTERS = [
  { raw: ch001Raw, title: '1화. 트럭이 오는 건 알고 있었다' },
  { raw: ch002Raw, title: '2화. 아젤리아 왕궁의 밤은 길다' },
  { raw: ch003Raw, title: '3화. 용사라는 직업의 현실' },
  { raw: ch004Raw, title: '4화. 이 세계에도 편의점은 없다' },
  { raw: ch005Raw, title: '5화. 축복이라 쓰고 제물이라 읽는다' },
];

const READER_STYLE_ID = 'novel-reader-styles';

const READER_CSS = `
.novel-reader {
  width: 1100px;
  height: 680px;
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
  padding: 0;
  background: transparent;
}

.novel-reader::-webkit-scrollbar {
  width: 5px;
}
.novel-reader::-webkit-scrollbar-track {
  background: transparent;
}
.novel-reader::-webkit-scrollbar-thumb {
  background: #333355;
  border-radius: 3px;
}

.reader-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 20px;
  border-bottom: 1px solid #222244;
  margin-bottom: 20px;
}

.back-btn {
  background: none;
  border: 1px solid #444466;
  color: #8888aa;
  font-size: 14px;
  padding: 4px 14px;
  border-radius: 4px;
  cursor: pointer;
  font-family: -apple-system, BlinkMacSystemFont, 'Malgun Gothic', sans-serif;
}
.back-btn:hover {
  color: #ccccee;
  border-color: #6666aa;
}

.header-title {
  color: #555577;
  font-size: 13px;
  font-family: -apple-system, BlinkMacSystemFont, 'Malgun Gothic', sans-serif;
}

.reader-content {
  max-width: 700px;
  margin: 0 auto;
  padding: 0 40px 60px;
}

.reader-content .chapter-title {
  text-align: center;
  font-size: 26px;
  color: #e0e0f0;
  font-weight: 400;
  letter-spacing: 1px;
  margin: 20px 0 40px;
  font-family: -apple-system, BlinkMacSystemFont, 'Malgun Gothic', sans-serif;
}

.reader-content .scene-break {
  text-align: center;
  color: #444466;
  margin: 36px 0;
  letter-spacing: 12px;
  font-size: 14px;
  user-select: none;
}

.reader-content p {
  color: #c8c8d8;
  font-size: 17px;
  line-height: 2;
  margin: 0 0 18px;
  font-family: -apple-system, BlinkMacSystemFont, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;
  word-break: keep-all;
  overflow-wrap: break-word;
}

.reader-content .thought {
  color: #7ca4d4;
}

.reader-content em {
  color: #9999bb;
  font-style: italic;
}

.chapter-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 40px 0 20px;
  margin-top: 20px;
  border-top: 1px solid #222244;
  gap: 16px;
}

.chapter-nav button {
  background: none;
  border: 1px solid #444466;
  color: #8888aa;
  font-size: 14px;
  padding: 8px 18px;
  border-radius: 4px;
  cursor: pointer;
  font-family: -apple-system, BlinkMacSystemFont, 'Malgun Gothic', sans-serif;
  max-width: 45%;
  text-align: center;
  line-height: 1.4;
}
.chapter-nav button:hover {
  color: #ccccee;
  border-color: #6666aa;
}
`;

export class ReaderScene extends Phaser.Scene {
  private readerDom?: Phaser.GameObjects.DOMElement;
  private currentChapter = 0;

  constructor() {
    super({ key: 'ReaderScene' });
  }

  init(data?: { chapter?: number }) {
    this.currentChapter = data?.chapter ?? 0;
  }

  create() {
    this.cameras.main.setBackgroundColor('#0d0d1a');
    this.injectStyles();
    this.showChapter(this.currentChapter);

    // ESC to menu
    this.input.keyboard?.addKey('ESC').on('down', () => this.goToMenu());
  }

  shutdown() {
    this.readerDom?.destroy();
    this.readerDom = undefined;
  }

  private showChapter(index: number) {
    this.readerDom?.destroy();

    const ch = CHAPTERS[index];
    const wrapper = document.createElement('div');
    wrapper.className = 'novel-reader';
    wrapper.innerHTML = this.buildReaderHTML(ch.raw, index);

    this.readerDom = this.add.dom(640, 360, wrapper);

    // Back button
    wrapper.querySelector('.back-btn')?.addEventListener('click', () => this.goToMenu());

    // Prev / Next chapter buttons
    wrapper.querySelector('.nav-prev')?.addEventListener('click', () => {
      this.currentChapter--;
      this.showChapter(this.currentChapter);
    });
    wrapper.querySelector('.nav-next')?.addEventListener('click', () => {
      this.currentChapter++;
      this.showChapter(this.currentChapter);
    });
  }

  private goToMenu() {
    this.scene.start('MenuScene');
  }

  private injectStyles() {
    if (document.getElementById(READER_STYLE_ID)) return;

    const style = document.createElement('style');
    style.id = READER_STYLE_ID;
    style.textContent = READER_CSS;
    document.head.appendChild(style);
  }

  private buildReaderHTML(raw: string, chapterIndex: number): string {
    const sections = raw.split(/\n---\n/);

    let contentHTML = '';

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i].trim();
      if (!section) continue;

      if (i > 0) {
        contentHTML += '<div class="scene-break" aria-hidden="true">*\u2003*\u2003*</div>';
      }

      const paragraphs = section.split(/\n\n+/);

      for (const para of paragraphs) {
        const p = para.trim();
        if (!p) continue;

        if (p.startsWith('# ')) {
          contentHTML += `<h1 class="chapter-title">${this.escape(p.slice(2))}</h1>`;
        } else {
          let html = this.escape(p);
          html = html.replace(/\n/g, '<br>');
          html = html.replace(/&#x27;([^&#]+?)&#x27;/g, '<span class="thought">\u2018$1\u2019</span>');
          html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
          contentHTML += `<p>${html}</p>`;
        }
      }
    }

    // Navigation buttons
    const hasPrev = chapterIndex > 0;
    const hasNext = chapterIndex < CHAPTERS.length - 1;
    const prevTitle = hasPrev ? CHAPTERS[chapterIndex - 1].title : '';
    const nextTitle = hasNext ? CHAPTERS[chapterIndex + 1].title : '';

    const navHTML = `<div class="chapter-nav">
      ${hasPrev ? `<button class="nav-prev">\u2190 ${this.escape(prevTitle)}</button>` : '<span></span>'}
      ${hasNext ? `<button class="nav-next">${this.escape(nextTitle)} \u2192</button>` : '<span></span>'}
    </div>`;

    return `
      <div class="reader-header">
        <button class="back-btn">\u2190 \ubaa9\ucc28</button>
        <span class="header-title">Arc 1 \u2014 \uc544\uc824\ub9ac\uc544 (${chapterIndex + 1}/${CHAPTERS.length})</span>
      </div>
      <div class="reader-content">
        ${contentHTML}
        ${navHTML}
      </div>
    `;
  }

  private escape(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }
}
