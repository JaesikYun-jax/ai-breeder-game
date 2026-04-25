/**
 * Chapter registry — 소설 챕터 메타데이터 및 raw import
 */

import ch001Raw from '../data/novel/arc1_azelia/1_트럭이 오는 건 알고있었다.md?raw';
import ch002Raw from '../data/novel/arc1_azelia/2_아젤리아 왕궁의 밤은 길다.md?raw';
import ch003Raw from '../data/novel/arc1_azelia/3_용사라는 직업의 현실.md?raw';
import ch004Raw from '../data/novel/arc1_azelia/4_이 세계에도 편의점은 없다.md?raw';
import ch005Raw from '../data/novel/arc1_azelia/5_축복이라 쓰고 제물이라 읽는다.md?raw';
import ch006Raw from '../data/novel/arc2_solaris/6_모래 위의 사람들.md?raw';
import ch007Raw from '../data/novel/arc2_solaris/7_불을 빌리는 자들.md?raw';
import ch008Raw from '../data/novel/arc2_solaris/8_계약.md?raw';
import ch009Raw from '../data/novel/arc2_solaris/9_모래폭풍.md?raw';
import ch010Raw from '../data/novel/arc2_solaris/10_꺼지지 않는 불.md?raw';
import ch011Raw from '../data/novel/arc2_solaris/11_명예로운 노예들.md?raw';
import ch012Raw from '../data/novel/arc2_solaris/12_최적화.md?raw';
import ch013Raw from '../data/novel/arc2_solaris/13_열사병은 걸리지 않는다.md?raw';
import ch014Raw from '../data/novel/arc3_awakening/14_이를 갈다.md?raw';
import ch015Raw from '../data/novel/arc3_awakening/15_번개를 맞는 자.md?raw';
import ch016Raw from '../data/novel/arc3_awakening/16_과부하.md?raw';
import ch017Raw from '../data/novel/arc3_awakening/17_코드를 새기다.md?raw';
import ch018Raw from '../data/novel/arc3_awakening/18_빛의 왕국으로.md?raw';
import ch019Raw from '../data/novel/arc3_awakening/19_심판.md?raw';
import ch020Raw from '../data/novel/arc3_awakening/20_용사의 길.md?raw';
import ch021Raw from '../data/novel/arc4_internal/21_부왕은 부왕이 아니다.md?raw';
import ch022Raw from '../data/novel/arc4_internal/22_재회.md?raw';
import ch023Raw from '../data/novel/arc4_internal/23_약한 세계의 용사.md?raw';
import ch024Raw from '../data/novel/arc4_internal/24_지하의 말.md?raw';
import ch025Raw from '../data/novel/arc4_internal/25_두 나라의 그림.md?raw';
import ch026Raw from '../data/novel/arc4_internal/26_솔라리스 가는 길.md?raw';
import ch027Raw from '../data/novel/arc4_internal/27_모래의 약속.md?raw';
import ch028Raw from '../data/novel/arc4_internal/28_비장의 무기.md?raw';
import ch029Raw from '../data/novel/arc5_caravan/29_사막의 새 호흡.md?raw';
import ch030Raw from '../data/novel/arc5_caravan/30_일곱 번째 오아시스.md?raw';
import ch031Raw from '../data/novel/arc5_caravan/31_정령석 작업장.md?raw';
import ch032Raw from '../data/novel/arc5_caravan/32_두 태양의 길.md?raw';
import ch033Raw from '../data/novel/arc5_caravan/33_모래 너머.md?raw';
import ch034Raw from '../data/novel/arc5_caravan/34_북쪽으로.md?raw';
import ch035Raw from '../data/novel/arc6_kaizer/35_강철의 첫날.md?raw';
import ch036Raw from '../data/novel/arc6_kaizer/36_강철의 식탁.md?raw';
import ch037Raw from '../data/novel/arc6_kaizer/37_변경의 침묵.md?raw';

// ── 마도 공학 프로그래머의 영생 프로젝트 (magitech-fire) ──
import mf001Raw from '../data/novel/mf_part1_survival/1_어디지, 이건.md?raw';
import mf002Raw from '../data/novel/mf_part1_survival/2_위장.md?raw';
import mf003Raw from '../data/novel/mf_part1_survival/3_폐기동.md?raw';
import mf004Raw from '../data/novel/mf_part1_survival/4_591호.md?raw';
import mf005Raw from '../data/novel/mf_part1_survival/5_어떤 남자.md?raw';

