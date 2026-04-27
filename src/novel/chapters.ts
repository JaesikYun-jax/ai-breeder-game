/**
 * Chapter registry — episode 메타데이터 및 raw import.
 *
 * awesome-novel-studio 마이그레이션(2026-04-26): ch/cm/mf/ast prefix → EP{NNN} 통일.
 * 파일은 projects/{name}/episode/EP{NNN}.md 위치.
 * id는 프로젝트 내에서만 unique → ALL_CHAPTERS 조회 시 projectId 함께 전달 필요.
 */

// ── D급 스킬 이세계 용사 (dclass-hero) ──
import dh001 from '../../projects/dclass-hero/episode/EP001.md?raw';
import dh002 from '../../projects/dclass-hero/episode/EP002.md?raw';
import dh003 from '../../projects/dclass-hero/episode/EP003.md?raw';
import dh004 from '../../projects/dclass-hero/episode/EP004.md?raw';
import dh005 from '../../projects/dclass-hero/episode/EP005.md?raw';
import dh006 from '../../projects/dclass-hero/episode/EP006.md?raw';
import dh007 from '../../projects/dclass-hero/episode/EP007.md?raw';
import dh008 from '../../projects/dclass-hero/episode/EP008.md?raw';
import dh009 from '../../projects/dclass-hero/episode/EP009.md?raw';
import dh010 from '../../projects/dclass-hero/episode/EP010.md?raw';
import dh011 from '../../projects/dclass-hero/episode/EP011.md?raw';
import dh012 from '../../projects/dclass-hero/episode/EP012.md?raw';
import dh013 from '../../projects/dclass-hero/episode/EP013.md?raw';
import dh014 from '../../projects/dclass-hero/episode/EP014.md?raw';
import dh015 from '../../projects/dclass-hero/episode/EP015.md?raw';
import dh016 from '../../projects/dclass-hero/episode/EP016.md?raw';
import dh017 from '../../projects/dclass-hero/episode/EP017.md?raw';
import dh018 from '../../projects/dclass-hero/episode/EP018.md?raw';
import dh019 from '../../projects/dclass-hero/episode/EP019.md?raw';
import dh020 from '../../projects/dclass-hero/episode/EP020.md?raw';
import dh021 from '../../projects/dclass-hero/episode/EP021.md?raw';
import dh022 from '../../projects/dclass-hero/episode/EP022.md?raw';
import dh023 from '../../projects/dclass-hero/episode/EP023.md?raw';
import dh024 from '../../projects/dclass-hero/episode/EP024.md?raw';
import dh025 from '../../projects/dclass-hero/episode/EP025.md?raw';
import dh026 from '../../projects/dclass-hero/episode/EP026.md?raw';
import dh027 from '../../projects/dclass-hero/episode/EP027.md?raw';
import dh028 from '../../projects/dclass-hero/episode/EP028.md?raw';
import dh029 from '../../projects/dclass-hero/episode/EP029.md?raw';
import dh030 from '../../projects/dclass-hero/episode/EP030.md?raw';
import dh031 from '../../projects/dclass-hero/episode/EP031.md?raw';
import dh032 from '../../projects/dclass-hero/episode/EP032.md?raw';
import dh033 from '../../projects/dclass-hero/episode/EP033.md?raw';
import dh034 from '../../projects/dclass-hero/episode/EP034.md?raw';
import dh035 from '../../projects/dclass-hero/episode/EP035.md?raw';
import dh036 from '../../projects/dclass-hero/episode/EP036.md?raw';
import dh037 from '../../projects/dclass-hero/episode/EP037.md?raw';
import dh038 from '../../projects/dclass-hero/episode/EP038.md?raw';
import dh039 from '../../projects/dclass-hero/episode/EP039.md?raw';
import dh040 from '../../projects/dclass-hero/episode/EP040.md?raw';
import dh041 from '../../projects/dclass-hero/episode/EP041.md?raw';
import dh042 from '../../projects/dclass-hero/episode/EP042.md?raw';
import dh043 from '../../projects/dclass-hero/episode/EP043.md?raw';
import dh044 from '../../projects/dclass-hero/episode/EP044.md?raw';
import dh045 from '../../projects/dclass-hero/episode/EP045.md?raw';
import dh046 from '../../projects/dclass-hero/episode/EP046.md?raw';
import dh047 from '../../projects/dclass-hero/episode/EP047.md?raw';

