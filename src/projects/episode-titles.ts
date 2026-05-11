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
  // dclass-hero — 2026-05-11 백업 정본화 (작가가 직접 추가 작성한 백업이 곧 정본).
  // 아크 분류는 잠정. design-big 재실행 후 재조정 예정 (EP059~EP158 신규 100화 설계 시).
  'dclass-hero': {
    entries: [
      { num: 1,  title: '트럭이 오는 건 알고 있었다', arc: 'arc1_summon',          arcLabel: 'Arc 1 — 강림과 사막' },
      { num: 2,  title: '검증',                      arc: 'arc1_summon',          arcLabel: 'Arc 1 — 강림과 사막' },
      { num: 3,  title: '용사의 현실',                arc: 'arc1_summon',          arcLabel: 'Arc 1 — 강림과 사막' },
      { num: 4,  title: '용사의 기록',                arc: 'arc1_summon',          arcLabel: 'Arc 1 — 강림과 사막' },
      { num: 5,  title: '축복 의식',                  arc: 'arc1_summon',          arcLabel: 'Arc 1 — 강림과 사막' },
      { num: 6,  title: '모래 위의 사람들',            arc: 'arc1_summon',          arcLabel: 'Arc 1 — 강림과 사막' },
      { num: 7,  title: '불을 빌리는 자들',            arc: 'arc1_summon',          arcLabel: 'Arc 1 — 강림과 사막' },
      { num: 8,  title: '계약',                      arc: 'arc1_summon',          arcLabel: 'Arc 1 — 강림과 사막' },
      { num: 9,  title: '모래폭풍 속 각성',            arc: 'arc1_summon',          arcLabel: 'Arc 1 — 강림과 사막' },
      { num: 10, title: '꺼지지 않는 불',              arc: 'arc1_summon',          arcLabel: 'Arc 1 — 강림과 사막' },
      { num: 11, title: '명예로운 노예들',             arc: 'arc1_summon',          arcLabel: 'Arc 1 — 강림과 사막' },
      { num: 12, title: '최적화',                    arc: 'arc1_summon',          arcLabel: 'Arc 1 — 강림과 사막' },
      { num: 13, title: '열사병은 걸리지 않는다',      arc: 'arc1_summon',          arcLabel: 'Arc 1 — 강림과 사막' },
      { num: 14, title: '이변',                      arc: 'arc2_awakening',       arcLabel: 'Arc 2 — 각성과 레거시' },
      { num: 15, title: '낙뢰',                      arc: 'arc2_awakening',       arcLabel: 'Arc 2 — 각성과 레거시' },
      { num: 16, title: '과부하',                    arc: 'arc2_awakening',       arcLabel: 'Arc 2 — 각성과 레거시' },
      { num: 17, title: '각인',                      arc: 'arc2_awakening',       arcLabel: 'Arc 2 — 각성과 레거시' },
      { num: 18, title: '레거시',                    arc: 'arc2_awakening',       arcLabel: 'Arc 2 — 각성과 레거시' },
      { num: 19, title: '심판 (1)',                  arc: 'arc2_awakening',       arcLabel: 'Arc 2 — 각성과 레거시' },
      { num: 20, title: '오버라이드',                arc: 'arc2_awakening',       arcLabel: 'Arc 2 — 각성과 레거시' },
      { num: 21, title: '돌아올 곳',                 arc: 'arc3_oath',            arcLabel: 'Arc 3 — 귀환과 서약' },
      { num: 22, title: '서약',                      arc: 'arc3_oath',            arcLabel: 'Arc 3 — 귀환과 서약' },
      { num: 23, title: '런타임 에러',                arc: 'arc3_oath',            arcLabel: 'Arc 3 — 귀환과 서약' },
      { num: 24, title: '흑철의 오만',                arc: 'arc3_oath',            arcLabel: 'Arc 3 — 귀환과 서약' },
      { num: 25, title: '채비',                      arc: 'arc3_oath',            arcLabel: 'Arc 3 — 귀환과 서약' },
      { num: 26, title: '솔라리스 가는 길',            arc: 'arc4_kazmor',          arcLabel: 'Arc 4 — 카즈모르 사냥' },
      { num: 27, title: '강림',                      arc: 'arc4_kazmor',          arcLabel: 'Arc 4 — 카즈모르 사냥' },
      { num: 28, title: '전략 재편',                  arc: 'arc4_kazmor',          arcLabel: 'Arc 4 — 카즈모르 사냥' },
      { num: 29, title: '흑철의 사냥개',              arc: 'arc4_kazmor',          arcLabel: 'Arc 4 — 카즈모르 사냥' },
      { num: 30, title: '카즈모르를 향하여',           arc: 'arc4_kazmor',          arcLabel: 'Arc 4 — 카즈모르 사냥' },
      { num: 31, title: '카즈모르의 천제 아키텍트',     arc: 'arc4_kazmor',          arcLabel: 'Arc 4 — 카즈모르 사냥' },
      { num: 32, title: '유령',                      arc: 'arc5_guerrilla',       arcLabel: 'Arc 5 — 게릴라전' },
      { num: 33, title: '게릴라전',                  arc: 'arc5_guerrilla',       arcLabel: 'Arc 5 — 게릴라전' },
      { num: 34, title: '덫',                        arc: 'arc5_guerrilla',       arcLabel: 'Arc 5 — 게릴라전' },
      { num: 35, title: '반전',                      arc: 'arc5_guerrilla',       arcLabel: 'Arc 5 — 게릴라전' },
      { num: 36, title: '공백',                      arc: 'arc5_guerrilla',       arcLabel: 'Arc 5 — 게릴라전' },
      { num: 37, title: '두더지',                    arc: 'arc5_guerrilla',       arcLabel: 'Arc 5 — 게릴라전' },
      { num: 38, title: '활공',                      arc: 'arc6_reunion',         arcLabel: 'Arc 6 — 재회와 재구성' },
      { num: 39, title: '달콤한 해후',                arc: 'arc6_reunion',         arcLabel: 'Arc 6 — 재회와 재구성' },
      { num: 40, title: '나이라',                    arc: 'arc6_reunion',         arcLabel: 'Arc 6 — 재회와 재구성' },
      { num: 41, title: '오버라이드',                arc: 'arc6_reunion',         arcLabel: 'Arc 6 — 재회와 재구성' },
      { num: 42, title: '재구성',                    arc: 'arc6_reunion',         arcLabel: 'Arc 6 — 재회와 재구성' },
      { num: 43, title: '소문',                      arc: 'arc7_imperial_call',   arcLabel: 'Arc 7 — 제국의 부름' },
      { num: 44, title: '초대',                      arc: 'arc7_imperial_call',   arcLabel: 'Arc 7 — 제국의 부름' },
      { num: 45, title: '알현',                      arc: 'arc7_imperial_call',   arcLabel: 'Arc 7 — 제국의 부름' },
      { num: 46, title: '변수',                      arc: 'arc7_imperial_call',   arcLabel: 'Arc 7 — 제국의 부름' },
      { num: 47, title: '강제종료',                  arc: 'arc7_imperial_call',   arcLabel: 'Arc 7 — 제국의 부름' },
      { num: 48, title: '사망 플래그',                arc: 'arc7_imperial_call',   arcLabel: 'Arc 7 — 제국의 부름' },
      { num: 49, title: '핫픽스',                    arc: 'arc7_imperial_call',   arcLabel: 'Arc 7 — 제국의 부름' },
      { num: 50, title: '비행',                      arc: 'arc7_imperial_call',   arcLabel: 'Arc 7 — 제국의 부름' },
      { num: 51, title: '탄생',                      arc: 'arc8_decisive',        arcLabel: 'Arc 8 — 결전과 탄생' },
      { num: 52, title: '십 분의 일',                arc: 'arc8_decisive',        arcLabel: 'Arc 8 — 결전과 탄생' },
      { num: 53, title: '항해',                      arc: 'arc8_decisive',        arcLabel: 'Arc 8 — 결전과 탄생' },
      { num: 54, title: '5번째 슬롯',                arc: 'arc8_decisive',        arcLabel: 'Arc 8 — 결전과 탄생' },
      { num: 55, title: '결전 (1)',                  arc: 'arc8_decisive',        arcLabel: 'Arc 8 — 결전과 탄생' },
      { num: 56, title: '결전 (2)',                  arc: 'arc8_decisive',        arcLabel: 'Arc 8 — 결전과 탄생' },
      { num: 57, title: '휴면',                      arc: 'arc9_wuxia_arrival',   arcLabel: 'Arc 9 — 무협 차원 강림' },
      { num: 58, title: '실낱같은 인연',              arc: 'arc9_wuxia_arrival',   arcLabel: 'Arc 9 — 무협 차원 강림' },
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
