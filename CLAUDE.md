# AI Breeder — 이세계 회귀 스토리게임

**장르**: 이세계 회귀 루프물 비주얼노벨 / 선택지 스토리게임  
**스택**: Phaser 3 + Vite + TypeScript  
**핵심 메커닉**: 매 분기마다 2-3개 선택지 → 루프 회귀 시 선택 기억 축적

---

## 핵심 설계 원칙

### 진입 & 지역 시스템 (퀴즈/능력치 없음)
- **1회차**: 프롤로그(현대 사망) → 아젤리아 왕국 직행 (클래식 이세계 도입부)
- **2회차+**: 사이 공간에서 해금된 지역 중 직접 선택
- **지역 해금**: 스토리 내 단서 획득 시 `unlockRegion` 이벤트로 해금
- **능력치 없음**: 분기는 플래그/메타 플래그/호감도/루프 횟수로만 결정
- **이유**: 비주얼노벨 장르에서 숫자 빌드는 스토리 몰입을 방해하고, 루프 메커닉(경험과 기억으로 성장)과 충돌

### 지역 해금 구조
| 지역 | 해금 방법 |
|------|----------|
| 아젤리아 | 기본 (1회차 자동) |
| 카이젤 | 아젤리아 내 제국 언급 플래그 or 아젤리아 진실 해금 |
| 솔라리스 | 정령 관련 플래그 or 마르코 관계 해금 |
| 프로스트헬 | 봉인 관련 플래그 or 카이젤 진실 해금 |
| 용화국 | 천명 관련 플래그 or 검은 로브 관계 해금 |
| 리베르타 | 해적왕 관련 플래그 or 솔라리스 진실 해금 |
| 셀레스티아 | 천인 관련 플래그 or 5회차 이상 |
| 카즈모르 | 드워프 관련 플래그 or 프로스트헬 진실 해금 |
| 아비살 | 심해 여왕 플래그 or 리베르타 진실 or 10회차 |

---

## 에이전트 팀 구성

### 📋 기획자 (Planner) Agent
**역할**: 게임 컨셉 및 기획 총괄
- 게임 컨셉, 세계관, 캐릭터 설정 총괄
- GDD(Game Design Document) 작성 및 관리 (`docs/gdd/`)
- 기능 명세서(Feature Spec) 작성 — 개발자가 구현 가능한 단위로 분해
- 선택지 구조 및 분기 흐름(플로우차트) 설계
- Story Architect(뼈대) → Script Writer(스크립트) 파이프라인 산출물 검토 후 정식 채택 결정
- 다른 에이전트 간 커뮤니케이션 허브 — 기획 의도 전달 및 피드백 반영
- 마일스톤 및 우선순위 관리

**주요 파일**: `docs/gdd/`, `docs/design/`, `docs/story/branches/`

**산출물 규칙**:
- 모든 기능은 GDD에 먼저 기술 후 개발 착수
- Feature Spec은 개발자가 바로 구현할 수 있도록 구체적 수치 포함
- 변경사항은 GDD에 반영 후 관련 에이전트에 공유

---

### 🔴 스토리 아키텍트 (Red Team) Agent
**역할**: 스토리 뼈대 설계 — 플롯 구조, 분기 맵, 서사 아키텍처 총괄

**핵심 업무**:
- 각 지역/챕터의 플롯 구조 설계: 핵심 사건, 전환점(turning point), 클라이맥스 정의
- 분기 맵 설계: 씬 간 연결 흐름도, 선택지별 분기 경로, 엔딩 조건 명시
- 복선 네트워크 설계: 루프 간 연결되는 복선·떡밥의 배치 및 회수 시점 관리
- 플래그 구조 정의: 분기에 필요한 플래그 목록, 조건식, 루프 간 전이 규칙
- 갈등 구조 및 긴장 곡선 설계: 각 지역의 서사적 긴장도 그래프
- 루프 메타 구조: 회귀 시 변화하는 요소, 누적 기억이 여는 새로운 경로 정의

