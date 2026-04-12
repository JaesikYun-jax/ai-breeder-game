# 04. 스토리 데이터 구조 스펙

## 개요

스토리 콘텐츠는 코드에서 완전히 분리하여 JSON 데이터로 관리.  
Developer Agent는 StoryEngine을, 작가팀은 JSON 데이터를 관리.

---

## 스토리 노드 구조

스토리는 **노드(Node) 그래프**로 구성. 각 노드는 하나의 "장면"이며, 텍스트 + 선택지 + 이벤트를 포함.

```typescript
interface StoryNode {
  id: string;                    // 고유 ID: "azelia_ch1_001"
  region: string;                // 소속 지역: "azelia"
  chapter: number;               // 챕터 번호
  
  // 씬 연출
  background: string;            // 배경 이미지 key
  bgm?: string;                  // BGM key (변경 시에만)
  sfx?: string;                  // 효과음 key
  
  // 캐릭터 표시
  characters: CharacterDisplay[];
  
  // 텍스트
  dialogue: DialogueLine[];
  
  // 분기
  choices?: Choice[];            // 선택지 (없으면 자동 진행)
  next?: string;                 // 자동 진행 시 다음 노드 ID
  
  // 이벤트
  onEnter?: GameEvent[];         // 노드 진입 시 실행
  onExit?: GameEvent[];          // 노드 퇴장 시 실행
  
  // 조건부 표시
  condition?: Condition;         // 이 노드에 도달하기 위한 조건
}

interface CharacterDisplay {
  id: string;                    // 캐릭터 ID
  sprite: string;                // 스프라이트 키 (표정/포즈)
  position: "left" | "center" | "right";
  animation?: "fadeIn" | "slideIn" | "shake";
}

interface DialogueLine {
  speaker?: string;              // 화자 이름 (null = 나레이션)
  text: string;                  // 대사 텍스트
  expression?: string;           // 화자 표정 변경
  speed?: "slow" | "normal" | "fast";  // 텍스트 출력 속도
  effect?: "shake" | "fade" | "flash"; // 화면 이펙트
}

interface Choice {
  text: string;                  // 선택지 텍스트
  next: string;                  // 선택 시 이동할 노드 ID
  condition?: Condition;         // 선택지 표시 조건
  effects?: GameEvent[];         // 선택 시 발생 이벤트
  
  // 메타 플래그 관련
  metaLabel?: string;            // 회귀 플레이어에게만 보이는 라벨
  metaCondition?: Condition;     // 메타 플래그 기반 조건
}

interface Condition {
  type: "flag" | "stat" | "meta" | "loop" | "and" | "or" | "not";
  
  // flag 조건
  flag?: string;
  value?: boolean;
  
  // stat 조건
  stat?: "STR" | "INT" | "CHA" | "PER" | "FAT";
  min?: number;
  max?: number;
  
  // meta 조건
  metaFlag?: string;
  
  // loop 조건
  minLoop?: number;
  
  // 복합 조건
  conditions?: Condition[];
}

interface GameEvent {
  type: "setFlag" | "setMeta" | "addStat" | "setAffinity" 
      | "playSound" | "screenEffect" | "death" | "ending";
  
  // setFlag / setMeta
  flag?: string;
  value?: boolean;
  
  // addStat
  stat?: string;
  amount?: number;
  
  // setAffinity
  character?: string;
  delta?: number;
  
  // death
  deathType?: "combat" | "trap" | "betrayal" | "sacrifice" | "accident";
  
  // ending
  endingId?: string;
}
```

---

## 예시: 아젤리아 챕터 1 오프닝

