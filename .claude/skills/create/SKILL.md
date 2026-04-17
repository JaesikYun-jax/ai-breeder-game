---
name: create
description: "웹소설 챕터 창작 오케스트레이터. 설정문서(캐릭터·플롯·세계관)에 따라 챕터를 순차 창작한다. '/create', '/create dclass-hero', '/create ch016', '/create dclass-hero ch016', '/create dclass-hero ch016-ch020' 으로 실행. novel-config.md의 설정문서 매핑과 가드레일을 적용하여 연속성, 캐릭터 보이스, 톤 일관성을 보장한다."
user-invocable: true
---

# 챕터 창작 오케스트레이터

설정문서(캐릭터·플롯·세계관)에 따라 챕터를 순차 창작하는 4-에이전트 파이프라인.

## 아키텍처

```
Phase 1 (병렬)              Phase 2 (순차)          Phase 3 (순차)
┌──────────────────┐       ┌──────────────┐       ┌──────────────┐
│ chapter-architect│──┐    │  chapter-    │       │  quality-    │
│ (설계도 추출)      │  ├──▶│  creator     │──────▶│  verifier    │
└──────────────────┘  │    │  (본문 집필)   │       │  (8축 검증)   │
┌──────────────────┐  │    └──────────────┘       └──────┬───────┘
│ continuity-bridge│──┘          ◀── REWRITE (max 2) ───┘
│ (연속성 수집)      │                     │
└──────────────────┘             PASS ───▶ 챕터 등록
```

## 전제 조건

1. `projects/{project}/novel-config.md` 존재
2. 설정문서 존재: 최소 bootstrap, character_core, character_detail, plot_framework
3. 챕터 디렉토리 존재 (`chapter_dir` in novel-config.md)

## 인자 파싱

| 입력 형태 | 해석 |
|----------|------|
| `/create` | 프로젝트 자동 감지, 마지막 챕터 다음부터 1화 |
| `/create dclass-hero` | dclass-hero, 마지막 챕터 다음부터 1화 |
| `/create ch016` | 프로젝트 자동 감지, ch016만 |
| `/create dclass-hero ch016` | dclass-hero, ch016만 |
| `/create dclass-hero ch016-ch020` | dclass-hero, ch016~ch020 범위 |

---

## 실행 흐름

### Step 0: 초기화

#### 0.1 프로젝트 결정

- $ARGUMENTS에서 프로젝트명 추출
- 프로젝트명 지정 없으면: `projects/` 디렉토리에서 `novel-config.md`가 있는 디렉토리 탐색
- `status: "completed"` 프로젝트는 제외
- `novel-config.md`가 여러 개면: 사용자에게 선택 요청

#### 0.2 novel-config.md 필수 필드 검증 게이트

`projects/{project}/novel-config.md`를 로드한 직후 필수 필드 검증:

```
필수 필드 체크리스트:
- [ ] project.chapter_dir — 챕터 저장 디렉토리
- [ ] project.work_dir — 작업 디렉토리
- [ ] 설정문서 매핑.bootstrap — 경로 + 파일 존재
- [ ] 설정문서 매핑.character_core — 경로 + 파일 존재
- [ ] 설정문서 매핑.character_detail — 경로 + 파일 존재
- [ ] 설정문서 매핑.plot_framework — 경로 + 파일 존재
- [ ] 아크 범위 테이블 — 최소 1개 행 존재
```

검증 실패 시:
```
❌ novel-config.md 필수 필드 누락: {누락 필드 목록}
create 스킬을 실행하려면 위 필드를 채워주세요.
```

#### 0.3 설정 파싱

```
{CONFIG}          ← novel-config.md 전체
{CHAPTER_DIR}     ← config.chapter_dir
{WORK_DIR}        ← config.work_dir
{WORKSPACE_DIR}   ← config.workspace_dir
{GUARD_RAILS}     ← config 보존 가드레일 (§4)
{CUSTOM_AXES}     ← config 커스텀 축 (§5, 있을 경우)
{CREATE_CFG}      ← config create 설정 (§6, 없으면 기본값)
```

