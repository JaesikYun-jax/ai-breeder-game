/**
 * Episode Title Registry — 프로젝트별 EP 메타데이터 (제목·아크).
 *
 * 본문(.md)은 src/novel/chapters.ts가 Vite glob으로 자동 수집한다.
 * 이 파일은 그 본문에 인간이 보는 메타데이터(제목·아크 키·아크 라벨)를 매핑한다.
 *
 * 새 EP 추가 워크플로:
 *   1. projects/{id}/episode/EP{NNN}.md 작성
 *   2. 이 파일의 해당 프로젝트 entries에 항목 추가 (없으면 'EP{NNN}' fallback 사용)
 *   3. 끝. import 문은 자동.
 *
 * 누락 fallback: 이 파일에 entry가 없는 EP는 '{N}화' 제목 + 'misc' 아크로 표시된다.
 */

export type ChapterStatus = 'writing' | 'complete' | 'published' | 'coming';

export interface EpisodeEntry {
  /** EP 숫자 (디렉토리 파일명의 NNN 부분) */
  num: number;
  title: string;
  /** 아크 키 — 같은 키의 EP끼리 그룹핑 */
  arc: string;
  /** UI 표시용 아크 라벨 */
  arcLabel: string;
  /** 기본 'writing' */
  status?: ChapterStatus;
}

/** "예정"(coming) placeholder — 실제 .md 파일 없이 향후 EP를 표시 */
export interface ComingEntry extends EpisodeEntry {
  status: 'coming';
}

export interface ProjectEpisodeMeta {
  /** 실제 EP들 (디스크 파일과 매칭) */
  entries: EpisodeEntry[];
  /** 향후 예정 EP placeholder (디스크 파일 없음) */
  coming?: ComingEntry[];
}

