# novel-config.md — D급 스킬 이세계 용사

> awesome-novel-studio 파이프라인 중앙 설정 (마이그레이션 일자: 2026-04-26).
> 모든 에이전트가 이 파일을 읽어 프로젝트별 경로·플롯 가이드·설정문서를 자동 선택한다.
> 가드레일·세계관 노트의 원본은 `_legacy_novel-config.md` 참조.

---

## 1. 프로젝트 기본 정보

```yaml
project:
  name: "D급 스킬 이세계 용사"
  target_platform: "문피아"
  target_genre: "이세계 선형 멸망 저지물 (회귀·루프 없음, 9개 기둥 차례로 치유)"
  episode_dir: "projects/dclass-hero/episode/"
  work_dir: "projects/dclass-hero/revision/"
  design_dir: "projects/dclass-hero/design/"
```

---

## 2. 설정문서 매핑

### 2-1. 공통 문서 (모든 EP)

| 문서 키 | 경로 | 용도 |
|---------|------|------|
| character_core | projects/dclass-hero/design/characters.md | 20+ NPC 프로필, 관계, 동기, 호칭 |
| character_detail | projects/dclass-hero/design/voice-guide.md | 보이스표(종결어미·말버릇·대사 샘플), 호칭 규칙 |
| dialogue_dna | projects/dclass-hero/design/voice-guide.md | Dialogue DNA (캐릭터 고유 말투 패턴) |
| bootstrap | projects/dclass-hero/design/worldbuilding.md | 9대 지역, 종족, 세계수, 9기둥 메커닉 |
| writing_rules | CLAUDE.md | 16개 가드레일·집필 규칙 |

### 2-2. EP 범위별 설정문서

| EP 범위 | 레이블 | 플롯 가이드 경로 | 세부 플롯 가이드 (선택) | 세부 캐릭터 시트 (선택) |
|---------|--------|----------------|----------------------|----------------------|
| EP001~EP025 | Part 1 — 강림·아젤리아·솔라리스·각성 | projects/dclass-hero/design/story-framework-6-30.md | | |
| EP026~EP058 | Part 2 — 흑철 정복·우주 탄생·무협 차원 강림 | projects/dclass-hero/design/story-framework-21-70.md | | |
| EP059~EP075 | Part 3 Arc 10 — 회복과 동맹 | projects/dclass-hero/design/story-framework-59-158.md | projects/dclass-hero/design/D급스킬이세계용사_Part3-4_세부플롯_EP059-083.md | projects/dclass-hero/design/D급스킬이세계용사_Part3-4_세부캐릭터_EP059-083.md |
| EP076~EP083 | Part 3 Arc 11 진입부 — 강철 정찰 + 다마르 첫 정면 | projects/dclass-hero/design/story-framework-59-158.md | projects/dclass-hero/design/D급스킬이세계용사_Part3-4_세부플롯_EP059-083.md | projects/dclass-hero/design/D급스킬이세계용사_Part3-4_세부캐릭터_EP059-083.md |
| EP084~EP092 | Part 3 Arc 11 후반 — 강철 기둥 정복 | projects/dclass-hero/design/story-framework-59-158.md | (design-small 2차 예정 EP084~108) | (design-small 2차 예정) |
| EP093~EP110 | Part 3 Arc 12 — 빙 기둥 + 검은 로브 첫 정면 | projects/dclass-hero/design/story-framework-59-158.md | (design-small 예정) | projects/dclass-hero/design/D급스킬이세계용사_Part3-4_캐릭터시트.md |
| EP111~EP128 | Part 4 Arc 13 — 용 기둥 + 청월문 백스토리 회수 | projects/dclass-hero/design/story-framework-59-158.md | (design-small 예정) | projects/dclass-hero/design/D급스킬이세계용사_Part3-4_캐릭터시트.md |
| EP129~EP145 | Part 4 Arc 14 — 바다·모래 합본 + Phase C 진입 + 부자 공투 시작 | projects/dclass-hero/design/story-framework-59-158.md | (design-small 예정) | projects/dclass-hero/design/D급스킬이세계용사_Part3-4_캐릭터시트.md |
| EP146~EP158 | Part 4 Arc 15 — 천·심해 마무리 + 노인 자연사 + 결말 | projects/dclass-hero/design/story-framework-59-158.md | (design-small 예정) | projects/dclass-hero/design/D급스킬이세계용사_Part3-4_캐릭터시트.md |

### 2-3. 보조 참조