기본값 (`create` 섹션 없을 때):
```yaml
draft_chars: 6000-8000
final_chars: 5000-7000
dialogue_ratio: 35-55%
max_scenes: 5
continuity_lookback: 2
hook_targets:
  opening_intensity: 3
  ending_intensity: 4
```

> **분량 기준**: 한 화 완성본 기준 5,000~7,000자 (공백 포함).
> 초안은 6,000~8,000자로 넘치게 쓰고, 트리밍으로 5,000~7,000자에 맞춘다.

#### 0.4 챕터 범위 & 아크 결정

1. 지정 챕터가 있으면 해당 범위 사용
2. 없으면 `{CHAPTER_DIR}`와 `chapters.ts`에서 마지막 챕터 번호를 찾고, 다음 번호 1화만 창작
3. 대상 챕터 번호 → 아크 범위 테이블에서 아크 확인:
   ```
   ch016 → arc2_solaris (ch006~ch030)
   → {ARC_DIR} = src/data/novel/arc2_solaris/
   → {PLOT_DOC} = 아크 범위 테이블의 플롯 가이드 경로
   → {CHAR_DETAIL_ARC} = 세부 캐릭터 시트 (있으면 우선, 없으면 공통 character_detail)
   ```

#### 0.5 workspace 디렉토리 확인

`{WORKSPACE_DIR}` 존재 확인 (없으면 생성).

#### 0.6 create-plan.md 생성/갱신

```markdown
# 챕터 창작 계획
## 대상: ch{start}~ch{end}
- [ ] ch{NNN} — 미착수
...
```

---

### Step 1: Phase 1 — 설계도 추출 + 연속성 수집 (병렬)

두 에이전트를 **병렬로** (한 메시지에 Agent 2회 호출) 실행한다.

> **에이전트 공통 경로 제한 지시** (프롬프트에 반드시 포함):
> "아래 명시된 파일 경로만 읽어라. 디렉토리를 Glob으로 탐색하거나,
> 명시되지 않은 파일을 스스로 찾아 읽으려 시도하지 마라."

**Agent 1: chapter-architect** (`run_in_background: true`)
- 에이전트 정의: `.claude/agents/chapter-architect.md` 읽으라고 지시
- 프롬프트에 포함:
  - 챕터 번호, 아크 정보
  - 읽을 설정문서 경로 (novel-config.md 매핑 기반):
    - bootstrap: `{CONFIG.bootstrap}`
    - plot_framework: `{CONFIG.plot_framework}`
    - character_core: `{CONFIG.character_core}`
    - character_detail: `{CHAR_DETAIL_ARC}`
    - protagonist_bible: `{CONFIG.protagonist_bible}`
    - death_regression: `{CONFIG.death_regression}`
    - tone_style: `{CONFIG.tone_style}`
  - 가드레일, 커스텀 축
  - **목표 분량**: `{CREATE_CFG.draft_chars}자`
  - 경로 제한 지시 + 허용 경로 화이트리스트
- 출력: `{WORKSPACE_DIR}/01_chapter-architect_blueprint_ch{NNN}.md`

**Agent 2: continuity-bridge** (`run_in_background: true`)
- 에이전트 정의: `.claude/agents/continuity-bridge.md` 읽으라고 지시
- 프롬프트에 포함:
  - 챕터 번호, 아크 정보
  - 읽을 문서:
    - 이전 2화 (아크 경계를 넘을 수 있음 — 이전 아크 디렉토리 포함)
    - alive-tracker: `{WORK_DIR}/alive-tracker.md` (존재 시)
    - foreshadowing: `{CONFIG.foreshadowing}`
    - timeline: `{CONFIG.timeline}`
    - death_regression: `{CONFIG.death_regression}` (모래시계 잔량 추적)
    - chapter_log: `{CONFIG.chapter_log}`
  - ch001 창작 시: 이전 챕터 대신 bootstrap 초기 상태 요약 지시
  - 경로 제한 지시
