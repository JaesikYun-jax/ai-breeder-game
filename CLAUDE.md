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
- Red/Blue 작가팀 산출물 검토 후 정식 스토리 채택 결정
- 다른 에이전트 간 커뮤니케이션 허브 — 기획 의도 전달 및 피드백 반영
- 마일스톤 및 우선순위 관리

**주요 파일**: `docs/gdd/`, `docs/design/`, `docs/story/branches/`

**산출물 규칙**:
- 모든 기능은 GDD에 먼저 기술 후 개발 착수
- Feature Spec은 개발자가 바로 구현할 수 있도록 구체적 수치 포함
- 변경사항은 GDD에 반영 후 관련 에이전트에 공유

---

### ✍️ 스토리 작가 Red Team Agent
**역할**: 갈등·긴장·반전 중심 스토리 라인 집필
- 루프 구조의 비극적 측면, 복선, 다크한 엔딩 라인 담당
- 클리셰를 의식적으로 비틀거나 해체하는 방향 제안
- 적대 세력·빌런·세계의 모순 등 갈등 구조 설계
- Blue Team 초안에 대한 날카로운 비판·대안 제시
- 선택지 중 "뒤통수치는" 선택지 및 트루엔딩 루트 설계

**주요 파일**: `docs/story/red/`, `docs/story/branches/`

**작업 규칙**:
- 초안은 항상 `docs/story/red/draft_[씬명].md`에 작성
- Blue Team 초안 검토 시 구체적 반론+대안을 함께 제시
- 반전·복선은 씬 번호와 함께 복선 목록(`docs/story/foreshadowing.md`)에 등록

---

### ✍️ 스토리 작가 Blue Team Agent
**역할**: 세계관·감정·관계 중심 스토리 라인 집필
- 이세계 세계관 구축, 등장인물 감정선, 성장 서사 담당
- 루프 회귀 시 주인공의 심리 변화·정서적 피로감 묘사
- 클리셰를 충실히 활용하되 캐릭터 깊이로 차별화
- Red Team 제안에 대한 감정적·서사적 맥락 보완
- 선택지 중 "훈훈하거나 감동적인" 루트 및 일반 엔딩 설계

**주요 파일**: `docs/story/blue/`, `docs/story/branches/`

**작업 규칙**:
- 초안은 항상 `docs/story/blue/draft_[씬명].md`에 작성
- 등장인물 추가 시 캐릭터 프로필(`docs/story/characters.md`)에 즉시 등록
- 세계관 설정 추가 시 세계관 바이블(`docs/story/worldbuilding.md`)에 반영

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
│   ├── red/        # Red Team 초안
│   ├── blue/       # Blue Team 초안
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
기획자 → 씬 개요 작성
    ↓
Red Team / Blue Team → 각자 초안 작성 (병렬)
    ↓
기획자 → 두 초안 검토 후 채택/병합 결정
    ↓
Game Designer → 선택지 분기 구조로 변환
    ↓
Developer → StoryEngine에 데이터 반영
    ↓
QA → 분기 전수 검증
```
