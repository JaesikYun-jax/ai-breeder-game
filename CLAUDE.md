# AI Breeder — D급 스킬 이세계 용사

**장르**: 이세계 선형 멸망 저지물 (회귀·루프 없음, 9개 기둥 차례로 치유)
**스택**: Vite + TypeScript (웹소설 리더 SPA)
**정식 제목**: 「D급 스킬 이세계 용사」
**주인공**: 강지호 (28세, 삼류 프로그래머 → 이세계 용사 → Part 2부터 아젤리아 부왕)

---

## 프로젝트 개요

이세계 선형 웹소설을 집필하고, 자체 제작 웹 리더앱으로 배포하는 1인 프로젝트.
2026-04-13 게임(Phaser 3 비주얼노벨) → 선형 웹소설로 피봇.
2026-04-18 Part 2 설계 확정 — 회귀 루프 컨셉 폐기, 70화 골격 + 노화·희생 엔딩 비전.

**핵심 컨셉**:
- Part 1 (ch001~020, 완결): 코미디→고통 낙차. D급 재생 + 무재능 = 다중 체계 흡수 가능. 결혼으로 마무리.
- Part 2 (ch021~070, 진행 예정): 변두리 부강화 + 멸망 저지의 전모 노출 + 첫 아들 탄생까지.
- Part 3 (ch071~, 미설계): 아들 성장 + 모든 기둥 치유 + 지호의 노화·죽음 (해피&새드 엔딩).

**세계관**: 9대 지역, 9기둥 = 이계 차단 배리어. 기둥 소멸 시 → 배리어 off → 이계 괴물 침략 → 세계 병합. 빌런(천인 평의회 등)은 의도적으로 기둥 약화 가속화.

---

## 프로젝트 구조

```
src/
├── novel/              # 웹소설 리더 앱
│   ├── main.ts         # 엔트리포인트
│   ├── chapters.ts     # 챕터 레지스트리 (raw import + 메타데이터)
│   ├── renderer.ts     # 마크다운 → HTML 렌더러
│   ├── feedback.ts     # 인라인 피드백 UI
│   └── styles.css      # 리더 스타일
├── data/novel/         # 챕터 원본 마크다운 (Vite 번들 대상)
│   ├── arc1_azelia/    # 1~5화
│   ├── arc2_solaris/   # 6~13화 (연재 중)
│   ├── arc3_kaizer/    # (피봇 전 잔존 파일, 미사용)
│   └── british_food/   # 별도 프로젝트
│
projects/                          # 집필 파이프라인 워크스페이스
├── dclass-hero/
│   ├── novel-config.md            # 중앙 설정 (가드레일, 아크 매핑, 에이전트 설정)
│   ├── revision/                  # 진행 추적
│   │   ├── create-plan.md
│   │   ├── fix_plan.md
│   │   ├── learnings.md
│   │   └── alive-tracker.md
│   └── _workspace/                # 에이전트 중간 산출물
│       ├── 01_chapter-architect_blueprint_chXXX.md
│       ├── 02_continuity-bridge_report_chXXX.md
│       └── ...
├── british-food/
│   └── novel-config.md
│
docs/story/                        # 설정 바이블 (novel-config.md가 참조)
│   ├── characters.md              # 캐릭터 프로필
│   ├── worldbuilding.md           # 세계관
│   ├── magic-systems.md           # 마법 체계
│   ├── foreshadowing.md           # 복선 배치/회수
│   ├── protagonist-bible.md       # 주인공 성장 추적
│   ├── death-and-regression.md    # 사망·회귀 메커닉
│   ├── voice-guide.md             # 캐릭터별 보이스 가이드
│   ├── tone-and-style.md          # 톤/스타일 규칙
│   ├── story-framework-6-30.md    # 6~30화 플롯 프레임워크
│   ├── chapter-log.md             # 화별 요약 로그
│   ├── timeline.md                # 작중 시간선
│   ├── glossary.md                # 용어집
│   ├── region-connections.md      # 지정학·교역
│   ├── story-feedback-log.md      # 피드백 기록
│   ├── inline-feedback.json       # 인라인 피드백 데이터
│   ├── red/                       # Story Architect 산출물 (게임 시절)
│   └── blue/                      # Script Writer 산출물 (게임 시절)
│
.claude/
├── agents/                        # 파이프라인 에이전트 정의
│   ├── chapter-architect.md       # 설계도 추출
│   ├── continuity-bridge.md       # 연속성 수집
│   ├── chapter-creator.md         # 본문 집필
│   ├── quality-verifier.md        # 8축 품질 검증 (create용)
│   ├── rule-checker.md            # 4축 규칙 위반 진단 (AITONE 30+패턴)
│   ├── story-analyst.md           # 9축 서사 분석
│   ├── alive-enhancer.md          # ALIVE 4축 캐릭터 생동감 (침묵 전담)
│   ├── revision-executor.md       # 15계층 우선순위 교정 + 2패스 AITONE 자기검증
│   └── revision-reviewer.md       # 4항 diff 기반 교정 검증
└── skills/
    ├── create.md                  # /create — 챕터 집필 파이프라인
    ├── polish.md                  # /polish — 챕터 윤문 파이프라인
    ├── settings-sync.md           # /settings-sync — 설정집 동기화
    └── apply-feedback.md          # /apply-feedback — 인라인 피드백 적용
```

