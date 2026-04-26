# novel-config.md — 마도 공학 프로그래머의 영생 프로젝트

> 이 파일은 집필 파이프라인(/create, /polish, /settings-sync)의 중앙 설정이다.
> 모든 에이전트가 이 파일을 읽어 프로젝트별 경로, 가드레일, 커스텀 축을 적용한다.

---

## 1. 프로젝트 기본 정보

```yaml
project:
  id: "magitech-fire"
  name: "마도 공학 프로그래머의 영생 프로젝트"
  target_platform: "self-published"
  target_genre: "이세계 마도 공학 × 돈벌이물 × 영생 서사"
  tone_reference: "달빛조각사 (3인칭 근접, 돈미새 서술)"
  length_target: "100화 완결 (4부 × 25화)"
  chapter_dir: "src/data/novel/"
  work_dir: "projects/magitech-fire/revision/"
  workspace_dir: "projects/magitech-fire/_workspace/"
  design_dir: "docs/story/magitech-fire/"
  status: "writing"
```

**로그라인**: 가난에 찌들어 췌장암으로 자살한 삼류 프로그래머가, 이세계의 유통기한 1년짜리 실험체 몸에 빙의한다. 그리고 깨닫는다 — 돈만 있으면 안 죽는다는 것을.

---

## 2. 설정문서 매핑

### 2-1. 공통 문서 (모든 아크)

| 문서 키 | 경로 | 용도 |
|---------|------|------|
| bootstrap | docs/story/magitech-fire/worldbuilding.md | 대륙, 연금술사 길드, 마도 공학자 길드, 귀족 체제, 호문클루스 경제 |
| magic_systems | docs/story/magitech-fire/magic-systems.md | 호문클루스 구조, 엘릭서 메커니즘, 마법진=코드 체계 |
| character_core | docs/story/magitech-fire/characters.md | 주요 NPC 프로필 (강신우, 이리스, 미다스, 그레고르, 세라핀, 에녹, 리노) |
| character_detail | docs/story/magitech-fire/voice-guide.md | 캐릭터 보이스표 (종결어미, 말버릇, 호칭, 대사 샘플) |
| protagonist_bible | docs/story/magitech-fire/protagonist-bible.md | 강신우 상세 바이블 (전생, 빙의 메커닉, 1인2역, 신체 개조, 성장) |
| tone_style | docs/story/magitech-fire/tone-and-style.md | 3인칭 근접 시점, 달빛조각사 문체, 돈미새 서술, 수치 박스 |
| foreshadowing | docs/story/magitech-fire/foreshadowing.md | 복선 매트릭스 (배치/회수 씬 쌍) |
| timeline | docs/story/magitech-fire/timeline.md | 작중 시간선 |
| glossary | docs/story/magitech-fire/glossary.md | 용어 사전 (엘릭서, 호문클루스 등급, 마도 공학 용어) |
| plot_framework | docs/story/magitech-fire/story-framework-100ch.md | 100화 전체 프레임워크 (4부 구조) |
| chapter_log | docs/story/magitech-fire/chapter-log.md | 화별 요약 (등장인물, 설정, 감정 아크, 훅) |
| feedback_log | docs/story/magitech-fire/story-feedback-log.md | 피드백 및 설정 동기화 기록 |

### 2-2. 아크 범위별 설정문서

| 아크 | 챕터 범위 | 레이블 | 챕터 디렉토리 | 플롯 가이드 | 상태 |
|------|----------|--------|-------------|------------|------|
| mf_part1_survival | ch001~ch025 | Part 1 — 연명 | src/data/novel/mf_part1_survival/ | docs/story/magitech-fire/story-framework-100ch.md | writing |
| mf_part2_invention | ch026~ch050 | Part 2 — 개발 | src/data/novel/mf_part2_invention/ | docs/story/magitech-fire/story-framework-100ch.md | planned |
| mf_part3_market | ch051~ch075 | Part 3 — 정치공작 | src/data/novel/mf_part3_market/ | docs/story/magitech-fire/story-framework-100ch.md | planned |
| mf_part4_synthesis | ch076~ch100 | Part 4 — 합성 | src/data/novel/mf_part4_synthesis/ | docs/story/magitech-fire/story-framework-100ch.md | planned |

