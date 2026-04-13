/**
 * Chapter registry — 소설 챕터 메타데이터 및 raw import
 */

import ch001Raw from '../data/novel/arc1_azelia/ch001_truck.md?raw';
import ch002Raw from '../data/novel/arc1_azelia/ch002_palace_night.md?raw';
import ch003Raw from '../data/novel/arc1_azelia/ch003_hero_training.md?raw';
import ch004Raw from '../data/novel/arc1_azelia/ch004_no_convenience_store.md?raw';
import ch005Raw from '../data/novel/arc1_azelia/ch005_first_death.md?raw';

export interface ChapterMeta {
  id: string;
  num: number;
  title: string;
  arc: string;
  arcLabel: string;
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
    status: 'published',
    raw: ch001Raw,
  },
  {
    id: 'ch002',
    num: 2,
    title: '아젤리아 왕궁의 밤은 길다',
    arc: 'arc1_azelia',
    arcLabel: 'Arc 1 — 아젤리아',
    status: 'published',
    raw: ch002Raw,
  },
  {
    id: 'ch003',
    num: 3,
    title: '용사라는 직업의 현실',
    arc: 'arc1_azelia',
    arcLabel: 'Arc 1 — 아젤리아',
    status: 'published',
    raw: ch003Raw,
  },
  {
    id: 'ch004',
    num: 4,
    title: '이 세계에도 편의점은 없다',
    arc: 'arc1_azelia',
    arcLabel: 'Arc 1 — 아젤리아',
    status: 'published',
    raw: ch004Raw,
  },
  {
    id: 'ch005',
    num: 5,
    title: '축복이라 쓰고 제물이라 읽는다',
    arc: 'arc1_azelia',
    arcLabel: 'Arc 1 — 아젤리아',
    status: 'published',
    raw: ch005Raw,
  },
];

export function getChapter(id: string): ChapterMeta | undefined {
  return CHAPTERS.find((c) => c.id === id);
}