export const EPISODE_META: Record<string, ProjectEpisodeMeta> = {
  'dclass-hero': {
    entries: [
      { num: 1,  title: '트럭이 오는 건 알고 있었다', arc: 'arc1_azelia',    arcLabel: 'Arc 1 — 아젤리아',       status: 'published' },
      { num: 2,  title: '아젤리아 왕궁의 밤은 길다', arc: 'arc1_azelia',    arcLabel: 'Arc 1 — 아젤리아',       status: 'published' },
      { num: 3,  title: '용사라는 직업의 현실',     arc: 'arc1_azelia',    arcLabel: 'Arc 1 — 아젤리아',       status: 'published' },
      { num: 4,  title: '이 세계에도 편의점은 없다', arc: 'arc1_azelia',    arcLabel: 'Arc 1 — 아젤리아',       status: 'published' },
      { num: 5,  title: '축복이라 쓰고 제물이라 읽는다', arc: 'arc1_azelia', arcLabel: 'Arc 1 — 아젤리아',       status: 'published' },
      { num: 6,  title: '모래 위의 사람들',         arc: 'arc2_solaris',   arcLabel: 'Arc 2 — 솔라리스' },
      { num: 7,  title: '불을 빌리는 자들',         arc: 'arc2_solaris',   arcLabel: 'Arc 2 — 솔라리스' },
      { num: 8,  title: '계약',                     arc: 'arc2_solaris',   arcLabel: 'Arc 2 — 솔라리스' },
      { num: 9,  title: '모래폭풍',                 arc: 'arc2_solaris',   arcLabel: 'Arc 2 — 솔라리스' },
      { num: 10, title: '꺼지지 않는 불',           arc: 'arc2_solaris',   arcLabel: 'Arc 2 — 솔라리스' },
      { num: 11, title: '명예로운 노예들',           arc: 'arc2_solaris',   arcLabel: 'Arc 2 — 솔라리스' },
      { num: 12, title: '최적화',                   arc: 'arc2_solaris',   arcLabel: 'Arc 2 — 솔라리스' },
      { num: 13, title: '열사병은 걸리지 않는다',   arc: 'arc2_solaris',   arcLabel: 'Arc 2 — 솔라리스' },
      { num: 14, title: '이를 갈다',                arc: 'arc3_awakening', arcLabel: 'Arc 3 — 각성과 귀환' },
      { num: 15, title: '번개를 맞는 자',           arc: 'arc3_awakening', arcLabel: 'Arc 3 — 각성과 귀환' },
      { num: 16, title: '과부하',                   arc: 'arc3_awakening', arcLabel: 'Arc 3 — 각성과 귀환' },
      { num: 17, title: '코드를 새기다',             arc: 'arc3_awakening', arcLabel: 'Arc 3 — 각성과 귀환' },
      { num: 18, title: '빛의 왕국으로',             arc: 'arc3_awakening', arcLabel: 'Arc 3 — 각성과 귀환' },
      { num: 19, title: '심판',                     arc: 'arc3_awakening', arcLabel: 'Arc 3 — 각성과 귀환' },
      { num: 20, title: '용사의 길',                arc: 'arc3_awakening', arcLabel: 'Arc 3 — 각성과 귀환' },
      { num: 21, title: '부왕은 부왕이 아니다',     arc: 'arc4_internal',  arcLabel: 'Arc 4 — 내정의 해' },
      { num: 22, title: '재회',                     arc: 'arc4_internal',  arcLabel: 'Arc 4 — 내정의 해' },
      { num: 23, title: '약한 세계의 용사',         arc: 'arc4_internal',  arcLabel: 'Arc 4 — 내정의 해' },
      { num: 24, title: '지하의 말',                arc: 'arc4_internal',  arcLabel: 'Arc 4 — 내정의 해' },
      { num: 25, title: '두 나라의 그림',           arc: 'arc4_internal',  arcLabel: 'Arc 4 — 내정의 해' },
      { num: 26, title: '솔라리스 가는 길',         arc: 'arc4_internal',  arcLabel: 'Arc 4 — 내정의 해' },
      { num: 27, title: '모래의 약속',              arc: 'arc4_internal',  arcLabel: 'Arc 4 — 내정의 해' },
      { num: 28, title: '비장의 무기',              arc: 'arc4_internal',  arcLabel: 'Arc 4 — 내정의 해' },
      { num: 29, title: '사막의 새 호흡',           arc: 'arc5_caravan',   arcLabel: 'Arc 5 — 사막의 캐러밴' },
      { num: 30, title: '일곱 번째 오아시스',       arc: 'arc5_caravan',   arcLabel: 'Arc 5 — 사막의 캐러밴' },
      { num: 31, title: '정령석 작업장',            arc: 'arc5_caravan',   arcLabel: 'Arc 5 — 사막의 캐러밴' },
      { num: 32, title: '두 태양의 길',             arc: 'arc5_caravan',   arcLabel: 'Arc 5 — 사막의 캐러밴' },
      { num: 33, title: '모래 너머',                arc: 'arc5_caravan',   arcLabel: 'Arc 5 — 사막의 캐러밴' },
      { num: 34, title: '북쪽으로',                 arc: 'arc5_caravan',   arcLabel: 'Arc 5 — 사막의 캐러밴' },
      { num: 35, title: '강철의 첫날',              arc: 'arc6_kaizer',    arcLabel: 'Arc 6 — 강철의 궁정' },
      { num: 36, title: '강철의 식탁',              arc: 'arc6_kaizer',    arcLabel: 'Arc 6 — 강철의 궁정' },
      { num: 37, title: '변경의 침묵',              arc: 'arc6_kaizer',    arcLabel: 'Arc 6 — 강철의 궁정' },
      { num: 38, title: '같은 결의 사람',           arc: 'arc6_kaizer',    arcLabel: 'Arc 6 — 강철의 궁정' },
      { num: 39, title: '강철의 정원',              arc: 'arc6_kaizer',    arcLabel: 'Arc 6 — 강철의 궁정' },
      { num: 40, title: '두 결의 충돌',             arc: 'arc6_kaizer',    arcLabel: 'Arc 6 — 강철의 궁정' },
      { num: 41, title: '강철의 안쪽',              arc: 'arc6_kaizer',    arcLabel: 'Arc 6 — 강철의 궁정' },
      { num: 42, title: '강철을 풀다',              arc: 'arc6_kaizer',    arcLabel: 'Arc 6 — 강철의 궁정' },
    ],
  },

  'canned-master': {
    entries: [
      { num: 1,  title: '손님',         arc: 'cm_arc1_opening',  arcLabel: 'Arc 1 — 개봉' },
      { num: 2,  title: '석관',         arc: 'cm_arc1_opening',  arcLabel: 'Arc 1 — 개봉' },
      { num: 3,  title: '조수석',       arc: 'cm_arc1_opening',  arcLabel: 'Arc 1 — 개봉' },
      { num: 4,  title: '아리수',       arc: 'cm_arc1_opening',  arcLabel: 'Arc 1 — 개봉' },
      { num: 5,  title: '부교주',       arc: 'cm_arc1_opening',  arcLabel: 'Arc 1 — 개봉' },
      { num: 6,  title: '남행',         arc: 'cm_arc1_opening',  arcLabel: 'Arc 1 — 개봉' },
      { num: 7,  title: '계곡',         arc: 'cm_arc1_opening',  arcLabel: 'Arc 1 — 개봉' },
      { num: 8,  title: '응급실',       arc: 'cm_arc1_opening',  arcLabel: 'Arc 1 — 개봉' },
      { num: 9,  title: '기적',         arc: 'cm_arc1_opening',  arcLabel: 'Arc 1 — 개봉' },
      { num: 10, title: '서연',         arc: 'cm_arc1_opening',  arcLabel: 'Arc 1 — 개봉' },
      { num: 11, title: '입성',         arc: 'cm_arc2_confront', arcLabel: 'Arc 2 — 대면' },
      { num: 12, title: '삼파',         arc: 'cm_arc2_confront', arcLabel: 'Arc 2 — 대면' },
      { num: 13, title: '미행',         arc: 'cm_arc2_confront', arcLabel: 'Arc 2 — 대면' },
      { num: 14, title: '자객',         arc: 'cm_arc2_confront', arcLabel: 'Arc 2 — 대면' },
      { num: 15, title: '후원자',       arc: 'cm_arc2_confront', arcLabel: 'Arc 2 — 대면' },
      { num: 16, title: '인질',         arc: 'cm_arc2_confront', arcLabel: 'Arc 2 — 대면' },
      { num: 17, title: '물의 경로',    arc: 'cm_arc2_confront', arcLabel: 'Arc 2 — 대면' },
      { num: 18, title: '심판',         arc: 'cm_arc2_confront', arcLabel: 'Arc 2 — 대면' },
      { num: 19, title: '백준하',       arc: 'cm_arc2_confront', arcLabel: 'Arc 2 — 대면' },
      { num: 20, title: '습격',         arc: 'cm_arc2_confront', arcLabel: 'Arc 2 — 대면' },
    ],
  },

  asteropos: {
    entries: [
      { num: 0,  title: '프롤로그 — 별 떨어진 밤', arc: 'ast_prologue',   arcLabel: '프롤로그' },
      { num: 1,  title: '구덩이',                   arc: 'arc1_village',   arcLabel: 'Arc 1 — 양부모 마을' },
      { num: 2,  title: '신의 은총',                arc: 'arc1_village',   arcLabel: 'Arc 1 — 양부모 마을' },
      { num: 3,  title: '현자의 재림',              arc: 'arc1_village',   arcLabel: 'Arc 1 — 양부모 마을' },
      { num: 4,  title: '마당의 끝',                arc: 'arc1_village',   arcLabel: 'Arc 1 — 양부모 마을' },
      { num: 5,  title: '사라진 마을',              arc: 'arc1_village',   arcLabel: 'Arc 1 — 양부모 마을' },
      { num: 6,  title: '마차 위에서',              arc: 'arc1_village',   arcLabel: 'Arc 1 — 양부모 마을' },
      { num: 7,  title: '라이덴 마법학원 도착',     arc: 'arc2a_leiden',   arcLabel: 'Arc 2-a — 라이덴 마법학원' },
      { num: 8,  title: '룬 기초',                  arc: 'arc2a_leiden',   arcLabel: 'Arc 2-a — 라이덴 마법학원' },
      { num: 9,  title: '도서관 일상',              arc: 'arc2a_leiden',   arcLabel: 'Arc 2-a — 라이덴 마법학원' },
      { num: 10, title: '룬 결투',                  arc: 'arc2a_leiden',   arcLabel: 'Arc 2-a — 라이덴 마법학원' },
      { num: 11, title: '자각의 화',                arc: 'arc2a_leiden',   arcLabel: 'Arc 2-a — 라이덴 마법학원' },
      { num: 12, title: '제국 장학생 통보',         arc: 'arc2a_leiden',   arcLabel: 'Arc 2-a — 라이덴 마법학원' },
      { num: 13, title: '제국 수도 도착',           arc: 'arc2b_imperial', arcLabel: 'Arc 2-b — 제국 검술 아카데미' },
      { num: 14, title: '검술 아카데미 지원',       arc: 'arc2b_imperial', arcLabel: 'Arc 2-b — 제국 검술 아카데미' },
      { num: 15, title: '입학·귀족 라이벌',         arc: 'arc2b_imperial', arcLabel: 'Arc 2-b — 제국 검술 아카데미' },
      { num: 16, title: '첫 합동 훈련',             arc: 'arc2b_imperial', arcLabel: 'Arc 2-b — 제국 검술 아카데미' },
    ],
    coming: [
      { num: 17, title: '17화 (예정)', arc: 'arc2b_imperial', arcLabel: 'Arc 2-b — 제국 검술 아카데미', status: 'coming' },
      { num: 18, title: '18화 (예정)', arc: 'arc2b_imperial', arcLabel: 'Arc 2-b — 제국 검술 아카데미', status: 'coming' },
      { num: 19, title: '19화 (예정)', arc: 'arc2b_imperial', arcLabel: 'Arc 2-b — 제국 검술 아카데미', status: 'coming' },
      { num: 20, title: '20화 (예정)', arc: 'arc2b_imperial', arcLabel: 'Arc 2-b — 제국 검술 아카데미', status: 'coming' },
      { num: 25, title: '25화 (예정)', arc: 'arc3_freecity',  arcLabel: 'Arc 3 — 자유 도시 + 첫 성석',  status: 'coming' },
      { num: 26, title: '26화 (예정)', arc: 'arc3_freecity',  arcLabel: 'Arc 3 — 자유 도시 + 첫 성석',  status: 'coming' },
      { num: 27, title: '27화 (예정)', arc: 'arc3_freecity',  arcLabel: 'Arc 3 — 자유 도시 + 첫 성석',  status: 'coming' },
      { num: 28, title: '28화 (예정)', arc: 'arc3_freecity',  arcLabel: 'Arc 3 — 자유 도시 + 첫 성석',  status: 'coming' },
      { num: 29, title: '29화 (예정)', arc: 'arc3_freecity',  arcLabel: 'Arc 3 — 자유 도시 + 첫 성석',  status: 'coming' },
      { num: 30, title: '30화 (예정)', arc: 'arc3_freecity',  arcLabel: 'Arc 3 — 자유 도시 + 첫 성석',  status: 'coming' },
      { num: 31, title: '31화 (예정)', arc: 'arc3_freecity',  arcLabel: 'Arc 3 — 자유 도시 + 첫 성석',  status: 'coming' },
      { num: 32, title: '32화 (예정)', arc: 'arc3_freecity',  arcLabel: 'Arc 3 — 자유 도시 + 첫 성석',  status: 'coming' },
      { num: 33, title: '33화 (예정)', arc: 'arc3_freecity',  arcLabel: 'Arc 3 — 자유 도시 + 첫 성석',  status: 'coming' },
      { num: 34, title: '34화 (예정)', arc: 'arc3_freecity',  arcLabel: 'Arc 3 — 자유 도시 + 첫 성석',  status: 'coming' },
      { num: 35, title: '35화 (예정)', arc: 'arc3_freecity',  arcLabel: 'Arc 3 — 자유 도시 + 첫 성석',  status: 'coming' },
      { num: 36, title: '36화 (예정)', arc: 'arc3_freecity',  arcLabel: 'Arc 3 — 자유 도시 + 첫 성석',  status: 'coming' },
      { num: 37, title: '37화 (예정)', arc: 'arc3_freecity',  arcLabel: 'Arc 3 — 자유 도시 + 첫 성석',  status: 'coming' },
      { num: 38, title: '38화 (예정)', arc: 'arc3_freecity',  arcLabel: 'Arc 3 — 자유 도시 + 첫 성석',  status: 'coming' },
    ],
  },

  // skill-compiler — EP는 큰 설계(/design-big) 후 작성. 비어 있어도 OK.
  'skill-compiler': {
    entries: [],
  },

  // dual-save — 큰 설계 + 1~10화 세부설계 완료. 본문 EP는 미작성.
  'dual-save': {
    entries: [],
  },
};

/**
 * Lookup helper. 메타 미정의 EP는 fallback (제목 = "{N}화", 아크 = "misc").
 */
export function lookupEpisodeMeta(
  projectId: string,
  num: number,
): EpisodeEntry {
  const meta = EPISODE_META[projectId];
  const found = meta?.entries.find((e) => e.num === num);
  if (found) return found;
  return {
    num,
    title: `${num}화`,
    arc: 'misc',
    arcLabel: 'Misc',
    status: 'writing',
  };
}