- 출력: `{WORKSPACE_DIR}/02_continuity-bridge_report_ch{NNN}.md`

**Phase 1 대기**: 배경 에이전트 완료 시 시스템이 자동 알림. sleep/polling 금지.

---

### Step 2: Phase 2 — 본문 집필 (순차)

Phase 1 완료 후 chapter-creator 실행.

**Agent 3: chapter-creator**
- 에이전트 정의: `.claude/agents/chapter-creator.md` 읽으라고 지시
- 프롬프트에 포함:
  - 읽을 문서:
    - `{WORKSPACE_DIR}/01_chapter-architect_blueprint_ch{NNN}.md`
    - `{WORKSPACE_DIR}/02_continuity-bridge_report_ch{NNN}.md`
    - character_detail: `{CHAR_DETAIL_ARC}` (보이스표)
    - tone_style: `{CONFIG.tone_style}` (시점/문체 규칙)
    - death_regression: `{CONFIG.death_regression}` (기둥 씬 해당 시)
  - `{CREATE_CFG}` (목표 글자수, 대화 비율 등)
  - 가드레일
  - **파일 명명**: `{ARC_DIR}/{global_num}_{title}.md` (title은 설계도에서 추출)
  - **Bash 금지**: 글자수 집계는 quality-verifier가 수행
  - 경로 제한 지시
- 출력: `{CHAPTER_DIR}/{arc_dir}/{num}_{title}.md`

**재작성 모드** (REWRITE 후 재실행 시):
- 추가 프롬프트:
  - `{WORKSPACE_DIR}/04_quality-verifier_verdict_ch{NNN}.md` 읽기
  - 기존 챕터 파일 읽기
  - "수정 지시에 따라 해당 부분만 수정. 전체 재작성 금지."

### Step 2.5: 트리밍 게이트 (오케스트레이터 직접 수행)

**전략: "넘치게 쓰고 줄이기"** — 초안은 {draft_chars}자로 작성 → {final_chars}자로 트리밍.

1. **측정**: `wc -m {챕터파일}` → 글자수 확인 (공백 포함)
2. **판정** (기본값 기준, novel-config.md `create` 섹션으로 오버라이드 가능):
   - 상한 초과 (7,000자 초과): chapter-creator를 트리밍 모드로 재호출
     - 삭제 우선순위: 메타서술 → 감정 반복 → 비핵심 배경 → 내면 재확인
     - 트리밍 후 재측정 (1회 재시도)
   - 범위 내 (5,000-7,000자): Phase 3으로 진행
   - 하한 미달 (5,000자 미만): chapter-creator 재호출 (장면 밀도 보강, 새 비트 추가 금지)

---

### Step 3: Phase 3 — 품질 검증 (순차)

**Agent 4: quality-verifier** (CREATE 모드)
- 에이전트 정의: `.claude/agents/quality-verifier.md` 읽으라고 지시
- CREATE 모드로 동작:
  ```
  CREATE 모드 검증 8축:
  1. PLOT_BEAT — 설계도의 플롯 비트가 챕터에 모두 반영되었는가
  2. TIMELINE — 시간 마커가 설정문서 및 이전 챕터와 일치하는가
  3. REGRESSION — 재생/기둥 메커닉이 death-and-regression.md와 일치하는가
  4. GUARDRAIL — novel-config.md의 보존 가드레일 위반 없는가
  5. CONTINUITY — continuity-bridge 보고서 항목이 반영되었는가
  6. HOOK — 코미디→고통 낙차 훅 강도가 목표치 이상인가
  7. CHAR_VOICE — 대사가 voice-guide.md 보이스표와 일관되는가
  8. CUSTOM — 커스텀 축 (REGRESSION, FORESHADOW, MODERN_REF) 위반 없는가
  ```