// ── 천년묵은 통조림 (canned-master) ──
import cm001Raw from '../data/novel/cm_arc1_opening/1_야경.md?raw';
import cm002Raw from '../data/novel/cm_arc1_opening/2_발굴.md?raw';
import cm003Raw from '../data/novel/cm_arc1_opening/3_물을 가까이 하지 말 것.md?raw';
import cm004Raw from '../data/novel/cm_arc1_opening/4_천 년의 간극.md?raw';
import cm005Raw from '../data/novel/cm_arc1_opening/5_봉인은 하나가 아니었다.md?raw';
import cm006Raw from '../data/novel/cm_arc1_opening/6_남쪽으로.md?raw';
import cm007Raw from '../data/novel/cm_arc1_opening/7_계곡에서.md?raw';
import cm008Raw from '../data/novel/cm_arc1_opening/8_응급실.md?raw';
import cm009Raw from '../data/novel/cm_arc1_opening/9_소문.md?raw';
import cm010Raw from '../data/novel/cm_arc1_opening/10_왕자님.md?raw';
import cm011Raw from '../data/novel/cm_arc2_confront/11_입성.md?raw';
import cm012Raw from '../data/novel/cm_arc2_confront/12_삼파.md?raw';
import cm013Raw from '../data/novel/cm_arc2_confront/13_미행.md?raw';
import cm014Raw from '../data/novel/cm_arc2_confront/14_자객.md?raw';
import cm015Raw from '../data/novel/cm_arc2_confront/15_후원자.md?raw';
import cm016Raw from '../data/novel/cm_arc2_confront/16_인질.md?raw';
import cm017Raw from '../data/novel/cm_arc2_confront/17_물의 경로.md?raw';
import cm018Raw from '../data/novel/cm_arc2_confront/18_심판.md?raw';
import cm019Raw from '../data/novel/cm_arc2_confront/19_백준하.md?raw';
import cm020Raw from '../data/novel/cm_arc2_confront/20_습격.md?raw';

// ── 아스테로포스 (asteropos) ──
import ast000Raw from '../data/novel/ast_prologue/0_프롤로그.md?raw';
import ast001Raw from '../data/novel/arc1_village/1_구덩이.md?raw';
import ast002Raw from '../data/novel/arc1_village/2_신의 은총.md?raw';
import ast003Raw from '../data/novel/arc1_village/3_현자의 재림.md?raw';

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