---

## 3. 에이전트별 문서 매핑

### chapter-architect (설계도 추출)
| 참조 | 문서 키 | 용도 |
|------|---------|------|
| 플롯 구조 | plot_framework | 부별 플롯 비트, 엘릭서 경제 전환점, 1인2역 에피소드 |
| 세계관 | bootstrap | 대륙·세력·호문클루스 법적 지위 |
| 캐릭터 | character_core | 해당 부 등장인물, 동기, 관계 |
| 보이스 | character_detail | 등장인물 보이스 퀵레프 카드 |
| 주인공 | protagonist_bible | 현재 수명·잔고·신체 개조 단계 |
| 마법 체계 | magic_systems | 엘릭서 연비, 마법진 재구축 규칙 |
| 톤 | tone_style | 달빛조각사 문체, 수치 박스 삽입 |

### continuity-bridge (연속성 수집)
| 참조 | 문서 키 | 용도 |
|------|---------|------|
| 이전 2화 | chapter_dir + arc dir | 직전 2화 전문 정독 |
| 복선 | foreshadowing | 활성 복선 스레드 |
| 시간선 | timeline | 작중 절대 시간 교차검증 |
| 수명/잔고 | protagonist_bible | 현재 엘릭서 잔량, 금화 잔고, 신체 개조 단계 |
| 관계 추적 | alive-tracker.md | 캐릭터 관계 상태 (롤링 윈도우) |
| 챕터 로그 | chapter_log | 이전 화 설정 공개, 감정 아크 |

### chapter-creator (본문 집필)
| 참조 | 문서 키 | 용도 |
|------|---------|------|
| 설계도 | _workspace/01_blueprint | chapter-architect 산출물 |
| 연속성 | _workspace/02_continuity | continuity-bridge 산출물 |
| 보이스 | character_detail | 대사 작성 시 참조 |
| 톤 | tone_style | 3인칭 근접, 목적절 서술, 수치 박스 |
| 마법 체계 | magic_systems | 엘릭서 연비 계산, 마법진 묘사 |
| 가드레일 | novel-config.md §4 | 보존 가드레일 |

### quality-verifier (CREATE 모드)
| 축 | 참조 문서 키 | 용도 |
|----|------------|------|
| PLOT_BEAT | plot_framework | 설계도 비트 반영 |
| TIMELINE | timeline | 시간 마커 정합성 |
| ECONOMY | protagonist_bible | 수명·잔고 수치 연속성 |
| GUARDRAIL | novel-config.md §4 | 보존 가드레일 |
| CONTINUITY | _workspace/02_continuity | 연속성 보고서 반영 |
| HOOK | tone_style | 훅 강도 |
| CHAR_VOICE | character_detail | 대사-보이스표 일치 |
| CUSTOM | novel-config.md §5 | 커스텀 축 |

### rule-checker / story-analyst / alive-enhancer / revision-executor / revision-reviewer
(dclass-hero와 동일 체계. 참조 경로만 magitech-fire 문서로 치환.)

---

## 4. 보존 가드레일 (10개 불변 규칙)

교정/집필 시 절대 훼손하지 않는 요소. 모든 에이전트가 매 챕터 검증한다.

