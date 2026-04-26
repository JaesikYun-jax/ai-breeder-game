# novel-config.md — 봉인당한 천마가 1093년 만에 풀려난 건에 대하여

> awesome-novel-studio 파이프라인 중앙 설정 (마이그레이션 일자: 2026-04-26).
> 가드레일·세계관 노트의 원본은 `_legacy_novel-config.md` 참조.

---

## 1. 프로젝트 기본 정보

```yaml
project:
  name: "봉인당한 천마가 1093년 만에 풀려난 건에 대하여"
  target_platform: "문피아"
  target_genre: "현대 판타지 — 회귀/환생 × 무협 × 복수극"
  episode_dir: "projects/canned-master/episode/"
  work_dir: "projects/canned-master/revision/"
  design_dir: "docs/story/canned-master/"
```

---

## 2. 설정문서 매핑

### 2-1. 공통 문서 (모든 EP)

| 문서 키 | 경로 | 용도 |
|---------|------|------|
| character_core | docs/story/canned-master/characters.md | 캐릭터 핵심 정의 |
| character_detail | docs/story/canned-master/voice-guide.md | 보이스표·호칭 규칙 |
| dialogue_dna | docs/story/canned-master/voice-guide.md | Dialogue DNA |
| bootstrap | docs/story/canned-master/worldbuilding.md | 세계관·천마종 설정 |
| writing_rules | CLAUDE.md | 집필 규칙 |

### 2-2. EP 범위별 설정문서

| EP 범위 | 레이블 | 플롯 가이드 경로 | 세부 플롯 가이드 (선택) | 세부 캐릭터 시트 (선택) |
|---------|--------|----------------|----------------------|----------------------|
| EP001~EP010 | Arc 1 — 개봉 | projects/canned-master/design/plot-hook-guide_act1.md | | |
| EP011~EP020 | Arc 2 — 대면 | projects/canned-master/design/plot-hook-guide_act2.md | | |

### 2-3. 보조 참조

| 문서 키 | 경로 | 용도 |
|---------|------|------|
| protagonist_bible | docs/story/canned-master/protagonist-bible.md | 천마 (백준하) 상세 |
| seal_regression | docs/story/canned-master/seal-regression.md | 봉인·환생 메커닉 |
| tone_style | docs/story/canned-master/tone-and-style.md | 시점·문장 스타일 |
| foreshadowing | docs/story/canned-master/foreshadowing.md | 복선 매트릭스 |
| timeline | docs/story/canned-master/timeline.md | 작중 시간선 |
| glossary | docs/story/canned-master/glossary.md | 용어 사전 |
| chapter_log | docs/story/canned-master/chapter-log.md | 화별 요약 |
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
| NUMBER | bootstrap, character_core |
| PLAUSIBILITY | character_core |

### platform-optimizer
| 축 | 참조 문서 키 |
|----|------------|
| HOOK | plot guide (EP 범위별) |
| OPENING | plot guide (EP 범위별) |
| MOBILE | narrative_style |

---

## 4. 현재 진행 현황

- **EP001~EP020 작성 완료** (Arc 1·2)
- Arc 3 이후 플롯 가이드는 `design/`에 추가 예정 (placeholder TBD)
