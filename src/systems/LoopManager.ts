/**
 * LoopManager — 회귀(루프) 상태 관리
 *
 * 책임:
 * - 루프 카운트 추적
 * - 방문 지역 기록
 * - 기둥 각성 레벨 관리
 * - 사망 유형 통계
 * - 엔딩 해금 기록
 * - 루프 임계값 기반 자동 플래그 관리
 *
 * 의존: localStorage (영구 저장)
 */

import type { RegionId } from '../entities/StoryTypes';
import type { LoopState, DeathType } from '../entities/GameTypes';
import { STORAGE_KEYS } from '../entities/SaveTypes';
import { LOOP_THRESHOLDS } from '../config/MetaFlagConfig';

export class LoopManager {
  private state: LoopState;

  constructor() {
    this.state = this.load();
  }

  // ─── 루프 카운트 ───────────────────────────────────

  getLoopCount(): number {
    return this.state.loopCount;
  }

  /** 회귀 시 호출: 루프 카운트 증가 + 기둥 각성 체크 */
  incrementLoop(): void {
    this.state.loopCount++;
    this.updatePillarAwakening();
    this.save();
  }

  /** 첫 플레이인지 (루프 0회 = 첫 번째) */
  isFirstPlay(): boolean {
    return this.state.loopCount === 0;
  }

  // ─── 방문 지역 ─────────────────────────────────────

  getVisitedRegions(): RegionId[] {
    return [...this.state.visitedRegions];
  }

  hasVisitedRegion(region: RegionId): boolean {
    return this.state.visitedRegions.includes(region);
  }

  addVisitedRegion(region: RegionId): void {
    if (!this.state.visitedRegions.includes(region)) {
      this.state.visitedRegions.push(region);
      this.save();
    }
  }

  // ─── 기둥 각성 ─────────────────────────────────────

  getPillarAwakeningLevel(): number {
    return this.state.pillarAwakeningLevel;
  }

  private updatePillarAwakening(): void {
    const loop = this.state.loopCount;
    if (loop >= LOOP_THRESHOLDS.PILLAR_AWAKENING_4) {
      this.state.pillarAwakeningLevel = 4;
    } else if (loop >= LOOP_THRESHOLDS.PILLAR_AWAKENING_3) {
      this.state.pillarAwakeningLevel = 3;
    } else if (loop >= LOOP_THRESHOLDS.PILLAR_AWAKENING_2) {
      this.state.pillarAwakeningLevel = 2;
    } else if (loop >= LOOP_THRESHOLDS.PILLAR_AWAKENING_1) {
      this.state.pillarAwakeningLevel = 1;
    }
  }

  // ─── 루프 플래그 임계값 체크 ───────────────────────

  /** 기시감 표시 여부 (3회차+) */
  shouldShowDejaVu(): boolean {
    return this.state.loopCount >= LOOP_THRESHOLDS.DEJA_VU;
  }

  /** NPC가 과거 루프 언급 (5회차+) */
  shouldNpcReference(): boolean {
    return this.state.loopCount >= LOOP_THRESHOLDS.NPC_REFERENCE;
  }

  /** 냉소적 선택지 추가 (10회차+) */
  shouldShowCynicalChoices(): boolean {
    return this.state.loopCount >= LOOP_THRESHOLDS.CYNICAL_CHOICES;
  }

  /** 프롤로그 스킵 가능 (20회차+) */
  canSkipPrologue(): boolean {
    return this.state.loopCount >= LOOP_THRESHOLDS.SKIP_AVAILABLE;
  }

  // ─── 지역 해금 ─────────────────────────────────────

  /** 해금된 지역 목록 (스토리에서 단서를 얻어 해금) */
  getUnlockedRegions(): RegionId[] {
    return [...(this.state.unlockedRegions ?? [])];
  }

  isRegionUnlocked(region: RegionId): boolean {
    // 방문한 적 있으면 자동 해금
    if (this.state.visitedRegions.includes(region)) return true;
    return (this.state.unlockedRegions ?? []).includes(region);
  }

  unlockRegion(region: RegionId): void {
    if (!this.state.unlockedRegions) {
      this.state.unlockedRegions = [];
    }
    if (!this.state.unlockedRegions.includes(region)) {
      this.state.unlockedRegions.push(region);
      this.save();
    }
  }

  /** 사이 공간에서 선택 가능한 지역 목록 (방문 + 해금) */
  getSelectableRegions(): RegionId[] {
    const set = new Set<RegionId>([
      ...this.state.visitedRegions,
      ...(this.state.unlockedRegions ?? []),
    ]);
    return [...set];
  }

  // ─── 사망 통계 ─────────────────────────────────────

  recordDeath(deathType: DeathType): void {
    this.state.deathCounts[deathType] =
      (this.state.deathCounts[deathType] ?? 0) + 1;
    this.save();
  }

  getDeathCount(deathType?: DeathType): number {
    if (deathType) return this.state.deathCounts[deathType] ?? 0;
    return Object.values(this.state.deathCounts).reduce((a, b) => a + b, 0);
  }

  // ─── 엔딩 기록 ─────────────────────────────────────

  getUnlockedEndings(): string[] {
    return [...this.state.endingsUnlocked];
  }

  hasUnlockedEnding(endingId: string): boolean {
    return this.state.endingsUnlocked.includes(endingId);
  }

  unlockEnding(endingId: string): void {
    if (!this.state.endingsUnlocked.includes(endingId)) {
      this.state.endingsUnlocked.push(endingId);
      this.save();
    }
  }

  getUnlockedEndingCount(): number {
    return this.state.endingsUnlocked.length;
  }

  // ─── 전체 상태 ─────────────────────────────────────

  getState(): LoopState {
    return { ...this.state };
  }

  // ─── localStorage 연동 ─────────────────────────────

  private load(): LoopState {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.META_SAVE);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.loopState) return parsed.loopState;
      }
    } catch {
      // 파싱 실패
    }
    return this.createDefault();
  }

  save(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.META_SAVE);
      const metaSave = raw ? JSON.parse(raw) : {};
      metaSave.loopState = this.state;
      localStorage.setItem(STORAGE_KEYS.META_SAVE, JSON.stringify(metaSave));
    } catch {
      // 저장 실패
    }
  }

  private createDefault(): LoopState {
    return {
      loopCount: 0,
      pillarAwakeningLevel: 0,
      visitedRegions: [],
      unlockedRegions: [],
      endingsUnlocked: [],
      deathCounts: {} as Record<DeathType, number>,
    };
  }

  /** 전체 초기화 (디버그용) */
  reset(): void {
    this.state = this.createDefault();
    this.save();
  }
}