// ── 마도 공학 프로그래머의 영생 프로젝트 (magitech-fire) ──
import mf001 from '../../projects/magitech-fire/episode/EP001.md?raw';
import mf002 from '../../projects/magitech-fire/episode/EP002.md?raw';
import mf003 from '../../projects/magitech-fire/episode/EP003.md?raw';
import mf004 from '../../projects/magitech-fire/episode/EP004.md?raw';
import mf005 from '../../projects/magitech-fire/episode/EP005.md?raw';

// ── 봉인당한 천마 (canned-master) ──
import cm001 from '../../projects/canned-master/episode/EP001.md?raw';
import cm002 from '../../projects/canned-master/episode/EP002.md?raw';
import cm003 from '../../projects/canned-master/episode/EP003.md?raw';
import cm004 from '../../projects/canned-master/episode/EP004.md?raw';
import cm005 from '../../projects/canned-master/episode/EP005.md?raw';
import cm006 from '../../projects/canned-master/episode/EP006.md?raw';
import cm007 from '../../projects/canned-master/episode/EP007.md?raw';
import cm008 from '../../projects/canned-master/episode/EP008.md?raw';
import cm009 from '../../projects/canned-master/episode/EP009.md?raw';
import cm010 from '../../projects/canned-master/episode/EP010.md?raw';
import cm011 from '../../projects/canned-master/episode/EP011.md?raw';
import cm012 from '../../projects/canned-master/episode/EP012.md?raw';
import cm013 from '../../projects/canned-master/episode/EP013.md?raw';
import cm014 from '../../projects/canned-master/episode/EP014.md?raw';
import cm015 from '../../projects/canned-master/episode/EP015.md?raw';
import cm016 from '../../projects/canned-master/episode/EP016.md?raw';
import cm017 from '../../projects/canned-master/episode/EP017.md?raw';
import cm018 from '../../projects/canned-master/episode/EP018.md?raw';
import cm019 from '../../projects/canned-master/episode/EP019.md?raw';
import cm020 from '../../projects/canned-master/episode/EP020.md?raw';

// ── 아스테로포스 (asteropos) ──
import ast000 from '../../projects/asteropos/episode/EP000.md?raw';
import ast001 from '../../projects/asteropos/episode/EP001.md?raw';
import ast002 from '../../projects/asteropos/episode/EP002.md?raw';
import ast003 from '../../projects/asteropos/episode/EP003.md?raw';
import ast004 from '../../projects/asteropos/episode/EP004.md?raw';
import ast005 from '../../projects/asteropos/episode/EP005.md?raw';
import ast006 from '../../projects/asteropos/episode/EP006.md?raw';
import ast007 from '../../projects/asteropos/episode/EP007.md?raw';
import ast008 from '../../projects/asteropos/episode/EP008.md?raw';
import ast009 from '../../projects/asteropos/episode/EP009.md?raw';
import ast010 from '../../projects/asteropos/episode/EP010.md?raw';
import ast011 from '../../projects/asteropos/episode/EP011.md?raw';
import ast012 from '../../projects/asteropos/episode/EP012.md?raw';
import ast013 from '../../projects/asteropos/episode/EP013.md?raw';
import ast014 from '../../projects/asteropos/episode/EP014.md?raw';
import ast015 from '../../projects/asteropos/episode/EP015.md?raw';
import ast016 from '../../projects/asteropos/episode/EP016.md?raw';

export interface ChapterMeta {
  id: string;
  num: number;
  title: string;
  arc: string;
  arcLabel: string;
  projectId: string;
  status: 'writing' | 'complete' | 'published' | 'coming';
  raw?: string;
}

const epId = (n: number) => `EP${String(n).padStart(3, '0')}`;