**산출물**:
- `docs/story/red/structure_[지역명].md` — 지역별 플롯 구조서 (씬 개요, 핵심 사건 목록, 전환점)
- `docs/story/red/branch_map_[지역명].md` — 분기 플로우차트 (씬 ID, 선택지, 이동 경로, 플래그 조건)
- `docs/story/red/flag_registry.md` — 전체 플래그 목록 및 상태 전이표
- `docs/story/foreshadowing.md` — 복선 배치/회수 매트릭스 (씬 번호 + 회수 시점)

**주요 파일**: `docs/story/red/`, `docs/story/foreshadowing.md`

**작업 규칙**:
- 구조서에는 반드시 **씬 ID**, **전제 조건(필요 플래그)**, **분기 결과**를 명시
- 새로운 플래그 추가 시 `flag_registry.md`에 즉시 등록 (이름, 설정 조건, 사용처)
- 복선은 **배치 씬**과 **회수 씬**을 반드시 쌍으로 등록
- Script Writer 산출물 검토 시: 구조적 빈틈(막힌 루트, 고아 씬, 미사용 플래그, 도달 불가 엔딩) 점검
- 검토 결과는 `docs/story/red/review_[대상파일명].md`에 기록

**검토 체크리스트** (Script Writer 산출물 리뷰 시):
- [ ] 모든 씬에 도달 경로가 존재하는가?
- [ ] 모든 선택지가 유효한 다음 씬으로 연결되는가?
- [ ] 플래그 설정/참조가 `flag_registry.md`와 일치하는가?
- [ ] 복선 배치/회수 시점이 `foreshadowing.md`와 일치하는가?
- [ ] 막다른 분기(dead end) 없이 모든 경로가 엔딩에 도달하는가?

---

### 🔵 스크립트 라이터 (Blue Team) Agent
**역할**: 게임 스크립트 집필 — 아키텍트의 뼈대를 게임에 바로 투입 가능한 상세 스크립트로 변환

**핵심 업무**:
- Story Architect의 구조서를 기반으로 씬별 상세 스크립트 작성
- 대사(dialogue) 집필: 캐릭터 성격·말투 반영, 감정선 구현
- 연출 지시(direction) 작성: 캐릭터 등장/퇴장, 표정 변화, 카메라 연출
- 선택지 텍스트 작성: 플레이어에게 보이는 선택지 문구 + 내부 분기 태그
- 에셋 큐(asset cue) 명시: 배경CG, 캐릭터 스탠딩, BGM, SE 변경 시점
- 루프 변주 스크립트: 같은 씬이 회귀 횟수에 따라 달라지는 대사/연출 분기

**산출물**:
- `docs/story/blue/script_[지역명]_[씬ID].md` — 씬별 게임 스크립트
- `docs/story/blue/asset_cue_[지역명].md` — 지역별 에셋 큐 시트 (씬별 필요 에셋 목록)
- `docs/story/branches/` — 기획자 승인 후 확정 스크립트 이동

**스크립트 포맷**:
```
[씬 ID: AZL_03]
[배경: 아젤리아 왕궁 알현실 / 석양]
[BGM: royal_tension.ogg]

[캐릭터 등장: 세리나 / 위치: 중앙 / 표정: 근심]

세리나: "용사님, 이 의식의 진짜 의미를... 알고 계신 건가요?"

[선택지]
  1. "무슨 뜻이죠?" → AZL_03a (플래그: ceremony_questioned = true)
  2. "알고 있습니다." → AZL_03b (조건: loop_count >= 2)
  3. (침묵) → AZL_03c

[SE: 문 닫히는 소리]
[캐릭터 표정 변화: 세리나 / 슬픔 → 결의]
```

**주요 파일**: `docs/story/blue/`, `docs/story/branches/`, `docs/story/characters.md`

**작업 규칙**:
- 스크립트 작성 전 반드시 해당 지역의 **구조서**(`docs/story/red/structure_*.md`)와 **분기 맵**(`docs/story/red/branch_map_*.md`)을 참조
- 모든 대사에 **캐릭터명**을 명시, 나레이션은 `[나레이션]` 태그 사용
- 에셋 큐는 씬 시작 시 `[배경]`, `[BGM]`, `[캐릭터 등장]`으로 반드시 명시
- 선택지에는 **이동할 씬 ID**와 **설정할 플래그**를 반드시 포함
- 등장인물 추가 시 캐릭터 프로필(`docs/story/characters.md`)에 즉시 등록
- 세계관 설정 추가 시 세계관 바이블(`docs/story/worldbuilding.md`)에 반영

