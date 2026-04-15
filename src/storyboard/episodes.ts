/**
 * Episode registry — storyboard episode metadata and raw imports
 */

import ep001Raw from '../data/episodes/ep001.md?raw';
import ep002Raw from '../data/episodes/ep002.md?raw';
import ep003Raw from '../data/episodes/ep003.md?raw';
import ep004Raw from '../data/episodes/ep004.md?raw';
import ep005Raw from '../data/episodes/ep005.md?raw';

import type { EpisodeEntry } from './types';

export const EPISODES: EpisodeEntry[] = [
  {
    id: 'ep001',
    num: 1,
    title: '트럭이 오는 건 알고 있었다',
    arc: 'arc1_azelia',
    arcLabel: 'Arc 1 — 아젤리아',
    projectId: 'dclass-hero',
    sourceChapter: '1화',
    status: 'draft',
    raw: ep001Raw,
  },
  {
    id: 'ep002',
    num: 2,
    title: '용사의 첫마디',
    arc: 'arc1_azelia',
    arcLabel: 'Arc 1 — 아젤리아',
    projectId: 'dclass-hero',
    sourceChapter: '2화',
    status: 'draft',
    raw: ep002Raw,
  },
  {
    id: 'ep003',
    num: 3,
    title: '검도 마법도 안 되는 용사',
    arc: 'arc1_azelia',
    arcLabel: 'Arc 1 — 아젤리아',
    projectId: 'dclass-hero',
    sourceChapter: '3화',
    status: 'draft',
    raw: ep003Raw,
  },
  {
    id: 'ep004',
    num: 4,
    title: '영웅전에는 이렇게 쓰여 있다',
    arc: 'arc1_azelia',
    arcLabel: 'Arc 1 — 아젤리아',
    projectId: 'dclass-hero',
    sourceChapter: '4화',
    status: 'draft',
    raw: ep004Raw,
  },
  {
    id: 'ep005',
    num: 5,
    title: '축복이라 쓰고 제물이라 읽는다',
    arc: 'arc1_azelia',
    arcLabel: 'Arc 1 — 아젤리아',
    projectId: 'dclass-hero',
    sourceChapter: '5화',
    status: 'draft',
    raw: ep005Raw,
  },
];

export function getEpisode(id: string): EpisodeEntry | undefined {
  return EPISODES.find((e) => e.id === id);
}
