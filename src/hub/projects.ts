/**
 * Story Project Registry (UI 표시용 얇은 래퍼).
 *
 * 단일 진실 공급원은 [src/projects/registry.ts](../projects/registry.ts).
 * 이 파일은 Cartographer Hub가 기대하는 이름(`PROJECTS`, `getProject`, `StoryProject`)을 유지하기 위한 re-export일 뿐이다.
 *
 * 새 프로젝트나 메타 변경은 모두 src/projects/registry.ts에서 한다.
 */

export type {
  ProjectMeta as StoryProject,
  PillarProgress,
} from '../projects/registry';

import { ACTIVE_PROJECTS, getProjectMeta } from '../projects/registry';
import type { ProjectMeta } from '../projects/registry';

/** Atlas에 표시되는 활성 프로젝트들 (archive 제외) */
export const PROJECTS: ProjectMeta[] = ACTIVE_PROJECTS;

export function getProject(id: string): ProjectMeta | undefined {
  return getProjectMeta(id);
}