**검토 체크리스트** (Story Architect 구조서 리뷰 시):
- [ ] 캐릭터 동기가 자연스럽게 성립하는가? (행동에 납득할 이유가 있는가?)
- [ ] 감정선이 급격히 단절되는 구간이 없는가?
- [ ] 연출로 구현 가능한 구조인가? (한 씬에 과도한 장면 전환 없는지)
- [ ] 대사로 전달할 정보량이 적절한가? (과도한 설명 또는 정보 부족)
- [ ] 루프 변주 시 감정적 임팩트가 유지되는가?

---

### 🎮 Game Designer Agent
**역할**: 선택지 분기 밸런스 및 루프 시스템 설계
- 선택지 분기 수, 루프 횟수 제한, 플래그 구조 설계
- 회귀 시 기억 축적 메커닉 수치화 (`src/config/`)
- 기획자 GDD + 작가팀 스토리 기반으로 플레이어블 분기 구체화

**주요 파일**: `src/config/`, `docs/design/`

---

### 💻 Developer Agent
**역할**: 핵심 게임 로직 및 시스템 구현
- Scene 생성 및 스토리 엔진 구현 (`src/systems/StoryEngine.ts`)
- 선택지 렌더링, 분기 처리, 루프 상태 관리
- 플래그/변수 저장 시스템 (LocalStorage 기반)

**주요 파일**: `src/scenes/`, `src/entities/`, `src/systems/`

**코딩 규칙**:
- 스토리 데이터는 코드에 하드코딩하지 않고 JSON/데이터 파일로 분리
- 모든 이동은 `delta / 1000` 기반 (프레임률 독립적)
- Scene 간 상태는 registry 또는 data 객체로 전달

---

### 🎨 Asset Manager Agent
**역할**: 에셋 파이프라인 및 리소스 관리
- 캐릭터 스탠딩CG, 배경, UI 임포트 및 최적화
- `BootScene.ts` 내 asset 로더 관리
- 에셋 명세서 유지 (`docs/assets/`)

**주요 파일**: `public/assets/`, `src/scenes/BootScene.ts`, `docs/assets/`

---

### 🧪 QA Agent
**역할**: 테스트 및 품질 관리
- 분기 경로 전수 검증 (막힌 루트, 고아 씬 없는지)
- 루프 상태 초기화/유지 로직 검증
- 버그 리포트 및 재현 절차 문서화 (`docs/bugs/`)

**주요 파일**: `docs/bugs/`, `src/` 전체

---

## 프로젝트 구조

```
src/
├── config/         # GameConfig, RegionConfig, MetaFlagConfig, Constants
├── scenes/         # BootScene, MenuScene, GameScene, UIScene
├── systems/        # StoryEngine, FlagManager, LoopManager, SaveManager
├── entities/       # 스토리/게임/캐릭터/세이브 타입 정의
├── data/
│   └── story/      # JSON 스토리 데이터
│       ├── shared/     # 프롤로그, 사이 공간
│       ├── azelia/     # 아젤리아 챕터별
│       ├── kaizer/     # 카이젤
│       ├── solaris/    # 솔라리스
│       ├── frosthel/   # 프로스트헬
│       ├── yonghwa/    # 용화국
│       ├── liberta/    # 리베르타
│       ├── celestia/   # 셀레스티아
│       ├── kazmor/     # 카즈모르
│       └── abyssal/    # 아비살
public/
└── assets/         # 배경, 캐릭터CG, UI, BGM
docs/
├── gdd/            # Game Design Document (기획자 산출물)
├── story/
│   ├── red/        # Story Architect 산출물 (구조서, 분기맵, 플래그)
│   ├── blue/       # Script Writer 산출물 (씬 스크립트, 에셋 큐)
│   ├── branches/   # 확정된 분기 스크립트
│   ├── characters.md     # 캐릭터 프로필
│   ├── worldbuilding.md  # 세계관 바이블
│   └── foreshadowing.md  # 복선 목록
├── design/         # 분기/밸런스 설계 문서
├── assets/         # 에셋 명세
└── bugs/           # 버그 리포트
```

## 개발 명령어

