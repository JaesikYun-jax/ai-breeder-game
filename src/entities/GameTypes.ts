/**
 * 게임 상태 타입 정의
 * - 조건(Condition), 이벤트(GameEvent), 플래그 시스템
 * - 능력치 없음: 분기는 플래그/메타 플래그/호감도/루프 횟수로만 결정
 */

import type { RegionId } from './StoryTypes';

// ─── 조건 시스템 ─────────────────────────────────────
// 복합 조건(and/or/not) 지원으로 복잡한 분기 표현 가능

export type ConditionDef =
  | FlagCondition
  | MetaFlagCondition
  | LoopCondition
  | VisitedCondition
  | AffinityCondition
  | RegionUnlockedCondition
  | AndCondition
  | OrCondition
  | NotCondition;

export interface FlagCondition {
  type: 'flag';
  /** 일반 플래그 키 */
  flag: string;
  /** 기대 값 (기본: true) */
  value?: boolean;
}

export interface MetaFlagCondition {
  type: 'meta';
  /** 메타 플래그 키 (e.g. "truth_azelia", "bond_erina", "melody_azelia") */
  metaFlag: string;
}

export interface LoopCondition {
  type: 'loop';
  /** 최소 회귀 횟수 */
  minLoop: number;
}

export interface VisitedCondition {
  type: 'visited';
  /** 방문 이력 필요한 지역 */
  region: RegionId;
}

export interface AffinityCondition {
  type: 'affinity';
  /** NPC 캐릭터 ID */
  character: string;
  /** 최소 호감도 */
  min?: number;
  /** 최대 호감도 */
  max?: number;
}

/** 지역 해금 조건 (사이 공간에서 선택 가능 여부) */
export interface RegionUnlockedCondition {
  type: 'regionUnlocked';
  region: RegionId;
}

export interface AndCondition {
  type: 'and';
  conditions: ConditionDef[];
}

export interface OrCondition {
  type: 'or';
  conditions: ConditionDef[];
}

export interface NotCondition {
  type: 'not';
  condition: ConditionDef;
}

// ─── 게임 이벤트 시스템 ──────────────────────────────
// 선택지 효과, 노드 진입/퇴장 시 실행되는 이벤트

export type GameEventDef =
  | SetFlagEvent
  | SetMetaFlagEvent
  | SetAffinityEvent
  | UnlockRegionEvent
  | PlaySoundEvent
  | ScreenEffectEvent
  | DeathEvent
  | EndingEvent
  | SetBgmEvent
  | ShowCGEvent
  | UnlockMelodyEvent
  | AddItemEvent;

export interface SetFlagEvent {
  type: 'setFlag';
  flag: string;
  value: boolean;
}

export interface SetMetaFlagEvent {
  type: 'setMeta';
  flag: string;
  value: boolean;
}

export interface SetAffinityEvent {
  type: 'setAffinity';
  character: string;
  /** 호감도 변화량 (양수=증가, 음수=감소) */
  delta: number;
}

/** 스토리 내에서 특정 지역의 단서를 얻으면 해금 */
export interface UnlockRegionEvent {
  type: 'unlockRegion';
  region: RegionId;
  /** 해금 시 플레이어에게 보여줄 힌트 텍스트 */
  hint?: string;
}

export interface PlaySoundEvent {
  type: 'playSound';
  /** SFX/BGM key */
  sound: string;
}

export interface ScreenEffectEvent {
  type: 'screenEffect';
  effect: 'shake' | 'fade' | 'flash' | 'glitch' | 'sepia' | 'redVignette' | 'blueVignette' | 'freeze';
  /** 효과 지속 시간(ms) */
  duration?: number;
}

export interface DeathEvent {
  type: 'death';
  deathType: DeathType;
  /** 사망 시 보여줄 텍스트 */
  deathText?: string;
}

export interface EndingEvent {
  type: 'ending';
  endingId: string;
}

export interface SetBgmEvent {
  type: 'setBgm';
  bgm: string;
  /** 페이드 시간(ms) */
  fadeMs?: number;
}

export interface ShowCGEvent {
  type: 'showCG';
  /** CG 이미지 key */
  cgKey: string;
}

export interface UnlockMelodyEvent {
  type: 'unlockMelody';
  region: RegionId;
}

export interface AddItemEvent {
  type: 'addItem';
  itemId: string;
  quantity?: number;
}

// ─── 사망 유형 ───────────────────────────────────────

export type DeathType = 'combat' | 'trap' | 'betrayal' | 'sacrifice' | 'accident';

// ─── 플래그 상태 ─────────────────────────────────────

/** 일반 플래그: 루프 시 초기화 */
export interface SessionFlags {
  [key: string]: boolean;
}

/** NPC 호감도: 루프 시 초기화 */
export interface AffinityMap {
  [characterId: string]: number;
}

// ─── 메타 플래그 (회귀해도 유지) ──────────────────────

export interface MetaFlags {
  /** 진실 플래그 (9개 지역) */
  truths: Record<string, boolean>;
  /** 관계 플래그 (11개 NPC) */
  bonds: Record<string, boolean>;
  /** 멜로디 플래그 (9개 지역) */
  melodies: Record<string, boolean>;
}

// ─── 루프 상태 (회귀해도 유지) ────────────────────────

export interface LoopState {
  /** 총 회귀 횟수 */
  loopCount: number;
  /** 기둥 각성 레벨 (0-4) */
  pillarAwakeningLevel: number;
  /** 방문한 지역 목록 */
  visitedRegions: RegionId[];
  /** 해금된 지역 목록 (스토리 내 단서로 해금, 방문과 별개) */
  unlockedRegions: RegionId[];
  /** 해금된 엔딩 ID 목록 */
  endingsUnlocked: string[];
  /** 사망 유형별 횟수 */
  deathCounts: Record<DeathType, number>;
}

// ─── 현재 게임 세션 상태 ─────────────────────────────

export interface GameSession {
  /** 현재 지역 */
  currentRegion: RegionId;
  /** 현재 챕터 */
  currentChapter: number;
  /** 현재 노드 ID */
  currentNodeId: string;
  /** 일반 플래그 (루프 시 리셋) */
  flags: SessionFlags;
  /** NPC 호감도 (루프 시 리셋) */
  affinity: AffinityMap;
  /** 인벤토리 (루프 시 리셋) */
  inventory: Record<string, number>;
  /** 대화 로그 (현재 세션) */
  dialogueHistory: DialogueLogEntry[];
  /** 선택 기록 (nodeId → choiceIndex) */
  choiceHistory: Array<{ nodeId: string; choiceIndex: number }>;
  /** 방문한 노드 ID 목록 */
  visitedNodes: string[];
}

export interface DialogueLogEntry {
  nodeId: string;
  speaker?: string;
  text: string;
  timestamp: number;
}