| 문서 키 | 경로 | 용도 |
|---------|------|------|
| protagonist_bible | projects/dclass-hero/design/protagonist-bible.md | 강지호 상세 (성격·재생 스킬·사망 기록·성장) |
| death_regression | projects/dclass-hero/design/death-and-regression.md | 기둥 흡수, 모래시계, 수명 대가 |
| tone_style | projects/dclass-hero/design/tone-and-style.md | 시점·문장·코미디↔비장 비율 |
| foreshadowing | projects/dclass-hero/design/foreshadowing.md | 복선 25+개 매트릭스 |
| timeline | projects/dclass-hero/design/timeline.md | 작중 시간선 |
| glossary | projects/dclass-hero/design/glossary.md | 용어 사전 |
| region_connections | projects/dclass-hero/design/region-connections.md | 지정학·교역·마르코 네트워크 |
| chapter_log | projects/dclass-hero/design/chapter-log.md | 화별 요약 (등장인물·설정·감정 아크·훅) |
| canon_quickref | projects/dclass-hero/design/canon-quickref.md | 정본 12개 압축 매뉴얼 |
| part34_bootstrap | projects/dclass-hero/design/D급스킬이세계용사_Part3-4_부트스트랩.md | Part 3·4 부트스트랩 확장 (EP059~158, 무협 차원/우주 3중 혈통/3 페이즈 전환) |
| part34_characters | projects/dclass-hero/design/D급스킬이세계용사_Part3-4_캐릭터시트.md | Part 3·4 캐릭터 시트 확장 (카에데·시즈루·노인·우주 성장형·4자 관계도) |
| part34_plot | projects/dclass-hero/design/story-framework-59-158.md | Part 3·4 플롯 훅 가이드 (6 아크 매크로 + 시간 압축 + 부자 정서 + 유료 전환) |
| narrative_style | (적용 안 함 — 2026-05-11 백업 정본화로 글로벌 서술체 v2 비적용) | dclass-hero에서는 정통 웹소설 톤 유지 |

---

## 3. 에이전트별 문서 매핑

### rule-checker
| 축 | 참조 문서 키 | 용도 |
|----|------------|------|
| VOICE | character_detail | 보이스표(종결어미·길이·패턴) 대조 |
| TITLE | character_detail | 호칭 규칙표(화자×청자 매트릭스) |
| BANNED | tone_style | 금지 표현, 영웅적 결의 대사 금지 등 |
| TRANS | — | grep 기반 (번역체) |

### story-analyst
| 축 | 참조 문서 키 | 용도 |
|----|------------|------|
| TIMELINE | timeline, plot_framework | EP별 확정 시간대, 사건 순서 |
| NUMBER | bootstrap, character_core | 9기둥·지역 수치 일관성 |
| PLAUSIBILITY | bootstrap, character_core | 능력·시대 고증 |

### platform-optimizer
| 축 | 참조 문서 키 | 용도 |
|----|------------|------|
| HOOK | plot_framework | EP별 훅 유형·감정강도 |
| OPENING | plot_framework | EP별 비트 구조 |
| MOBILE | (제약 해제) | dclass-hero에서는 단락·분량 제한 룰 미적용 — 정통 웹소설 호흡 유지 |

---

## 4. 현재 진행 현황 (2026-05-11 백업 정본화)

- **EP001~EP058 작성 완료** (사용자가 직접 추가 작성한 백업 정본 — `/Users/j6/재생스킬_원고_백업` 출처)
- 백업이 곧 정본. 글로벌 서술체 v2(`docs/narrative-style.md`)는 이 작품에서 **적용 안 함** — 정통 웹소설 톤 유지 (긴 단락·풍부한 묘사·1인칭 자조 톤 공존).
- **다음 작업**: EP059~EP158 신규 100화 (Part 3·4) 큰/작은 설계 재실행.
- Part 2 톤 공식: 코미디 2 : 비장 5 : 반전 3 (Part 1은 3:5:2) — 백업 기준 그대로.
- 챕터 분량: 5,000~25,000자 (공백 포함) — 백업 분량 폭 그대로 인정.

### 4-1. 톤 정책 (백업 정본화 이후)
- 정본 모델: `projects/dclass-hero/episode/EP001~EP058.md` (백업 원본 그대로).
- 정통 웹소설 톤 — 긴 단락 허용, 묘사 풍부, 비유 적극 활용.
- 1인칭 자조 + 객관 묘사 혼용 (백업 56화 등에서 메타 코멘트도 일부 존재).
- "작은따옴표 생각풍선" `'~'` **허용** (글로벌 서술체 v2의 폐기 규칙 미적용).
- 단락 길이 제한 **없음** (한 줄 단락 5~7회 제한 룰도 미적용).
- 모바일 가독성은 분량·문장 호흡으로 자연스럽게 — 강제 규칙 X.

상세 가드레일·아크 매크로 비트는 `_legacy_novel-config.md` §4~§5 참조.
