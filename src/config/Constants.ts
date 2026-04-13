/**
 * 게임 상수
 * UI, 연출, 게임플레이 수치
 */

// ─── 텍스트 연출 ─────────────────────────────────────

export const TEXT_SPEED = {
  /** 느린 타이핑 (ms/글자) — 독백, 충격적 내용 */
  slow: 60,
  /** 기본 타이핑 (ms/글자) */
  normal: 30,
  /** 빠른 타이핑 (ms/글자) — 급박한 상황 */
  fast: 15,
} as const;

/** 자동 모드 기본 대기 시간(ms) */
export const AUTO_ADVANCE_DELAY = 2000;

// ─── UI 레이아웃 ─────────────────────────────────────

export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;

export const UI_LAYOUT = {
  /** 대화 박스 영역 (화면 하단 30%) */
  DIALOGUE_BOX: {
    x: 0,
    y: GAME_HEIGHT * 0.7,
    width: GAME_WIDTH,
    height: GAME_HEIGHT * 0.3,
    padding: 24,
    speakerOffsetY: -30,
  },

  /** 캐릭터 위치 */
  CHARACTER_POSITIONS: {
    left: { x: GAME_WIDTH * 0.25, y: GAME_HEIGHT * 0.35 },
    center: { x: GAME_WIDTH * 0.5, y: GAME_HEIGHT * 0.35 },
    right: { x: GAME_WIDTH * 0.75, y: GAME_HEIGHT * 0.35 },
  },

  /** 선택지 영역 */
  CHOICE_BOX: {
    x: GAME_WIDTH * 0.15,
    y: GAME_HEIGHT * 0.35,
    width: GAME_WIDTH * 0.7,
    itemHeight: 56,
    itemGap: 12,
    minTouchSize: 44,
  },

  /** HUD (상단) */
  HUD: {
    height: 40,
    padding: 16,
  },
} as const;

// ─── 화면 이펙트 ─────────────────────────────────────

export const TRANSITION_DURATION = {
  /** 일반 페이드 인/아웃 */
  fade: 500,
  /** 디졸브 */
  dissolve: 1000,
  /** 플래시 */
  flash: 300,
  /** 세피아 전환 */
  sepia: 800,
} as const;

export const DEATH_SEQUENCE_TIMING = {
  /** Stage 1: 붉은 비네팅 */
  vignetteMs: 1500,
  /** Stage 2: 프리즈 프레임 */
  freezeMs: 500,
  /** Stage 3: 화면 깨짐 */
  crackMs: 2500,
  /** Stage 4: 되감기 */
  rewindMs: 4000,
  /** Stage 5: 사이 공간 텍스트 */
  betweenTextMs: 3000,
} as const;

// ─── 호감도 시스템 ───────────────────────────────────

export const AFFINITY = {
  /** 초기값 */
  INITIAL: 0,
  /** 최소값 */
  MIN: -100,
  /** 최대값 (Bond 플래그 해금 기준) */
  MAX: 100,
  /** Bond 플래그 해금 임계값 */
  BOND_THRESHOLD: 80,
} as const;

// ─── 오디오 ──────────────────────────────────────────

export const AUDIO = {
  /** BGM 페이드 기본 시간(ms) */
  BGM_FADE_MS: 1500,
  /** SFX 최대 동시 재생 수 */
  MAX_CONCURRENT_SFX: 5,
} as const;

// ─── 세이브 시스템 ───────────────────────────────────

export const SAVE = {
  AUTO_SLOTS: 3,
  MANUAL_SLOTS: 20,
  AUTO_SAVE_INTERVAL_MS: 10 * 60 * 1000, // 10분
  CURRENT_SAVE_VERSION: 1,
  CURRENT_META_VERSION: 1,
} as const;

// ─── 메타 선택지 연출 ────────────────────────────────

export const META_CHOICE_STYLE = {
  /** 테두리 글리치 주기(ms) */
  glitchIntervalMs: 150,
  /** 텍스트 색상 (보라/금색) */
  textColor: '#C5A0FF',
  /** 라벨 색상 */
  labelColor: '#FFD700',
  /** 등장 애니메이션 지속(ms) */
  appearDurationMs: 600,
} as const;

// ─── 키보드 단축키 ───────────────────────────────────

export const KEYBINDINGS = {
  ADVANCE: 'ENTER',
  CHOICE_1: 'ONE',
  CHOICE_2: 'TWO',
  CHOICE_3: 'THREE',
  MENU: 'ESC',
  LOG: 'L',
  AUTO: 'A',
  SKIP: 'S',
} as const;
