# AI Breeder — 이세계 회귀 스토리게임

**장르**: 이세계 회귀 루프물 비주얼노벨 / 선택지 스토리게임  
**스택**: Phaser 3 + Vite + TypeScript  
**핵심 메커닉**: 매 분기마다 2-3개 선택지 → 루프 회귀 시 선택 기억 축적

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
├── config/         # GameConfig, 분기 상수, 루프 설정
├── scenes/         # BootScene, MenuScene, StoryScene, UIScene
├── systems/        # StoryEngine, FlagManager, LoopManager
├── entities/       # 스토리 데이터 타입 정의
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

## 기획 문서 현황 (총 ~19,000줄)

### GDD (docs/gdd/) — 11개 ✅ 완료
| # | 파일 | 핵심 내용 |
|---|------|----------|
| 01 | 01-game-overview.md | 장르, 핵심 루프, 회귀 메커닉, 능력치 5종(STR/INT/CHA/PER/FAT) |
| 02 | 02-character-creation.md | 성격 퀴즈 5문항 → 9개 진입점 매핑 공식 |
| 03 | 03-meta-flag-system.md | 메타 플래그 4분류 (진실/관계/멜로디/루프) |
| 04 | 04-story-data-spec.md | **JSON 노드 그래프 구조** (StoryNode, Choice, Condition, GameEvent 인터페이스) |
| 05 | 05-prologue-and-loop.md | 사망→되감기→재시작 시퀀스, 루프별 프롤로그 변화 |
| 06 | 06-ending-tree.md | 33개 엔딩 조건 (일반9/히든9/관계9/트루3/특수3) |
| 07 | 07-ui-ux-design.md | 화면 레이아웃, 선택지 UI, 세이브/로드 |
| 08 | 08-sound-design.md | 지역별 BGM, 멜로디 복선, SFX 목록 |
| 09 | 09-milestones.md | Phase 0~3 개발 단계 |
| 10 | 10-multiloop-mechanics.md | **스탯체크 3단계**, 영혼귀속(스탯+아이템), 수확체감, 루프 오버라이드 |
| 11 | 11-cross-region-dependencies.md | **9×9 의존 매트릭스**, 트루엔딩 크리티컬 패스, 영혼아이템 18종 |

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

### 완료된 코드
| 파일 | 상태 | 내용 |
|------|------|------|
| `config/GameConfig.ts` | ✅ | Phaser 설정 (1280×720, Arcade, FIT) |
| `config/Constants.ts` | ✅ | UI 레이아웃, 텍스트 속도, 메타 선택지 스타일 |
| `config/MetaFlagConfig.ts` | ✅ | 메타 플래그 키 상수 |
| `config/RegionConfig.ts` | ✅ | 9개 지역 ID/이름 매핑 |
| `entities/GameTypes.ts` | ✅ | GameSession, PlayerStats, DeathType 등 |
| `entities/StoryTypes.ts` | ✅ | StoryNode, Choice, Condition, ChapterData 등 |
| `entities/SaveTypes.ts` | ✅ | SaveSlot, MetaSaveData 구조 |
| `entities/CharacterTypes.ts` | ✅ | NPC 메타데이터 타입 |
| `scenes/BootScene.ts` | ✅ | 에셋 로딩 + 프로그레스바 |
| `scenes/MenuScene.ts` | ✅ | 타이틀, 시작 버튼, 루프 카운트 |
| `scenes/GameScene.ts` | ✅ | **StoryEngine ↔ Phaser 연결** (타이핑, 선택지 UI, 사망 연출) |
| `scenes/UIScene.ts` | ✅ | HUD 오버레이 (루프 카운트, ESC 힌트) |
| `systems/StoryEngine.ts` | ✅ | **핵심 엔진** (노드 처리, 조건 평가, 이벤트 실행, 선택지 필터링) |
| `systems/FlagManager.ts` | ✅ | 세션 플래그 + 메타 플래그 (localStorage) |
| `systems/LoopManager.ts` | ✅ | 회귀 횟수, 방문 지역, 기둥 각성 레벨 |
| `systems/SaveManager.ts` | ✅ | localStorage 세이브/로드 |
| `data/story/shared/prologue.json` | ✅ | 프롤로그 스토리 데이터 |

### 미구현 (다음 단계)
| 항목 | 우선순위 | 의존 문서 |
|------|---------|----------|
| `SoulManager.ts` | 높음 | GDD 10 (영혼귀속 시스템) |
| `DiminishingManager.ts` | 높음 | GDD 10 (수확체감) |
| `StoryEngine` 스탯체크 확장 | 높음 | GDD 10 (3단계 스탯체크) |
| `StoryEngine` 루프 오버라이드 | 높음 | GDD 10 (JSON 오버라이드) |
| 아젤리아 Ch1 JSON 데이터 변환 | 높음 | script_azelia_*.md → JSON |
| 성격 퀴즈 씬 | 중간 | GDD 02 |
| 사망→회귀 시퀀스 연출 | 중간 | GDD 05 |
| 기억의 서재 메뉴 | 낮음 | GDD 07 |
| 엔딩 갤러리 | 낮음 | GDD 06 |

---

## 개발자를 위한 핵심 레퍼런스

### "이 시스템 어떻게 동작하지?" 궁금할 때
| 질문 | 읽을 문서 |
|------|----------|
| 스탯 체크가 어떻게 분기하는가? | `docs/gdd/10-multiloop-mechanics.md` §A |
| 영혼 스탯/아이템이 루프 간 어떻게 전달되는가? | `docs/gdd/10-multiloop-mechanics.md` §B |
| 같은 이벤트 반복 시 보상이 줄어드는 공식은? | `docs/gdd/10-multiloop-mechanics.md` §C |
| 다른 지역에서 온 플래그가 여기서 뭘 여는가? | `docs/gdd/11-cross-region-dependencies.md` |
| JSON 스토리 노드 구조는? | `docs/gdd/04-story-data-spec.md` |
| 아젤리아 1회차에서 어떤 선택지가 어디로 연결되는가? | `docs/design/azelia-ch1-flowchart.md` |
| 아젤리아가 루프 2/3/5에서 어떻게 달라지는가? | `docs/design/azelia-ch1-multiloop.md` |
| 플래그 X의 설정 조건과 사용처는? | `docs/story/red/flag_registry.md` |
| 아젤리아 1회차 실제 대사와 연출은? | `docs/story/blue/script_azelia_*.md` (3파일, 5,010줄) |

### 스크립트 → JSON 변환 규칙
- `script_azelia_*.md`의 `[씬 ID: AZL_XXX]` → JSON의 `StoryNode.id`
- `[선택지] 1. "텍스트" → AZL_XXXa (CHA+1)` → JSON의 `Choice.text`, `Choice.next`, `Choice.effects`
- `[배경: bg_xxx]` → JSON의 `StoryNode.background`
- `[BGM: bgm_xxx]` → JSON의 `StoryNode.bgm`
- `(괄호 내면 독백)` → JSON의 `DialogueLine.speaker = null` (나레이션 처리)
- `[스탯 체크: STR >= 5]` → JSON의 `Choice.statCheck` (GDD 10 참조)
