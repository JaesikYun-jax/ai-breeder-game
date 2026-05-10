/**
 * Chapter registry — 활성 프로젝트의 EP 본문을 Vite glob으로 자동 수집한다.
 *
 * 표준 위치: projects/{id}/episode/EP{NNN}.md
 *   - id는 src/projects/registry.ts ACTIVE_PROJECT_IDS의 항목만 인식
 *   - 디스크에 EP 파일을 추가하면 dev-server reload 시 자동 등록 (manual import 불필요)
 *
 * 메타데이터(제목·아크 라벨·상태)는 src/projects/episode-titles.ts에서 매핑.
 *   - 메타 누락 EP는 '{N}화' / 'Misc' fallback (리더에서는 보임, 그룹핑은 'misc')
 *   - "예정"(coming) placeholder는 episode-titles.ts에서 정의 (디스크 파일 없음, raw 비어있음)
 *
 * 합성키: id는 프로젝트 내에서만 unique → ALL_CHAPTERS 조회 시 projectId 함께 전달 필요.
 */

import { ACTIVE_PROJECTS } from '../projects/registry';
import {
  EPISODE_META,
  lookupEpisodeMeta,
  type ChapterStatus,
} from '../projects/episode-titles';

export interface ChapterMeta {
  id: string;
  num: number;
  title: string;
  arc: string;
  arcLabel: string;
  projectId: string;
  status: ChapterStatus;
  raw?: string;
}

const epId = (n: number) => `EP${String(n).padStart(3, '0')}`;

// ── Auto-collection via Vite glob import ──
//
// `eager: true` inlines every EP file at build time so we get plain strings.
// Path shape: ../../projects/{projectId}/episode/EP{NNN}.md
const RAW_MODULES = import.meta.glob('../../projects/*/episode/EP*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const PATH_RE = /\/projects\/([^/]+)\/episode\/EP(\d{3})\.md$/;

interface DiskEpisode {
  projectId: string;
  num: number;
  raw: string;
}

function collectDiskEpisodes(): DiskEpisode[] {
  const out: DiskEpisode[] = [];
  for (const [path, raw] of Object.entries(RAW_MODULES)) {
    const m = path.match(PATH_RE);
    if (!m) continue;
    out.push({
      projectId: m[1],
      num: parseInt(m[2], 10),
      raw,
    });
  }
  return out;
}

const ACTIVE_IDS = new Set(ACTIVE_PROJECTS.map((p) => p.id));

function buildProjectChapters(projectId: string): ChapterMeta[] {
  const diskByNum = new Map<number, string>();
  for (const ep of collectDiskEpisodes()) {
    if (ep.projectId === projectId) diskByNum.set(ep.num, ep.raw);
  }

  const meta = EPISODE_META[projectId];
  const result: ChapterMeta[] = [];

  // 1. 디스크 파일 기준 — 메타가 있으면 매칭, 없으면 fallback
  for (const [num, raw] of diskByNum) {
    const m = lookupEpisodeMeta(projectId, num);
    result.push({
      id: epId(num),
      num,
      title: m.title,
      arc: m.arc,
      arcLabel: m.arcLabel,
      projectId,
      status: m.status ?? 'writing',
      raw,
    });
  }

  // 2. 메타에 entries가 있지만 디스크에 파일 없는 항목 — 무시 (혼란 방지).
  //    필요하면 episode-titles.ts의 coming 배열에 옮길 것.

  // 3. coming placeholder (예정 EP)
  for (const c of meta?.coming ?? []) {
    if (diskByNum.has(c.num)) continue; // 디스크 파일이 생기면 자동 승격되므로 중복 방지
    result.push({
      id: epId(c.num),
      num: c.num,
      title: c.title,
      arc: c.arc,
      arcLabel: c.arcLabel,
      projectId,
      status: 'coming',
    });
  }

  result.sort((a, b) => a.num - b.num);
  return result;
}

// ── 활성 프로젝트별 챕터 배열 (이름 호환을 위해 유지된 export) ──
export const CHAPTERS: ChapterMeta[] = buildProjectChapters('dclass-hero');
export const CANNED_MASTER_CHAPTERS: ChapterMeta[] = buildProjectChapters('canned-master');
export const SKILL_COMPILER_CHAPTERS: ChapterMeta[] = buildProjectChapters('skill-compiler');
export const ASTEROPOS_CHAPTERS: ChapterMeta[] = buildProjectChapters('asteropos');

/** 모든 활성 프로젝트의 챕터를 등록 순서대로 결합 */
export const ALL_CHAPTERS: ChapterMeta[] = ACTIVE_PROJECTS.flatMap((p) =>
  buildProjectChapters(p.id),
);

/** 활성 프로젝트가 아닌 디스크 파일이 있으면 dev 콘솔에 경고 (archive 누락 가드) */
if (typeof console !== 'undefined') {
  const stray = collectDiskEpisodes().filter((ep) => !ACTIVE_IDS.has(ep.projectId));
  if (stray.length > 0) {
    const ids = Array.from(new Set(stray.map((s) => s.projectId)));
    console.warn(
      `[chapters] disk has EPs for inactive projects: ${ids.join(', ')} ` +
        `— add to src/projects/registry.ts or move to archive/`,
    );
  }
}

/**
 * Find a chapter by id.
 *
 * Multiple projects share EP{NNN} ids (e.g. dclass-hero EP001 and asteropos EP001).
 * Pass projectId to disambiguate. Without projectId, returns the first match — only safe
 * for legacy IDs that were globally unique.
 */
export function getChapter(id: string, projectId?: string): ChapterMeta | undefined {
  if (projectId) {
    return ALL_CHAPTERS.find((c) => c.id === id && c.projectId === projectId);
  }
  return ALL_CHAPTERS.find((c) => c.id === id);
}

/**
 * In-memory raw mutation. Used by the editor after a successful PUT /__episode
 * so the reader reflects the new content without a page reload. The on-disk
 * file is the source of truth — this only refreshes the runtime cache.
 */
export function updateChapterRaw(projectId: string, id: string, raw: string): boolean {
  const ch = ALL_CHAPTERS.find((c) => c.id === id && c.projectId === projectId);
  if (!ch) return false;
  ch.raw = raw;
  return true;
}