## 개발 명령어

```bash
npm run dev      # 개발 서버 (HMR) — 리더앱에서 챕터 읽기
npm run build    # 프로덕션 빌드
npm run preview  # 빌드 결과 미리보기
```

---

## 집필 파이프라인 (통합 모드, 2026-04-19~)

**핵심 변경**: `/create` 호출 한 번으로 **창작 → 검증 → 폴리시**까지 자동 진행.
컨텍스트 효율화로 챕터당 토큰 ~600k (이전 ~1M에서 -40%).

### 통합 흐름 (/create 한 번 호출)

```
[CREATE]                                              [POLISH 자동 연계]
Phase 1 (병렬)        Phase 2 (순차)    Phase 3       Phase 4 (병렬 진단)        Phase 5 (조건부)
┌──────────┐         ┌──────────┐     ┌──────────┐   ┌──────────────┐         ┌──────────┐
│ architect│         │  creator │     │ verifier │   │ rule-checker │         │ executor │
│ (설계도)  │──┐      │  (본문)  │────▶│  (8축)   │──▶│ story-analyst│──CRIT───▶│  (교정)   │
└──────────┘  │      └──────────┘     └────┬─────┘   │alive-enhancer│   or    └────┬─────┘
┌──────────┐  ├─────▶                      │         └──────────────┘   조기종료     │
│ bridge   │──┘            ◀── REWRITE ────┘                              │       reviewer
│ (연속성)  │                                                              │
└──────────┘                                                          최종 fix_plan + 등록
```

### 컨텍스트 효율화 원칙

**필수 읽기 (모든 에이전트 공통)**: `docs/story/canon-quickref.md` — 정본 12개를 압축한 단일 매뉴얼 (~7k tokens)
**선택 읽기**: 챕터 특수 디테일이 필요할 때만 원본 정본 1~2개 추가
**금지**: Glob 디렉토리 탐색, 명시되지 않은 파일 자발적 탐색, 12개 정본 풀 로딩

**조기 종료 게이트 (Polish Phase 4 후)**:
- 3개 진단 모두 CRITICAL=0 + MAJOR=0 + 분량/금지표현 상한 위반 0 → **executor·reviewer 스킵 직접 PASS**
- 그 외 → Phase 5 풀 사이클

### 에이전트 역할

| 에이전트 | 역할 | 1차 참조 |
|---------|------|---------|
| chapter-architect | 설계도 추출 (플롯 비트, 씬 구성, 가드레일 체크리스트) | canon-quickref + plot framework 해당 챕터 |
| continuity-bridge | 직전 1화 상태 + 활성 복선 + 비언어 메모리 변주 | canon-quickref + 직전 1화 + alive-tracker |
| chapter-creator | 본문 집필 (1인칭, Part 2 톤, 분량 5~7천자) | 설계도 + 연속성 보고서 + canon-quickref |
| quality-verifier | 8축 검증 (PLOT_BEAT, TIMELINE, REGRESSION, GUARDRAIL, CONTINUITY, HOOK, CHAR_VOICE, CUSTOM) | 챕터 + 설계도 + canon-quickref |
| rule-checker | 4축 (BANNED, VOICE, TITLE, TRANS) + Part 2 §11~16 | canon-quickref + 챕터 |
| story-analyst | 9축 (SCENE/LOGIC/HOOK/OPENING/PACING/TONEDROP + REGRESSION/FORESHADOW/MODERN_REF) | canon-quickref + 챕터 + 직전 1화 |
| alive-enhancer | 4축 (메아리, 침묵→비언어, 조연 긴장, 관계 곡선) | canon-quickref + 챕터 + alive-tracker |
| revision-executor | 15계층 우선순위 교정 + 2패스 AITONE 자기검증 | 진단 보고서 3개 + 챕터 |
| revision-reviewer | 4항 diff 기반 검증 → PASS/REVISE | 수정본 + changelog + 진단 |

