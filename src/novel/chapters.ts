/**
 * Chapter registry — 소설 챕터 메타데이터 및 raw import
 */

import ch001Raw from '../data/novel/arc1_azelia/ch001_truck.md?raw';

export interface ChapterMeta {
  id: string;
  num: number;
  title: string;
  arc: string;
  arcLabel: string;
  status: 'published' | 'coming';
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
    status: 'coming',
  },
  {
    id: 'ch003',
    num: 3,
    title: '용사라는 이름의 무게',
    arc: 'arc1_azelia',
    arcLabel: 'Arc 1 — 아젤리아',
    status: 'coming',
  },
];

export function getChapter(id: string): ChapterMeta | undefined {
  return CHAPTERS.find((c) => c.id === id);
}
