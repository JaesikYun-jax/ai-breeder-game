# AI Breeder — D급 스킬 이세계 용사 (외 4 프로젝트)

**스택**: Vite + TypeScript (웹소설 리더 SPA)
**파이프라인**: [awesome-novel-studio](https://github.com/MJbae/awesome-novel-studio) (2026-04-26 마이그레이션)
**대표작**: 「D급 스킬 이세계 용사」 (이세계 선형 멸망 저지물 / 9개 기둥 차례 치유 / 회귀·루프 X)

---

## 프로젝트 개요

5개 프로젝트가 동시 진행되는 웹소설 스튜디오. 각 프로젝트는 `projects/{name}/novel-config.md`로 독립 운영.

| 프로젝트 | 장르 | 플랫폼 | 상태 |
|---|---|---|---|
| **dclass-hero** (D급 스킬 이세계 용사) | 이세계 멸망 저지물 | 문피아 | EP001~EP037 진행 중 |
| canned-master (천년묵은 통조림) | 천마 빙의 현대물 | 문피아 | EP020 진행 중 |
| magitech-fire (마도공학 영생) | 이세계 호문클루스 빙의물 | 문피아 | EP005 진행 중 |
| asteropos (아스테로포스) | (신규) | 문피아 | 1 아크 진행 |
| british-food (내 대영제국에 괴식은 없다) | 음식 빙의물 | (별도) | 431화 완결 |

**dclass-hero 핵심 컨셉**:
- Part 1 (EP001~020, 완결): 코미디→고통 낙차. D급 재생 + 무재능 = 다중 체계 흡수. 결혼 마무리.
- Part 2 (EP021~070, 진행 중): 변두리 부강화 + 멸망 저지 전모 노출 + 첫 아들 탄생.
- Part 3 (EP071~, 미설계): 아들 성장 + 모든 기둥 치유 + 노화·죽음.
- 9대 지역, 9기둥 = 이계 차단 배리어. 빌런(천인 평의회) 의도적 약화.

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

## 프로젝트 구조

```
src/
├── novel/              # 웹소설 리더 앱 (Vite + TS)
│   ├── chapters.ts     # EP 레지스트리 (raw import + 메타데이터)
│   ├── renderer.ts     # 마크다운 → HTML 렌더러
│   └── ...
├── data/novel/         # 챕터 원본 마크다운 (Vite 번들)
│   ├── arc1_azelia/   ~ arc6_kaizer/   # dclass-hero
│   ├── cm_*/                            # canned-master
│   ├── mf_*/                            # magitech-fire
│   └── ast_*/                           # asteropos

projects/                          # 5개 프로젝트 워크스페이스
├── dclass-hero/
│   ├── novel-config.md            # 중앙 설정 (target_platform·episode_dir·매핑·가드레일)
│   ├── _legacy_novel-config.md    # 마이그레이션 보존본
│   ├── episode/                   # EP001.md ~ EP{NNN}.md (신 파이프라인)
│   ├── revision/                  # 진행 추적
│   │   ├── create-plan.md / fix_plan.md / alive-tracker.md
│   └── _workspace/                # 에이전트 중간 산출물
├── canned-master/  magitech-fire/  asteropos/  british-food/

docs/
├── story/                         # dclass-hero 설정 바이블
│   ├── canon-quickref.md          # ★ 정본 12개 압축 매뉴얼 (모든 에이전트 1차 참조)
│   ├── characters.md  voice-guide.md
│   ├── worldbuilding.md  magic-systems.md
│   ├── foreshadowing.md           # 복선 25+개 (S/A/B/C 등급)
│   ├── protagonist-bible.md       # 강지호 성장 추적
│   ├── death-and-regression.md    # 모래시계·재생 메커닉
│   ├── tone-and-style.md          # 톤 / 금지 표현
│   ├── story-framework-6-30.md  story-framework-21-70.md
│   ├── chapter-log.md  timeline.md  glossary.md  region-connections.md
│   └── story-feedback-log.md  inline-feedback.json
├── narrative-style.md             # ★ 글로벌 서술체 v2 (모든 작품 적용 — tone-and-style보다 우선)

.claude/
├── agents/                        # 18 에이전트 (awesome-novel-studio)
└── skills/                        # 10 스킬
```

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

## EP 등록 (신 파이프라인)

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

### 2. 리더 등록 (`src/novel/chapters.ts`)
- raw import + CHAPTERS 배열 항목 (id: `EPxxx` 또는 프로젝트별 prefix)
- 마이그레이션 메모: `ch/cm/mf/ast prefix → EP{NNN} 통일`

### 3. 메타 (`projects/{project}/episode/_episode_meta.json` 또는 동등 구조)
프로젝트별 합성키 ID + summary + status

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
15. EP 분량 5,000~7,000자 (공백 포함) — Part 2
16. ~~한 줄 단락 5~7회 이내~~ → **글로벌 서술체 v2 우선** (단락 1~3줄 기본, 한줄 단락 제한 폐기)

**원칙 17 (2026-04-25 신규)**:
- **메인 서사 방향**: 주인공 무쌍 + 나라 부강 + 전쟁 승리. 마르코·검은 로브 등 미스터리 라인은 부차. 무쌍·부강·승리 후도 자조 톤 유지.

**기둥 치유 메커닉**: 3단 조건 (물리 접촉 + 디버깅 미니 시퀀스 + 외부 조력자 협력) + 매 지역 새 풀이 + 본인 수명 미세 지불. "손만 대면 해결" X.

---

## 글로벌 서술체 v2 (★ 1차 참조)

`docs/narrative-style.md` — 모든 작품·모든 신규 EP에 적용. 작품별 `tone-and-style.md`보다 **우선**.

핵심:
1. **단락 1~3줄 기본** — 클러스터 단일 줄바꿈, 빈 줄은 전환에만
2. **`'독백'` 작은따옴표 생각풍선 폐기** — 평서문 서술자 보이스에 융합. 명시 진입은 "그렇게 생각했다" 짧은 1줄로만 가끔
3. **묘사 = 감각 단문** (비유 절제)
4. **대사 핑퐁** 4~5턴 큰따옴표만, 지문 전환점에만
5. **클리프행어 단문** 클로징
6. **씬 전환** `---` + 시간 직설
7. **문장 길이** 호흡 단위 (체감 25~40자)
8. **미래 시점 예고** ("그때까지만 해도 ~ 거라고 생각했다")
9. **POV 캐릭터 밀착** — 외부 인물 내면 직접 서술 X

dclass-hero EP001~EP037 전체 소급 적용 완료 (2026-04-25).

---

## 현재 연재 현황 (dclass-hero)

| 범위 | 아크 | 상태 |
|---|---|---|
| EP001~005 | Arc 1 — 아젤리아 | published / writing |
| EP006~013 | Arc 2 — 솔라리스 | writing |
| EP014~020 | Arc 3 — 각성과 귀환 | writing |
| EP021~028 | Arc 4 — 내정의 해 | writing (8화 완료) |
| EP029~034 | Arc 5 — 사막의 캐러밴 | writing (6화 완료) |
| **EP035~037** | **Arc 6 — 강철의 궁정** | **writing (3화, 진입부)** |
| EP038~042 | Arc 6 후반 | 미착수 |
| EP043~070 | Arc 7~10 | 미착수 |

**Part 3 (EP071~)**: 미설계.

상세 EP별 상태: `projects/dclass-hero/novel-config.md` §10.

### EP 단위 plan 작성 시점
- **매크로**: EP070까지 정해짐 (story-framework-21-70.md)
- **마이크로 (4씬 비트)**: 각 아크 진입 시 `arcN_plan_EPNNN-MMM.md` 작성

### 한 번에 create할 EP수 권장
| 시나리오 | 권장 EP수 |
|---|---|
| 새 아크 첫 화 (EP029, EP035, EP043 등) | 1화 단독 (정착 검증) |
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
- **스토리 피드백**: `docs/story/story-feedback-log.md` (FB-XXX·SYNC-XXX)

---

## 핵심 레퍼런스

| 질문 | 읽을 곳 |
|---|---|
| 프로젝트 전체 설정? | `projects/{project}/novel-config.md` |
| 정본 압축본? | `docs/story/canon-quickref.md` (★ 1차 참조) |
| 글로벌 서술체? | `docs/narrative-style.md` (★ 1차 참조, tone-style보다 우선) |
| EP N의 플롯 비트? | `docs/story/story-framework-21-70.md` (Part 2) |
| 캐릭터 X 말투? | `docs/story/voice-guide.md` |
| 복선 X 배치/회수? | `docs/story/foreshadowing.md` |
| 모래시계 메커닉? | `docs/story/death-and-regression.md` + 가드레일 §11 (2026-04-25 리디파인) |
| 금지 표현? | `docs/story/tone-and-style.md` + canon-quickref |
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