```json
{
  "id": "azelia_ch1_001",
  "region": "azelia",
  "chapter": 1,
  "background": "bg_azelia_throne_room",
  "bgm": "bgm_azelia_royal",
  "characters": [
    { "id": "erina", "sprite": "erina_smile", "position": "right", "animation": "fadeIn" }
  ],
  "dialogue": [
    { "text": "눈을 떠보니 거대한 대리석 홀이었다.", "speed": "slow" },
    { "text": "천장에서 빛이 쏟아져 내렸고, 수십 명의 시선이 나를 향하고 있었다." },
    { "speaker": "에리나", "text": "마침내... 용사님이 소환되셨군요.", "expression": "erina_relieved" },
    { "text": "금발의 소녀가 손을 내밀었다. 눈은 웃고 있었지만, 어딘가 피곤해 보였다." }
  ],
  "choices": [
    {
      "text": "손을 잡는다.",
      "next": "azelia_ch1_002a",
      "effects": [
        { "type": "addStat", "stat": "CHA", "amount": 1 },
        { "type": "setAffinity", "character": "erina", "delta": 5 }
      ]
    },
    {
      "text": "주변을 먼저 살핀다.",
      "next": "azelia_ch1_002b",
      "effects": [
        { "type": "addStat", "stat": "PER", "amount": 1 }
      ]
    },
    {
      "text": "\"여기가 어디지?\" 라고 묻는다.",
      "next": "azelia_ch1_002c",
      "effects": [
        { "type": "addStat", "stat": "INT", "amount": 1 }
      ]
    }
  ]
}
```

### 메타 플래그 기반 추가 선택지 예시

```json
{
  "text": "\"...에리나, 대신관을 조심해.\"",
  "next": "azelia_ch1_002d_meta",
  "metaCondition": {
    "type": "meta",
    "metaFlag": "truth_azelia"
  },
  "metaLabel": "[이전 기억]",
  "effects": [
    { "type": "setAffinity", "character": "erina", "delta": 15 },
    { "type": "setFlag", "flag": "erina_warned_early", "value": true }
  ]
}
```

---

## 파일 구조

```
src/data/
├── story/
│   ├── azelia/
│   │   ├── chapter1.json      # 챕터 1 노드 배열
│   │   ├── chapter2.json
│   │   └── endings.json       # 엔딩 노드들
│   ├── kaizer/
│   │   └── ...
│   └── shared/
│       ├── prologue.json      # 현대 사망 → 전이 공통 프롤로그
│       ├── quiz.json          # 성격 퀴즈 노드
│       └── loop_return.json   # 회귀 시 공통 연출
├── characters.json            # 캐릭터 메타데이터
├── flags.json                 # 플래그 초기값 정의
└── meta_flags.json            # 메타 플래그 정의
```

---

## StoryEngine 책임 범위

```
StoryEngine
├── loadChapter(region, chapter)   // JSON 로드
├── processNode(nodeId)            // 현재 노드 처리
├── evaluateCondition(condition)   // 조건 평가
├── executeEvent(event)            // 이벤트 실행
├── getAvailableChoices()          // 조건 만족하는 선택지만 필터
├── selectChoice(choiceIndex)      // 선택 → 다음 노드 이동
├── triggerDeath(deathType)        // 사망 → 회귀 처리
└── checkEnding()                  // 엔딩 조건 확인

FlagManager
├── getFlag(key)
├── setFlag(key, value)
├── getMetaFlag(key)               // localStorage 기반
├── setMetaFlag(key, value)        // localStorage 기반
└── resetSessionFlags()            // 회귀 시 일반 플래그만 초기화

LoopManager
├── getLoopCount()
├── incrementLoop()
├── getVisitedRegions()
├── addVisitedRegion(region)
├── getPillarAwakeningLevel()
└── save() / load()                // localStorage
```

---

## 텍스트 연출 규칙

| 상황 | 연출 |
|------|------|
| 일반 대화 | 타이핑 효과 (글자 하나씩) |
| 독백/내레이션 | 이탤릭 + 느린 타이핑 |
| 충격적 발견 | 화면 흔들림 + 효과음 |
| 회상 | 세피아 필터 + 반투명 |
| 메타 선택지 등장 | 글리치 이펙트 + 특수 색상 |
| 사망 직전 | 붉은 비네팅 + 역재생 느낌 |
| 회귀 연출 | 화면 깨짐 → 되감기 → 퀴즈/선택 화면 |
