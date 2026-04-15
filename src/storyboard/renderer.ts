/**
 * Storyboard Renderer — StoryboardEpisode → Timeline HTML
 */

import type { StoryboardEpisode, StoryboardCut } from './types';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderTimebar(episode: StoryboardEpisode): string {
  if (episode.totalDurationSec === 0) return '';

  const segments = episode.cuts.map((cut, i) => {
    const width = ((cut.endSec - cut.startSec) / episode.totalDurationSec) * 100;
    return `
      <div class="sb-timebar-segment" data-cut="${i}" style="width: ${width}%">
        <span class="sb-timebar-label">${escapeHtml(cut.label)}</span>
        <span class="sb-timebar-time">${cut.timeRange.split('-')[0]}</span>
      </div>
    `;
  }).join('');

  return `
    <div class="sb-timebar">
      ${segments}
    </div>
    <div class="sb-timebar-ruler">
      <span>0:00</span>
      <span>${formatTime(episode.totalDurationSec)}</span>
    </div>
  `;
}

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function renderCutCard(cut: StoryboardCut, index: number): string {
  const duration = cut.endSec - cut.startSec;

  const details: string[] = [];
  if (cut.background) {
    details.push(detailRow('BG', cut.background));
  }
  if (cut.character) {
    details.push(detailRow('CHAR', cut.character));
  }
  if (cut.dialogue) {
    details.push(`
      <div class="sb-detail-row sb-detail-dialogue">
        <span class="sb-detail-key">DIAL</span>
        <span class="sb-detail-val">&ldquo;${escapeHtml(cut.dialogue)}&rdquo;</span>
      </div>
    `);
  }
  if (cut.direction) {
    details.push(detailRow('CAM', cut.direction));
  }
  if (cut.sfx) {
    details.push(detailRow('SFX', cut.sfx));
  }

  return `
    <div class="sb-cut-card" id="cut-${index}" data-time="${cut.timeRange}">
      <div class="sb-cut-header">
        <span class="sb-cut-time">[${cut.timeRange}]</span>
        <span class="sb-cut-label">${escapeHtml(cut.label)}</span>
        <span class="sb-cut-duration">${duration}s</span>
      </div>
      <div class="sb-cut-body">
        ${cut.narration ? `
          <div class="sb-cut-narration">
            <span class="sb-field-label">Narration</span>
            <p>&ldquo;${escapeHtml(cut.narration)}&rdquo;</p>
          </div>
        ` : ''}
        ${details.length > 0 ? `
          <div class="sb-cut-details">
            ${details.join('')}
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

function detailRow(key: string, value: string): string {
  return `
    <div class="sb-detail-row">
      <span class="sb-detail-key">${key}</span>
      <span class="sb-detail-val">${escapeHtml(value)}</span>
    </div>
  `;
}

export function renderEpisodeHTML(episode: StoryboardEpisode): string {
  const metaTags = [
    episode.meta.sourceChapter && `<span class="sb-meta-tag">${escapeHtml(episode.meta.sourceChapter)}</span>`,
    episode.meta.duration && `<span class="sb-meta-tag">${escapeHtml(episode.meta.duration)}</span>`,
    episode.meta.platform && `<span class="sb-meta-tag">${escapeHtml(episode.meta.platform)}</span>`,
  ].filter(Boolean).join('');

  const cutCards = episode.cuts.map((cut, i) => renderCutCard(cut, i)).join('');

  return `
    <div class="sb-episode-header">
      <h1 class="sb-ep-title">${escapeHtml(episode.headerTitle)}</h1>
      <div class="sb-ep-meta">${metaTags}</div>
    </div>
    ${renderTimebar(episode)}
    <div class="sb-cuts">
      ${cutCards}
    </div>
  `;
}
