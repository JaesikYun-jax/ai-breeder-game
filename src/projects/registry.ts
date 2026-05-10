/**
 * Project Registry — Single Source of Truth.
 *
 * 모든 프로젝트의 메타데이터·표준 경로·활성 여부를 한 곳에서 정의한다.
 * 다음 위치에서 모두 이 레지스트리를 참조한다:
 *   - src/hub/projects.ts        (Cartographer 별 표시용)
 *   - src/novel/chapters.ts      (EP 자동 수집)
 *   - src/novel/design.ts        (설계 문서 자동 수집)
 *   - vite-plugin-episode.ts     (PUT/__episode 화이트리스트)
 *   - vite-plugin-design.ts      (PUT/__design 화이트리스트)
 *   - vite-plugin-feedback.ts    (프로젝트별 inline-feedback.json 경로)
 *   - scripts/check-chapters.mjs (CI 검사)
 *
 * 표준 경로 규약 (모든 프로젝트 동일):
 *   projects/{id}/novel-config.md       — 파이프라인 중앙 설정
 *   projects/{id}/episode/EP{NNN}.md    — 본문
 *   projects/{id}/design/**\/*.md       — 설계 문서 (Design Atlas 자동 수집)
 *   projects/{id}/revision/             — 작업·피드백 추적
 *   projects/{id}/revision/inline-feedback.json — 인라인 피드백
 *
 * 새 프로젝트 추가 시:
 *   1. projects/{id}/ 디렉토리 + episode/, design/, revision/ 생성
 *   2. projects/{id}/novel-config.md 작성 (design_dir/episode_dir 표준 경로)
 *   3. 이 파일의 PROJECTS 배열에 항목 추가 + 필요하면 src/projects/episode-titles/{id}.ts 작성
 *
 * 보관(archive)은 projects/ 밖의 archive/{id}/로 옮기고 PROJECTS에서 항목 제거
 * 또는 archived: true 플래그로 표시.
 */

export interface PillarProgress {
  name: string;
  pct: number;
  arc: string;
}

export interface ProjectMeta {
  /** 슬러그 — 디렉토리명 + 모든 경로의 키 */
  id: string;
  /** 정식 제목 */
  title: string;
  /** 짧은 라벨 (별 옆 표시) */
  short: string;
  /** 한 줄 설명 (Atlas 미리보기) */
  description: string;
  emoji: string;
  genre: string;
  region: string;
  /** 시그니처 색 (별·강조·악센트에 사용) */
  color: string;
  /** Atlas 별 크기 */
  mag: number;
  /** Atlas 좌표 0..1 */
  x: number;
  y: number;
  /** archive로 이동했거나 비활성화 — 뷰어/파이프라인에서 제외 */
  archived?: boolean;
  /** /__feedback 인라인 피드백 활성 여부 (현재 dclass-hero만) */
  feedbackEnabled?: boolean;
  /** dclass-hero 전용 — 9기둥 진행도 */
  pillars?: PillarProgress[];
}

/**
 * 프로젝트별 표준 경로 (단일 진실 공급원).
 * 절대 다른 곳에서 `projects/{id}/...` 문자열을 직접 조립하지 말고 이 함수를 사용할 것.
 */
export function projectPaths(id: string) {
  const root = `projects/${id}`;
  return {
    /** 프로젝트 루트 */
    root,
    /** novel-config.md (파이프라인 중앙 설정) */
    config: `${root}/novel-config.md`,
    /** EP{NNN}.md 본문 디렉토리 */
    episodeDir: `${root}/episode`,
    /** 설계 문서 (Design Atlas 수집 대상) */
    designDir: `${root}/design`,
    /** 작업·검토 산출물 */
    revisionDir: `${root}/revision`,
    /** 인라인 피드백 JSON */
    feedbackFile: `${root}/revision/inline-feedback.json`,
  };
}

/**
 * 모든 프로젝트 메타데이터.
 *
 * archived: true → 뷰어·API에서 제외. archive/{id}/ 로 디렉토리 이동을 권장.
 */
