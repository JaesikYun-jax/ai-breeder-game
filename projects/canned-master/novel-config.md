# novel-config.md — 봉인당한 천마가 1093년 만에 풀려난 건에 대하여

> 집필 파이프라인(/create, /polish, /settings-sync)의 중앙 설정.
> 모든 에이전트가 이 파일을 읽어 프로젝트별 경로, 가드레일, 커스텀 축을 적용한다.

---

## 1. 프로젝트 기본 정보

```yaml
project:
  name: "봉인당한 천마가 1093년 만에 풀려난 건에 대하여"
  short_name: "canned-master"
  target_platform: "self-published"
  target_genre: "현대 판타지 — 회귀/환생 × 무협 × 복수극"
  chapter_dir: "src/data/novel/"
  work_dir: "projects/canned-master/revision/"
  workspace_dir: "projects/canned-master/_workspace/"
  design_dir: "docs/story/canned-master/"
  status: "writing"
```

---

## 2. 설정문서 매핑

### 2-1. 공통 문서 (모든 아크)

| 문서 키 | 경로 | 용도 |
|---------|------|------|
| bootstrap | docs/story/canned-master/worldbuilding.md | 신교·혈마공·봉인진·삼파(백·아베노·당) |
| character_core | docs/story/canned-master/characters.md | 주요 인물 프로필 (관계·동기·배경) |
| character_detail | docs/story/canned-master/voice-guide.md | 캐릭터 보이스표 (종결어미·말버릇·호칭) |
| protagonist_bible | docs/story/canned-master/protagonist-bible.md | 진무혈 바이블 (성격·무공·회복·감정 곡선) |
| death_regression | docs/story/canned-master/seal-regression.md | 봉인·업보·재생 메커닉 |
| tone_style | docs/story/canned-master/tone-and-style.md | 시점·문체·카타르시스 공식·섹시어필 가이드 |
| foreshadowing | docs/story/canned-master/foreshadowing.md | 복선 배치/회수 매트릭스 |
| timeline | docs/story/canned-master/timeline.md | 작중 시간선 (2019년 기준) |
| glossary | docs/story/canned-master/glossary.md | 용어 사전 |
| plot_framework | projects/canned-master/story-framework-1bu.md | 1부 전체 플롯 프레임워크 (ch001~ch030) |
| chapter_log | docs/story/canned-master/chapter-log.md | 화별 요약 |
| feedback_log | docs/story/inline-feedback.json | 인라인 피드백 기록 |

### 2-2. 아크 범위 테이블

| 아크 | 챕터 범위 | 레이블 | 챕터 디렉토리 | 플롯 가이드 | 상태 |
|------|----------|--------|-------------|------------|------|
| cm_arc1_opening | ch001~ch010 | Arc 1 — 개봉 | src/data/novel/cm_arc1_opening/ | projects/canned-master/story-framework-1bu.md | writing |
| cm_arc2_confront | ch011~ch020 | Arc 2 — 대면 | src/data/novel/cm_arc2_confront/ | projects/canned-master/story-framework-1bu.md | coming |
| cm_arc3_rebuild | ch021~ch030 | Arc 3 — 재건 | src/data/novel/cm_arc3_rebuild/ | projects/canned-master/story-framework-1bu.md | coming |

---

## 3. 시점 설정

- **주서술자**: 진무혈 (1인칭) + 하은·서연·빌런·환자 가족 (3인칭 제한시점)
- **시점 비중 규칙**: 한 챕터에 최대 3시점, 각 시점 최소 1,000자
- **다시점 필수**: 5화 연속 주인공 시점만 나오면 경고. 빌런/관찰자 시점 의무 삽입
- **시점 전환 마커**: `---` 구분선

---

## 4. 보존 가드레일

집필 시 반드시 지켜야 하는 10개 불변 규칙:

1. **1093년**: 봉인 기간 고정. 926년~2019년. 변경 금지.
2. **혈마공의 재생 원리**: 물(水) + 빛(光) 매개. 식물 속성. 고통 내성 형성 불가.
3. **설경 왼팔**: 봉인 당시 상실. 천 년 전 잘림. 무공 수위 낮아 재생 불가.
4. **진무혈 무공 회복 단계**: 각성 시 1할 → 6화 2할 → 9화 3할 → 1부말 7할. 단계별 서술 준수.
5. **혈마공 연둣빛 눈**: 회복될수록 짙어짐. 주화입마 감정 무뎌짐과 반비례.
6. **삼파 구도**: 백씨(한국/정재계) / 아베노(일본/음양사) / 당 무림(중국/뒷세계). 각자 목적 분리.
7. **서연의 병 = 봉인의 업보**: 백씨 후손이 짊어지는 업. 유전 아님.
8. **혈마공의 전파 방식**: 치유는 자의적 수용 시 효과 배가. 강제 주입 불가능.
9. **아리수 설정**: 한국 상수도 수질이 혈마공 회복에 최적.
10. **하은·서연 질투 구도**: 서로 은근한 견제. 대놓고 싸우지 않음. 진무혈은 둔감/의도적 무시.

---

## 5. 커스텀 축

기본 9축(SCENE, LOGIC, HOOK, OPENING, PACING, TONEDROP) 외에 이 프로젝트 고유 3축:

| 축 | 의미 | 위반 판정 |
|----|------|----------|
| CATHARSIS | 어그로-해소 낙차가 충분한가 | 챕터당 최소 1회. 어그로 빌드업 분량 30% 이상. |
| SEALING | 봉인·업보·재생 메커닉 일관성 | 1093년 고정·설경 왼팔·혈마공 단계 어김 여부 |
| SEXYAPPEAL | 은은한 매력 어필 배치 | 챕터당 2~4회. 과도/노골 금지. 조연 시점 간접 묘사만. |

---

## 6. create 설정

```yaml
create:
  draft_chars: 6000-8000
  final_chars: 5000-7000
  dialogue_ratio: 35-55%
  max_scenes: 5
  continuity_lookback: 2
  hook_targets:
    opening_intensity: 3
    ending_intensity: 4
  catharsis_per_chapter: 1
  sexy_appeal_per_chapter: 2-4
  pov_switches_per_chapter: 0-2
```

---

## 7. 금지 표현

- em dash `—` 전면 금지 (AI 톤)
- "~이었다" 5회 이하
- "~고 있었다" 3회 이하
- "~것이었다" 1회 이하
- 성적 노골 묘사 금지 (매력 어필은 간접·은은하게만)
- "미라였다" 직접 서술 반복 금지 (3회 이하). 대신 "갈라진 피부" "바짝 마른 손" 등 감각 묘사

---

## 8. 현재 연재 현황

| 화 | 제목 | 아크 | 상태 | 집필일 |
|----|------|------|------|--------|
| 1화 | 손님 | Arc 1 | writing | 2026-04-17 |
| 2화 | 석관 | Arc 1 | writing | 2026-04-17 |
| 3화 | 조수석 | Arc 1 | writing | 2026-04-17 |
| 4화 | 아리수 | Arc 1 | writing | 2026-04-17 |
| 5화 | 부교주 | Arc 1 | writing | 2026-04-17 |
| 6화 | 남행 | Arc 1 | writing | 2026-04-17 |
| 7화 | 계곡 | Arc 1 | writing | 2026-04-17 |
| 8화 | 응급실 | Arc 1 | writing | 2026-04-17 |
| 9화 | 기적 | Arc 1 | writing | 2026-04-17 |
| 10화 | 서연 | Arc 1 | writing | 2026-04-17 |

---

## 9. 1부 구조 요약

```
Arc 1 (ch001~010): 개봉 — 각성·담양 치유·서연 등장·L타워 확보
Arc 2 (ch011~020): 대면 — 백가 직접 대결·김교수 처단·내부 균열
Arc 3 (ch021~030): 재건 — 신교 공식 재건·백가 와해·국제전 예고
```

상세 시놉시스: `projects/canned-master/story-framework-1bu.md`
