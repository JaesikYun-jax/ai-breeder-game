/**
 * Story Project Registry
 * Each project is one story with both novel chapters and storyboard episodes.
 */

export interface StoryProject {
  id: string;
  title: string;
  description: string;
  emoji: string;
}

export const PROJECTS: StoryProject[] = [
  {
    id: 'dclass-hero',
    title: 'D급 스킬 이세계 용사',
    description: '이세계물 500편 읽은 삼류 프로그래머가 진짜 이세계에 떨어졌다. 근데 여기서도 죽으면 다시 돌아온다.',
    emoji: '\u2694\uFE0F',
  },
  {
    id: 'canned-master',
    title: '봉인당한 천마가 1093년 만에 풀려난 건에 대하여',
    description: '신교의 천마, 역병을 치유하던 불사의 교주가 음모에 의해 봉인당했다. 1093년 후, 물 한 방울에 깨어난다.',
    emoji: '⛓️',
  },
  {
    id: 'british-food',
    title: '내 대영제국에 괴식은 없다',
    description: '현대 한국인 요리사가 19세기 영국에 빙의. 상태창과 요리로 대영제국을 바꿔나간다. (낑깡깽 작, 431화 완결)',
    emoji: '\uD83C\uDF73',
  },
];

export function getProject(id: string): StoryProject | undefined {
  return PROJECTS.find((p) => p.id === id);
}
