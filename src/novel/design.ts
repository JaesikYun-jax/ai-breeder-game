// Design Atlas registry — auto-collects all design documents across projects.
//
// Source glob: projects/<project>/design followed by '/' '**' '/' '*.md'
// Each project's novel-config.md sets design_dir to projects/<project>/design/,
// which is the canonical location after the 2026-05-09 docs/story migration.
//
// Auto-categorisation by filename prefix; sub-folders (blue/red/region-details)
// get dedicated categories. New .md files added under each project's design/
// directory appear automatically on the next dev-server reload — no manual
// import needed.
//
// docKey is the path relative to the project's design/ root, without the .md
// extension.
//   characters.md         -> docKey 'characters'
//   blue/draft_azelia.md  -> docKey 'blue/draft_azelia'

export type DesignCategory =
  | 'world'      // 세계관/부트스트랩
  | 'character'  // 캐릭터 시트·보이스
  | 'plot'       // 플롯·훅 가이드
  | 'lore'       // 복선·용어·연표
  | 'style'      // 톤·문체·내러티브
  | 'meta'       // 정본·로그·피드백
  | 'drafts'     // 작가 팀 작업본 (blue/, red/)
  | 'other';

export interface DesignDocMeta {
  /** owning project id (e.g. 'dclass-hero') */
  projectId: string;
  /** path relative to projects/{project}/design/, no .md extension */
  docKey: string;
  /** display file name including .md */
  fileName: string;
  /** human-readable title — first H1 if present, else filename */
  title: string;
  /** computed category for tree grouping */
  category: DesignCategory;
  /** raw markdown content */
  raw: string;
}

const CATEGORY_LABELS: Record<DesignCategory, string> = {
  world: '세계관·부트스트랩',
  character: '캐릭터·보이스',
  plot: '플롯·훅',
  lore: '복선·용어·연표',
  style: '톤·문체',
  meta: '정본·로그',
  drafts: '작업본',
  other: '기타',
};

const CATEGORY_ORDER: DesignCategory[] = [
  'world',
  'character',
  'plot',
  'lore',
  'style',
  'meta',
  'drafts',
  'other',
];

export function categoryLabel(c: DesignCategory): string {
  return CATEGORY_LABELS[c];
}

export function categoryOrder(): DesignCategory[] {
  return [...CATEGORY_ORDER];
}

// ── Auto-collection via Vite glob import ──
//
// `eager: true` inlines every match at build time so we get plain strings
// (the same shape as chapters.ts's `?raw` imports). Result keys are paths
// relative to this file: ../../projects/{project}/design/{...}/{name}.md
const RAW_MODULES = import.meta.glob('../../projects/*/design/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const PATH_RE = /\/projects\/([^/]+)\/design\/(.+)\.md$/;

function categorise(docKey: string, fileName: string): DesignCategory {
  // Sub-folder routing first
  if (docKey.startsWith('blue/') || docKey.startsWith('red/')) return 'drafts';
  if (docKey.startsWith('region-details/')) return 'world';

  const base = fileName.replace(/\.md$/, '');

  // World / bootstrap
  if (
    base === 'worldbuilding' ||
    base === 'bootstrap' ||
    base === 'magic-systems' ||
    base === 'seal-regression' ||
    base.startsWith('region-')
  ) return 'world';

  // Character
  if (
    base === 'characters' ||
    base === 'voice-guide' ||
    base.startsWith('protagonist-')
  ) return 'character';

  // Plot
  if (base.startsWith('plot-hook-') || base.startsWith('story-framework-')) return 'plot';

  // Lore
  if (
    base === 'foreshadowing' ||
    base === 'glossary' ||
    base === 'timeline'
  ) return 'lore';

  // Style
  if (
    base.startsWith('tone-') ||
    base.startsWith('narrative-') ||
    base === 'death-and-regression'
  ) return 'style';

  // Meta / logs
  if (
    base === 'canon-quickref' ||
    base === 'chapter-log' ||
    base.endsWith('-feedback-log')
  ) return 'meta';

  return 'other';
}

function extractTitle(raw: string, fallback: string): string {
  const match = raw.match(/^#\s+(.+?)\s*$/m);
  if (match) {
    return match[1].replace(/^[^\s]+\s+/, (m) => (/^[#*\-—]+$/.test(m.trim()) ? '' : m));
  }
  return fallback;
}

function buildRegistry(): DesignDocMeta[] {
  const out: DesignDocMeta[] = [];
  for (const [path, raw] of Object.entries(RAW_MODULES)) {
    const m = path.match(PATH_RE);
    if (!m) continue;
    const projectId = m[1];
    const docKey = m[2];
    const fileName = docKey.split('/').pop()! + '.md';
    const title = extractTitle(raw, fileName.replace(/\.md$/, ''));
    out.push({
      projectId,
      docKey,
      fileName,
      title,
      category: categorise(docKey, fileName),
      raw,
    });
  }
  out.sort((a, b) => {
    if (a.projectId !== b.projectId) return a.projectId.localeCompare(b.projectId);
    const ca = CATEGORY_ORDER.indexOf(a.category);
    const cb = CATEGORY_ORDER.indexOf(b.category);
    if (ca !== cb) return ca - cb;
    return a.docKey.localeCompare(b.docKey);
  });
  return out;
}

export const ALL_DESIGN_DOCS: DesignDocMeta[] = buildRegistry();

// ── Lookup helpers ──

export function getDesignDocs(projectId: string): DesignDocMeta[] {
  return ALL_DESIGN_DOCS.filter((d) => d.projectId === projectId);
}

export function getDesignDoc(projectId: string, docKey: string): DesignDocMeta | undefined {
  return ALL_DESIGN_DOCS.find((d) => d.projectId === projectId && d.docKey === docKey);
}

/**
 * Group a project's design docs by category, in the canonical order.
 * Empty categories are omitted.
 */
export function groupedDesignDocs(projectId: string): Array<{
  category: DesignCategory;
  label: string;
  docs: DesignDocMeta[];
}> {
  const docs = getDesignDocs(projectId);
  const buckets = new Map<DesignCategory, DesignDocMeta[]>();
  for (const d of docs) {
    if (!buckets.has(d.category)) buckets.set(d.category, []);
    buckets.get(d.category)!.push(d);
  }
  return CATEGORY_ORDER
    .filter((c) => buckets.has(c))
    .map((c) => ({ category: c, label: CATEGORY_LABELS[c], docs: buckets.get(c)! }));
}

/**
 * In-memory raw mutation. Mirror of updateChapterRaw — used by the editor
 * after a successful PUT /__design so the design view reflects the new
 * content without a page reload.
 */
export function updateDesignDocRaw(projectId: string, docKey: string, raw: string): boolean {
  const d = ALL_DESIGN_DOCS.find((x) => x.projectId === projectId && x.docKey === docKey);
  if (!d) return false;
  d.raw = raw;
  d.title = extractTitle(raw, d.fileName.replace(/\.md$/, ''));
  return true;
}
