/**
 * Storyboard Markdown Parser
 * Converts storyboard markdown into typed StoryboardEpisode structures.
 */

import type { StoryboardEpisode, StoryboardCut, EpisodeMeta } from './types';

function parseTime(timeStr: string): number {
  const parts = timeStr.split(':');
  if (parts.length === 2) {
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
  }
  return parseInt(parts[0], 10);
}

function parseMetaBlock(text: string): EpisodeMeta {
  const meta: EpisodeMeta = {
    sourceChapter: '',
    duration: '',
    platform: '',
  };

  const lines = text.split('\n');
  for (const line of lines) {
    const clean = line.replace(/^>\s*/, '').trim();
    const sourceMatch = clean.match(/\*\*원본\*\*:\s*(.+)/);
    if (sourceMatch) meta.sourceChapter = sourceMatch[1].trim();

    const durationMatch = clean.match(/\*\*길이\*\*:\s*(.+)/);
    if (durationMatch) meta.duration = durationMatch[1].trim();

    const platformMatch = clean.match(/\*\*플랫폼\*\*:\s*(.+)/);
    if (platformMatch) meta.platform = platformMatch[1].trim();
  }

  return meta;
}

function parseCutSection(section: string): StoryboardCut | null {
  const headerMatch = section.match(/^##\s*\[(\d+:\d{2})\s*[-–]\s*(\d+:\d{2})\]\s*(.+)$/m);
  if (!headerMatch) return null;

  const startSec = parseTime(headerMatch[1]);
  const endSec = parseTime(headerMatch[2]);
  const label = headerMatch[3].trim();
  const timeRange = `${headerMatch[1]}-${headerMatch[2]}`;

  const cut: StoryboardCut = {
    timeRange,
    startSec,
    endSec,
    label,
    rawMarkdown: section.trim(),
  };

  // Parse narration: **나레이션**: "text"
  const narrationMatch = section.match(/\*\*나레이션\*\*:\s*"([^"]+)"/);
  if (narrationMatch) cut.narration = narrationMatch[1];

  // Parse bullet fields
  const fieldPattern = /[-*]\s*\*\*(.+?)\*\*:\s*(.+)/g;
  let match;
  while ((match = fieldPattern.exec(section)) !== null) {
    const key = match[1].trim();
    const val = match[2].trim();

    switch (key) {
      case '배경': cut.background = val; break;
      case '인물': cut.character = val; break;
      case '대사': cut.dialogue = val.replace(/^"/, '').replace(/"$/, ''); break;
      case '연출': cut.direction = val; break;
      case '효과음':
      case 'BGM':
      case 'SFX': cut.sfx = val; break;
    }
  }

  return cut;
}

export function parseStoryboard(raw: string): StoryboardEpisode {
  const sections = raw.split(/\n---\n/);

  // Parse header section
  const header = sections[0] || '';
  const titleMatch = header.match(/^#\s*(EP\.\d+)\s*[—–-]\s*(.+)$/m);
  const num = titleMatch ? parseInt(titleMatch[1].replace('EP.', ''), 10) : 0;
  const title = titleMatch ? titleMatch[2].trim() : 'Untitled';
  const headerTitle = titleMatch ? `${titleMatch[1]} — ${title}` : title;

  const meta = parseMetaBlock(header);

  // Parse cut sections
  const cuts: StoryboardCut[] = [];
  for (let i = 1; i < sections.length; i++) {
    const section = sections[i].trim();
    if (!section) continue;

    const cut = parseCutSection(section);
    if (cut) cuts.push(cut);
  }

  const totalDurationSec = cuts.length > 0 ? cuts[cuts.length - 1].endSec : 0;

  return {
    num,
    title,
    headerTitle,
    meta,
    cuts,
    totalDurationSec,
  };
}