### 챕터 등록 자동화 (Step 5)

PASS 후 자동 수행:
1. `_arc_meta.json`에 챕터 추가
2. `chapters.ts`에 import + CHAPTERS 배열 등록
3. `novel-config.md` §10 status 표 갱신
4. **자동 폴리시 연계** (Step 6 → Phase 4 진단 → 조기종료 또는 Phase 5)
5. `npm run dev` 리더에서 즉시 확인

### /polish 단독 호출

`/polish dclass-hero ch022` 같이 단독 호출 시에도 동일한 조기종료 게이트 적용. 이미 PASS인 화 재폴리시 시 토큰 효율.

---

## 웹소설 챕터 등록 방법

### 1. 마크다운 파일 작성
```
src/data/novel/arc{N}_{region}/{num}_{한글제목}.md
```
예: `src/data/novel/arc2_solaris/13_열사병은 걸리지 않는다.md`

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
import ch013Raw from '../data/novel/arc2_solaris/13_열사병은 걸리지 않는다.md?raw';
```

**Step 2** — `CHAPTERS` 배열에 항목 추가:
```typescript
{
  id: 'ch013',
  num: 13,
  title: '열사병은 걸리지 않는다',
  arc: 'arc2_solaris',
  arcLabel: 'Arc 2 — 솔라리스',
  projectId: 'dclass-hero',
  status: 'writing',
  raw: ch013Raw,
},
```

### 3. 아크 메타데이터 업데이트 (`_arc_meta.json`)
해당 아크의 `chapters` 배열에 추가:
```json
{
  "id": "ch013",
  "file": "13_열사병은 걸리지 않는다.md",
  "title": "열사병은 걸리지 않는다",
  "summary": "한 줄 요약",
  "status": "writing"
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

---

## 현재 연재 현황 (2026-04-20 기준)

| 범위 | 아크 | 상태 |
|------|------|------|
| ch001~005 | Arc 1 — 아젤리아 | writing (Part 1 초안 완료) |
| ch006~013 | Arc 2 — 솔라리스 | writing |
| ch014~020 | Arc 3 — 각성과 귀환 | writing |
| **ch021~028** | **Arc 4 — 내정의 해** | **writing (8화 폴리시 PASS, 정본 동기화 완료)** |
| ch029~ | Arc 5~10 | 미착수 (각 아크 진입 시 plan 작성) |

**통합 모드 진행 통계 (Arc 4)**: 챕터당 평균 ~600k tokens, /create 한 번 호출로 창작+폴리시 자동 완료, 폴리시 조기 종료 게이트 도입.

**상세 화별 표**: `projects/dclass-hero/novel-config.md` §10 참조 (자동 갱신).

### 아크 구조 (novel-config.md / story-framework-21-70.md 참조)

**Part 1 (ch001~020, 완결)**
| 아크 | 범위 | 지역 | 상태 |
|------|------|------|------|
| arc1_azelia | ch001~005 | 아젤리아 왕국 | 초안 완료 |
| arc2_solaris | ch006~013 | 솔라리스 사막 | 초안 완료 |
| arc3_awakening | ch014~020 | 아젤리아 귀환·심판·결혼 | 초안 완료 |

**Part 2 (ch021~070, 진행 중)**
| 아크 | 범위 | 테마 | 상태 |
|------|------|------|------|
| arc4_internal | ch021~028 | 내정의 해 (부왕 정착 + 마르코 진실 + 카이젤 사절 + 임신 + 솔라리스 동맹) | **8화 완료** |
| arc5_caravan | ch029~034 | 사막의 캐러밴 (천막 기술·솔라리스 부강·정령석 사치품 본격) | 매크로 비트 / 진입 시 plan 필요 |
| arc6_kaizer | ch035~042 | 강철의 궁정 (카이젤 외교·내전·기둥 치유) | 매크로 비트 / 진입 시 plan 필요 |
| arc7_frosthel | ch043~050 | 얼어붙은 경계 (프로스트헬·천인 윤곽 + 첫 흰머리) | 매크로 비트 |
| arc8_dragon | ch051~058 | 천명 너머 (용화국·빌런 동기 노출) | 매크로 비트 |
| arc9_liberta | ch059~064 | 파도의 맹세 (리베르타·레온·이계 침공 조짐) | 매크로 비트 |
| arc10_return | ch065~070 | 돌아온 자 (귀환·아들 출산·Part 3 훅) | 매크로 비트 |

**Part 3 (ch071~, 미설계)**: 셀레스티아·카즈모르·아비살 + 천인 평의회 본진 + 모든 기둥 치유 → 노화·희생 엔딩

### 화 단위 plan 작성 시점

- **매크로 (아크 테마·외부 조력자·비장의 무기 시연 시점)** = ch070까지 정해짐 (story-framework-21-70.md)
- **마이크로 (화별 4씬 비트)** = Arc 4까지만 정해짐. **각 아크 진입 시 `arcN_plan_chXXX-YYY.md` 작성** (Arc 4 plan = `projects/dclass-hero/_workspace/arc4_plan_ch022-025.md` 형식 참조)

### 한 번에 create할 화수 권장 (ch021~028 경험 기반)

| 시나리오 | 권장 화수 | 이유 |
|---|---|---|
| 새 아크 첫 화 (ch029, ch035, ch043 등) | **1화 단독** | 톤·외부 조력자·신규 캐릭터 정착 검증 필요 |
| 흐름 정착된 중반 | **2~3화 묶음** | 사건 밀도·복선 분배 흐름 유지 |
| 아크 피날레 / 대형 사건 | **1화 단독** | 시연 임팩트·엔딩 훅 비중 큼 |

**4~5화 한 번에 비추천** — 컨텍스트 폭발 + 누적 오류 + 사용자 중간 검토 기회 상실. 새 아크는 항상 첫 화 단독 후 사용자 리더 검토 → 진행 결정.

---

## 보존 가드레일 (novel-config.md §4 — 16개 규칙)

**원칙 1~10 (전 시기 적용):**
1. 재생 스킬은 D급 — 1인칭 시점이 아닌 제3자가 언급할 때만 등급 노출
2. 모래시계 = **세상 모든 기둥의 잔여 시간 카운트다운 지표** (Part 2 RETCON, 지호 도구 X)
3. 기둥 치유 순서: 빛(ch019) → 태양(ch021) → 강철(Arc 6) → 빙(Arc 7) → ... (설계문서 순서 엄수)
4. 1인칭 시점 유지 (강지호)
5. IT/프로그래머 비유는 챕터당 최대 3회
6. **Part 2 톤 공식 — 코미디 2 : 비장 5 : 반전 3** (Part 1은 3:5:2)
7. 마르코는 최소 등장 — 떡밥만 뿌리고 사라짐 (안내자, 정체 모호 양면성 유지)
8. 사망 묘사는 감각 중심 (시각적 고어 금지)
9. 현대 지식 활용은 canon-quickref §3 부강 에피소드 범위만 (증기·화약·금속야금·전기 자체 발전 금지)
10. 정령 계약의 수명 대가 — 일반 술사는 머리색 탈색·수명 단축 / 지호는 D급 재생 덕에 미미 (단 기둥 치유는 본인 수명 직접 지불, Part 3 회수)

**원칙 11~16 (Part 2~ 신규):**
11. **모래시계 도구화 금지** — 들여다본다·관찰 OK / 흔들기·발동·돌리기 절대 금지
12. **정령 다중 계약 시 머리색 변화 챕터당 1줄 이내** (Arc 7부터 흰머리 1가닥 시작)
13. **아젤리아 혁신 = 프로그래머 가능 범위만** (canon-quickref §3 비장의 무기 3종)
14. **영웅적 결의 대사 절대 금지** — 행동만 영웅, 독백은 자조 (ch021~028 8화 모두 0회 일관)
15. **챕터 분량 5,000~7,000자 (공백 포함)** — Part 2 신규 분량 룰
16. **한 줄 단락 5~7회 이내**, 1인칭 독백 60% 이하

**기둥 치유 메커닉 (Part 2 보강):** 3단 조건 (물리 접촉 + 디버깅 미니 시퀀스 + 외부 조력자 협력) + 매 지역 새 풀이 + 본인 수명 미세 지불. "손만 대면 해결" 절대 X.

---

## 작업 워크플로

### 챕터 집필 흐름
```
1. 자연어 명령 ("13화 써줘" / "다음 화 집필")
2. novel-config.md에서 프로젝트 설정 로드
3. /create 파이프라인 실행 (4 에이전트)
4. 리더앱에서 읽기 → 피드백
5. /polish 파이프라인 실행 (5 에이전트, 17축 진단)
6. 만족 시 → /settings-sync로 설정집 동기화
```

### 챕터 상태 (4단계)
```
writing → complete → published → (coming은 미래 예고용)
```

### 피드백 시스템
- **인라인 피드백**: 리더에서 텍스트 드래그 → 코멘트 → `inline-feedback.json`에 축적 → `/apply-feedback`으로 적용
- **스토리 피드백**: `story-feedback-log.md`에 FB-XXX로 기록

### 설정집 동기화 (`/settings-sync`)
6개 병렬 에이전트가 챕터 내용을 설정 문서에 반영:
| 문서 | 체크 포인트 |
|------|------------|
| characters.md | 새 캐릭터, 관계 변화, 호칭/말투 |
| worldbuilding.md + magic-systems.md | 지역, 마법 체계 |
| foreshadowing.md | 복선 배치/회수 |
| region-connections.md | 지정학, 교역 |
| chapter-log.md | 화별 요약, 등장인물 |
| protagonist-bible.md | 성장, 능력, 사망, 관계 |

---

## 설계 문서 현황

### 설정 바이블 (docs/story/) — 핵심 참조
| 파일 | 내용 |
|------|------|
| worldbuilding.md | 9대 지역, 종족, 갈등 구도, 세계수 |
| characters.md | 20+ NPC 프로필 |
| protagonist-bible.md | 강지호 성장 추적 (능력, 사망, 관계) |
| foreshadowing.md | 복선 25+개 (S/A/B/C 등급) |
| magic-systems.md | 9개 마법 체계 + 상성 |
| death-and-regression.md | 사망·회귀 메커닉 상세 |
| voice-guide.md | 캐릭터별 말투/어조 가이드 |
| tone-and-style.md | 톤, 금지 표현, 문체 규칙 |
| story-framework-6-30.md | 6~30화 플롯 프레임워크 |
| chapter-log.md | 화별 요약 로그 |
| timeline.md | 작중 시간선 |
| glossary.md | 용어집 |
| region-connections.md | 지역 간 관계, 교역 |

### GDD (docs/gdd/) — 게임 시절 산출물, 세계관 참고용
11개 문서 존재. **게임 메커닉(분기, 플래그, 엔딩 등)은 폐기**되었으나 세계관/캐릭터/지역 설정은 여전히 유효.

### Red/Blue Team (docs/story/red/, blue/) — 게임 시절 산출물
게임 스크립트 형식이나 세계관/캐릭터 배경 설정은 참고 가능.

---

## 핵심 레퍼런스

| 질문 | 읽을 곳 |
|------|---------|
| 프로젝트 전체 설정은? | `projects/dclass-hero/novel-config.md` |
| N화 플롯 비트는? | `docs/story/story-framework-6-30.md` |
| 캐릭터 X의 말투는? | `docs/story/voice-guide.md` |
| 복선 X의 배치/회수는? | `docs/story/foreshadowing.md` |
| 사망·회귀 규칙은? | `docs/story/death-and-regression.md` |
| 금지 표현 목록은? | `docs/story/tone-and-style.md` |
| 파이프라인 에이전트 동작은? | `.claude/agents/*.md` |
| 스킬 실행 절차는? | `.claude/skills/*.md` |
| 챕터 등록 방법은? | 이 파일의 "웹소설 챕터 등록 방법" 섹션 |
