# AI Breeder — 나에게만 스킬이 코드로 보인다 (외 3 프로젝트 + 1 완결 + 1 archive)

**스택**: Vite + TypeScript (웹소설 리더 SPA)
**파이프라인**: [awesome-novel-studio](https://github.com/MJbae/awesome-novel-studio) (2026-04-26 마이그레이션)
**현재 집중작 (2026-05-09~)**: 「나에게만 스킬이 코드로 보인다」 (현대 헌터물 / F급 디버거 먼치킨 / 회귀 X / 1인칭 자조)
**보존 작품**: 「D급 스킬 이세계 용사」 (EP001~EP058 백업 정본화 2026-05-11, EP059~EP158 설계 예정) / 「봉인당한 천마」 / 「아스테로포스」

---

## 프로젝트 개요

4 프로젝트 동시 + 1 완결 + 1 archive 보존. 각 프로젝트는 `projects/{name}/novel-config.md`로 독립 운영.

| 프로젝트 | 장르 | 플랫폼 | 상태 |
|---|---|---|---|
| **skill-compiler** (나에게만 스킬이 코드로 보인다) | 현대 판타지 / 헌터물 | 문피아 | 큰 설계 대기 (2026-05-09 신규, **메인**) |
| dclass-hero (D급 스킬 이세계 용사) | 이세계 멸망 저지물 | 문피아 | EP001~EP058 (백업 정본화, EP059~EP158 신규 100화 설계 예정) |
| canned-master (천년묵은 통조림) | 천마 빙의 현대물 | 문피아 | EP020 진행 중 (보존) |
| asteropos (아스테로포스) | 정통 판타지 성장물 | 문피아 | 1 아크 진행 (보존) |
| british-food (내 대영제국에 괴식은 없다) | 음식 빙의물 | (별도) | 431화 완결 |
| ~~magitech-fire (마도공학 영생)~~ | ~~호문클루스 빙의물~~ | — | **archive/magitech-fire/** (2026-05-09 보관) |

**skill-compiler 핵심 컨셉** (2026-05-09 신규):
- 1부 (EP001~EP080, 신규): 대각성 1년 후, F급 비각성자 안강해의 코드 편집 능력 자각 → 솔플 먼치킨 → 길드 전쟁 → 시스템 농장 1차 자각.
- 2부 (EP081~, 미설계): 시스템 반항 + 베타 테스터 동료 합류 + 0층 적 떡밥.
- 3부: 미설계 (라스트).
- 1인칭 자조 + 사이다. 회귀 X / 미래 앎 X. 상태창 v0.1 베타 (오리지널). 5대 길드 + 무능력자 부서. **당분간 메인 집중작**.

**dclass-hero 핵심 컨셉** (2026-05-11 백업 정본화):
- **EP001~EP058 완료** (작가가 직접 추가 작성한 백업 = 정본). 분량 확장(70화 → 58화 완료) + 무협 차원 강림으로 마무리.
- Arc 1~9 잠정 구분 (`src/projects/episode-titles.ts` 참조). 정확한 아크 경계는 design-big 재실행 시 재조정.
- 주요 분기점: EP051 우주(아들) 탄생 / EP055~56 흑철 제국 30만 대군 격파 / EP057 지호 빈사 / EP058 무협 차원 인물(카에데·시즈루·노인) 강림.
- **EP059~EP158 신규 100화 설계 예정** — design-big/small 재실행으로 Part 3·4 매크로/마이크로 비트 구축.
- 9대 지역, 9기둥 = 이계 차단 배리어. 빌런(천인 평의회) 의도적 약화. **무협 차원 = 신규 캐논**(58화 도입).
- **톤 = 백업 모델 정본화**. 글로벌 서술체 v2(`docs/narrative-style.md`)는 dclass-hero에서 **적용 안 함** — 정통 웹소설 톤(긴 단락·풍부한 묘사·작은따옴표 생각풍선 허용) 유지.

---

## 마이그레이션 상태 (2026-04-26)

자체 진화 파이프라인 → **MJbae/awesome-novel-studio** 정식판 전환:
- ch{N} → **EP{NNN}** 합성키 통일
- 9 에이전트 → **18 에이전트**
- 4 스킬 → **10 스킬**
- target_platform: self-published → **문피아**
- chapter_dir → `episode_dir` (`projects/{name}/episode/`)
- legacy 보존: `_legacy_novel-config.md`

**현재 main 브랜치 디스크 상태**: 일부 마이그레이션 미반영 가능. 워크트리 `unruffled-grothendieck-6dc360`에 정식 산출물. 세션 활성 스킬은 신 파이프라인.

---

## 프로젝트 구조 — 표준 경로 규약 (★ 단일 진실 공급원)

모든 활성 프로젝트는 다음 표준 위치를 따른다. 한 군데만 위반해도 뷰어/스킬/Vite 플러그인이 누락 처리한다.

```
projects/{id}/                     # 활성 프로젝트 워크스페이스 (id = 슬러그)
├── novel-config.md                # 파이프라인 중앙 설정 (target_platform·episode_dir·design_dir·매핑·가드레일)
├── episode/EP{NNN}.md             # 본문 — Vite glob 자동 수집, 별도 import 불필요
├── design/**/*.md                 # 설계 문서 — Design Atlas 자동 수집·카테고리 분류
└── revision/                      # 진행 추적
    ├── inline-feedback.json       # 인라인 피드백 (feedbackEnabled 프로젝트만)
    ├── create-plan.md / rewrite-plan.md / alive-tracker.md
    └── _workspace/                # 에이전트 중간 산출물

archive/{id}/                      # 보관 중인 프로젝트 (뷰어/파이프라인 제외)
└── ...                            # 예: archive/magitech-fire/

src/
├── projects/                      # ★ SSOT — 모든 하드코딩이 여기로 모임
│   ├── registry.ts                # ProjectMeta + projectPaths() + ACTIVE_PROJECT_IDS
│   └── episode-titles.ts          # 프로젝트별 EP 제목·아크 (메타 미정의 시 fallback)
├── novel/                         # 리더/Design Atlas 앱 (Vite + TS)
│   ├── chapters.ts                # registry × glob × episode-titles 결합
│   ├── design.ts                  # registry × glob 자동 수집
│   ├── design-view.ts / design-renderer.ts
│   ├── renderer.ts / editor.ts / feedback.ts
│   └── main.ts
├── hub/                           # Cartographer Hub
│   ├── projects.ts                # registry 얇은 re-export (PROJECTS / getProject)
│   └── main.ts
└── ...

vite-plugin-episode.ts             # /__episode  (registry의 ACTIVE_PROJECT_IDS + projectPaths)
vite-plugin-design.ts              # /__design   (한글 파일명 지원)
vite-plugin-feedback.ts            # /__feedback (멀티프로젝트, ?project=X)

docs/
└── narrative-style.md             # ★ 글로벌 서술체 v2 (모든 작품 적용)

.claude/
├── agents/                        # 18 에이전트 (awesome-novel-studio)
└── skills/                        # 10 스킬
```

### 표준 경로 위반 = 자동 수집 누락 (★ 중요)

| 표준 경로 | 위반 사례 → 결과 |
|---|---|
| `projects/{id}/episode/EP{NNN}.md` | 다른 위치에 저장 → 리더에서 보이지 않음 (chapters.ts glob 누락) |
| `projects/{id}/design/**/*.md` | `docs/{id}/`처럼 다른 위치 → Design Atlas에 안 보임 |
| `projects/{id}/revision/inline-feedback.json` | — | 자동 생성됨 (feedbackEnabled 프로젝트만) |

`novel-config.md`의 `episode_dir/design_dir/work_dir`은 반드시 위 표준을 가리켜야 한다. 다른 경로를 쓰면 design-big/design-small 스킬은 동작하지만 뷰어에서 안 보인다.

### 새 프로젝트 추가 체크리스트

1. `projects/{id}/` + `episode/`, `design/`, `revision/` 디렉토리 생성
2. `projects/{id}/novel-config.md` 작성 (위 표준 경로 따름)
3. `src/projects/registry.ts`의 `PROJECTS` 배열에 항목 추가
4. EP 작성 시 `src/projects/episode-titles.ts`의 해당 프로젝트 entries에 제목·아크 추가 (생략 시 `{N}화` / `Misc` fallback)
5. dev 서버 reload → 허브에 자동 표시, Design Atlas에 자동 등록

### 프로젝트 보관(archive)

1. 디렉토리를 `archive/{id}/`로 이동
2. `src/projects/registry.ts`의 PROJECTS 배열에서 항목 제거 또는 `archived: true` 플래그
3. 자동으로 모든 뷰어/플러그인에서 제외됨 (단일 ACTIVE_PROJECT_IDS 참조)

### 정합성 검사

```bash
npm run check:chapters
```

- registry ↔ projects/ 디렉토리 매칭
- episode-titles.ts ↔ 디스크 EP{NNN}.md 매칭 (orphan/fallback 경고)
- 빈 파일·EP 번호 갭 감지

---

## 신 파이프라인 (awesome-novel-studio)

### 스킬 계층 (10개)

| 스킬 | 역할 | 하위 호출 / 비고 |
|---|---|---|
| **propose** | 컨셉/타겟 입력 → 3개 설계안 제안 | 신규 프로젝트 시작 시 |
| **design** | 통합 설계 라우터 (큰+작은) | 모호 요청은 여기로 |
| **design-big** | 큰 설계 (전체 소설) | bootstrap + character + plot-hook |
| **design-small** | 작은 설계 (25화 단위 세부) | 큰 설계 전제 조건 |
| **bootstrap** | 부트스트랩(컨셉·세계관·플랫폼) 단독 | |
| **character** | 캐릭터 시트 단독 | 큰/작은 양쪽 가능 |
| **plot-hook** | 플롯 구조·훅 가이드 단독 | 큰/작은 양쪽 가능 |
| **create** | 에피소드 창작 오케스트레이터 (4 에이전트) | `/create EP051` |
| **polish** | 윤문 (6 에이전트 병렬+순차) | `/polish EP051` |
| **rewrite** | 설정 변경에 따른 에피소드 재작성 | `/rewrite EP051` |

### 에이전트 계층 (18개)

**설계(Design)**
- `concept-builder` — 부트스트랩 핵심
- `character-architect` — 큰 설계 캐릭터 시트
- `character-sculptor` — 작은 설계 캐릭터 변화
- `plot-hook-engineer` — 플롯/훅 구조
- `domain-researcher` — 자동 리서치(전문 분야 자료)
- `proposal-generator` — 제안서 작성
- `platform-optimizer` — 플랫폼별 최적화 (HOOK/OPENING)

**창작(Create)**
- `episode-architect` — 설계도 추출
- `continuity-bridge` — 직전 EP + 활성 복선
- `episode-creator` — 본문 집필
- `quality-verifier` — 7축 검증

**윤문(Polish)**
- `rule-checker` — VOICE/TITLE/BANNED/TRANS 4축
- `story-analyst` — TIMELINE/NUMBER/PLAUSIBILITY/FORESHADOW 등 9축
- `alive-enhancer` — 메아리·침묵·관계 곡선 4축
- `revision-analyst` — 우선순위 분석
- `revision-executor` — 15계층 우선순위 교정
- `revision-reviewer` — 4항 diff 검증

**재작성(Rewrite)**
- `episode-rewriter` — 설정 변경 반영 재작성

### create 흐름 (단일 EP)

```
Phase 1 (병렬)              Phase 2 (순차)          Phase 3 (순차)
┌──────────────────┐       ┌──────────────┐       ┌──────────────┐
│ episode-architect│──┐    │  episode-    │       │  quality-    │
│ (설계도 추출)      │  ├──▶│  creator     │──────▶│  verifier    │
└──────────────────┘  │    │  (본문)        │       │  (7축)       │
┌──────────────────┐  │    └──────────────┘       └──────┬───────┘
│ continuity-bridge│──┘          ◀── REWRITE (max 2) ───┘
│ (연속성)          │                     │
└──────────────────┘             PASS ───▶ 다음 EP
```

### polish 흐름

조기 종료 게이트: rule-checker / story-analyst / alive-enhancer 3개 진단이 모두 CRITICAL=0 + MAJOR=0 + 분량/금지표현 상한 위반 0이면 → executor·reviewer 스킵 직접 PASS.

---

## Design Atlas (설계 뷰어)

리더 뷰어 안에서 설계 문서(캐릭터 시트·세계관·플롯 가이드 등)를 카테고리별로 보고 인라인 편집까지 할 수 있다.
**대시보드 → "Design Atlas" 카드** 또는 라우트 `#/p/:projectId/design`.

### 자동 등록 조건 (★ 중요)

`src/novel/design.ts`의 Vite glob 패턴은 다음만 수집한다:

```
projects/*/design/**/*.md
```

**design-big의 Phase 0.5 게이트가 이 표준을 자동 보장**한다. 작가가 직접 `design_dir`을 표준으로 설정할 필요 없다 — design-big 실행 시 비표준이면 자동으로 `projects/{name}/design/`로 보정 + 기존 산출물도 git mv로 이동.

```yaml
# ✅ 올바름 — Design Atlas 자동 등록
project:
  design_dir: "projects/skill-compiler/design/"

# ❌ 잘못됨 — 뷰어 노출 안 됨 (마이그레이션 필요)
project:
  design_dir: "docs/skill-compiler/"
```

### 카테고리 자동 분류 (파일명 prefix 기반)

| 카테고리 | 매칭 prefix |
|---|---|
| world (세계관·부트스트랩) | `worldbuilding`, `bootstrap`, `magic-systems`, `region-*`, `seal-regression`, `*부트스트랩*` |
| character | `characters`, `voice-guide`, `protagonist-*`, `*캐릭터시트*` |
| plot | `plot-hook-*`, `plot-framework-*`, `story-framework-*`, `*플롯훅*` |
| lore (복선·용어·연표) | `foreshadowing`, `glossary`, `timeline`, `region-connections` |
| style (톤·문체) | `tone-*`, `narrative-*`, `death-and-regression` |
| meta (정본·로그·피드백) | `canon-quickref`, `chapter-log`, `*-feedback-log` |
| drafts (작가 팀 작업본) | `blue/*`, `red/*` 하위 |
| 기타 | `other` |

새 키워드 추가 시 `src/novel/design.ts`의 `categorise()` 함수 수정.

### 본문 렌더링

- 챕터 본문(EP)은 `src/novel/renderer.ts` (간이 파서, 단락 리듬 우선)
- 설계 문서는 `src/novel/design-renderer.ts` ([marked](https://marked.js.org/) 풀 GFM — 표·헤딩·코드·인용 모두 지원)
- 두 경로 분리됨 — 본문 리더 회귀 없음

### design-big / design-small 스킬과의 관계

두 스킬은 **이미 `{DESIGN_DIR}`을 따라 산출물을 저장**하도록 명세돼 있다(`design-big/SKILL.md` Phase 4 §4). 따라서 novel-config.md의 `design_dir`만 표준 위치를 가리키면, 큰 설계·작은 설계 산출물이 자동으로 Design Atlas에 노출된다.

### 라우트

| 경로 | 화면 |
|---|---|
| `#/p/:projectId/design` | 카테고리 트리 인덱스 |
| `#/p/:projectId/design/:docKey` | 단일 문서 (편집·복사 가능, slash docKey 지원: `blue/draft_azelia`) |

### 신규 프로젝트 체크리스트 — 별도 조처 없이 자동 등록

1. `design-big` 실행 (필요 시 `design-small`도)
   - **Phase 0.5 게이트**가 `novel-config.md`의 `design_dir`을 자동 검증 → 비표준이면 표준 위치(`projects/{슬러그}/design/`)로 자동 보정 + 산출물 git mv
   - 큰 설계 산출물(부트스트랩·캐릭터시트·플롯훅가이드)이 표준 위치에 저장됨
2. dev 서버 reload → Design Atlas에 자동 등록 (수동 import 불필요)

> **즉, 작가가 별다른 조처를 하지 않아도 design-big 실행만으로 뷰어에 자동 노출된다.**
> 기존 비표준 위치(예: `docs/{name}/`)에 산출물이 있던 프로젝트도 design-big을 한 번 더 실행하면 표준 위치로 자동 마이그레이션된다.

---

## EP 등록 (자동 — 2026-05-10 표준화 이후)

### 1. 마크다운 작성
`projects/{project}/episode/EP{NNN}.md`

```markdown
# EP{NNN}. 챕터 제목

---

씬 본문 (글로벌 서술체 v2 — 작은따옴표 생각풍선 ❌, 평서문 융합 ✅)

---

다음 씬...

*EP{NNN} 끝. 다음: EP{NNN+1} 제목.*
```

### 2. 리더 자동 등록 (수동 import 불필요)

`src/novel/chapters.ts`가 Vite glob (`projects/*/episode/EP*.md`)으로 자동 수집한다.
파일을 떨구고 dev 서버를 reload하면 끝.

### 3. 제목·아크 메타 (선택)

`src/projects/episode-titles.ts`의 해당 프로젝트 entries에 추가:

```typescript
EPISODE_META['skill-compiler'].entries.push(
  { num: 1, title: '편집 가능한 한 줄', arc: 'arc1_debut', arcLabel: 'Arc 1 — 디버거의 눈' }
);
```

생략 시 fallback (`{N}화` / 'Misc') — 리더에 보이긴 하나 그룹핑이 부정확. 정합성은 `npm run check:chapters`로 검증.

---

## 보존 가드레일 (16개)

**원칙 1~10 (전 시기)**:
1. 재생 D급 — 1인칭 시점이 아닌 제3자 언급에서만 등급 노출
2. 모래시계 = 9기둥 잔여 시간 카운트다운 (지호 도구 X)
3. 기둥 치유 순서: 빛(EP019) → 태양(EP021) → 강철(Arc 6) → 빙(Arc 7) → ... 엄수
4. 1인칭 시점 (강지호)
5. IT/프로그래머 비유 EP당 최대 3회
6. **Part 2 톤 공식 코미디 2 : 비장 5 : 반전 3** (Part 1 = 3:5:2)
7. 마르코 **아크당 0~1회** (2026-04-25 빈도 축소). 안 나와도 됨
8. 사망 묘사 감각 중심 (시각적 고어 X)
9. 현대 지식은 canon-quickref §3 부강 에피소드 범위만
10. 정령 계약 수명 대가 — 일반 술사는 머리색 탈색·수명 단축 / 지호는 D급 재생으로 미미

**원칙 11~16 (Part 2~)**:
11. **모래시계 메커닉** (2026-04-25 리디파인):
    - 박자 어긋남 디테일 묘사 폐기
    - 두 가지 극적 용도만: (a) 종말 자각 → 서두르게 함 / (b) 위험 시 자동 발동(주마등) → 시간 가속·재생 완료·판단 보조
    - 자동 발동은 지호 의지 X
    - 도구화 절대 금지 — 들여다본다 OK / 흔들기·돌리기 X
    - 잔량 한 알 감소도 절제 (Arc당 0~1회)
12. 정령 다중 계약 시 머리색 변화 EP당 1줄 이내 (Arc 7부터 흰머리 1가닥)
13. 아젤리아 혁신 = 프로그래머 가능 범위만 (canon-quickref §3 비장의 무기 3종 + 행정 DB / 카드 색인)
14. **영웅적 결의 대사 절대 금지** — 행동만 영웅, 독백은 자조
15. EP 분량 5,000~25,000자 (공백 포함) — 2026-05-11 백업 정본화로 분량 폭 확장
16. ~~한 줄 단락 5~7회 이내~~ / ~~글로벌 서술체 v2 우선~~ → **2026-05-11 폐기**. 백업(정통 웹소설 톤) = 정본. 단락·분량 제한 룰 미적용.

**원칙 17 (2026-04-25 신규)**:
- **메인 서사 방향**: 주인공 무쌍 + 나라 부강 + 전쟁 승리. 마르코·검은 로브 등 미스터리 라인은 부차. 무쌍·부강·승리 후도 자조 톤 유지.

**기둥 치유 메커닉**: 3단 조건 (물리 접촉 + 디버깅 미니 시퀀스 + 외부 조력자 협력) + 매 지역 새 풀이 + 본인 수명 미세 지불. "손만 대면 해결" X.

---

## 글로벌 서술체 v2 (★ 작품별 적용)

`docs/narrative-style.md` — 신규 작품·신규 EP의 **기본** 톤. 작품별 `tone-and-style.md`보다 우선.

**작품별 적용 매트릭스 (2026-05-11 갱신)**:
| 작품 | v2 적용 | 비고 |
|---|---|---|
| skill-compiler | ✅ 적용 | 메인 집중작. 신규 작성 EP는 모두 v2 기준. |
| dclass-hero | ❌ **미적용** | 2026-05-11 백업 정본화로 폐기. 정통 웹소설 톤(긴 단락·풍부한 묘사·작은따옴표 생각풍선 허용) 유지. EP001~EP058 백업이 정본, EP059~EP158 신규 100화도 백업 톤 계승. |
| canned-master | ✅ 적용 | |
| asteropos | ✅ 적용 | |
| dual-save | ✅ 적용 | |

핵심 (v2 적용 작품 한정):
1. **단락 1~3줄 기본** — 클러스터 단일 줄바꿈, 빈 줄은 전환에만
2. **`'독백'` 작은따옴표 생각풍선 폐기** — 평서문 서술자 보이스에 융합. 명시 진입은 "그렇게 생각했다" 짧은 1줄로만 가끔
3. **묘사 = 감각 단문** (비유 절제)
4. **대사 핑퐁** 4~5턴 큰따옴표만, 지문 전환점에만
5. **클리프행어 단문** 클로징
6. **씬 전환** `---` + 시간 직설
7. **문장 길이** 호흡 단위 (체감 25~40자)
8. **미래 시점 예고** ("그때까지만 해도 ~ 거라고 생각했다")
9. **POV 캐릭터 밀착** — 외부 인물 내면 직접 서술 X

이전 "dclass-hero EP001~EP037 v2 소급 적용 완료" 기록은 2026-05-11 백업 정본화로 무효화됨.

---

## 현재 연재 현황 (dclass-hero) — 2026-05-11 백업 정본화

| 범위 | 아크 (잠정) | 상태 |
|---|---|---|
| EP001~013 | Arc 1 — 강림과 사막 | complete (백업 정본) |
| EP014~020 | Arc 2 — 각성과 레거시 | complete (백업 정본) |
| EP021~025 | Arc 3 — 귀환과 서약 | complete (백업 정본) |
| EP026~031 | Arc 4 — 카즈모르 사냥 | complete (백업 정본) |
| EP032~037 | Arc 5 — 게릴라전 | complete (백업 정본) |
| EP038~042 | Arc 6 — 재회와 재구성 | complete (백업 정본) |
| EP043~050 | Arc 7 — 제국의 부름 | complete (백업 정본) |
| EP051~056 | Arc 8 — 결전과 탄생 (우주 출생 + 30만 대군 격파) | complete (백업 정본) |
| EP057~058 | Arc 9 — 무협 차원 강림 (카에데·시즈루·노인 등장) | complete (백업 정본) |
| **EP059~EP158** | **Part 3·4 신규 100화** | **설계 대기** (design-big/small 재실행 예정) |

> 아크 경계는 잠정. design-big 재실행 시 매크로 비트와 함께 재조정 예정.

### EP 단위 plan 작성 시점
- **매크로 (EP059~EP158)**: design-big에서 정해짐.
- **마이크로 (4씬 비트)**: 각 아크 진입 시 design-small이 25화 단위로 작성.

### 한 번에 create할 EP수 권장
| 시나리오 | 권장 EP수 |
|---|---|
| 새 아크 첫 화 | 1화 단독 (정착 검증) |
| 흐름 정착된 중반 | 2~3화 묶음 |
| 아크 피날레 / 대형 사건 | 1화 단독 |

4~5화 한 번에 비추천.

---

## 작업 워크플로

```
1. 자연어 명령 ("EP038 써줘" / "다음 화 집필")
2. novel-config.md에서 프로젝트 설정 로드
3. /create 파이프라인 실행 (4 에이전트, REWRITE max 2회)
4. 리더앱(localhost:5173)에서 읽기 + 인라인 피드백
5. /polish 파이프라인 실행 (3개 진단 → 조기종료 또는 풀 사이클)
6. 완성 → /settings-sync 또는 /rewrite로 설정집·후속 EP 정리
```

### 챕터 상태 (4단계)
`writing → complete → published → coming` (coming은 미래 예고용)

### 피드백 시스템
- **인라인**: 리더에서 텍스트 드래그 → `inline-feedback.json` → `/apply-feedback`
- **스토리 피드백**: `projects/dclass-hero/design/story-feedback-log.md` (FB-XXX·SYNC-XXX)

---

## 핵심 레퍼런스

| 질문 | 읽을 곳 |
|---|---|
| 프로젝트 전체 설정? | `projects/{project}/novel-config.md` |
| 정본 압축본? | `projects/dclass-hero/design/canon-quickref.md` (★ 1차 참조) |
| 글로벌 서술체? | `docs/narrative-style.md` (★ 1차 참조, tone-style보다 우선) |
| EP N의 플롯 비트? | `projects/dclass-hero/design/story-framework-21-70.md` (Part 2) |
| 캐릭터 X 말투? | `projects/dclass-hero/design/voice-guide.md` |
| 복선 X 배치/회수? | `projects/dclass-hero/design/foreshadowing.md` |
| 모래시계 메커닉? | `projects/dclass-hero/design/death-and-regression.md` + 가드레일 §11 (2026-04-25 리디파인) |
| 금지 표현? | `projects/dclass-hero/design/tone-and-style.md` + canon-quickref |
| 에이전트 동작? | `.claude/agents/*.md` |
| 스킬 실행? | `.claude/skills/*/SKILL.md` |
| EP 등록? | 이 파일 §"EP 등록" |

---

## 최근 캐논 변경 (2026-04-23 ~ 2026-04-26)

| 날짜 | 변경 | 메모 파일 |
|---|---|---|
| 2026-04-23 | 모래시계 등장 빈도 3~4화 1회 | `feedback_sandglass_frequency.md` |
| 2026-04-23 | FS-A11 기후 프로그래밍 복선 신규 (3정령+문신 코딩 = 기후 함수, Arc 후반 대전 결정타) | `project_climate_programming.md` |
| 2026-04-25 | 글로벌 서술체 v2 — 작은따옴표 생각풍선 폐기, 평서문 융합 | `feedback_global_narrative_style.md` (전체 소급 완료) |
| 2026-04-25 | 모래시계 메커닉 리디파인 — 박자 묘사 폐기 + 자동 발동(주마등) 신규 | `feedback_sandglass_redefinition.md` |
| 2026-04-25 | 마르코 비중 축소 (아크당 0~1회) + 메인 서사 방향(무쌍·부강·전쟁) | `feedback_marco_reduction.md` |
| 2026-04-26 | awesome-novel-studio 마이그레이션 (18 에이전트·10 스킬·EP 단위·target=문피아) | `project_pipeline_upgrade.md` |