- 읽을 문서: 챕터 파일, 설계도, 연속성 보고서, 설정문서, novel-config.md
- 출력: `{WORKSPACE_DIR}/04_quality-verifier_verdict_ch{NNN}.md`

---

### Step 4: 판정 분기

verdict 파일을 읽어 판정 확인.

**PASS 시 — 오케스트레이터 교차검증**:

1. Grep `있었다` in 챕터 → 5회 이하 확인
2. Grep `고 있었다` in 챕터 → 3회 이하 확인
3. `wc -m` → 목표 글자수 범위 확인

교차검증 통과 시:
1. **챕터 등록** (Step 5로)
2. create-plan.md에서 해당 챕터를 `[x]`로 갱신
3. 다음 챕터로 이동 (Step 1부터)

교차검증 위반 시:
- 초과분 3건 이하 + 단순 치환 가능 → 오케스트레이터가 직접 Edit
- 그 외 → REWRITE 절차

**REWRITE 시**:
1. 기존 verdict 파일 삭제
2. 재시도 2회 미만: Step 2로 (재작성 모드)
3. 재시도 2회 이상: 사용자 알림, `[△]` 표시, 다음 챕터로

---

### Step 5: 챕터 등록 (AI_Breeder 고유)

ANS에 없는 단계. PASS 판정 후 챕터를 리더앱에 등록한다.

1. **_arc_meta.json 업데이트**:
   `{CHAPTER_DIR}/{arc_dir}/_arc_meta.json`의 `chapters` 배열에 추가:
   ```json
   {
     "id": "ch{NNN}",
     "file": "{num}_{title}.md",
     "title": "{title}",
     "summary": "{1줄 요약 — 설계도에서 추출}",
     "status": "draft"
   }
   ```

2. **chapters.ts 업데이트**:
   `src/novel/chapters.ts` 파일에:
   - 상단에 raw import 추가:
     ```typescript
     import ch{NNN}Raw from '../data/novel/{arc_dir}/{num}_{title}.md?raw';
     ```
   - CHAPTERS 배열에 항목 추가:
     ```typescript
     {
       id: 'ch{NNN}',
       num: {NNN},
       title: '{title}',
       arc: '{arc_id}',
       arcLabel: '{arc_label}',
       projectId: 'dclass-hero',
       status: 'writing',
       raw: ch{NNN}Raw,
     },
     ```

3. **novel-config.md 현재 연재 현황 업데이트** (§10)

---

### Step 6: 자기 루프

대상 범위의 모든 챕터가 처리될 때까지 Step 1~5를 반복한다.

완료 시:
1. create-plan.md 최종 갱신
2. 결과 요약 출력:
   ```
   ## 창작 완료 요약
   - 총 챕터: N화
   - PASS: X화
   - 부분통과(△): Y화
   - REWRITE 발생: Z회

   ### 다음 단계
   - 문장 품질 향상: `/polish` — 다축 진단으로 문체·훅·캐릭터 생동감 교정
   - 설정집 동기화: `/settings-sync` — 새 챕터의 설정 변경 반영
   - 피드백 수집: `npm run dev`로 리더에서 읽고 인라인 코멘트 남기기
   ```

---

## 에러 핸들링

| 에러 유형 | 전략 |
|----------|------|
| 에이전트 실패 | 1회 재시도 → 실패 시 `[!]` 표시, 다음으로 |
| 설정문서 누락 | 경고 후 가용한 문서로 진행. plot_framework 누락 시 종료 |
| 이전 챕터 없음 (ch001) | continuity-bridge가 bootstrap 초기 상태 요약 |
| novel-config.md 누락 | 에러 출력 후 종료 |
| 아크 경계 이전 챕터 | 이전 아크 디렉토리에서 챕터 파일 읽기 |
| Phase 1 한쪽만 실패 | 성공한 보고서로 Phase 2 진행, 누락 명시 |
