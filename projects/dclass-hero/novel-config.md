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
  design_dir: "docs/story/"
```

---

## 2. 설정문서 매핑

### 2-1. 공통 문서 (모든 EP)

| 문서 키 | 경로 | 용도 |
|---------|------|------|
| character_core | docs/story/characters.md | 20+ NPC 프로필, 관계, 동기, 호칭 |
| character_detail | docs/story/voice-guide.md | 보이스표(종결어미·말버릇·대사 샘플), 호칭 규칙 |
| dialogue_dna | docs/story/voice-guide.md | Dialogue DNA (캐릭터 고유 말투 패턴) |
| bootstrap | docs/story/worldbuilding.md | 9대 지역, 종족, 세계수, 9기둥 메커닉 |
| writing_rules | CLAUDE.md | 16개 가드레일·집필 규칙 |

### 2-2. EP 범위별 설정문서

| EP 범위 | 레이블 | 플롯 가이드 경로 | 세부 플롯 가이드 (선택) | 세부 캐릭터 시트 (선택) |
|---------|--------|----------------|----------------------|----------------------|
| EP001~EP020 | Part 1 — 아젤리아·솔라리스·각성 | docs/story/story-framework-6-30.md | | |
| EP021~EP070 | Part 2 — 부왕·기둥 치유·아들 탄생 | docs/story/story-framework-21-70.md | | |

### 2-3. 보조 참조

| 문서 키 | 경로 | 용도 |
|---------|------|------|
| protagonist_bible | docs/story/protagonist-bible.md | 강지호 상세 (성격·재생 스킬·사망 기록·성장) |
| death_regression | docs/story/death-and-regression.md | 기둥 흡수, 모래시계, 수명 대가 |
| tone_style | docs/story/tone-and-style.md | 시점·문장·코미디↔비장 비율 |
| foreshadowing | docs/story/foreshadowing.md | 복선 25+개 매트릭스 |
| timeline | docs/story/timeline.md | 작중 시간선 |
| glossary | docs/story/glossary.md | 용어 사전 |
| region_connections | docs/story/region-connections.md | 지정학·교역·마르코 네트워크 |
| chapter_log | docs/story/chapter-log.md | 화별 요약 (등장인물·설정·감정 아크·훅) |
| canon_quickref | docs/story/canon-quickref.md | 정본 12개 압축 매뉴얼 |
| narrative_style | docs/narrative-style.md | 글로벌 서술체 v2 (1차 참조) |

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
| MOBILE | narrative_style | 모바일 최적화 (한 줄 단락 5~7회 이내) |

---

## 4. 현재 진행 현황

- **EP001~EP037 작성 완료** (Arc 1~6 일부)
- 다음 작성 대상: EP038~ (Arc 6 강철의 궁정 후반)
- Part 2 톤 공식: 코미디 2 : 비장 5 : 반전 3 (Part 1은 3:5:2)
- 챕터 분량: 5,000~7,000자 (공백 포함)

상세 가드레일·아크 매크로 비트는 `_legacy_novel-config.md` §4~§5 참조.
