/**
 * 메타 플래그 & 엔딩 설정
 * GDD 03번 (메타 플래그) + GDD 06번 (엔딩 트리) 기반
 */

import type { EndingDef } from '../entities/CharacterTypes';

// ─── 진실 플래그 정의 ────────────────────────────────

export interface TruthFlagDef {
  id: string;
  region: string;
  description: string;
  unlockEffect: string;
}

export const TRUTH_FLAGS: TruthFlagDef[] = [
  { id: 'truth_azelia', region: 'azelia', description: '대신관의 음모 폭로', unlockEffect: '2회차+ 아젤리아 시작 시 새 루트' },
  { id: 'truth_kaizer', region: 'kaizer', description: '황제의 수명 착취 발견', unlockEffect: '제국 반란 루트 해금' },
  { id: 'truth_solaris', region: 'solaris', description: '정령=기둥 파편 인지', unlockEffect: '정령 대화에 새 선택지' },
  { id: 'truth_frosthel', region: 'frosthel', description: '봉인 존재의 정체 확인', unlockEffect: '봉인지 직접 접근 가능' },
  { id: 'truth_yonghwa', region: 'yonghwa', description: '천명 시스템의 인위성 발견', unlockEffect: '천명 거부 루트 해금' },
  { id: 'truth_liberta', region: 'liberta', description: '해적왕=전이자 확인', unlockEffect: '레온과 현대 대화 해금' },
  { id: 'truth_celestia', region: 'celestia', description: '대몰락=천인의 죄 발견', unlockEffect: '천인 평의회 대면 이벤트' },
  { id: 'truth_kazmor', region: 'kazmor', description: '광맥=기둥의 뿌리 발견', unlockEffect: '광맥 심층 루트 해금' },
  { id: 'truth_abyssal', region: 'abyssal', description: '여왕=전이자 환생 인지', unlockEffect: '여왕 전생 기억 각성 이벤트' },
];

// ─── 관계 플래그 정의 ────────────────────────────────

export interface BondFlagDef {
  id: string;
  characterName: string;
  description: string;
  unlockEffect: string;
}

export const BOND_FLAGS: BondFlagDef[] = [
  { id: 'bond_erina', characterName: '에리나', description: '에리나 신뢰도 MAX', unlockEffect: '에리나 개인 엔딩 해금' },
  { id: 'bond_velta', characterName: '벨타', description: '벨타와 반란 공모', unlockEffect: '제국 반란 합류 가능' },
  { id: 'bond_naira', characterName: '나이라', description: '나이라의 비밀 수용', unlockEffect: '정령 교감 공유 이벤트' },
  { id: 'bond_kai', characterName: '카이', description: '카이와 생사고락', unlockEffect: '봉인지 동행 가능' },
  { id: 'bond_hyeonmu', characterName: '현무', description: '사부의 가르침 완수', unlockEffect: '천명 바깥의 힘 해금' },
  { id: 'bond_leon', characterName: '레온', description: '레온과 동맹', unlockEffect: '다지역 항해 루트 해금' },
  { id: 'bond_ariel', characterName: '아리엘', description: '아리엘과 진실 추적', unlockEffect: '대몰락 기록 열람' },
  { id: 'bond_thorg', characterName: '토르그', description: '토르그 대장간 수료', unlockEffect: '특수 무기 제작 가능' },
  { id: 'bond_abigail', characterName: '아비게일', description: '여왕의 전생 기억 회복', unlockEffect: '시간의 기둥 정보 해금' },
  { id: 'bond_marco', characterName: '마르코', description: '마르코의 진심 대화 3회', unlockEffect: '세계수에 대한 직접 언급' },
  { id: 'bond_blackrobe', characterName: '검은 로브 여인', description: '검은 로브 여인 3지역 대화', unlockEffect: '시간의 기둥 관리자 인지' },
];

// ─── 멜로디 플래그 정의 ──────────────────────────────

export interface MelodyFlagDef {
  id: string;
  region: string;
  discoveryLocation: string;
}

