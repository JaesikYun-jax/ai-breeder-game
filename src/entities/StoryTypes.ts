/**
 * 스토리 데이터 타입 정의
 * - 모든 스토리 콘텐츠는 JSON으로 관리, 코드와 완전 분리
 * - 노드 그래프 기반: 각 노드 = 하나의 장면(씬)
 */

import type { ConditionDef, GameEventDef } from './GameTypes';

// ─── 스토리 노드 ───────────────────────────────────────

export interface StoryNode {
  /** 고유 ID: "azelia_ch1_001" */
  id: string;
  /** 소속 지역 */
  region: RegionId;
  /** 챕터 번호 */
  chapter: number;

  // 씬 연출
  /** 배경 이미지 key */
  background: string;
  /** BGM key (변경 시에만 지정) */
  bgm?: string;
  /** 효과음 key */
  sfx?: string;
  /** BGM 레이어 추가/제거 */
  bgmLayer?: BgmLayerCommand;

  // 캐릭터 표시
  characters: CharacterDisplay[];

  // 텍스트
  dialogue: DialogueLine[];

  // 분기
  /** 선택지 (없으면 next로 자동 진행) */
  choices?: Choice[];
  /** 자동 진행 시 다음 노드 ID */
  next?: string;

  // 이벤트
  /** 노드 진입 시 실행 이벤트 */
  onEnter?: GameEventDef[];
  /** 노드 퇴장 시 실행 이벤트 */
  onExit?: GameEventDef[];

  // 조건부 표시
  /** 이 노드에 도달하기 위한 전제 조건 */
  condition?: ConditionDef;

  // 메타 정보
  /** 에디터/QA용 태그 */
  tags?: string[];
}

// ─── 캐릭터 표시 ───────────────────────────────────────

export type CharacterPosition = 'left' | 'center' | 'right';
export type CharacterAnimation = 'fadeIn' | 'fadeOut' | 'slideIn' | 'slideOut' | 'shake' | 'bounce';

export interface CharacterDisplay {
  /** 캐릭터 ID */
  id: string;
  /** 스프라이트 키 (표정/포즈) */
  sprite: string;
  /** 화면 내 위치 */
  position: CharacterPosition;
  /** 등장/퇴장 애니메이션 */
  animation?: CharacterAnimation;
  /** 대화 중 하이라이트 여부 */
  highlight?: boolean;
}

// ─── 대사 ────────────────────────────────────────────

export type TextSpeed = 'slow' | 'normal' | 'fast';
export type ScreenEffect = 'shake' | 'fade' | 'flash' | 'glitch' | 'sepia' | 'redVignette' | 'blueVignette';

export interface DialogueLine {
  /** 화자 이름 (undefined = 나레이션) */
  speaker?: string;
  /** 대사 텍스트 */
  text: string;
  /** 화자 표정 변경 (스프라이트 키) */
  expression?: string;
  /** 텍스트 출력 속도 */
  speed?: TextSpeed;
  /** 화면 이펙트 */
  effect?: ScreenEffect;
  /** 대사 중 재생할 SFX */
  sfx?: string;
  /** 나레이션 스타일: 독백은 괄호+주인공색, 시스템은 대괄호+글리치 */
  style?: 'narration' | 'monologue' | 'system' | 'whisper';
  /** 텍스트 표시 후 자동 대기 시간(ms). undefined = 클릭 대기 */
  autoDelay?: number;
}

// ─── 선택지 ──────────────────────────────────────────

export interface Choice {
  /** 선택지 텍스트 */
  text: string;
  /** 선택 시 이동할 노드 ID */
  next: string;
  /** 선택지 표시 조건 (플래그 기반) */
  condition?: ConditionDef;
  /** 선택 시 발생하는 이벤트 */
  effects?: GameEventDef[];

  // 메타 플래그 관련 (회귀 전용)
  /** 회귀 플레이어에게만 보이는 라벨 (e.g. "[이전 기억]", "[기시감]") */
  metaLabel?: string;
  /** 메타 플래그 기반 표시 조건 */
  metaCondition?: ConditionDef;
}

// ─── BGM 레이어 ──────────────────────────────────────

export type BgmLayerType = 'tension' | 'combat' | 'emotional' | 'discovery' | 'death' | 'meta';

export interface BgmLayerCommand {
  action: 'add' | 'remove' | 'clear';
  layer?: BgmLayerType;
}

// ─── 챕터 데이터 (JSON 파일 단위) ──────────────────────

export interface ChapterData {
  region: RegionId | 'shared';
  chapter: number;
  /** 챕터 제목 */
  title: string;
  /** 시작 노드 ID */
  startNodeId: string;
  /** 노드 맵 (ID → StoryNode) */
  nodes: Record<string, StoryNode>;
}

// ─── 지역 ID 타입 ────────────────────────────────────

export type RegionId =
  | 'azelia'
  | 'kaizer'
  | 'solaris'
  | 'frosthel'
  | 'yonghwa'
  | 'liberta'
  | 'celestia'
  | 'kazmor'
  | 'abyssal';

// ─── Re-exports (GameEvent, Condition은 GameTypes에서 정의) ──

export type { ConditionDef, GameEventDef };
