---
name: polish
description: "웹소설 챕터 윤문 오케스트레이터. 17축 진단(규칙 4축 + 서사 9축 + ALIVE 4축)으로 문체, 정합성, 캐릭터 생동감을 교정한다. AITONE 30+패턴 탐지 + 2패스 자기검증으로 AI글투를 근절한다. '/polish', '/polish dclass-hero', '/polish ch006', '/polish dclass-hero ch006-ch012' 로 실행."
user-invocable: true
---

# 챕터 윤문 오케스트레이터

3개 진단 에이전트(병렬) → 교정 실행(2패스 AITONE 자기검증 포함) → 교정 검증의 5-에이전트 파이프라인.

## 아키텍처

```
Phase 1 (병렬 진단)              Phase 2 (순차 교정)     Phase 3 (순차 검증)
┌──────────────────┐
│  rule-checker    │──┐
│  (4축 규칙 위반)   │  │         ┌──────────────┐    ┌──────────────┐
└──────────────────┘  │         │  revision-   │    │  revision-   │
┌──────────────────┐  ├────────▶│  executor    │───▶│  reviewer    │
│  story-analyst   │──┤         │  (15단계 교정) │    │  (4항 검증)   │
│  (9축 서사 분석)   │  │         └──────────────┘    └──────┬───────┘
└──────────────────┘  │                 ◀── REVISE (max 1) ─┘
┌──────────────────┐  │                        │
│  alive-enhancer  │──┘                  PASS ───▶ fix_plan.md 갱신
│  (4축 생동감)     │
└──────────────────┘
```

**축 구성 (17축)**:
- Part A — 위반 (rule-checker 4축): BANNED, VOICE, TITLE, TRANS(MORPH/AITONE 30+패턴/SEMANTIC)
- Part B — 서사 (story-analyst 9축): SCENE, LOGIC(TIMELINE/NUMBER/PLAUSIBILITY), HOOK, OPENING, PACING, TONEDROP + Custom(REGRESSION, FORESHADOW, MODERN_REF)
- ALIVE (alive-enhancer 4축): ALIVE-1(메아리), ALIVE-2(침묵→비언어 전담), ALIVE-3(조연 긴장), ALIVE-4(관계 곡선)

## 전제 조건

1. `projects/{project}/novel-config.md` 존재
2. 대상 챕터 파일이 `{chapter_dir}/{arc_dir}/`에 존재
3. character_detail(voice-guide.md) 존재

## 인자 파싱

| 입력 형태 | 해석 |
|----------|------|
| `/polish` | 프로젝트 자동 감지, fix_plan.md의 다음 미완료 챕터 |
| `/polish dclass-hero` | dclass-hero, fix_plan.md의 다음 미완료 챕터 |
| `/polish ch006` | 프로젝트 자동 감지, ch006만 |
| `/polish dclass-hero ch006` | dclass-hero, ch006만 |
| `/polish dclass-hero ch006-ch012` | dclass-hero, ch006~ch012 범위 |

---

## 실행 흐름

### Step 0: 초기화

#### 0.1 프로젝트 결정

- $ARGUMENTS에서 프로젝트명 추출
- 프로젝트명 지정 없으면: `projects/` 디렉토리에서 `novel-config.md`가 있는 디렉토리 탐색
- `status: "completed"` 프로젝트는 제외
- `novel-config.md`가 여러 개면: 사용자에게 선택 요청

#### 0.2 novel-config.md 필수 필드 검증 게이트

```
필수 필드 체크리스트:
- [ ] project.chapter_dir — 챕터 저장 디렉토리
- [ ] project.work_dir — 작업 디렉토리
- [ ] 설정문서 매핑.character_detail — 보이스표 경로 + 파일 존재
- [ ] 설정문서 매핑.death_regression — 기둥 메커닉 경로 + 파일 존재
- [ ] 설정문서 매핑.tone_style — 톤/스타일 경로 + 파일 존재
- [ ] 아크 범위 테이블 — 최소 1개 행 존재
```

검증 실패 시:
```
❌ novel-config.md 필수 필드 누락: {누락 필드 목록}
polish 스킬을 실행하려면 위 필드를 채워주세요.
```

#### 0.3 설정 파싱

```
{CONFIG}          ← novel-config.md 전체
{CHAPTER_DIR}     ← config.chapter_dir
{WORK_DIR}        ← config.work_dir
{WORKSPACE_DIR}   ← config.workspace_dir
{GUARD_RAILS}     ← config 보존 가드레일 (§4)
{CUSTOM_AXES}     ← config 커스텀 축 (§5)
{CREATE_CFG}      ← config create 설정 (§6, 훅 목표/분량 범위 참조)
```

#### 0.4 챕터 범위 & 아크 결정