export const MELODY_FLAGS: MelodyFlagDef[] = [
  { id: 'melody_azelia', region: 'azelia', discoveryLocation: '궁정 연회 참석 시 간주에서 발견' },
  { id: 'melody_kaizer', region: 'kaizer', discoveryLocation: '야간 행군 중 병사가 부르는 노래' },
  { id: 'melody_solaris', region: 'solaris', discoveryLocation: '정령 소환 의식 참관' },
  { id: 'melody_frosthel', region: 'frosthel', discoveryLocation: '대빙하 위에서 바람 소리 경청' },
  { id: 'melody_yonghwa', region: 'yonghwa', discoveryLocation: '내공 수련 중 내면에서 들림' },
  { id: 'melody_liberta', region: 'liberta', discoveryLocation: '레온이 술 마시며 부르는 뱃노래' },
  { id: 'melody_celestia', region: 'celestia', discoveryLocation: '에테르노의 기록실에서 고대 악보 발견' },
  { id: 'melody_kazmor', region: 'kazmor', discoveryLocation: '최심층 광맥에서 울려오는 진동' },
  { id: 'melody_abyssal', region: 'abyssal', discoveryLocation: '여왕의 자장가' },
];

/** 멜로디 완성에 필요한 파편 수 */
export const MELODY_COMPLETE_THRESHOLD = 9;

// ─── 루프 플래그 임계값 ──────────────────────────────

export const LOOP_THRESHOLDS = {
  DEJA_VU: 3,           // 기시감 표시
  NPC_REFERENCE: 5,     // NPC "전에도..." 류 대사
  CYNICAL_CHOICES: 10,  // 냉소적 선택지 추가
  SKIP_AVAILABLE: 20,   // 프롤로그 스킵 가능
  PILLAR_AWAKENING_1: 5,   // 손끝 발광
  PILLAR_AWAKENING_2: 10,  // NPC 반응
  PILLAR_AWAKENING_3: 20,  // 시간 정지 능력
  PILLAR_AWAKENING_4: 30,  // 기둥화 경고
} as const;

// ─── 엔딩 정의 ───────────────────────────────────────

