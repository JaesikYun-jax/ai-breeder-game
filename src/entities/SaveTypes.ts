/**
 * 세이브/로드 및 설정 데이터 타입 정의
 * - localStorage 기반 영구 저장
 * - 메타 세이브(회귀 데이터)와 일반 세이브 분리
 */

import type { RegionId } from './StoryTypes';
import type {
  SessionFlags,
  AffinityMap,
  MetaFlags,
  LoopState,
} from './GameTypes';

// ─── 세이브 슬롯 ─────────────────────────────────────

export interface SaveSlot {
  /** 슬롯 번호 (0 = 자동저장) */
  slotIndex: number;
  /** 슬롯 유형 */
  slotType: 'auto' | 'manual';
  /** 저장 시점 (ISO string) */
  savedAt: string;
  /** 스크린샷 썸네일 (base64, 선택적) */
  thumbnail?: string;
  /** 요약 정보 (UI 표시용) */
  summary: SaveSummary;
  /** 실제 게임 데이터 */
  data: SaveData;
}

export interface SaveSummary {
  /** 현재 지역 */
  region: RegionId;
  /** 챕터 */
  chapter: number;
  /** 씬 제목/설명 */
  sceneTitle: string;
  /** 회귀 횟수 */
  loopCount: number;
  /** 플레이 시간(초) */
  playTimeSeconds: number;
}

// ─── 세이브 데이터 ───────────────────────────────────

export interface SaveData {
  /** 세이브 데이터 버전 (마이그레이션용) */
  version: number;

  // 현재 세션 상태
  /** 현재 지역 */
  currentRegion: RegionId;
  /** 현재 챕터 */
  currentChapter: number;
  /** 현재 노드 ID */
  currentNodeId: string;
  /** 대화 인덱스 (노드 내 몇 번째 대사까지 진행했는지) */
  dialogueIndex: number;

  // 플레이어 상태
  /** 주인공 이름 */
  playerName: string;
  /** 일반 플래그 */
  flags: SessionFlags;
  /** NPC 호감도 */
  affinity: AffinityMap;
  /** 인벤토리 */
  inventory: Record<string, number>;

  // 플레이 기록
  /** 선택 기록 (nodeId → choiceIndex) */
  choiceHistory: Array<{ nodeId: string; choiceIndex: number }>;
  /** 방문한 노드 ID 목록 */
  visitedNodes: string[];

  // 세션 메타
  /** 현재 루프에서의 플레이 시간(초) */
  playTimeSeconds: number;
}

// ─── 메타 세이브 (회귀 영구 데이터) ──────────────────

export interface MetaSaveData {
  /** 데이터 버전 */
  version: number;
  /** 메타 플래그 */
  metaFlags: MetaFlags;
  /** 루프 상태 */
  loopState: LoopState;
  /** 총 플레이 시간(초) */
  totalPlayTimeSeconds: number;
  /** 최초 플레이 시작일 (ISO string) */
  firstPlayDate: string;
  /** 마지막 플레이일 (ISO string) */
  lastPlayDate: string;
}

// ─── 세이브 슬롯 인덱스 ──────────────────────────────

export const SAVE_SLOT_CONFIG = {
  /** 자동 저장 슬롯 수 */
  AUTO_SLOTS: 3,
  /** 수동 저장 슬롯 수 */
  MANUAL_SLOTS: 20,
  /** 자동 저장 간격(ms) */
  AUTO_SAVE_INTERVAL_MS: 10 * 60 * 1000, // 10분
} as const;

/** 자동 저장 트리거 */
export type AutoSaveTrigger = 'beforeChoice' | 'chapterStart' | 'interval';

// ─── 설정 (Settings) ─────────────────────────────────

export interface GameSettings {
  // 텍스트
  /** 텍스트 속도 */
  textSpeed: 'slow' | 'normal' | 'fast';
  /** 자동 진행 */
  autoAdvance: boolean;
  /** 자동 진행 대기 시간(ms) */
  autoAdvanceDelayMs: number;
  /** 텍스트 크기 */
  textSize: 'small' | 'normal' | 'large';

  // 오디오
  /** BGM 볼륨 (0-1) */
  bgmVolume: number;
  /** SFX 볼륨 (0-1) */
  sfxVolume: number;
  /** 마스터 볼륨 (0-1) */
  masterVolume: number;

  // 접근성
  /** 화면 이펙트 ON/OFF */
  screenEffectsEnabled: boolean;
  /** 고대비 모드 */
  highContrastMode: boolean;

  // 언어
  language: 'ko';
}

export const DEFAULT_SETTINGS: GameSettings = {
  textSpeed: 'normal',
  autoAdvance: false,
  autoAdvanceDelayMs: 2000,
  textSize: 'normal',
  bgmVolume: 0.7,
  sfxVolume: 0.8,
  masterVolume: 1.0,
  screenEffectsEnabled: true,
  highContrastMode: false,
  language: 'ko',
};

// ─── localStorage 키 ─────────────────────────────────

export const STORAGE_KEYS = {
  META_SAVE: 'aibreeder_meta',
  SAVE_PREFIX: 'aibreeder_save_',
  SETTINGS: 'aibreeder_settings',
} as const;

// ─── 데이터 버전 ─────────────────────────────────────

export const CURRENT_SAVE_VERSION = 1;
export const CURRENT_META_VERSION = 1;