```markdown
1. **시점**: 3인칭 근접 (주로 강신우). 간헐적 조연 시점 전환 가능 (20% 이내).
   **"~했다. ~하기 위해서였다" 목적절 강제 서술 폐지.** 자연스러운 평이한 한국어로.

2. **내면 독백 톤**: 살아있는 사람의 실시간 반응.
   - 좋은 예: "뭐지? 이건 가..상현실인가?" / "일단 실험이 실패한 것으로 위장해야 된다."
   - 금지: 스프레드시트 나열 / 영어 혼용 / 회계사식 건조함
   - 표준 참조: tone-and-style.md §13 "사용자 원본 샘플"

3. **1인 2역 체계 고수** (Part 1 후반 이후):
   - 낮: 호문클루스 603호 — 감정 없음, 표정 없음
   - 밤(로브): 은거 마도 공학자 "미다스 씨"
   두 정체는 같은 사람이지만 제3자 앞에서는 절대 동시 노출 금지.

4. **실용주의 생존 본능 서술**: 강신우는 돈·시간·자원을 진지하게 계산하지만, 내면은 **감정이 섞인 절박함**이어야 함. 건조한 나열이나 영문 메타포 금지.

5. **엘릭서 경제 일관성**:
   - Part 1 초반: 1병 = 30일, 금화 150닢
   - Part 1 후반(1차 개조): 1병 = 90일
   - Part 2 후반(2차 개조): 1병 = 1년
   - Part 3 후반(3차 개조): 1병 = 3~5년
   - Part 4 (합성 성공): 자급자족 무제한
   역행 절대 불가. magic-systems.md 정본 참조.

6. **영혼 빙의 = 기밀**: 강신우 본인 영혼의 존재는 절대 노출 금지.
   발각 시 즉시 해부 대상. 세라핀의 진실 발견(Part 3 후반) 전까지 다른 조연에게 새지 않음.

7. **호문클루스 신체 스펙**:
   - 감각은 인간과 동일 (통증·감정·식욕)
   - 수면 불필요
   - **실험용 기본 = 일반인 근력·반응속도 2~3배** (강신우가 ch007에서 시현)
   - 엘릭서 중단 = 수일 내 사망
   - 대규모 손상은 엘릭서+마법진 수리 필요 (자연 회복 아님)

8. **회귀·루프 없음**: 죽으면 진짜 끝. 일방통행 이세계.

9. **프로그래머 기질 표현**: 용어(스택 트레이스·EOF·SaaS 등) 직접 노출 **전면 금지**.
   **"계산에 익숙한 뇌", "예산 없는 프로젝트 해온 본능", "문제를 단계별로 나누는 습관"** 식으로 **기질만** 드러내기. 챕터당 1~2회, 0회 가능.

10. **여성 캐릭터 묘사**: 과도한 외모 장황 묘사 금지. 절제가 오히려 매력.
    "은발, 기품 있는" 정도. "달빛을 머금은 실크같은 은발이..." 금지.

11. **영어·외래어 규칙**: 영어 단어·문장 본문 노출 **전면 금지**. IT 용어는 한국어 의역. 판타지 어휘(엘릭서·호문클루스·소울 등)는 허용.

12. **수치 박스**: **매 화 의무 조항 폐지**. 의미 있는 순간(탈출 전 상태 점검·자산 대이동·Stage 전환 등)에만 드물게 사용. 전체 1~2화에 1회 정도.
```

---

## 5. 커스텀 진단 축

### ECONOMY — 수명·잔고 수치 정합성

```yaml
custom_axis:
  name: ECONOMY
  description: "엘릭서 잔량·금화 잔고·신체 개조 단계 수치가 이전 화와 일관되는지 검증"
  agent: story-analyst
  reference: docs/story/magitech-fire/protagonist-bible.md §수치 추적
```

**탐지 키워드**: `엘릭서`, `금화`, `은화`, `수명`, `잔량`, `월세`, `잔고`
**판별 기준**:
- 엘릭서 잔량이 이전 화보다 증가 (주입 없이) → CRITICAL
- 잔고 수치가 수입·지출 로그와 불일치 → MAJOR
- 신체 개조 단계가 시간순 역행 → CRITICAL
- 금화/은화 환산 비율 오류 → MINOR (금화 1닢 = 은화 100닢 = 동화 10,000닢)

### DUAL_IDENTITY — 1인 2역 일관성

```yaml
custom_axis:
  name: DUAL_IDENTITY
  description: "603호/미다스 씨 이중 정체가 제3자 앞에서 동시 노출되지 않았는지 검증"
  agent: story-analyst
  reference: novel-config.md §4.3
```

**탐지 키워드**: `미다스`, `603호`, `호문클루스`, `주인`, `로브`
**판별 기준**:
- 제3자 앞에서 두 정체 동시 등장 → CRITICAL (Part 3 후반 세라 진실 장면 제외)
- 603호가 감정·지성 노출 → VIOLATION
- 미다스 씨의 외모·목소리가 강신우 맨얼굴로 노출 → CRITICAL

### PROGRAMMER_REF — 프로그래머 비유 정합성