1. 지정 챕터가 있으면 해당 범위 사용
2. 없으면 `{WORK_DIR}/fix_plan.md`에서 다음 미완료(`[ ]`) 챕터 확인
3. fix_plan.md가 없거나 비어 있으면: 현재 `writing` 상태의 모든 챕터를 대상으로 fix_plan.md 자동 생성
4. 대상 챕터 번호 → 아크 범위 테이블에서 아크 + 파일 경로 확인
5. 챕터 파일이 존재하지 않으면 에러 출력 후 해당 챕터 건너뜀

#### 0.5 workspace 디렉토리 확인

`{WORKSPACE_DIR}` 존재 확인 (없으면 생성).

#### 0.6 fix_plan.md 생성/갱신

fix_plan.md가 없으면 생성:
```markdown
# 윤문 계획
## 대상: ch{start}~ch{end}
- [ ] ch{NNN} — 미착수
...
```

기존 fix_plan.md가 있으면: 새로운 대상 챕터를 추가 (중복 제거).

---

### Step 1: Phase 1 — 3-에이전트 병렬 진단

세 에이전트를 **병렬로** (한 메시지에 Agent 3회 호출) 실행한다.

> **에이전트 공통 경로 제한 지시** (프롬프트에 반드시 포함):
> "아래 명시된 파일 경로만 읽어라. 디렉토리를 Glob으로 탐색하거나,
> 명시되지 않은 파일을 스스로 찾아 읽으려 시도하지 마라."

## 컨텍스트 효율화 원칙 (2026-04-19~)

**필수 읽기 (모든 진단 에이전트 공통)**: `docs/story/canon-quickref.md` — 정본 12개 압축본
**선택 읽기**: 챕터 본문 + 직전 1화 본문만 (직후 화는 chapter-log.md 줄 요약으로 대체)
**금지**: characters.md, voice-guide.md, worldbuilding.md, foreshadowing.md, magic-systems.md, death-and-regression.md 등 원본 정본 풀 로딩

**Agent 1: rule-checker** (`run_in_background: true`)
- 에이전트 정의: `.claude/agents/rule-checker.md` 읽으라고 지시
- 읽기: **canon-quickref.md** (보이스·금지표현·가드레일 §11~16) + 챕터 파일만
- 출력: `{WORKSPACE_DIR}/07_rule-checker_report_ch{NNN}.md` (간결 모드, 200~400자 요약 + 위반 라인 표)

**Agent 2: story-analyst** (`run_in_background: true`)
- 에이전트 정의: `.claude/agents/story-analyst.md` 읽으라고 지시
- 읽기: **canon-quickref.md** + 챕터 파일 + 직전 1화 본문 + 설계도(blueprint, 있으면)
- 출력: `{WORKSPACE_DIR}/07_story-analyst_report_ch{NNN}.md` (간결 모드)

**Agent 3: alive-enhancer** (`run_in_background: true`)
- 에이전트 정의: `.claude/agents/alive-enhancer.md` 읽으라고 지시
- 읽기: **canon-quickref.md** (캐릭터 보이스·시그니처 비언어) + 챕터 파일 + 직전 1화 + alive-tracker.md
- 출력: `{WORKSPACE_DIR}/07_alive-enhancer_report_ch{NNN}.md` + alive-tracker.md 갱신

**Phase 1 대기**: 배경 에이전트 완료 알림. sleep/polling 금지.

### 🚨 조기 종료 게이트 (2026-04-19~)

3개 진단 보고서 모두 다음 조건 충족 시 **executor·reviewer 풀 사이클 스킵**:
- CRITICAL = 0
- MAJOR = 0
- 분량 가드레일 (5,000~7,000자) 위반 없음
- 금지 표현 상한 위반 없음

→ 오케스트레이터가 직접 fix_plan에 PASS 기록, 다음 챕터로 이동.
→ 토큰 절감: executor 70~95k + reviewer 85k = **155~180k/챕터 절약** (~30~35%)

WARN/MINOR만 있는 경우도 조기 종료 가능 (사용자 선호에 따라 운영).
CRITICAL ≥ 1 OR MAJOR ≥ 1 → Phase 2/3 풀 사이클로 진행.

---

### Step 2: Phase 2 — 교정 실행 (순차)

Phase 1 완료 후 revision-executor 실행.

**Agent 4: revision-executor**
- 에이전트 정의: `.claude/agents/revision-executor.md` 읽으라고 지시
- 프롬프트에 포함:
  - 3개 진단 보고서 경로:
    - `{WORKSPACE_DIR}/07_rule-checker_report_ch{NNN}.md`
    - `{WORKSPACE_DIR}/07_story-analyst_report_ch{NNN}.md`
    - `{WORKSPACE_DIR}/07_alive-enhancer_report_ch{NNN}.md`
  - 챕터 파일 경로 (Edit 대상)
  - character_detail: `{CONFIG.character_detail}` (보이스 수정 참조)
  - death_regression: `{CONFIG.death_regression}` (수치 수정 참조)
  - novel-config.md 경로 (가드레일, 수치 우선순위)
  - 경로 제한 지시
