/**
 * SaveManager — 세이브/로드 시스템
 *
 * 책임:
 * - 수동 세이브 (20슬롯)
 * - 자동 세이브 (3슬롯: 선택지 직전, 챕터 시작, 10분 간격)
 * - 메타 세이브 (회귀 데이터, 자동)
 * - 설정 저장/로드
 * - 세이브 데이터 버전 관리
 *
 * 의존: localStorage
 */

import type {
  SaveSlot,
  SaveData,
  MetaSaveData,
  GameSettings,
  AutoSaveTrigger,
} from '../entities/SaveTypes';
import {
  STORAGE_KEYS,
  SAVE_SLOT_CONFIG,
  DEFAULT_SETTINGS,
  CURRENT_SAVE_VERSION,
  CURRENT_META_VERSION,
} from '../entities/SaveTypes';
import type { GameSession } from '../entities/GameTypes';
import type { FlagManager } from './FlagManager';
import type { LoopManager } from './LoopManager';

export class SaveManager {
  private autoSaveIndex = 0; // 자동 저장 순환 인덱스 (0, 1, 2)

  // ─── 수동 세이브 ───────────────────────────────────

  /** 수동 저장 */
  saveManual(
    slotIndex: number,
    session: GameSession,
    flagManager: FlagManager,
    sceneTitle: string,
    loopCount: number,
    playTimeSeconds: number,
  ): boolean {
    if (slotIndex < 1 || slotIndex > SAVE_SLOT_CONFIG.MANUAL_SLOTS) {
      return false;
    }

    const slot = this.createSaveSlot(
      slotIndex,
      'manual',
      session,
      flagManager,
      sceneTitle,
      loopCount,
      playTimeSeconds,
    );

    return this.writeSlot(slotIndex, slot);
  }

  /** 수동 로드 */
  loadManual(slotIndex: number): SaveSlot | null {
    return this.readSlot(slotIndex);
  }

  // ─── 자동 세이브 ───────────────────────────────────

  /** 자동 저장 (순환: 0, 1, 2) */
  autoSave(
    _trigger: AutoSaveTrigger,
    session: GameSession,
    flagManager: FlagManager,
    sceneTitle: string,
    loopCount: number,
    playTimeSeconds: number,
  ): void {
    const slotIndex = -(this.autoSaveIndex + 1); // -1, -2, -3

    const slot = this.createSaveSlot(
      slotIndex,
      'auto',
      session,
      flagManager,
      sceneTitle,
      loopCount,
      playTimeSeconds,
    );

    this.writeSlot(slotIndex, slot);
    this.autoSaveIndex = (this.autoSaveIndex + 1) % SAVE_SLOT_CONFIG.AUTO_SLOTS;
  }

  /** 자동 저장 슬롯 목록 */
  getAutoSaves(): SaveSlot[] {
    const slots: SaveSlot[] = [];
    for (let i = 1; i <= SAVE_SLOT_CONFIG.AUTO_SLOTS; i++) {
      const slot = this.readSlot(-i);
      if (slot) slots.push(slot);
    }
    return slots.sort(
      (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime(),
    );
  }

  // ─── 슬롯 관리 ────────────────────────────────────

  /** 특정 슬롯 삭제 */
  deleteSlot(slotIndex: number): void {
    const key = `${STORAGE_KEYS.SAVE_PREFIX}${slotIndex}`;
    localStorage.removeItem(key);
  }

  /** 모든 수동 세이브 슬롯 정보 (비어있으면 null) */
  getAllManualSlots(): Array<SaveSlot | null> {
    const slots: Array<SaveSlot | null> = [];
    for (let i = 1; i <= SAVE_SLOT_CONFIG.MANUAL_SLOTS; i++) {
      slots.push(this.readSlot(i));
    }
    return slots;
  }

  /** 비어있는 첫 번째 수동 슬롯 번호 */
  getFirstEmptySlot(): number | null {
    for (let i = 1; i <= SAVE_SLOT_CONFIG.MANUAL_SLOTS; i++) {
      if (!this.readSlot(i)) return i;
    }
    return null;
  }

  // ─── 메타 세이브 ───────────────────────────────────

  /** 메타 세이브 (회귀 시 자동 호출) */
  saveMetaData(
    flagManager: FlagManager,
    loopManager: LoopManager,
    totalPlayTimeSeconds: number,
  ): void {
    const metaSave: MetaSaveData = {
      version: CURRENT_META_VERSION,
      metaFlags: flagManager.getAllMetaFlags(),
      loopState: loopManager.getState(),
      totalPlayTimeSeconds,
      firstPlayDate:
        this.loadMetaData()?.firstPlayDate ?? new Date().toISOString(),
      lastPlayDate: new Date().toISOString(),
    };

    try {
      localStorage.setItem(STORAGE_KEYS.META_SAVE, JSON.stringify(metaSave));
    } catch {
      // 저장 실패
    }
  }

  loadMetaData(): MetaSaveData | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.META_SAVE);
      if (raw) return JSON.parse(raw) as MetaSaveData;
    } catch {
      // 파싱 실패
    }
    return null;
  }

  // ─── 설정 ──────────────────────────────────────────

  saveSettings(settings: GameSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch {
      // 저장 실패
    }
  }

  loadSettings(): GameSettings {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (raw) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
      }
    } catch {
      // 파싱 실패
    }
    return { ...DEFAULT_SETTINGS };
  }

  // ─── 내부 ──────────────────────────────────────────

  private createSaveSlot(
    slotIndex: number,
    slotType: 'auto' | 'manual',
    session: GameSession,
    flagManager: FlagManager,
    sceneTitle: string,
    loopCount: number,
    playTimeSeconds: number,
  ): SaveSlot {
    const data: SaveData = {
      version: CURRENT_SAVE_VERSION,
      currentRegion: session.currentRegion,
      currentChapter: session.currentChapter,
      currentNodeId: session.currentNodeId,
      dialogueIndex: 0,
      playerName: '하윤', // TODO: 주인공 이름 설정 반영
      flags: flagManager.getAllSessionFlags(),
      affinity: { ...session.affinity },
      inventory: { ...session.inventory },
      choiceHistory: [...session.choiceHistory],
      visitedNodes: [...session.visitedNodes],
      playTimeSeconds,
    };

    return {
      slotIndex,
      slotType,
      savedAt: new Date().toISOString(),
      summary: {
        region: session.currentRegion,
        chapter: session.currentChapter,
        sceneTitle,
        loopCount,
        playTimeSeconds,
      },
      data,
    };
  }

  private writeSlot(slotIndex: number, slot: SaveSlot): boolean {
    try {
      const key = `${STORAGE_KEYS.SAVE_PREFIX}${slotIndex}`;
      localStorage.setItem(key, JSON.stringify(slot));
      return true;
    } catch {
      return false;
    }
  }

  private readSlot(slotIndex: number): SaveSlot | null {
    try {
      const key = `${STORAGE_KEYS.SAVE_PREFIX}${slotIndex}`;
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw) as SaveSlot;
    } catch {
      // 파싱 실패
    }
    return null;
  }

  /** 전체 세이브 삭제 (디버그용) */
  clearAll(): void {
    // 수동 슬롯
    for (let i = 1; i <= SAVE_SLOT_CONFIG.MANUAL_SLOTS; i++) {
      this.deleteSlot(i);
    }
    // 자동 슬롯
    for (let i = 1; i <= SAVE_SLOT_CONFIG.AUTO_SLOTS; i++) {
      this.deleteSlot(-i);
    }
    // 메타 세이브
    localStorage.removeItem(STORAGE_KEYS.META_SAVE);
    // 설정
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  }
}