```yaml
custom_axis:
  name: PROGRAMMER_REF
  description: "강신우의 IT/프로그래밍 비유가 삼류 프로그래머 배경에 일관되는지 검증"
  agent: story-analyst
  reference: docs/story/magitech-fire/protagonist-bible.md
```

**탐지 키워드**: `코드`, `버그`, `리팩토링`, `스펙`, `파싱`, `캐싱`, `루프`, `모듈`, `EOF`
**판별 기준**:
- 삼류 프로그래머가 모를 고급 전문 지식 시연 → VIOLATION
- IT 비유 3회+/챕터 → WARNING (과잉)
- 비유가 독자에게 불친절 (전문 용어 설명 없음) → MINOR

---

## 6. create 설정

```yaml
create:
  draft_chars: 6000-9000        # 웹소설 표준 분량으로 조정
  final_chars: 5500-8000
  dialogue_ratio: 20-45%
  max_scenes: 4
  continuity_lookback: 2
  hook_targets:
    opening_intensity: 3
    ending_intensity: 3
  point_scenes_per_chapter: 2
  dead_zone_threshold: 3000
  mandatory_elements:
    status_box: 0              # 의무 아님. 필요할 때만
    programmer_ref_max: 2      # 프로그래머 기질 드러내기 최대 2회, 0~1회 권장
    english_terms: 0           # 영어 노출 절대 금지
```

### create 가드레일 (보존 가드레일에 추가)

```markdown
- 챕터 시작 또는 중간에 [상태창] 박스 1회 이상 삽입
- 강신우의 내면 독백은 최소 2회 돈 계산으로 환산 (감정·판단 → 금화 환산)
- 1인 2역 장면에서 호칭 혼동 없도록 "603호" / "미다스 씨" 명확히 구분
- 새 등장인물 첫 씬은 3인칭 객관 묘사로 시작, 이후 강신우 관점으로 복귀
```

### polish 설정

```yaml
polish:
  max_revise_retry: 1
  silence_limit: 4
  aitone_threshold: 3
  banned_limits:
    있었다: 5
    고 있었다: 3
    것이었다: 1
    수 있었다: 3
    하게 되었다: 2
  silence_exception_characters: ["호문클루스 603호", "호문클루스 591호"]
  volume_tolerance: 15
```

> **침묵 예외**: 603호/591호는 역할상 의도적 침묵이 많으므로 침묵 상한 초과 허용.

---

## 7. 수치 교차검증 정본 우선순위

```markdown
1. protagonist_bible §수치 추적 — 엘릭서 잔량, 금화 잔고, 신체 개조 단계 (최우선)
2. magic_systems — 엘릭서 연비, 마법진 규칙, 호문클루스 등급
3. plot_framework — 부별 목표 수치, 경제 전환점
4. chapter_log — 이전 화에서 확정된 사실
5. 직전 2화 원문 — 서사 연속성
6. bootstrap — 세계관 매크로 수치
```

---

## 8. 챕터 파일 명명 규칙

```yaml
naming:
  pattern: "{global_num}_{korean_title}.md"
  examples:
    - "1_죽는게 돈이 덜 든다.md"
    - "2_호문클루스 603호.md"
  registry:
    arc_meta: "src/data/novel/{arc}/_arc_meta.json"
    chapters_ts: "src/novel/chapters.ts"
  import_format: "import chXXXRaw from '../data/novel/{arc}/{filename}?raw';"
```

---

## 9. 챕터 배포 파이프라인 (create 후)

```markdown
1. 챕터 파일 저장: src/data/novel/{arc_dir}/{num}_{title}.md
2. _arc_meta.json 업데이트: chapters 배열에 항목 추가
3. chapters.ts 업데이트:
   - raw import 추가
   - CHAPTERS 배열에 ChapterMeta 추가 (projectId: 'magitech-fire', status: 'writing')
4. npm run dev로 리더에서 즉시 확인
```

---

## 10. 현재 연재 현황

| 화 | 아크 | 상태 |
|----|------|------|
| ch001 (mf001) | mf_part1_survival | draft |
| ch002~ch005 | mf_part1_survival | planned → 집필 대상 |