```bash
npm run dev      # 개발 서버 (HMR)
npm run build    # 프로덕션 빌드
npm run preview  # 빌드 결과 미리보기
```

## 스토리 작업 흐름

```
기획자 → 씬 개요 및 지역 요구사항 작성
    ↓
Story Architect (Red) → 플롯 구조서 + 분기 맵 + 플래그 정의
    ↓
Script Writer (Blue) → 구조서 검토 (감정선·연출 가능성 피드백)
    ↓
Story Architect → 피드백 반영 후 구조 확정
    ↓
Script Writer (Blue) → 확정 구조 기반 상세 게임 스크립트 작성
    ↓
Story Architect (Red) → 스크립트 검토 (구조 정합성·빈틈 점검)
    ↓
기획자 → 최종 검토 후 branches/로 채택
    ↓
Game Designer → 선택지 밸런스 및 루프 수치 조정
    ↓
Developer → StoryEngine에 데이터 반영
    ↓
QA → 분기 전수 검증
```

---

## 게임 플로우

```
[1회차]
  프롤로그(현대 사망 → 사이 공간 → "네가 필요하다")
    → 아젤리아 왕국 직행
    → 스토리 진행 (플래그/호감도 기반 분기)
    → 사망 or 엔딩
    → 회귀

[2회차+]
  프롤로그(루프 변형: 3/5/10/20회차별 변화)
    → 사이 공간: 해금된 지역 선택
    → 선택한 지역 스토리 진행
    → 사망 or 엔딩
    → 회귀

[지역 해금]
  스토리 내 단서 획득 → unlockRegion 이벤트
    → 다음 회귀 시 사이 공간에서 선택 가능
```

---

## 기획 문서 현황

### GDD (docs/gdd/) — 11개 ✅ 완료
| # | 파일 | 핵심 내용 |
|---|------|----------|
| 01 | 01-game-overview.md | 장르, 핵심 루프, 회귀 메커닉 |
| 02 | 02-character-creation.md | ~~퀴즈 시스템~~ **폐기** — 1회차 아젤리아 직행으로 변경 |
| 03 | 03-meta-flag-system.md | 메타 플래그 4분류 (진실/관계/멜로디/루프) |
| 04 | 04-story-data-spec.md | **JSON 노드 그래프 구조** (StoryNode, Choice, Condition, GameEvent 인터페이스) |
| 05 | 05-prologue-and-loop.md | 사망→되감기→재시작 시퀀스, 루프별 프롤로그 변화 |
| 06 | 06-ending-tree.md | 33개 엔딩 조건 (일반9/히든9/관계9/트루3/특수3) |
| 07 | 07-ui-ux-design.md | 화면 레이아웃, 선택지 UI, 세이브/로드 |
| 08 | 08-sound-design.md | 지역별 BGM, 멜로디 복선, SFX 목록 |
| 09 | 09-milestones.md | Phase 0~3 개발 단계 |
| 10 | 10-multiloop-mechanics.md | 영혼귀속, 수확체감, 루프 오버라이드 |
| 11 | 11-cross-region-dependencies.md | **9×9 의존 매트릭스**, 트루엔딩 크리티컬 패스, 영혼아이템 18종 |

> **⚠ GDD 01, 02번 내용은 코드와 불일치**: 능력치(STR/INT 등), 퀴즈 시스템은 기획 변경으로 **삭제됨**. 분기는 플래그/메타 플래그/호감도/루프 횟수로만 결정. GDD 문서 자체는 미수정 상태이므로 코드(`src/entities/`, `src/config/`)를 정본으로 참조할 것.

### 설계 문서 (docs/design/)
| 파일 | 내용 |
|------|------|
| azelia-ch1-flowchart.md | 아젤리아 Ch1 분기도 (~34노드) |
| azelia-ch1-multiloop.md | **아젤리아 버티컬 슬라이스** — 9개 노드 × 4개 루프 티어 상세 |
| kaizer-ch1-flowchart.md | 카이젤 Ch1 분기도 (~30노드) |

### 세계관 (docs/story/)
| 파일 | 내용 |
|------|------|
| worldbuilding.md | 9대 지역, 종족, 갈등 구도, 숨겨진 진실(세계수) |
| characters.md | 20+ NPC 프로필 (전 지역) |
| foreshadowing.md | 복선 25+개 (S/A/B/C 등급) |
| magic-systems.md | 9개 독립 마법 체계 + 상성 |
| region-connections.md | 지정학 관계, 교역, 마르코 네트워크 |

