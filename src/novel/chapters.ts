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

// ── 천년묵은 통조림 (canned-master) ──
import cm001Raw from '../data/novel/cm_arc1_opening/1_야경.md?raw';
import cm002Raw from '../data/novel/cm_arc1_opening/2_발굴.md?raw';
import cm003Raw from '../data/novel/cm_arc1_opening/3_물을 가까이 하지 말 것.md?raw';
import cm004Raw from '../data/novel/cm_arc1_opening/4_천 년의 간극.md?raw';
import cm005Raw from '../data/novel/cm_arc1_opening/5_봉인은 하나가 아니었다.md?raw';

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
];

// ── Canned Master (천년묵은 통조림) ──
export const CANNED_MASTER_CHAPTERS: ChapterMeta[] = [
  {
    id: 'cm001',
    num: 1,
    title: '야경',
    arc: 'cm_arc1_opening',
    arcLabel: 'Arc 1 — 개봉',
    projectId: 'canned-master',
    status: 'writing',
    raw: cm001Raw,
  },
  {
    id: 'cm002',
    num: 2,
    title: '발굴',
    arc: 'cm_arc1_opening',
    arcLabel: 'Arc 1 — 개봉',
    projectId: 'canned-master',
    status: 'writing',
    raw: cm002Raw,
  },
  {
    id: 'cm003',
    num: 3,
    title: '물을 가까이 하지 말 것',
    arc: 'cm_arc1_opening',
    arcLabel: 'Arc 1 — 개봉',
    projectId: 'canned-master',
    status: 'writing',
    raw: cm003Raw,
  },
  {
    id: 'cm004',
    num: 4,
    title: '천 년의 간극',
    arc: 'cm_arc1_opening',
    arcLabel: 'Arc 1 — 개봉',
    projectId: 'canned-master',
    status: 'writing',
    raw: cm004Raw,
  },
  {
    id: 'cm005',
    num: 5,
    title: '봉인은 하나가 아니었다',
    arc: 'cm_arc1_opening',
    arcLabel: 'Arc 1 — 개봉',
    projectId: 'canned-master',
    status: 'writing',
    raw: cm005Raw,
  },
];

// ── British Food novel (431 chapters via glob) ──
import { BRITISH_FOOD_CHAPTERS } from './chapters-british-food';

export const ALL_CHAPTERS: ChapterMeta[] = [...CHAPTERS, ...CANNED_MASTER_CHAPTERS, ...BRITISH_FOOD_CHAPTERS];

export function getChapter(id: string): ChapterMeta | undefined {
  return ALL_CHAPTERS.find((c) => c.id === id);
}