- 출력:
  - 수정된 챕터 파일 (in-place Edit)
  - `{WORKSPACE_DIR}/07_revision-executor_changelog_ch{NNN}.md`

---

### Step 3: Phase 3 — 교정 검증 (순차)

revision-executor 완료 후 revision-reviewer 실행.

**Agent 5: revision-reviewer**
- 에이전트 정의: `.claude/agents/revision-reviewer.md` 읽으라고 지시
- 프롬프트에 포함:
  - 수정된 챕터 파일 경로
  - changelog: `{WORKSPACE_DIR}/07_revision-executor_changelog_ch{NNN}.md`
  - 3개 원본 진단 보고서 경로
  - timeline: `{CONFIG.timeline}`
  - death_regression: `{CONFIG.death_regression}`
  - foreshadowing: `{CONFIG.foreshadowing}`
  - protagonist_bible: `{CONFIG.protagonist_bible}`
  - novel-config.md 경로 (가드레일, 수치 우선순위, create 설정)
  - 경로 제한 지시
- 출력: `{WORKSPACE_DIR}/07_revision-reviewer_verdict_ch{NNN}.md`

---

### Step 4: 판정 분기

verdict 파일을 읽어 판정 확인.

**PASS 시**:
1. fix_plan.md에서 해당 챕터를 `[x]`로 갱신
2. learnings.md에 이 챕터에서 발견된 패턴 기록:
   - 반복 위반 유형 (예: "AITONE MORPH가 매 화 5건+")
   - 새로운 보이스 패턴 발견
   - 수치 불일치 패턴
3. 결과 요약 출력 후 다음 챕터로 이동 (Step 1부터)

**REVISE 시**:
1. 재시도 1회 미만:
   - revision-reviewer의 REVISE 사유를 revision-executor에 전달
   - Step 2로 (재교정 모드)
   - 재교정 모드 추가 지시:
     - verdict 파일의 REVISE 사유 읽기
     - "REVISE 사유에 해당하는 부분만 재수정. 이미 PASS된 수정은 유지."
2. 재시도 1회 이상:
   - `[△]` 표시, 사용자 알림
   - 다음 챕터로 이동

---

### Step 5: 자기 루프

대상 범위의 모든 챕터가 처리될 때까지 Step 1~4를 반복한다.

완료 시:
1. fix_plan.md 최종 갱신
2. learnings.md에 세션 요약 추가
3. 결과 요약 출력:
   ```
   ## 윤문 완료 요약
   - 총 챕터: N화
   - PASS: X화
   - 부분통과(△): Y화
   - REVISE 발생: Z회
   - 주요 수정 패턴: {가장 빈번한 위반 축 3개}

   ### 축별 통계
   | 축 | CRITICAL | MAJOR | MINOR | 수정 건수 |
   |----|---------|-------|-------|----------|

   ### 다음 단계
   - 설정집 동기화: `/settings-sync` — 수정된 내용의 설정 변경 반영
   - 피드백 수집: `npm run dev`로 리더에서 읽고 인라인 코멘트 남기기
   - 재윤문: `/polish` — 추가 윤문이 필요하면 재실행
   ```

---

## 에러 핸들링

| 에러 유형 | 전략 |
|----------|------|
| 에이전트 실패 | 1회 재시도 → 실패 시 해당 보고서 없이 진행 (executor에 누락 명시) |
| 챕터 파일 미존재 | `[!]` 표시, 해당 챕터 건너뜀 |
| novel-config.md 누락 | 에러 출력 후 종료 |
| 진단 보고서 0개 성공 | 에러 출력 후 해당 챕터 건너뜀 |
| Phase 1 부분 실패 | 성공한 보고서로 Phase 2 진행, 누락된 축 명시 |
| 분량 범위 이탈 | 경고 출력, PASS 판정은 유지 (별도 트리밍 필요 시 사용자 알림) |

---

## /create와의 차이

| 항목 | /create | /polish |
|------|---------|---------|
| 목적 | 신규 챕터 생성 | 기존 챕터 교정 |
| 입력 | 설정문서만 | 설정문서 + 기존 챕터 |
| 에이전트 수 | 4 | 5 |
| 진단 축 수 | 8 (검증용) | 19 (진단+교정) |
| 파일 변경 | 신규 생성 | in-place 수정 |
| 등록 절차 | _arc_meta + chapters.ts | 없음 (이미 등록됨) |
| 추적 파일 | create-plan.md | fix_plan.md |
| 재시도 제한 | 2회 | 1회 |
