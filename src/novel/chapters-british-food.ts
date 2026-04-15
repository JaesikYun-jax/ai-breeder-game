/**
 * British Food novel chapters — loaded via import.meta.glob
 * 431 chapters auto-imported from src/data/novel/british_food/
 */

import type { ChapterMeta } from './chapters';
import metaJson from '../data/novel/british_food/_chapters_meta.json';

const rawModules = import.meta.glob<string>(
  '../data/novel/british_food/*.md',
  { eager: true, query: '?raw', import: 'default' },
);

function resolveRaw(filename: string): string | undefined {
  const key = `../data/novel/british_food/${filename}`;
  return rawModules[key];
}

function arcFor(num: number): { arc: string; arcLabel: string } {
  if (num <= 423)
    return { arc: 'main', arcLabel: '본편' };
  return { arc: 'extra', arcLabel: '외전' };
}

export const BRITISH_FOOD_CHAPTERS: ChapterMeta[] = (
  metaJson as { num: number; title: string; filename: string }[]
).map((m) => {
  const { arc, arcLabel } = arcFor(m.num);
  return {
    id: `bf${String(m.num).padStart(3, '0')}`,
    num: m.num,
    title: m.title,
    arc,
    arcLabel,
    projectId: 'british-food',
    status: 'published' as const,
    raw: resolveRaw(m.filename),
  };
});