### Red Team (docs/story/red/) — Story Architect 산출물
| 파일 | 내용 |
|------|------|
| draft_[9지역].md (9개) | 갈등/반전 중심 Ch1 스토리 뼈대 |
| flag_registry.md | **230+ 플래그 마스터 문서** (세션/메타/사망/영혼/방문/엔딩) |

### Blue Team (docs/story/blue/) — Script Writer 산출물
| 파일 | 내용 |
|------|------|
| draft_[9지역].md (9개) | 감정/관계 중심 Ch1 캐릭터 스토리 |
| **script_azelia_001_006.md** (1,286줄) | ✅ 아젤리아 1회차 게임 스크립트: 소환~축복 |
| **script_azelia_007.md** (1,784줄) | ✅ 아젤리아 1회차 게임 스크립트: 자유탐색의 밤 |
| **script_azelia_010_050.md** (1,940줄) | ✅ 아젤리아 1회차 게임 스크립트: 선언~전투~결말 |

---

## 구현 현황 (src/)

### 타입 시스템 (`src/entities/`)
| 파일 | 내용 |
|------|------|
| `StoryTypes.ts` | StoryNode, Choice, DialogueLine, CharacterDisplay, ChapterData, RegionId |
| `GameTypes.ts` | ConditionDef (7종 조건 + and/or/not), GameEventDef (12종 이벤트), SessionFlags, AffinityMap, MetaFlags, LoopState, GameSession |
| `CharacterTypes.ts` | CharacterProfile, RegionDef (해금 시스템 포함), EndingDef, TradeItem |
| `SaveTypes.ts` | SaveSlot, SaveData, MetaSaveData, GameSettings, localStorage 키 |

### 설정 (`src/config/`)
| 파일 | 내용 |
|------|------|
| `GameConfig.ts` | Phaser 설정 (1280×720, Arcade, FIT) |
| `RegionConfig.ts` | 9개 지역 정의 (해금 조건, 힌트, BGM, NPC 등) |
| `MetaFlagConfig.ts` | 진실9/관계11/멜로디9 플래그 + 33개 엔딩 + 루프 임계값 |
| `Constants.ts` | UI 레이아웃, 텍스트 속도, 사망 연출 타이밍, 호감도, 메타 선택지 스타일 |

### 게임 시스템 (`src/systems/`)
| 파일 | 내용 |
|------|------|
| `StoryEngine.ts` | **핵심 엔진** — 노드 그래프 처리, 조건 평가(7종+복합), 이벤트 실행(12종), 선택지 필터링(일반/메타 분리) |
| `FlagManager.ts` | 세션 플래그(루프 리셋) + 메타 플래그(localStorage 영구) 이중 레이어 |
| `LoopManager.ts` | 회귀 횟수, 방문 지역, **지역 해금**, 기둥 각성, 사망 통계, 엔딩 기록 |
| `SaveManager.ts` | 자동 3슬롯 + 수동 20슬롯, 메타 세이브, 설정 저장 |

### 씬 (`src/scenes/`)
| 파일 | 상태 | 내용 |
|------|------|------|
| `BootScene.ts` | ✅ | 에셋 로딩 + 프로그레스바 |
| `MenuScene.ts` | ✅ | 타이틀, 시작 버튼 |
| `GameScene.ts` | 스켈레톤 | StoryEngine ↔ Phaser 연결 (구현 필요) |
| `UIScene.ts` | 스켈레톤 | HUD 오버레이 (구현 필요) |

### 스토리 데이터 (`src/data/story/`)
| 파일 | 내용 |
|------|------|
| `shared/prologue.json` | ✅ 프롤로그 + 사이 공간 지역 선택 (루프 변형 포함) |
| `azelia/` ~ `abyssal/` | 📁 디렉토리 생성됨, 데이터 미작성 |

