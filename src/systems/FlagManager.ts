/**
 * FlagManager — 플래그 및 메타 플래그 관리
 *
 * 두 가지 플래그 레이어:
 * 1. SessionFlags — 일반 플래그, 루프 시 초기화
 * 2. MetaFlags — localStorage 기반, 영구 유지 (진실/관계/멜로디)
 *
 * 의존: localStorage (메타 플래그 영구 저장)
 */

import type { MetaFlags, SessionFlags } from '../entities/GameTypes';
import { STORAGE_KEYS } from '../entities/SaveTypes';
import { MELODY_COMPLETE_THRESHOLD } from '../config/MetaFlagConfig';

export class FlagManager {
  private sessionFlags: SessionFlags = {};
  private metaFlags: MetaFlags;

  constructor() {
    this.metaFlags = this.loadMetaFlags();
  }

  // ─── 일반 플래그 (세션 한정) ───────────────────────

  getFlag(key: string): boolean {
    return this.sessionFlags[key] ?? false;
  }

  setFlag(key: string, value: boolean): void {
    this.sessionFlags[key] = value;
  }

  /** 루프 시 일반 플래그 전체 초기화 */
  resetSessionFlags(): void {
    this.sessionFlags = {};
  }

  getAllSessionFlags(): SessionFlags {
    return { ...this.sessionFlags };
  }

  /** 세이브 로드 시 일괄 복원 */
  restoreSessionFlags(flags: SessionFlags): void {
    this.sessionFlags = { ...flags };
  }

  // ─── 메타 플래그 (영구 저장) ───────────────────────

  getMetaFlag(key: string): boolean {
    // 카테고리별 검색
    if (key.startsWith('truth_')) return this.metaFlags.truths[key] ?? false;
    if (key.startsWith('bond_')) return this.metaFlags.bonds[key] ?? false;
    if (key.startsWith('melody_')) return this.metaFlags.melodies[key] ?? false;
    return false;
  }

  setMetaFlag(key: string, value: boolean): void {
    if (key.startsWith('truth_')) {
      this.metaFlags.truths[key] = value;
    } else if (key.startsWith('bond_')) {
      this.metaFlags.bonds[key] = value;
    } else if (key.startsWith('melody_')) {
      this.metaFlags.melodies[key] = value;
    }
    this.saveMetaFlags();
  }

  // ─── 메타 플래그 조회 유틸리티 ─────────────────────

  /** 해금된 진실 플래그 수 */
  getTruthCount(): number {
    return Object.values(this.metaFlags.truths).filter(Boolean).length;
  }

  /** 해금된 관계 플래그 수 */
  getBondCount(): number {
    return Object.values(this.metaFlags.bonds).filter(Boolean).length;
  }

  /** 수집된 멜로디 수 */
  getMelodyCount(): number {
    return Object.values(this.metaFlags.melodies).filter(Boolean).length;
  }

  /** 멜로디 완성 여부 */
  isMelodyComplete(): boolean {
    return this.getMelodyCount() >= MELODY_COMPLETE_THRESHOLD;
  }

  /** 전체 메타 플래그 반환 (UI 표시용) */
  getAllMetaFlags(): MetaFlags {
    return {
      truths: { ...this.metaFlags.truths },
      bonds: { ...this.metaFlags.bonds },
      melodies: { ...this.metaFlags.melodies },
    };
  }

  // ─── localStorage 연동 ─────────────────────────────

  private loadMetaFlags(): MetaFlags {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.META_SAVE);
      if (raw) {
        const parsed = JSON.parse(raw);
        // 메타 세이브의 metaFlags 부분만 추출
        if (parsed.metaFlags) return parsed.metaFlags;
      }
    } catch {
      // 파싱 실패 시 기본값
    }
    return this.createDefaultMetaFlags();
  }

  private saveMetaFlags(): void {
    try {
      // 기존 메타 세이브를 읽어서 metaFlags 부분만 업데이트
      const raw = localStorage.getItem(STORAGE_KEYS.META_SAVE);
      const metaSave = raw ? JSON.parse(raw) : {};
      metaSave.metaFlags = this.metaFlags;
      localStorage.setItem(STORAGE_KEYS.META_SAVE, JSON.stringify(metaSave));
    } catch {
      // 저장 실패 시 무시 (용량 초과 등)
    }
  }

  private createDefaultMetaFlags(): MetaFlags {
    return {
      truths: {},
      bonds: {},
      melodies: {},
    };
  }

  /** 전체 메타 플래그 초기화 (디버그용) */
  resetAllMetaFlags(): void {
    this.metaFlags = this.createDefaultMetaFlags();
    this.saveMetaFlags();
  }
}
