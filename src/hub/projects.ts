/**
 * Story Project Registry — Cartographer atlas metadata.
 *
 * Each project carries:
 *   - identity (id, title, short label, description, genre)
 *   - cartographic position on the star atlas (x, y in 0..1, mag for star size)
 *   - signature color used across hub star, dashboard accents, reader accent
 *   - region label and optional pillar mechanic (dclass-hero only)
 */

export interface PillarProgress {
  name: string;
  pct: number;
  arc: string;
}

export interface StoryProject {
  id: string;
  title: string;
  short: string;
  description: string;
  emoji: string;
  genre: string;
  region: string;
  color: string;
  /** star magnitude (relative size on the atlas) */
  mag: number;
  /** atlas coordinates, 0..1 of viewport */
  x: number;
  y: number;
  /** dclass-hero only — nine pillars healing tracker */
  pillars?: PillarProgress[];
}

export const PROJECTS: StoryProject[] = [
  {
    id: 'dclass-hero',
    title: 'D급 스킬 이세계 용사',
    short: 'D-Class Hero',
    description: '이세계물 500편 읽은 삼류 프로그래머가 진짜 이세계에 떨어졌다. 9개의 기둥, 멸망까지의 카운트다운.',
    emoji: '⚔️',
    genre: 'Isekai · Linear',
    region: '아젤리아 / 솔라리스 / 카이젤',
    color: '#d4a853',
    mag: 1.0,
    x: 0.30,
    y: 0.42,
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
    description: '신교의 천마, 역병을 치유하던 불사의 교주가 음모에 의해 봉인당했다. 1093년 후, 물 한 방울에 깨어난다.',
    emoji: '⛓️',
    genre: 'Modern Wuxia',
    region: '서울 / 한반도 현대',
    color: '#9aa6c8',
    mag: 0.85,
    x: 0.62,
    y: 0.30,
  },
  {
    id: 'magitech-fire',
    title: '마도공학 프로그래머로 영생해보자',
    short: 'Magitech Fire',
    description: '가난에 찌들어 췌장암으로 자살한 삼류 프로그래머가, 이세계의 유통기한 1년짜리 호문클루스 몸에 빙의한다. 돈만 있으면 안 죽는다.',
    emoji: '💰',
    genre: 'Magitech · Survival',
    region: '제2제국 / 폐기동',
    color: '#c1846a',
    mag: 0.65,
    x: 0.50,
    y: 0.70,
  },
  {
    id: 'asteropos',
    title: '아스테로포스',
    short: 'Asteropos',
    description: '제국 동변, 하늘에서 일곱 빛이 한꺼번에 갈라진 밤. 맹인 고아가 주운 작은 돌이 잠든 사이 그의 죽은 눈으로 파고든다.',
    emoji: '✨',
    genre: 'High Fantasy',
    region: '린덴호프 / 한자제국',
    color: '#7fa890',
    mag: 0.55,
    x: 0.78,
    y: 0.55,
  },
];

export function getProject(id: string): StoryProject | undefined {
  return PROJECTS.find((p) => p.id === id);
}
