/**
 * 캐릭터 & 지역 타입 정의
 */

import type { RegionId } from './StoryTypes';
import type { ConditionDef } from './GameTypes';

// ─── 캐릭터 프로필 ───────────────────────────────────

export interface CharacterProfile {
  /** 캐릭터 고유 ID */
  id: string;
  /** 표시 이름 */
  name: string;
  /** 소속 지역 (공유 NPC는 'shared') */
  region: RegionId | 'shared';
  /** 역할 분류 */
  role: CharacterRole;
  /** 짧은 소개 */
  description: string;
  /** 비밀 정보 (메타 플래그 해금 시 공개) */
  secret?: string;

  // 비주얼
  /** 기본 스프라이트 키 */
  defaultSprite: string;
  /** 사용 가능한 표정 목록 */
  expressions: string[];
  /** 대사 색상 (HEX) */
  nameColor: string;

  // 관계 시스템
  /** 호감도 초기값 */
  initialAffinity: number;
  /** 관계 플래그 키 (bond_xxx) */
  bondFlag?: string;
  /** 관계 엔딩 ID */
  relationshipEndingId?: string;
}

export type CharacterRole =
  | 'protagonist'  // 주인공
  | 'heroine'      // 히로인/키 NPC
  | 'mentor'       // 스승/조력자
  | 'antagonist'   // 적대자/빌런
  | 'companion'    // 동료
  | 'mysterious'   // 미스터리 NPC (마르코, 검은 로브)
  | 'ruler'        // 지배자/왕
  | 'support';     // 서브 NPC

// ─── 주인공 데이터 ───────────────────────────────────

export interface ProtagonistData {
  /** 플레이어 설정 이름 (기본: 하윤) */
  name: string;
}

// ─── 지역 정의 ───────────────────────────────────────

export interface RegionDef {
  id: RegionId;
  /** 표시 이름 */
  name: string;
  /** 한자 표기 */
  nameHanja?: string;
  /** 기둥 이름 */
  pillar: string;
  /** 분위기 한줄 요약 */
  vibe: string;
  /** 지역 설명 */
  description: string;

  // 해금 시스템
  /** 1회차 기본 지역 여부 */
  isStarterRegion: boolean;
  /** 해금 조건 (스토리 플래그 기반) — 기본 지역이면 불필요 */
  unlockCondition?: ConditionDef;
  /** 해금 시 사이 공간에서 보여줄 힌트 */
  unlockHint?: string;

  // 연출
  /** 전이 연출 텍스트 */
  transitionText: string;
  /** 기본 배경 키 */
  defaultBackground: string;
  /** 메인 테마 BGM 키 */
  mainBgm: string;
  /** 환경 SFX 키 */
  ambientSfx: string;

  // 메타 플래그 연결
  /** 진실 플래그 키 */
  truthFlag: string;
  /** 멜로디 플래그 키 */
  melodyFlag: string;

  // 핵심 NPC ID 목록
  keyNpcIds: string[];

  // 챕터 수
  totalChapters: number;
}

// ─── 엔딩 정의 ───────────────────────────────────────

export interface EndingDef {
  id: string;
  /** 엔딩 제목 */
  title: string;
  /** 엔딩 부제 */
  subtitle: string;
  /** 엔딩 분류 */
  category: EndingCategory;
  /** 소속 지역 (트루/특수 엔딩은 undefined) */
  region?: RegionId;
  /** 해금 조건 */
  condition: EndingCondition;
  /** 엔딩 CG 키 */
  cgKey?: string;
  /** 마지막 대사 */
  finalQuote: string;
  /** 감정 태그 */
  mood: string;
}

export type EndingCategory =
  | 'normal'        // 지역 일반 엔딩 (9개)
  | 'hidden'        // 지역 히든 엔딩 (9개)
  | 'relationship'  // 관계 엔딩 (9개)
  | 'true'          // 트루 엔딩 (3개)
  | 'special';      // 특수 엔딩 (3개)

export interface EndingCondition {
  /** 필요한 메타 플래그 */
  requiredMeta?: string[];
  /** 필요한 관계 플래그 */
  requiredBonds?: string[];
  /** 필요한 진실 플래그 수 */
  minTruths?: number;
  /** 멜로디 완성 필요 여부 */
  melodyComplete?: boolean;
  /** 최소 루프 횟수 */
  minLoop?: number;
  /** 최대 관계 플래그 수 (고독 엔딩용) */
  maxBonds?: number;
  /** 추가 커스텀 조건 ID */
  customCondition?: string;
}

// ─── 마르코 교역 시스템 ──────────────────────────────

export interface TradeItem {
  id: string;
  name: string;
  description: string;
  /** 교환 비용 (이야기 개수) */
  storyCost: number;
  /** 효과 */
  effect: TradeItemEffect;
  /** 구매 가능 조건 */
  condition?: ConditionDef;
}

export type TradeItemEffect =
  | { type: 'flagReveal'; hint: string }
  | { type: 'melodyHint'; region: RegionId }
  | { type: 'loopItem'; itemId: string };