// ── D급 스킬 이세계 용사 ──
const DCLASS_TITLES: Array<[number, string, string, string]> = [
  [1, '트럭이 오는 건 알고 있었다', 'arc1_azelia', 'Arc 1 — 아젤리아'],
  [2, '아젤리아 왕궁의 밤은 길다', 'arc1_azelia', 'Arc 1 — 아젤리아'],
  [3, '용사라는 직업의 현실', 'arc1_azelia', 'Arc 1 — 아젤리아'],
  [4, '이 세계에도 편의점은 없다', 'arc1_azelia', 'Arc 1 — 아젤리아'],
  [5, '축복이라 쓰고 제물이라 읽는다', 'arc1_azelia', 'Arc 1 — 아젤리아'],
  [6, '모래 위의 사람들', 'arc2_solaris', 'Arc 2 — 솔라리스'],
  [7, '불을 빌리는 자들', 'arc2_solaris', 'Arc 2 — 솔라리스'],
  [8, '계약', 'arc2_solaris', 'Arc 2 — 솔라리스'],
  [9, '모래폭풍', 'arc2_solaris', 'Arc 2 — 솔라리스'],
  [10, '꺼지지 않는 불', 'arc2_solaris', 'Arc 2 — 솔라리스'],
  [11, '명예로운 노예들', 'arc2_solaris', 'Arc 2 — 솔라리스'],
  [12, '최적화', 'arc2_solaris', 'Arc 2 — 솔라리스'],
  [13, '열사병은 걸리지 않는다', 'arc2_solaris', 'Arc 2 — 솔라리스'],
  [14, '이를 갈다', 'arc3_awakening', 'Arc 3 — 각성과 귀환'],
  [15, '번개를 맞는 자', 'arc3_awakening', 'Arc 3 — 각성과 귀환'],
  [16, '과부하', 'arc3_awakening', 'Arc 3 — 각성과 귀환'],
  [17, '코드를 새기다', 'arc3_awakening', 'Arc 3 — 각성과 귀환'],
  [18, '빛의 왕국으로', 'arc3_awakening', 'Arc 3 — 각성과 귀환'],
  [19, '심판', 'arc3_awakening', 'Arc 3 — 각성과 귀환'],
  [20, '용사의 길', 'arc3_awakening', 'Arc 3 — 각성과 귀환'],
  [21, '부왕은 부왕이 아니다', 'arc4_internal', 'Arc 4 — 내정의 해'],
  [22, '재회', 'arc4_internal', 'Arc 4 — 내정의 해'],
  [23, '약한 세계의 용사', 'arc4_internal', 'Arc 4 — 내정의 해'],
  [24, '지하의 말', 'arc4_internal', 'Arc 4 — 내정의 해'],
  [25, '두 나라의 그림', 'arc4_internal', 'Arc 4 — 내정의 해'],
  [26, '솔라리스 가는 길', 'arc4_internal', 'Arc 4 — 내정의 해'],
  [27, '모래의 약속', 'arc4_internal', 'Arc 4 — 내정의 해'],
  [28, '비장의 무기', 'arc4_internal', 'Arc 4 — 내정의 해'],
  [29, '사막의 새 호흡', 'arc5_caravan', 'Arc 5 — 사막의 캐러밴'],
  [30, '일곱 번째 오아시스', 'arc5_caravan', 'Arc 5 — 사막의 캐러밴'],
  [31, '정령석 작업장', 'arc5_caravan', 'Arc 5 — 사막의 캐러밴'],
  [32, '두 태양의 길', 'arc5_caravan', 'Arc 5 — 사막의 캐러밴'],
  [33, '모래 너머', 'arc5_caravan', 'Arc 5 — 사막의 캐러밴'],
  [34, '북쪽으로', 'arc5_caravan', 'Arc 5 — 사막의 캐러밴'],
  [35, '강철의 첫날', 'arc6_kaizer', 'Arc 6 — 강철의 궁정'],
  [36, '강철의 식탁', 'arc6_kaizer', 'Arc 6 — 강철의 궁정'],
  [37, '변경의 침묵', 'arc6_kaizer', 'Arc 6 — 강철의 궁정'],
  [38, '같은 결의 사람', 'arc6_kaizer', 'Arc 6 — 강철의 궁정'],
  [39, '강철의 정원', 'arc6_kaizer', 'Arc 6 — 강철의 궁정'],
  [40, '두 결의 충돌', 'arc6_kaizer', 'Arc 6 — 강철의 궁정'],
  [41, '강철의 안쪽', 'arc6_kaizer', 'Arc 6 — 강철의 궁정'],
  [42, '강철을 풀다', 'arc6_kaizer', 'Arc 6 — 강철의 궁정'],
  [43, '다섯의 자리', 'arc6_5_homecoming', 'Arc 6.5 — 귀환과 다섯 결'],
  [44, '기후 함수 군단', 'arc6_5_homecoming', 'Arc 6.5 — 귀환과 다섯 결'],
  [45, '다섯 깃발', 'arc6_5_homecoming', 'Arc 6.5 — 귀환과 다섯 결'],
  [46, '마지막 호흡', 'arc6_5_homecoming', 'Arc 6.5 — 귀환과 다섯 결'],
  [47, '폭풍의 자리표', 'arc6_5_homecoming', 'Arc 6.5 — 귀환과 다섯 결'],
];

const DCLASS_RAWS = [
  dh001, dh002, dh003, dh004, dh005, dh006, dh007, dh008, dh009, dh010,
  dh011, dh012, dh013, dh014, dh015, dh016, dh017, dh018, dh019, dh020,
  dh021, dh022, dh023, dh024, dh025, dh026, dh027, dh028, dh029, dh030,
  dh031, dh032, dh033, dh034, dh035, dh036, dh037, dh038, dh039, dh040,
  dh041, dh042, dh043, dh044, dh045, dh046, dh047,
];

