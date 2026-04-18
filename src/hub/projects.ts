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
    id: 'magitech-fire',
    title: '마도공학 프로그래머로 영생해보자',
    description: '가난에 찌들어 췌장암으로 자살한 삼류 프로그래머가, 이세계의 유통기한 1년짜리 호문클루스 몸에 빙의한다. 돈만 있으면 안 죽는다는 것을 깨닫는 순간, 영생 프로젝트가 시작된다.',
    emoji: '\uD83D\uDCB0',
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