export const CHAPTERS: ChapterMeta[] = [
  {
    id: 'ch001',
    num: 1,
    title: '트럭이 오는 건 알고 있었다',
    arc: 'arc1_azelia',
    arcLabel: 'Arc 1 — 아젤리아',
    projectId: 'dclass-hero',
    status: 'published',
    raw: ch001Raw,
  },
  {
    id: 'ch002',
    num: 2,
    title: '아젤리아 왕궁의 밤은 길다',
    arc: 'arc1_azelia',
    arcLabel: 'Arc 1 — 아젤리아',
    projectId: 'dclass-hero',
    status: 'published',
    raw: ch002Raw,
  },
  {
    id: 'ch003',
    num: 3,
    title: '용사라는 직업의 현실',
    arc: 'arc1_azelia',
    arcLabel: 'Arc 1 — 아젤리아',
    projectId: 'dclass-hero',
    status: 'published',
    raw: ch003Raw,
  },
  {
    id: 'ch004',
    num: 4,
    title: '이 세계에도 편의점은 없다',
    arc: 'arc1_azelia',
    arcLabel: 'Arc 1 — 아젤리아',
    projectId: 'dclass-hero',
    status: 'published',
    raw: ch004Raw,
  },
  {
    id: 'ch005',
    num: 5,
    title: '축복이라 쓰고 제물이라 읽는다',
    arc: 'arc1_azelia',
    arcLabel: 'Arc 1 — 아젤리아',
    projectId: 'dclass-hero',
    status: 'published',
    raw: ch005Raw,
  },
  {
    id: 'ch006',
    num: 6,
    title: '모래 위의 사람들',
    arc: 'arc2_solaris',
    arcLabel: 'Arc 2 — 솔라리스',
    projectId: 'dclass-hero',
    status: 'writing',
    raw: ch006Raw,
  },
  {
    id: 'ch007',
    num: 7,
    title: '불을 빌리는 자들',
    arc: 'arc2_solaris',
    arcLabel: 'Arc 2 — 솔라리스',
    projectId: 'dclass-hero',
    status: 'writing',
    raw: ch007Raw,
  },
  {
    id: 'ch008',
    num: 8,
    title: '계약',
    arc: 'arc2_solaris',
    arcLabel: 'Arc 2 — 솔라리스',
    projectId: 'dclass-hero',
    status: 'writing',
    raw: ch008Raw,
  },
  {
    id: 'ch009',
    num: 9,
    title: '모래폭풍',
    arc: 'arc2_solaris',
    arcLabel: 'Arc 2 — 솔라리스',
    projectId: 'dclass-hero',
    status: 'writing',
    raw: ch009Raw,
  },
  {
    id: 'ch010',
    num: 10,
    title: '꺼지지 않는 불',
    arc: 'arc2_solaris',
    arcLabel: 'Arc 2 — 솔라리스',
    projectId: 'dclass-hero',
    status: 'writing',
    raw: ch010Raw,
  },
  {
    id: 'ch011',
    num: 11,
    title: '명예로운 노예들',
    arc: 'arc2_solaris',
    arcLabel: 'Arc 2 — 솔라리스',
    projectId: 'dclass-hero',
    status: 'writing',
    raw: ch011Raw,
  },
  {
    id: 'ch012',
    num: 12,
    title: '최적화',
    arc: 'arc2_solaris',
    arcLabel: 'Arc 2 — 솔라리스',
    projectId: 'dclass-hero',
    status: 'writing',
    raw: ch012Raw,
  },
  {
    id: 'ch013',
    num: 13,
    title: '열사병은 걸리지 않는다',
    arc: 'arc2_solaris',
    arcLabel: 'Arc 2 — 솔라리스',
    projectId: 'dclass-hero',
    status: 'writing',
    raw: ch013Raw,
  },
  {
    id: 'ch014',
    num: 14,
    title: '이를 갈다',
    arc: 'arc3_awakening',
    arcLabel: 'Arc 3 — 각성과 귀환',
    projectId: 'dclass-hero',
    status: 'writing',
    raw: ch014Raw,
  },
  {
    id: 'ch015',
    num: 15,
    title: '번개를 맞는 자',
    arc: 'arc3_awakening',
    arcLabel: 'Arc 3 — 각성과 귀환',
    projectId: 'dclass-hero',
    status: 'writing',
    raw: ch015Raw,
  },
  {
    id: 'ch016',
    num: 16,
    title: '과부하',
    arc: 'arc3_awakening',
    arcLabel: 'Arc 3 — 각성과 귀환',
    projectId: 'dclass-hero',
    status: 'writing',
    raw: ch016Raw,
  },
  {
    id: 'ch017',
    num: 17,
    title: '코드를 새기다',
    arc: 'arc3_awakening',
    arcLabel: 'Arc 3 — 각성과 귀환',
    projectId: 'dclass-hero',
    status: 'writing',
    raw: ch017Raw,
  },
  {
    id: 'ch018',
    num: 18,
    title: '빛의 왕국으로',
    arc: 'arc3_awakening',
    arcLabel: 'Arc 3 — 각성과 귀환',
    projectId: 'dclass-hero',
    status: 'writing',
    raw: ch018Raw,
  },
  {
    id: 'ch019',
    num: 19,
    title: '심판',
    arc: 'arc3_awakening',
    arcLabel: 'Arc 3 — 각성과 귀환',
    projectId: 'dclass-hero',
    status: 'writing',
    raw: ch019Raw,
  },
  {
    id: 'ch020',
    num: 20,
    title: '용사의 길',
    arc: 'arc3_awakening',
    arcLabel: 'Arc 3 — 각성과 귀환',
    projectId: 'dclass-hero',
    status: 'writing',
    raw: ch020Raw,
  },
  {
    id: 'ch021',
    num: 21,
    title: '부왕은 부왕이 아니다',
    arc: 'arc4_internal',
    arcLabel: 'Arc 4 — 내정의 해',
    projectId: 'dclass-hero',
    status: 'writing',
    raw: ch021Raw,
  },
  {
    id: 'ch022',
    num: 22,
    title: '재회',
    arc: 'arc4_internal',
    arcLabel: 'Arc 4 — 내정의 해',
    projectId: 'dclass-hero',
    status: 'writing',
    raw: ch022Raw,
  },
  {
    id: 'ch023',
    num: 23,
    title: '약한 세계의 용사',
    arc: 'arc4_internal',
    arcLabel: 'Arc 4 — 내정의 해',
    projectId: 'dclass-hero',
    status: 'writing',
    raw: ch023Raw,
  },
  {
    id: 'ch024',
    num: 24,
    title: '지하의 말',
    arc: 'arc4_internal',
    arcLabel: 'Arc 4 — 내정의 해',
    projectId: 'dclass-hero',
    status: 'writing',
    raw: ch024Raw,
  },
  {
    id: 'ch025',
    num: 25,
    title: '두 나라의 그림',
    arc: 'arc4_internal',
    arcLabel: 'Arc 4 — 내정의 해',
    projectId: 'dclass-hero',
    status: 'writing',
    raw: ch025Raw,
  },
  {
    id: 'ch026',
    num: 26,
    title: '솔라리스 가는 길',
    arc: 'arc4_internal',
    arcLabel: 'Arc 4 — 내정의 해',
    projectId: 'dclass-hero',
    status: 'writing',
    raw: ch026Raw,
  },
  {
    id: 'ch027',
    num: 27,
    title: '모래의 약속',
    arc: 'arc4_internal',
    arcLabel: 'Arc 4 — 내정의 해',
    projectId: 'dclass-hero',
    status: 'writing',
    raw: ch027Raw,
  },
  {
    id: 'ch028',
    num: 28,
    title: '비장의 무기',
    arc: 'arc4_internal',
    arcLabel: 'Arc 4 — 내정의 해',
    projectId: 'dclass-hero',
    status: 'writing',
    raw: ch028Raw,
  },
  {
    id: 'ch029',
    num: 29,
    title: '사막의 새 호흡',
    arc: 'arc5_caravan',
    arcLabel: 'Arc 5 — 사막의 캐러밴',
    projectId: 'dclass-hero',
    status: 'writing',
    raw: ch029Raw,
  },
  {
    id: 'ch030',
    num: 30,
    title: '일곱 번째 오아시스',
    arc: 'arc5_caravan',
    arcLabel: 'Arc 5 — 사막의 캐러밴',
    projectId: 'dclass-hero',
    status: 'writing',
    raw: ch030Raw,
  },
  {
    id: 'ch031',
    num: 31,
    title: '정령석 작업장',
    arc: 'arc5_caravan',
    arcLabel: 'Arc 5 — 사막의 캐러밴',
    projectId: 'dclass-hero',
    status: 'writing',
    raw: ch031Raw,
  },
  {
    id: 'ch032',
    num: 32,
    title: '두 태양의 길',
    arc: 'arc5_caravan',
    arcLabel: 'Arc 5 — 사막의 캐러밴',
    projectId: 'dclass-hero',
    status: 'writing',
    raw: ch032Raw,
  },
  {
    id: 'ch033',
    num: 33,
    title: '모래 너머',
    arc: 'arc5_caravan',
    arcLabel: 'Arc 5 — 사막의 캐러밴',
    projectId: 'dclass-hero',
    status: 'writing',
    raw: ch033Raw,
  },
  {
    id: 'ch034',
    num: 34,
    title: '북쪽으로',
    arc: 'arc5_caravan',
    arcLabel: 'Arc 5 — 사막의 캐러밴',
    projectId: 'dclass-hero',
    status: 'writing',
    raw: ch034Raw,
  },
  {
    id: 'ch035',
    num: 35,
    title: '강철의 첫날',
    arc: 'arc6_kaizer',
    arcLabel: 'Arc 6 — 강철의 궁정',
    projectId: 'dclass-hero',
    status: 'writing',
    raw: ch035Raw,
  },
  {
    id: 'ch036',
    num: 36,
    title: '강철의 식탁',
    arc: 'arc6_kaizer',
    arcLabel: 'Arc 6 — 강철의 궁정',
    projectId: 'dclass-hero',
    status: 'writing',
    raw: ch036Raw,
  },
  {
    id: 'ch037',
    num: 37,
    title: '변경의 침묵',
    arc: 'arc6_kaizer',
    arcLabel: 'Arc 6 — 강철의 궁정',
    projectId: 'dclass-hero',
    status: 'writing',
    raw: ch037Raw,
  },
];