export const CHAPTERS: ChapterMeta[] = DCLASS_TITLES.map(([num, title, arc, arcLabel], i) => ({
  id: epId(num),
  num,
  title,
  arc,
  arcLabel,
  projectId: 'dclass-hero',
  status: num <= 5 ? 'published' : 'writing',
  raw: DCLASS_RAWS[i],
}));

// ── Canned Master (천년묵은 통조림) ──
const CM_TITLES: Array<[number, string, string, string]> = [
  [1, '손님', 'cm_arc1_opening', 'Arc 1 — 개봉'],
  [2, '석관', 'cm_arc1_opening', 'Arc 1 — 개봉'],
  [3, '조수석', 'cm_arc1_opening', 'Arc 1 — 개봉'],
  [4, '아리수', 'cm_arc1_opening', 'Arc 1 — 개봉'],
  [5, '부교주', 'cm_arc1_opening', 'Arc 1 — 개봉'],
  [6, '남행', 'cm_arc1_opening', 'Arc 1 — 개봉'],
  [7, '계곡', 'cm_arc1_opening', 'Arc 1 — 개봉'],
  [8, '응급실', 'cm_arc1_opening', 'Arc 1 — 개봉'],
  [9, '기적', 'cm_arc1_opening', 'Arc 1 — 개봉'],
  [10, '서연', 'cm_arc1_opening', 'Arc 1 — 개봉'],
  [11, '입성', 'cm_arc2_confront', 'Arc 2 — 대면'],
  [12, '삼파', 'cm_arc2_confront', 'Arc 2 — 대면'],
  [13, '미행', 'cm_arc2_confront', 'Arc 2 — 대면'],
  [14, '자객', 'cm_arc2_confront', 'Arc 2 — 대면'],
  [15, '후원자', 'cm_arc2_confront', 'Arc 2 — 대면'],
  [16, '인질', 'cm_arc2_confront', 'Arc 2 — 대면'],
  [17, '물의 경로', 'cm_arc2_confront', 'Arc 2 — 대면'],
  [18, '심판', 'cm_arc2_confront', 'Arc 2 — 대면'],
  [19, '백준하', 'cm_arc2_confront', 'Arc 2 — 대면'],
  [20, '습격', 'cm_arc2_confront', 'Arc 2 — 대면'],
];
const CM_RAWS = [
  cm001, cm002, cm003, cm004, cm005, cm006, cm007, cm008, cm009, cm010,
  cm011, cm012, cm013, cm014, cm015, cm016, cm017, cm018, cm019, cm020,
];
export const CANNED_MASTER_CHAPTERS: ChapterMeta[] = CM_TITLES.map(([num, title, arc, arcLabel], i) => ({
  id: epId(num),
  num,
  title,
  arc,
  arcLabel,
  projectId: 'canned-master',
  status: 'writing',
  raw: CM_RAWS[i],
}));

// ── Magitech Fire ──
const MF_TITLES: Array<[number, string]> = [
  [1, '어디지, 이건'],
  [2, '위장'],
  [3, '폐기동'],
  [4, '591호'],
  [5, '어떤 남자'],
];
const MF_RAWS = [mf001, mf002, mf003, mf004, mf005];
export const MAGITECH_FIRE_CHAPTERS: ChapterMeta[] = MF_TITLES.map(([num, title], i) => ({
  id: epId(num),
  num,
  title,
  arc: 'mf_part1_survival',
  arcLabel: 'Part 1 — 연명',
  projectId: 'magitech-fire',
  status: 'writing',
  raw: MF_RAWS[i],
}));