export const ENDINGS: EndingDef[] = [
  // 지역 일반 엔딩 (9개)
  { id: 'NE01', title: '빛의 용사', subtitle: '아젤리아', category: 'normal', region: 'azelia', condition: {}, cgKey: 'cg_ne01', finalQuote: '용사님 만세! ...그런데 빛이, 조금 어두워진 것 같지 않나요?', mood: '겉으로는 해피엔딩, 씁쓸한 여운' },
  { id: 'NE02', title: '철의 병사', subtitle: '카이젤', category: 'normal', region: 'kaizer', condition: {}, cgKey: 'cg_ne02', finalQuote: '제국을 위하여... 영원히.', mood: '비극적 충성' },
  { id: 'NE03', title: '불꽃의 무사', subtitle: '솔라리스', category: 'normal', region: 'solaris', condition: {}, cgKey: 'cg_ne03', finalQuote: '태양이 뜨는 한, 불꽃은 꺼지지 않아.', mood: '당당하지만 닳아가는' },
  { id: 'NE04', title: '서리 사냥꾼', subtitle: '프로스트헬', category: 'normal', region: 'frosthel', condition: {}, cgKey: 'cg_ne04', finalQuote: '얼음 아래에서 무언가가 기다리고 있다... 언젠간.', mood: '불안한 평온' },
  { id: 'NE05', title: '무림의 검객', subtitle: '용화국', category: 'normal', region: 'yonghwa', condition: {}, cgKey: 'cg_ne05', finalQuote: '하늘이 정한 길을 걸었다. ...정말 내가 원한 길이었을까?', mood: '공허한 성공' },
  { id: 'NE06', title: '바다의 자유인', subtitle: '리베르타', category: 'normal', region: 'liberta', condition: {}, cgKey: 'cg_ne06', finalQuote: '수평선 끝에 뭐가 있을까... 돌아갈 곳?', mood: '자유롭지만 공허한' },
  { id: 'NE07', title: '하늘의 날개', subtitle: '셀레스티아', category: 'normal', region: 'celestia', condition: {}, cgKey: 'cg_ne07', finalQuote: '이 하늘은 아름답다. ...하지만 왜 이렇게 슬플까.', mood: '아름답고 슬픈' },
  { id: 'NE08', title: '대지의 장인', subtitle: '카즈모르', category: 'normal', region: 'kazmor', condition: {}, cgKey: 'cg_ne08', finalQuote: '가장 깊은 곳에서 가장 좋은 것이 나온다... 그렇지?', mood: '모르는 채 지나가는' },
  { id: 'NE09', title: '심해의 이방인', subtitle: '아비살', category: 'normal', region: 'abyssal', condition: {}, cgKey: 'cg_ne09', finalQuote: '빛이 닿지 않는 곳에서도 따뜻할 수 있다.', mood: '조용한 따뜻함' },

  // 관계 엔딩 (9개)
  { id: 'RE01', title: '가면 벗은 공주', subtitle: '에리나', category: 'relationship', region: 'azelia', condition: { requiredBonds: ['bond_erina'] }, cgKey: 'cg_re01', finalQuote: '', mood: '달콤쌉싸름' },
  { id: 'RE02', title: '전우의 자유', subtitle: '벨타', category: 'relationship', region: 'kaizer', condition: { requiredBonds: ['bond_velta'] }, cgKey: 'cg_re02', finalQuote: '', mood: '고통스러운 승리' },
  { id: 'RE03', title: '정령의 선택', subtitle: '나이라', category: 'relationship', region: 'solaris', condition: { requiredBonds: ['bond_naira'] }, cgKey: 'cg_re03', finalQuote: '', mood: '상실과 해방' },
  { id: 'RE04', title: '동토의 맹세', subtitle: '카이', category: 'relationship', region: 'frosthel', condition: { requiredBonds: ['bond_kai'] }, cgKey: 'cg_re04', finalQuote: '', mood: '고요한 신뢰' },
  { id: 'RE05', title: '천명을 넘어', subtitle: '설화', category: 'relationship', region: 'yonghwa', condition: { requiredBonds: ['bond_hyeonmu'] }, cgKey: 'cg_re05', finalQuote: '', mood: '해방과 설렘' },
  { id: 'RE06', title: '선배의 등', subtitle: '레온', category: 'relationship', region: 'liberta', condition: { requiredBonds: ['bond_leon'] }, cgKey: 'cg_re06', finalQuote: '', mood: '향수와 연대' },
  { id: 'RE07', title: '부러진 날개의 비상', subtitle: '아리엘', category: 'relationship', region: 'celestia', condition: { requiredBonds: ['bond_ariel'] }, cgKey: 'cg_re07', finalQuote: '', mood: '희망과 용기' },
  { id: 'RE08', title: '대장간의 불꽃', subtitle: '토르그 & 핌', category: 'relationship', region: 'kazmor', condition: { requiredBonds: ['bond_thorg'] }, cgKey: 'cg_re08', finalQuote: '', mood: '따뜻한 성취' },
  { id: 'RE09', title: '기억의 바다', subtitle: '아비게일', category: 'relationship', region: 'abyssal', condition: { requiredBonds: ['bond_abigail'] }, cgKey: 'cg_re09', finalQuote: '', mood: '깊고 슬프고 아름다운' },

  // 트루 엔딩 (3개)
  {
    id: 'TE01', title: '세계수의 심장', subtitle: '복원 엔딩', category: 'true',
    condition: { melodyComplete: true, minTruths: 6, requiredBonds: ['bond_blackrobe'] },
    cgKey: 'cg_te01', finalQuote: '고마웠어, 관찰자의 임무는 이제 끝이야.', mood: '숭고한 희생',
  },
  {
    id: 'TE02', title: '자유의 대가', subtitle: '파괴 엔딩', category: 'true',
    condition: { melodyComplete: true, minTruths: 6, minLoop: 20 },
    cgKey: 'cg_te02', finalQuote: '', mood: '자유와 상실',
  },
  {
    id: 'TE03', title: '10번째 기둥', subtitle: '공존 엔딩', category: 'true',
    condition: { melodyComplete: true, minTruths: 9, requiredBonds: ['bond_abigail', 'bond_marco'] },
    cgKey: 'cg_te03', finalQuote: '드디어... 10개의 기둥이 모두 섰군.', mood: '밝고 따뜻한 평화',
  },

  // 특수 엔딩 (3개)
  {
    id: 'SE01', title: '관광객', subtitle: '고독 엔딩', category: 'special',
    condition: { minLoop: 30, maxBonds: 0 },
    cgKey: 'cg_se01', finalQuote: '', mood: '공허와 공포',
  },
  {
    id: 'SE02', title: '세계수의 잎사귀', subtitle: '관측자 엔딩', category: 'special',
    condition: { requiredBonds: ['bond_marco'], customCondition: 'marco_observe_choice' },
    cgKey: 'cg_se02', finalQuote: '', mood: '기묘한 평온',
  },
  {
    id: 'SE03', title: '기둥이 된 자', subtitle: '각성 실패 엔딩', category: 'special',
    condition: { minLoop: 30, customCondition: 'pillar_awakening_4_no_true' },
    cgKey: 'cg_se03', finalQuote: '', mood: '비극, 메타적 암시',
  },
];

/** 총 엔딩 수 */
export const TOTAL_ENDINGS = ENDINGS.length; // 33