// ── Canned Master (천년묵은 통조림) ──
export const CANNED_MASTER_CHAPTERS: ChapterMeta[] = [
  {
    id: 'cm001',
    num: 1,
    title: '손님',
    arc: 'cm_arc1_opening',
    arcLabel: 'Arc 1 — 개봉',
    projectId: 'canned-master',
    status: 'writing',
    raw: cm001Raw,
  },
  {
    id: 'cm002',
    num: 2,
    title: '석관',
    arc: 'cm_arc1_opening',
    arcLabel: 'Arc 1 — 개봉',
    projectId: 'canned-master',
    status: 'writing',
    raw: cm002Raw,
  },
  {
    id: 'cm003',
    num: 3,
    title: '조수석',
    arc: 'cm_arc1_opening',
    arcLabel: 'Arc 1 — 개봉',
    projectId: 'canned-master',
    status: 'writing',
    raw: cm003Raw,
  },
  {
    id: 'cm004',
    num: 4,
    title: '아리수',
    arc: 'cm_arc1_opening',
    arcLabel: 'Arc 1 — 개봉',
    projectId: 'canned-master',
    status: 'writing',
    raw: cm004Raw,
  },
  {
    id: 'cm005',
    num: 5,
    title: '부교주',
    arc: 'cm_arc1_opening',
    arcLabel: 'Arc 1 — 개봉',
    projectId: 'canned-master',
    status: 'writing',
    raw: cm005Raw,
  },
  {
    id: 'cm006',
    num: 6,
    title: '남행',
    arc: 'cm_arc1_opening',
    arcLabel: 'Arc 1 — 개봉',
    projectId: 'canned-master',
    status: 'writing',
    raw: cm006Raw,
  },
  {
    id: 'cm007',
    num: 7,
    title: '계곡',
    arc: 'cm_arc1_opening',
    arcLabel: 'Arc 1 — 개봉',
    projectId: 'canned-master',
    status: 'writing',
    raw: cm007Raw,
  },
  {
    id: 'cm008',
    num: 8,
    title: '응급실',
    arc: 'cm_arc1_opening',
    arcLabel: 'Arc 1 — 개봉',
    projectId: 'canned-master',
    status: 'writing',
    raw: cm008Raw,
  },
  {
    id: 'cm009',
    num: 9,
    title: '기적',
    arc: 'cm_arc1_opening',
    arcLabel: 'Arc 1 — 개봉',
    projectId: 'canned-master',
    status: 'writing',
    raw: cm009Raw,
  },
  {
    id: 'cm010',
    num: 10,
    title: '서연',
    arc: 'cm_arc1_opening',
    arcLabel: 'Arc 1 — 개봉',
    projectId: 'canned-master',
    status: 'writing',
    raw: cm010Raw,
  },
  {
    id: 'cm011',
    num: 11,
    title: '입성',
    arc: 'cm_arc2_confront',
    arcLabel: 'Arc 2 — 대면',
    projectId: 'canned-master',
    status: 'writing',
    raw: cm011Raw,
  },
  {
    id: 'cm012',
    num: 12,
    title: '삼파',
    arc: 'cm_arc2_confront',
    arcLabel: 'Arc 2 — 대면',
    projectId: 'canned-master',
    status: 'writing',
    raw: cm012Raw,
  },
  {
    id: 'cm013',
    num: 13,
    title: '미행',
    arc: 'cm_arc2_confront',
    arcLabel: 'Arc 2 — 대면',
    projectId: 'canned-master',
    status: 'writing',
    raw: cm013Raw,
  },
  {
    id: 'cm014',
    num: 14,
    title: '자객',
    arc: 'cm_arc2_confront',
    arcLabel: 'Arc 2 — 대면',
    projectId: 'canned-master',
    status: 'writing',
    raw: cm014Raw,
  },
  {
    id: 'cm015',
    num: 15,
    title: '후원자',
    arc: 'cm_arc2_confront',
    arcLabel: 'Arc 2 — 대면',
    projectId: 'canned-master',
    status: 'writing',
    raw: cm015Raw,
  },
  {
    id: 'cm016',
    num: 16,
    title: '인질',
    arc: 'cm_arc2_confront',
    arcLabel: 'Arc 2 — 대면',
    projectId: 'canned-master',
    status: 'writing',
    raw: cm016Raw,
  },
  {
    id: 'cm017',
    num: 17,
    title: '물의 경로',
    arc: 'cm_arc2_confront',
    arcLabel: 'Arc 2 — 대면',
    projectId: 'canned-master',
    status: 'writing',
    raw: cm017Raw,
  },
  {
    id: 'cm018',
    num: 18,
    title: '심판',
    arc: 'cm_arc2_confront',
    arcLabel: 'Arc 2 — 대면',
    projectId: 'canned-master',
    status: 'writing',
    raw: cm018Raw,
  },
  {
    id: 'cm019',
    num: 19,
    title: '백준하',
    arc: 'cm_arc2_confront',
    arcLabel: 'Arc 2 — 대면',
    projectId: 'canned-master',
    status: 'writing',
    raw: cm019Raw,
  },
  {
    id: 'cm020',
    num: 20,
    title: '습격',
    arc: 'cm_arc2_confront',
    arcLabel: 'Arc 2 — 대면',
    projectId: 'canned-master',
    status: 'writing',
    raw: cm020Raw,
  },
];