// ── Asteropos ──
export const ASTEROPOS_CHAPTERS: ChapterMeta[] = [
  { id: 'EP000', num: 0, title: '프롤로그 — 별 떨어진 밤', arc: 'ast_prologue', arcLabel: '프롤로그', projectId: 'asteropos', status: 'writing', raw: ast000 },
  { id: 'EP001', num: 1, title: '구덩이', arc: 'arc1_village', arcLabel: 'Arc 1 — 양부모 마을', projectId: 'asteropos', status: 'writing', raw: ast001 },
  { id: 'EP002', num: 2, title: '신의 은총', arc: 'arc1_village', arcLabel: 'Arc 1 — 양부모 마을', projectId: 'asteropos', status: 'writing', raw: ast002 },
  { id: 'EP003', num: 3, title: '현자의 재림', arc: 'arc1_village', arcLabel: 'Arc 1 — 양부모 마을', projectId: 'asteropos', status: 'writing', raw: ast003 },
  { id: 'EP004', num: 4, title: '마당의 끝', arc: 'arc1_village', arcLabel: 'Arc 1 — 양부모 마을', projectId: 'asteropos', status: 'writing', raw: ast004 },
  { id: 'EP005', num: 5, title: '사라진 마을', arc: 'arc1_village', arcLabel: 'Arc 1 — 양부모 마을', projectId: 'asteropos', status: 'writing', raw: ast005 },
  { id: 'EP006', num: 6, title: '마차 위에서', arc: 'arc1_village', arcLabel: 'Arc 1 — 양부모 마을', projectId: 'asteropos', status: 'writing', raw: ast006 },
  { id: 'EP007', num: 7, title: '라이덴 마법학원 도착', arc: 'arc2a_leiden', arcLabel: 'Arc 2-a — 라이덴 마법학원', projectId: 'asteropos', status: 'writing', raw: ast007 },
  { id: 'EP008', num: 8, title: '룬 기초', arc: 'arc2a_leiden', arcLabel: 'Arc 2-a — 라이덴 마법학원', projectId: 'asteropos', status: 'writing', raw: ast008 },
  { id: 'EP009', num: 9, title: '도서관 일상', arc: 'arc2a_leiden', arcLabel: 'Arc 2-a — 라이덴 마법학원', projectId: 'asteropos', status: 'writing', raw: ast009 },
  { id: 'EP010', num: 10, title: '룬 결투', arc: 'arc2a_leiden', arcLabel: 'Arc 2-a — 라이덴 마법학원', projectId: 'asteropos', status: 'writing', raw: ast010 },
  { id: 'EP011', num: 11, title: '자각의 화', arc: 'arc2a_leiden', arcLabel: 'Arc 2-a — 라이덴 마법학원', projectId: 'asteropos', status: 'writing', raw: ast011 },
  { id: 'EP012', num: 12, title: '제국 장학생 통보', arc: 'arc2a_leiden', arcLabel: 'Arc 2-a — 라이덴 마법학원', projectId: 'asteropos', status: 'writing', raw: ast012 },
  { id: 'EP013', num: 13, title: '제국 수도 도착', arc: 'arc2b_imperial', arcLabel: 'Arc 2-b — 제국 검술 아카데미', projectId: 'asteropos', status: 'writing', raw: ast013 },
  { id: 'EP014', num: 14, title: '검술 아카데미 지원', arc: 'arc2b_imperial', arcLabel: 'Arc 2-b — 제국 검술 아카데미', projectId: 'asteropos', status: 'writing', raw: ast014 },
  { id: 'EP015', num: 15, title: '입학·귀족 라이벌', arc: 'arc2b_imperial', arcLabel: 'Arc 2-b — 제국 검술 아카데미', projectId: 'asteropos', status: 'writing', raw: ast015 },
  { id: 'EP016', num: 16, title: '첫 합동 훈련', arc: 'arc2b_imperial', arcLabel: 'Arc 2-b — 제국 검술 아카데미', projectId: 'asteropos', status: 'writing', raw: ast016 },
  ...Array.from({ length: 4 }, (_, i) => ({
    id: epId(i + 17),
    num: i + 17,
    title: `${i + 17}화 (예정)`,
    arc: 'arc2b_imperial',
    arcLabel: 'Arc 2-b — 제국 검술 아카데미',
    projectId: 'asteropos',
    status: 'coming' as const,
  })),
  ...Array.from({ length: 14 }, (_, i) => ({
    id: epId(i + 25),
    num: i + 25,
    title: `${i + 25}화 (예정)`,
    arc: 'arc3_freecity',
    arcLabel: 'Arc 3 — 자유 도시 + 첫 성석',
    projectId: 'asteropos',
    status: 'coming' as const,
  })),
];

export const ALL_CHAPTERS: ChapterMeta[] = [
  ...CHAPTERS,
  ...CANNED_MASTER_CHAPTERS,
  ...MAGITECH_FIRE_CHAPTERS,
  ...ASTEROPOS_CHAPTERS,
];

/**
 * Find a chapter by id.
 *
 * Multiple projects share EP{NNN} ids (e.g. dclass-hero EP001 and magitech-fire EP001).
 * Pass projectId to disambiguate. Without projectId, returns the first match — only safe
 * for legacy IDs that were globally unique.
 */
export function getChapter(id: string, projectId?: string): ChapterMeta | undefined {
  if (projectId) {
    return ALL_CHAPTERS.find((c) => c.id === id && c.projectId === projectId);
  }
  return ALL_CHAPTERS.find((c) => c.id === id);
}