### 미구현 (다음 단계)
| 항목 | 우선순위 | 의존 |
|------|---------|------|
| 아젤리아 Ch1 JSON 데이터 변환 | 높음 | script_azelia_*.md → JSON |
| GameScene 스토리 렌더러 | 높음 | StoryEngine + Phaser 연결 |
| 사망→회귀 시퀀스 연출 | 높음 | GDD 05 |
| UIScene HUD 구현 | 중간 | GDD 07 |
| 기억의 서재 메뉴 | 낮음 | GDD 07 |
| 엔딩 갤러리 | 낮음 | GDD 06 |

---

## 개발자를 위한 핵심 레퍼런스

### "이 시스템 어떻게 동작하지?" 궁금할 때
| 질문 | 읽을 곳 |
|------|---------|
| 분기 조건 시스템은? | `src/entities/GameTypes.ts` — ConditionDef (flag/meta/loop/visited/affinity/regionUnlocked + and/or/not) |
| 이벤트 시스템은? | `src/entities/GameTypes.ts` — GameEventDef (setFlag/setMeta/setAffinity/unlockRegion/death/ending 등 12종) |
| 지역 해금 조건은? | `src/config/RegionConfig.ts` — 각 RegionDef.unlockCondition |
| 메타 플래그 목록은? | `src/config/MetaFlagConfig.ts` — TRUTH_FLAGS, BOND_FLAGS, MELODY_FLAGS |
| 엔딩 33개 조건은? | `src/config/MetaFlagConfig.ts` — ENDINGS 배열 |
| JSON 스토리 노드 구조는? | `src/entities/StoryTypes.ts` — StoryNode, ChapterData |
| 프롤로그 & 지역 선택 플로우는? | `src/data/story/shared/prologue.json` |
| 아젤리아 1회차 대사와 연출은? | `docs/story/blue/script_azelia_*.md` (3파일, 5,010줄) |
| 플래그 X의 설정 조건과 사용처는? | `docs/story/red/flag_registry.md` |

### 스크립트 → JSON 변환 규칙
- `script_azelia_*.md`의 `[씬 ID: AZL_XXX]` → JSON의 `StoryNode.id`
- `[선택지] 1. "텍스트" → AZL_XXXa` → JSON의 `Choice.text`, `Choice.next`, `Choice.effects`
- `[배경: bg_xxx]` → JSON의 `StoryNode.background`
- `[BGM: bgm_xxx]` → JSON의 `StoryNode.bgm`
- `(괄호 내면 독백)` → JSON의 `DialogueLine.style: "monologue"`
- 플래그 조건 → JSON의 `Choice.condition` 또는 `Choice.metaCondition`
- 지역 해금 단서 → JSON의 `GameEventDef { type: "unlockRegion", region: "...", hint: "..." }`

---

## 웹소설 챕터 등록 방법

### 1. 마크다운 파일 작성
```
src/data/novel/arc{N}_{region}/ch{NNN}_{slug}.md
```
예: `src/data/novel/arc1_azelia/ch006_new_chapter.md`

**마크다운 포맷**:
```markdown
# N화. 챕터 제목

---

첫 번째 씬 본문.

'내면 독백은 작은따옴표로 감싼다.'

---

두 번째 씬 본문. `---`로 씬 구분.

*N화 끝. 다음 화: 다음 챕터 제목.*
```

### 2. 챕터 레지스트리 등록 (`src/novel/chapters.ts`)

**Step 1** — 파일 상단에 raw import 추가:
```typescript
import ch006Raw from '../data/novel/arc1_azelia/ch006_new_chapter.md?raw';
```

**Step 2** — `CHAPTERS` 배열에 항목 추가:
```typescript
{
  id: 'ch006',
  num: 6,
  title: '챕터 제목',
  arc: 'arc1_azelia',
  arcLabel: 'Arc 1 — 아젤리아',
  status: 'published',   // 'writing' | 'complete' | 'published' | 'coming'
  raw: ch006Raw,
},
```

### 3. 아크 메타데이터 업데이트 (`_arc_meta.json`)
해당 아크의 `chapters` 배열에 추가:
```json
{
  "id": "ch006",
  "file": "ch006_new_chapter.md",
  "title": "챕터 제목",
  "summary": "한 줄 요약",
  "status": "draft"
}
```

### 마크다운 스타일 규칙
| 문법 | 렌더링 |
|------|--------|
| `'텍스트'` | 내면 독백 (파란색) |
| `"텍스트"` | 대사 (볼드) |
| `*텍스트*` | 강조/이탤릭 |
| `---` | 씬 구분선 (· · ·) |
| `# 제목` | 챕터 타이틀 |