// ── Magitech Fire (마도 공학 프로그래머의 영생 프로젝트) ──
export const MAGITECH_FIRE_CHAPTERS: ChapterMeta[] = [
  {
    id: 'mf001',
    num: 1,
    title: '어디지, 이건',
    arc: 'mf_part1_survival',
    arcLabel: 'Part 1 — 연명',
    projectId: 'magitech-fire',
    status: 'writing',
    raw: mf001Raw,
  },
  {
    id: 'mf002',
    num: 2,
    title: '위장',
    arc: 'mf_part1_survival',
    arcLabel: 'Part 1 — 연명',
    projectId: 'magitech-fire',
    status: 'writing',
    raw: mf002Raw,
  },
  {
    id: 'mf003',
    num: 3,
    title: '폐기동',
    arc: 'mf_part1_survival',
    arcLabel: 'Part 1 — 연명',
    projectId: 'magitech-fire',
    status: 'writing',
    raw: mf003Raw,
  },
  {
    id: 'mf004',
    num: 4,
    title: '591호',
    arc: 'mf_part1_survival',
    arcLabel: 'Part 1 — 연명',
    projectId: 'magitech-fire',
    status: 'writing',
    raw: mf004Raw,
  },
  {
    id: 'mf005',
    num: 5,
    title: '어떤 남자',
    arc: 'mf_part1_survival',
    arcLabel: 'Part 1 — 연명',
    projectId: 'magitech-fire',
    status: 'writing',
    raw: mf005Raw,
  },
];

