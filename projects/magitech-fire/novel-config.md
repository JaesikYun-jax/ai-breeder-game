# novel-config.md — 마도 공학 프로그래머의 영생 프로젝트

> awesome-novel-studio 파이프라인 중앙 설정 (마이그레이션 일자: 2026-04-26).
> 톤 레퍼런스: 달빛조각사 (3인칭 근접, 돈미새 서술).
> 원본 설정 노트: `_legacy_novel-config.md`.

---

## 1. 프로젝트 기본 정보

```yaml
project:
  name: "마도 공학 프로그래머의 영생 프로젝트"
  target_platform: "문피아"
  target_genre: "이세계 마도 공학 × 돈벌이물 × 영생 서사"
  episode_dir: "projects/magitech-fire/episode/"
  work_dir: "projects/magitech-fire/revision/"
  design_dir: "docs/story/magitech-fire/"
```

**로그라인**: 가난에 찌들어 췌장암으로 자살한 삼류 프로그래머가, 이세계의 유통기한 1년짜리 실험체 몸에 빙의한다. 그리고 깨닫는다 — 돈만 있으면 안 죽는다는 것을.

---

## 2. 설정문서 매핑

### 2-1. 공통 문서 (모든 EP)

| 문서 키 | 경로 | 용도 |
|---------|------|------|
| character_core | docs/story/magitech-fire/characters.md | 캐릭터 핵심 정의 |
| character_detail | docs/story/magitech-fire/voice-guide.md | 보이스표·호칭 규칙 |
| dialogue_dna | docs/story/magitech-fire/voice-guide.md | Dialogue DNA |
| bootstrap | docs/story/magitech-fire/worldbuilding.md | 세계관·마도 공학 |
| writing_rules | CLAUDE.md | 집필 규칙 |

### 2-2. EP 범위별 설정문서

| EP 범위 | 레이블 | 플롯 가이드 경로 | 세부 플롯 가이드 (선택) | 세부 캐릭터 시트 (선택) |
|---------|--------|----------------|----------------------|----------------------|
| EP001~EP100 | 100화 완결 (4부 × 25화) | docs/story/magitech-fire/story-framework-100ch.md | | |

### 2-3. 보조 참조

| 문서 키 | 경로 | 용도 |
|---------|------|------|
| protagonist_bible | docs/story/magitech-fire/protagonist-bible.md | 주인공 상세 |
| magic_systems | docs/story/magitech-fire/magic-systems.md | 마도 공학 체계 |
| tone_style | docs/story/magitech-fire/tone-and-style.md | 시점·문장 스타일 (3인칭 근접) |
| foreshadowing | docs/story/magitech-fire/foreshadowing.md | 복선 매트릭스 |
| timeline | docs/story/magitech-fire/timeline.md | 작중 시간선 |
| glossary | docs/story/magitech-fire/glossary.md | 용어 사전 |
| chapter_log | docs/story/magitech-fire/chapter-log.md | 화별 요약 |
| feedback_log | docs/story/magitech-fire/story-feedback-log.md | 피드백 기록 |
| narrative_style | docs/narrative-style.md | 글로벌 서술체 v2 |

---

## 3. 에이전트별 문서 매핑

### rule-checker
| 축 | 참조 문서 키 |
|----|------------|
| VOICE | character_detail |
| TITLE | character_detail |
| BANNED | tone_style |

### story-analyst
| 축 | 참조 문서 키 |
|----|------------|
| TIMELINE | timeline, chapter_log |
| NUMBER | bootstrap, magic_systems |
| PLAUSIBILITY | magic_systems, character_core |

### platform-optimizer
| 축 | 참조 문서 키 |
|----|------------|
| HOOK | plot guide (EP 범위별) |
| OPENING | plot guide (EP 범위별) |
| MOBILE | narrative_style |

---

## 4. 현재 진행 현황

- **EP001~EP005 작성 완료** (Part 1 연명 도입부)
- 다음 작성 대상: EP006~ (Part 1 후반)
