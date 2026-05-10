/**
 * Design Docs Atlas — 모든 프로젝트의 설정 문서 자동 수집.
 *
 * 디자인 문서 = 부트스트랩·캐릭터시트·플롯훅가이드·세부설계 등.
 * Vite glob import로 projects/{slug}/design/*.md 자동 스캔.
 *
 * 새 프로젝트 추가 시 별도 등록 불필요 — `projects/{slug}/design/`에 .md 파일을 두면 자동 감지.
 */

const designModules = import.meta.glob('../../projects/*/design/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

export type DesignDocType =
  | 'bootstrap'
  | 'character'
  | 'plot'
  | 'detail'
  | 'character_detail'
  | 'plot_detail'
  | 'other';

export interface DesignDoc {
  /** unique id within project (stable for routing) */
  id: string;
  projectId: string;
  filename: string;
  /** display label (한글) */
  label: string;
  /** broader group label */
  group: string;
  type: DesignDocType;
  /** sort order within project */
  order: number;
  raw: string;
  /** path relative to repo root */
  path: string;
  /** approximate char count (for index card) */
  bytes: number;
}

interface ClassResult {
  type: DesignDocType;
  group: string;
  order: number;
}

function classifyByFilename(name: string): ClassResult {
  const n = name.toLowerCase();
  if (n.includes('부트스트랩') || n.includes('bootstrap')) {
    return { type: 'bootstrap', group: '큰 설계', order: 1 };
  }
  if (n.includes('세부캐릭터') || n.includes('character_detail')) {
    return { type: 'character_detail', group: '작은 설계', order: 4 };
  }
  if (
    n.includes('세부플롯') ||
    n.includes('plot_detail') ||
    /plot-?hook-?guide_act/i.test(name)
  ) {
    return { type: 'plot_detail', group: '작은 설계', order: 5 };
  }
  if (n.includes('세부설계') || n.includes('design_small')) {
    return { type: 'detail', group: '작은 설계', order: 6 };
  }
  if (n.includes('캐릭터시트') || n.includes('character')) {
    return { type: 'character', group: '큰 설계', order: 2 };
  }
  if (n.includes('플롯훅') || n.includes('플롯') || n.includes('plot')) {
    return { type: 'plot', group: '큰 설계', order: 3 };
  }
  return { type: 'other', group: '기타', order: 9 };
}

function deriveLabel(type: DesignDocType, cleanName: string): string {
  const baseMap: Record<DesignDocType, string> = {
    bootstrap: '부트스트랩',
    character: '캐릭터 시트',
    plot: '플롯 훅 가이드',
    character_detail: '세부 캐릭터 시트',
    plot_detail: '세부 플롯 훅 가이드',
    detail: '세부 설계',
    other: cleanName,
  };
  const base = baseMap[type];
  // EP 범위 또는 act 번호 추출
  const rangeMatch = cleanName.match(/(\d+~?\d*화|act\d+)/i);
  if (rangeMatch) return `${base} · ${rangeMatch[1]}`;
  return base;
}

function buildDocs(): DesignDoc[] {
  const docs: DesignDoc[] = [];
  for (const [path, raw] of Object.entries(designModules)) {
    const m = path.match(/projects\/([^/]+)\/design\/(.+)\.md$/);
    if (!m) continue;
    const projectId = m[1];
    const filename = m[2];
    const cls = classifyByFilename(filename);
    // id: 슬러그 prefix 제거한 깔끔한 식별자
    const cleanName = filename.replace(new RegExp('^' + projectId + '_'), '');
    const id = encodeURIComponent(cleanName || filename);
    const label = deriveLabel(cls.type, cleanName || filename);
    docs.push({
      id,
      projectId,
      filename,
      label,
      group: cls.group,
      type: cls.type,
      order: cls.order,
      raw,
      path: path.replace(/^\.\.\/\.\.\//, ''),
      bytes: raw.length,
    });
  }
  docs.sort((a, b) => {
    if (a.projectId !== b.projectId) return a.projectId.localeCompare(b.projectId);
    if (a.order !== b.order) return a.order - b.order;
    return a.id.localeCompare(b.id);
  });
  return docs;
}

export const ALL_DESIGN_DOCS: DesignDoc[] = buildDocs();

export function getDesignDocs(projectId: string): DesignDoc[] {
  return ALL_DESIGN_DOCS.filter((d) => d.projectId === projectId);
}

export function getDesignDoc(projectId: string, id: string): DesignDoc | undefined {
  return ALL_DESIGN_DOCS.find((d) => d.projectId === projectId && d.id === id);
}
