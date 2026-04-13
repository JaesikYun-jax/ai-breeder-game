/**
 * 9개 지역 설정
 * - 아젤리아: 1회차 기본 진입 (클래식 이세계 도입부)
 * - 나머지 8개: 스토리 내 단서로 해금, 회귀 후 사이 공간에서 선택
 */

import type { RegionDef } from '../entities/CharacterTypes';

export const REGIONS: Record<string, RegionDef> = {
  azelia: {
    id: 'azelia',
    name: '아젤리아 왕국',
    pillar: '빛의 기둥',
    vibe: '중세 왕국, 용사 소환',
    description: '빛의 기둥이 수호하는 정통 판타지 왕국. 대신관이 실권을 쥐고 용사 소환 의식을 주관한다.',
    isStarterRegion: true,
    transitionText: '빛 기둥 속으로 떨어진다... 거대한 대리석 홀에 착지.',
    defaultBackground: 'bg_azelia_throne_room',
    mainBgm: 'bgm_azelia',
    ambientSfx: 'sfx_env_throne',
    truthFlag: 'truth_azelia',
    melodyFlag: 'melody_azelia',
    keyNpcIds: ['erina', 'mordeus', 'cedric', 'gus'],
    totalChapters: 2,
  },

  kaizer: {
    id: 'kaizer',
    name: '카이젤 제국',
    pillar: '철의 기둥',
    vibe: '군국주의 제국, 마기텍',
    description: '철의 기둥의 힘으로 마법과 기술을 융합한 군사 제국. 불사의 황제가 900년 넘게 통치 중.',
    isStarterRegion: false,
    unlockCondition: {
      type: 'or',
      conditions: [
        { type: 'flag', flag: 'heard_about_empire' },
        { type: 'meta', metaFlag: 'truth_azelia' },
      ],
    },
    unlockHint: '아젤리아 왕국과 전쟁 중인 동쪽 제국... 그곳에도 기둥이 있다는 소문.',
    transitionText: '어둠 속 쇳소리... 빈민가 골목에서 깨어남.',
    defaultBackground: 'bg_kaizer_slums',
    mainBgm: 'bgm_kaizer',
    ambientSfx: 'sfx_env_march',
    truthFlag: 'truth_kaizer',
    melodyFlag: 'melody_kaizer',
    keyNpcIds: ['velta', 'kaizer_emperor', 'pim_soldier', 'gald'],
    totalChapters: 2,
  },

  solaris: {
    id: 'solaris',
    name: '솔라리스',
    nameHanja: '南方',
    pillar: '화염의 기둥',
    vibe: '사막 부족, 정령 교감',
    description: '화염의 기둥이 타오르는 남방 사막. 부족민들은 정령과 교감하며 살아간다.',
    isStarterRegion: false,
    unlockCondition: {
      type: 'or',
      conditions: [
        { type: 'flag', flag: 'heard_about_spirits' },
        { type: 'meta', metaFlag: 'bond_marco' },
      ],
    },
    unlockHint: '남쪽 사막에서 정령과 교감하는 부족이 있다고 한다.',
    transitionText: '뜨거운 바람이 몰아친다... 모래 위에 쓰러져 있다.',
    defaultBackground: 'bg_solaris_desert',
    mainBgm: 'bgm_solaris',
    ambientSfx: 'sfx_env_desert',
    truthFlag: 'truth_solaris',
    melodyFlag: 'melody_solaris',
    keyNpcIds: ['naira', 'ifrit'],
    totalChapters: 2,
  },

  frosthel: {
    id: 'frosthel',
    name: '프로스트헬',
    nameHanja: '北方',
    pillar: '서리의 기둥',
    vibe: '설원 수렵 문화, 봉인된 위협',
    description: '서리의 기둥이 잠든 극북 설원. 프림족이 봉인을 지키며 수렵 생활을 한다.',
    isStarterRegion: false,
    unlockCondition: {
      type: 'or',
      conditions: [
        { type: 'flag', flag: 'heard_about_seal' },
        { type: 'meta', metaFlag: 'truth_kaizer' },
      ],
    },
    unlockHint: '북쪽 설원에 무언가가 봉인되어 있다는 이야기...',
    transitionText: '극심한 한기... 설원에서 동사 직전.',
    defaultBackground: 'bg_frosthel_tundra',
    mainBgm: 'bgm_frosthel',
    ambientSfx: 'sfx_env_snow',
    truthFlag: 'truth_frosthel',
    melodyFlag: 'melody_frosthel',
    keyNpcIds: ['kai', 'baram'],
    totalChapters: 2,
  },

  yonghwa: {
    id: 'yonghwa',
    name: '용화국',
    nameHanja: '東方',
    pillar: '기의 기둥',
    vibe: '동양 무협, 천명 시스템',
    description: '기의 기둥이 지탱하는 동방 무림 세계. 천명 시스템이 모든 이의 운명을 기록한다.',
    isStarterRegion: false,
    unlockCondition: {
      type: 'or',
      conditions: [
        { type: 'flag', flag: 'heard_about_fate_system' },
        { type: 'meta', metaFlag: 'bond_blackrobe' },
      ],
    },
    unlockHint: '동쪽 산맥 너머에 운명을 기록하는 나라가 있다고 한다.',
    transitionText: '안개 속 산길... 기억 없이 방황하고 있다.',
    defaultBackground: 'bg_yonghwa_mountain',
    mainBgm: 'bgm_yonghwa',
    ambientSfx: 'sfx_env_mountain',
    truthFlag: 'truth_yonghwa',
    melodyFlag: 'melody_yonghwa',
    keyNpcIds: ['hyeonmu', 'seolhwa'],
    totalChapters: 2,
  },

  liberta: {
    id: 'liberta',
    name: '리베르타',
    nameHanja: '群島',
    pillar: '바람의 기둥',
    vibe: '해적 군도, 교역 허브',
    description: '바람의 기둥이 부는 군도 연합. 해적왕 레온이 자유의 깃발 아래 군도를 통합했다.',
    isStarterRegion: false,
    unlockCondition: {
      type: 'or',
      conditions: [
        { type: 'flag', flag: 'heard_about_pirate_king' },
        { type: 'meta', metaFlag: 'truth_solaris' },
      ],
    },
    unlockHint: '바다 건너 군도에 이 세계에 온 또 다른 사람이 있다는 소문.',
    transitionText: '파도 소리... 난파선 잔해 위에서 깨어남.',
    defaultBackground: 'bg_liberta_shipwreck',
    mainBgm: 'bgm_liberta',
    ambientSfx: 'sfx_env_sea',
    truthFlag: 'truth_liberta',
    melodyFlag: 'melody_liberta',
    keyNpcIds: ['leon', 'luna'],
    totalChapters: 2,
  },

  celestia: {
    id: 'celestia',
    name: '셀레스티아',
    nameHanja: '天空',
    pillar: '하늘의 기둥',
    vibe: '몰락한 천공 문명, 천인',
    description: '하늘의 기둥 위에 세워진 천인의 문명. 대몰락 이후 고립되어 쇠퇴 중.',
    isStarterRegion: false,
    unlockCondition: {
      type: 'or',
      conditions: [
        { type: 'flag', flag: 'heard_about_sky_people' },
        { type: 'loop', minLoop: 5 },
      ],
    },
    unlockHint: '하늘 위에 날개 달린 종족이 산다는 전설...',
    transitionText: '상승 기류에 휩쓸린다... 구름 위 섬에 떨어짐.',
    defaultBackground: 'bg_celestia_skyisland',
    mainBgm: 'bgm_celestia',
    ambientSfx: 'sfx_env_sky',
    truthFlag: 'truth_celestia',
    melodyFlag: 'melody_celestia',
    keyNpcIds: ['ariel', 'etherno'],
    totalChapters: 2,
  },

  kazmor: {
    id: 'kazmor',
    name: '카즈모르',
    nameHanja: '地下',
    pillar: '대지의 기둥',
    vibe: '드워프 지하 문명, 대장장이',
    description: '대지의 기둥 뿌리 근처에 세워진 드워프 지하 도시. 광맥 채굴이 세계의 근간을 흔들고 있다.',
    isStarterRegion: false,
    unlockCondition: {
      type: 'or',
      conditions: [
        { type: 'flag', flag: 'heard_about_dwarves' },
        { type: 'meta', metaFlag: 'truth_frosthel' },
      ],
    },
    unlockHint: '지하 깊은 곳에 기둥의 뿌리를 캐는 드워프 도시가 있다고 한다.',
    transitionText: '지진... 갱도 속에 매몰.',
    defaultBackground: 'bg_kazmor_mine',
    mainBgm: 'bgm_kazmor',
    ambientSfx: 'sfx_env_cave',
    truthFlag: 'truth_kazmor',
    melodyFlag: 'melody_kazmor',
    keyNpcIds: ['thorg', 'pim_dwarf'],
    totalChapters: 2,
  },

  abyssal: {
    id: 'abyssal',
    name: '아비살',
    nameHanja: '心淵',
    pillar: '심연의 기둥',
    vibe: '심해 문명, 인어/사이렌',
    description: '심연의 기둥이 빛나는 해저 왕국. 여왕 아비게일만이 루프 너머의 기억을 보유한다.',
    isStarterRegion: false,
    unlockCondition: {
      type: 'or',
      conditions: [
        { type: 'flag', flag: 'heard_about_deep_queen' },
        { type: 'meta', metaFlag: 'truth_liberta' },
        { type: 'loop', minLoop: 10 },
      ],
    },
    unlockHint: '심해에 루프를 기억하는 존재가 있다...',
    transitionText: '물속으로 가라앉는다... 빛나는 손에 이끌려 깨어남.',
    defaultBackground: 'bg_abyssal_deep',
    mainBgm: 'bgm_abyssal',
    ambientSfx: 'sfx_env_deep',
    truthFlag: 'truth_abyssal',
    melodyFlag: 'melody_abyssal',
    keyNpcIds: ['abigail', 'maria'],
    totalChapters: 2,
  },
};

/** 지역 ID 목록 */
export const REGION_IDS = Object.keys(REGIONS) as Array<keyof typeof REGIONS>;

/** 1회차 기본 진입 지역 */
export const STARTER_REGION = 'azelia' as const;

/** 해금 가능한 지역 목록 (기본 지역 제외) */
export const UNLOCKABLE_REGIONS = REGION_IDS.filter(
  (id) => !REGIONS[id].isStarterRegion,
);