export const PROJECTS: ProjectMeta[] = [
  {
    id: 'dclass-hero',
    title: 'D급 스킬 이세계 용사',
    short: 'D-Class Hero',
    description:
      '이세계물 500편 읽은 삼류 프로그래머가 진짜 이세계에 떨어졌다. 9개의 기둥, 멸망까지의 카운트다운.',
    emoji: '⚔️',
    genre: 'Isekai · Linear',
    region: '아젤리아 / 솔라리스 / 카이젤',
    color: '#d4a853',
    mag: 1.0,
    x: 0.30,
    y: 0.42,
    feedbackEnabled: true,
    pillars: [
      { name: '빛',   pct: 100, arc: 'Arc 1' },
      { name: '태양', pct: 100, arc: 'Arc 2-3' },
      { name: '강철', pct: 38,  arc: 'Arc 6' },
      { name: '빙',   pct: 0,   arc: 'Arc 7' },
      { name: '용',   pct: 0,   arc: 'Arc 8' },
      { name: '바다', pct: 0,   arc: 'Arc 9' },
      { name: '모래', pct: 0,   arc: '—' },
      { name: '천',   pct: 0,   arc: '—' },
      { name: '지',   pct: 0,   arc: '—' },
    ],
  },
  {
    id: 'canned-master',
    title: '봉인당한 천마가 1093년 만에 풀려난 건에 대하여',
    short: 'Canned Master',
    description:
      '신교의 천마, 역병을 치유하던 불사의 교주가 음모에 의해 봉인당했다. 1093년 후, 물 한 방울에 깨어난다.',
    emoji: '⛓️',
    genre: 'Modern Wuxia',
    region: '서울 / 한반도 현대',
    color: '#9aa6c8',
    mag: 0.85,
    x: 0.62,
    y: 0.30,
  },
  {
    id: 'skill-compiler',
    title: '나에게만 스킬이 코드로 보인다',
    short: 'Skill Compiler',
    description:
      '모두에게 상태창이 열린 시대. F급 비각성자만이 자신의 스킬이 수정 가능한 코드로 되어 있음을 깨닫는다. 무시당하던 디버거가 시스템의 가장 위험한 변수가 된다.',
    emoji: '💻',
    genre: 'Modern Hunter · Code',
    region: '한국 / 대각성 후 1년',
    color: '#6b8aff',
    mag: 1.0,
    x: 0.50,
    y: 0.70,
  },
  {
    id: 'asteropos',
    title: '아스테로포스',
    short: 'Asteropos',
    description:
      '제국 동변, 하늘에서 일곱 빛이 한꺼번에 갈라진 밤. 맹인 고아가 주운 작은 돌이 잠든 사이 그의 죽은 눈으로 파고든다.',
    emoji: '✨',
    genre: 'High Fantasy',
    region: '린덴호프 / 한자제국',
    color: '#7fa890',
    mag: 0.55,
    x: 0.78,
    y: 0.55,
  },
  {
    id: 'dual-save',
    title: 'SSS급 저주에 걸린 짐꾼',
    short: 'Doyunmamu',
    description:
      '부모가 죽기 전 자식한테 시간 신 저주를 걸었다. 짐꾼 한도윤은 23세 신촌 반지하 영구 앵커로 회귀해 차원을 넘는다.',
    emoji: '⌛',
    genre: 'Recurrence · Hunter',
    region: '신촌 / 다중 차원',
    color: '#6a5b8a',
    mag: 0.5,
    x: 0.18,
    y: 0.78,
  },
];

/** 활성 프로젝트만 (archived 제외) */
export const ACTIVE_PROJECTS: ProjectMeta[] = PROJECTS.filter((p) => !p.archived);

/** 활성 프로젝트 ID 집합 — 화이트리스트 검증용 */
export const ACTIVE_PROJECT_IDS: ReadonlySet<string> = new Set(
  ACTIVE_PROJECTS.map((p) => p.id),
);

export function getProjectMeta(id: string): ProjectMeta | undefined {
  return PROJECTS.find((p) => p.id === id);
}

export function isActiveProject(id: string): boolean {
  return ACTIVE_PROJECT_IDS.has(id);
}