export const ASTEROPOS_CHAPTERS: ChapterMeta[] = [
  {
    id: 'ast000',
    num: 0,
    title: '프롤로그 — 별 떨어진 밤',
    arc: 'ast_prologue',
    arcLabel: '프롤로그',
    projectId: 'asteropos',
    status: 'writing',
    raw: ast000Raw,
  },
  {
    id: 'ast001',
    num: 1,
    title: '구덩이',
    arc: 'arc1_village',
    arcLabel: 'Arc 1 — 양부모 마을',
    projectId: 'asteropos',
    status: 'writing',
    raw: ast001Raw,
  },
  {
    id: 'ast002',
    num: 2,
    title: '신의 은총',
    arc: 'arc1_village',
    arcLabel: 'Arc 1 — 양부모 마을',
    projectId: 'asteropos',
    status: 'writing',
    raw: ast002Raw,
  },
  {
    id: 'ast003',
    num: 3,
    title: '현자의 재림',
    arc: 'arc1_village',
    arcLabel: 'Arc 1 — 양부모 마을',
    projectId: 'asteropos',
    status: 'writing',
    raw: ast003Raw,
  },
  ...Array.from({ length: 9 }, (_, i) => ({
    id: `ast${String(i + 4).padStart(3, '0')}`,
    num: i + 4,
    title: `${i + 4}화 (예정)`,
    arc: 'arc1_village',
    arcLabel: 'Arc 1 — 양부모 마을',
    projectId: 'asteropos',
    status: 'coming' as const,
  })),
  ...Array.from({ length: 12 }, (_, i) => ({
    id: `ast${String(i + 13).padStart(3, '0')}`,
    num: i + 13,
    title: `${i + 13}화 (예정)`,
    arc: 'arc2_academy',
    arcLabel: 'Arc 2 — 한자 마법학원',
    projectId: 'asteropos',
    status: 'coming' as const,
  })),
  ...Array.from({ length: 14 }, (_, i) => ({
    id: `ast${String(i + 25).padStart(3, '0')}`,
    num: i + 25,
    title: `${i + 25}화 (예정)`,
    arc: 'arc3_freecity',
    arcLabel: 'Arc 3 — 자유 도시 + 첫 성석',
    projectId: 'asteropos',
    status: 'coming' as const,
  })),
];

export const ALL_CHAPTERS: ChapterMeta[] = [...CHAPTERS, ...CANNED_MASTER_CHAPTERS, ...MAGITECH_FIRE_CHAPTERS, ...ASTEROPOS_CHAPTERS];

export function getChapter(id: string): ChapterMeta | undefined {
  return ALL_CHAPTERS.find((c) => c.id === id);
}