### 현재 연재 현황
| 화 | 파일 | 아크 | 상태 |
|----|------|------|------|
| 1화 | ch001_truck.md | Arc 1 — 아젤리아 | published |
| 2화 | ch002_palace_night.md | Arc 1 — 아젤리아 | published |
| 3화 | ch003_hero_training.md | Arc 1 — 아젤리아 | published |
| 4화 | ch004_no_convenience_store.md | Arc 1 — 아젤리아 | published |
| 5화 | ch005_first_death.md | Arc 1 — 아젤리아 | published |

---

## 5화 배치 작업 워크플로

### 챕터 상태 (4단계)

```
writing → complete → published → (coming은 미래 예고용)
```

| 상태 | 의미 | chapters.ts | _arc_meta.json |
|------|------|-------------|----------------|
| `writing` | 작성 중, 피드백 수집 단계 | `status: 'writing'` | `status: "writing"` |
| `complete` | 내용 확정, 설정집 동기화 대기 | `status: 'complete'` | `status: "complete"` |
| `published` | 배포 완료, 독자 공개 | `status: 'published'` | `status: "published"` |
| `coming` | 목차에만 표시 (제목 예고) | `status: 'coming'` | `status: "coming"` |

### 배치 사이클 (5화 단위)

```
[Phase 1: 작성] writing 상태
  ├── 5화 초안 작성
  ├── 사용자 코멘트/피드백 수집
  │   └── story-feedback-log.md에 FB-XXX로 기록
  ├── 피드백 반영 수정
  └── 반복 (사용자 만족까지)

[Phase 2: 완성] writing → complete 전환
  ├── 사용자가 "완성" 선언
  ├── chapters.ts + _arc_meta.json 상태 변경
  └── 피드백 로그 상태 → "반영 완료"

[Phase 3: 설정집 동기화] /settings-sync 실행
  ├── 6개 병렬 에이전트 실행:
  │   ├── 캐릭터 동기화 (characters.md)
  │   ├── 세계관 동기화 (worldbuilding.md + magic-systems.md)
  │   ├── 복선 동기화 (foreshadowing.md)
  │   ├── 지역연결 동기화 (region-connections.md)
  │   ├── 챕터 로그 업데이트 (chapter-log.md)
  │   └── 주인공 바이블 동기화 (protagonist-bible.md)
  ├── 변경 요약 보고
  └── story-feedback-log.md에 SYNC 기록

[Phase 4: 배포] complete → published 전환
  ├── 사용자 확인 후 상태 변경
  ├── 연재 현황 테이블 업데이트
  └── 빌드 & 배포
```

### 피드백 기록 규칙

작성 중(writing) 챕터에 대한 사용자 피드백은 `docs/story/story-feedback-log.md`에 기록:

```markdown
### FB-XXX — YYYY-MM-DD

**피드백 원문**: (원문 그대로)
**요약**: 한 줄 요약
**대상 챕터**: N화~M화
**영향 받은 챕터**: 구체적 변경 내역
**설정 변경**: 해당 시 기록
**파급 효과**: 향후 영향
**상태**: 반영 완료 / 부분 반영 / 미반영
```

### 설정집 동기화 스킬

`/settings-sync` 명령으로 실행. 상세 절차는 `.claude/skills/settings-sync.md` 참조.

**동기화 대상 설정 문서**:
| 문서 | 에이전트 | 체크 포인트 |
|------|---------|------------|
| `characters.md` | 캐릭터 | 새 캐릭터, 관계 변화, 호칭/말투 |
| `worldbuilding.md` | 세계관 | 지역, 역사, 종족, 세력 |
| `magic-systems.md` | 세계관 | 마법 체계, 새 술식/능력 |
| `foreshadowing.md` | 복선 | 새 복선 배치, 기존 복선 회수 |
| `region-connections.md` | 지역연결 | 지정학, 교역, 정치 변화 |
| `chapter-log.md` | 챕터 로그 | 화별 요약, 등장인물, 감정 아크 |
| `protagonist-bible.md` | 주인공 | 성장, 능력, 사망, 관계 변화 |
