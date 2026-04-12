# AI Breeder — Game Project

Phaser 3 + Vite + TypeScript 기반 2D 웹 게임 프로젝트.

---

## 에이전트 팀 구성

### 📋 기획자 (Planner) Agent
**역할**: 게임 컨셉 및 기획 총괄
- 게임 컨셉, 세계관, 스토리, 캐릭터 설정
- GDD(Game Design Document) 작성 및 관리 (`docs/gdd/`)
- 기능 명세서(Feature Spec) 작성 — 개발자가 구현 가능한 단위로 분해
- 유저 플로우(씬 전환, UX 흐름) 설계
- 다른 에이전트 간 커뮤니케이션 허브 — 기획 의도 전달 및 피드백 반영
- 마일스톤 및 우선순위 관리

**주요 파일**: `docs/gdd/`, `docs/design/`

**산출물 규칙**:
- 모든 기능은 GDD에 먼저 기술 후 개발 착수
- Feature Spec은 개발자가 바로 구현할 수 있도록 구체적 수치 포함
- 변경사항은 GDD에 반영 후 관련 에이전트에 공유

---

### 🎮 Game Designer Agent
**역할**: 레벨 디자인 및 밸런스 설계
- 레벨 구조, 적 배치, 난이도 곡선 설계
- 수치 밸런싱 (`src/config/` 내 상수 관리)
- 기획자 GDD 기반으로 플레이어블 레벨 구체화

**주요 파일**: `src/config/`, `docs/design/`

---

### 💻 Developer Agent
**역할**: 핵심 게임 로직 및 시스템 구현
- Scene 생성 및 게임 로직 구현
- Entity/Component 시스템 설계 (`src/entities/`)
- Physics, Input, Animation 처리

**주요 파일**: `src/scenes/`, `src/entities/`, `src/systems/`

**코딩 규칙**:
- 모든 이동은 `delta / 1000` 기반 (프레임률 독립적)
- Scene 간 상태는 registry 또는 data 객체로 전달
- 스프라이트시트 로드 전 반드시 프레임 크기 측정
- Physics: 기본 Arcade, 물리 퍼즐만 Matter 고려

---

### 🎨 Asset Manager Agent
**역할**: 에셋 파이프라인 및 리소스 관리
- 스프라이트, 타일셋, 사운드 임포트 및 최적화
- `BootScene.ts` 내 asset 로더 관리
- 에셋 명세서 유지 (`docs/assets/`)

**주요 파일**: `public/assets/`, `src/scenes/BootScene.ts`, `docs/assets/`

**규칙**:
- 스프라이트시트 로드 시 반드시 실제 픽셀 크기 측정
- 프레임 간 spacing 확인 필수

---

### 🧪 QA Agent
**역할**: 테스트 및 품질 관리
- 게임플레이 시나리오 검증
- 성능 프로파일링 (60fps 유지)
- 버그 리포트 및 재현 절차 문서화 (`docs/bugs/`)

**주요 파일**: `docs/bugs/`, `src/` 전체

---

## 프로젝트 구조

```
src/
├── config/         # GameConfig, 상수, 밸런스 수치
├── scenes/         # BootScene, MenuScene, GameScene, UIScene
├── entities/       # Player, Enemy, 기타 게임 오브젝트
├── systems/        # Input, Audio, State 등 시스템
public/
└── assets/         # 이미지, 스프라이트시트, 사운드
docs/
├── gdd/            # Game Design Document (기획자 산출물)
├── design/         # 레벨/밸런스 설계 문서
├── assets/         # 에셋 명세
└── bugs/           # 버그 리포트
```

## 개발 명령어

```bash
npm run dev      # 개발 서버 (HMR)
npm run build    # 프로덕션 빌드
npm run preview  # 빌드 결과 미리보기
```

## Physics 선택 기준

| 상황 | 선택 |
|------|------|
| 플랫포머, 슈터, 대부분의 2D | Arcade |
| 물리 퍼즐, 래그돌 | Matter |
| 메뉴, 카드게임 | None |
