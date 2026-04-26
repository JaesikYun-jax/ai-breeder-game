# novel-config.md — 아스테로포스 (Asteropos)

> awesome-novel-studio 파이프라인 중앙 설정 (마이그레이션 일자: 2026-04-26).
> 제목 어원: Ἀστερωπός (Asteropos) — "별 같은 눈을 가진" (호메로스 서사시 표현).
> 원본 설정 노트: `_legacy_novel-config.md`.

---

## 1. 프로젝트 기본 정보

```yaml
project:
  name: "아스테로포스"
  target_platform: "문피아"
  target_genre: "정통 판타지 성장물 (검·마법, 에픽 스케일)"
  episode_dir: "projects/asteropos/episode/"
  work_dir: "projects/asteropos/revision/"
  design_dir: "docs/asteropos/"
```

---

## 2. 설정문서 매핑

### 2-1. 공통 문서 (모든 EP)

| 문서 키 | 경로 | 용도 |
|---------|------|------|
| character_core | docs/asteropos/characters.md | 캐릭터 핵심 정의·관계 |
| character_detail | docs/asteropos/characters.md | (별도 voice-guide 미존재 — 동일 파일 사용) |
| dialogue_dna | docs/asteropos/characters.md | Dialogue DNA (characters.md 내 섹션) |
| bootstrap | docs/asteropos/worldbuilding.md | 세계관·지역·종족 |
| writing_rules | CLAUDE.md | 집필 규칙 |

### 2-2. EP 범위별 설정문서

| EP 범위 | 레이블 | 플롯 가이드 경로 | 세부 플롯 가이드 (선택) | 세부 캐릭터 시트 (선택) |
|---------|--------|----------------|----------------------|----------------------|
| EP000~EP030 | 1막 — 양부모 마을·학원·자유 도시 | docs/asteropos/story-framework-1-30.md | | |

### 2-3. 보조 참조

| 문서 키 | 경로 | 용도 |
|---------|------|------|
| mechanics | docs/asteropos/mechanics.md | 마법·검술 메커닉 |
| foreshadowing | docs/asteropos/foreshadowing.md | 복선 매트릭스 |
| chapter_log | docs/asteropos/chapter-log.md | 화별 요약 |
| narrative_style | docs/narrative-style.md | 글로벌 서술체 v2 |

---

## 3. 에이전트별 문서 매핑

### rule-checker
| 축 | 참조 문서 키 |
|----|------------|
| VOICE | character_detail |
| TITLE | character_detail |
| BANNED | — |

### story-analyst
| 축 | 참조 문서 키 |
|----|------------|
| TIMELINE | chapter_log |
| NUMBER | bootstrap, mechanics |
| PLAUSIBILITY | mechanics, character_core |

### platform-optimizer
| 축 | 참조 문서 키 |
|----|------------|
| HOOK | plot guide (EP 범위별) |
| OPENING | plot guide (EP 범위별) |
| MOBILE | narrative_style |

---

## 4. 현재 진행 현황

- **EP000(프롤로그) ~ EP006 작성 완료**
- 다음 작성 대상: EP007~ (Arc 1 양부모 마을 후속)
- Arc 2(한자 마법학원), Arc 3(자유 도시) 진입 시 별도 framework 추가 예정

## 5. 분량 정책 (리더 카운트 기준)

| 구간 | 분량 | 비고 |
|------|------|------|
| 1~3 아크 | 4,500~5,500자 | 평균 5,000자 권장 |
| 4~6 아크 | 5,000~6,500자 | 평균 5,800자 권장 |
| 7~8 아크 | 5,500~7,000자 | 평균 6,200자 권장 |
| 프롤로그·서장 | 2,500~3,500자 | 예외 |

상한 7,000자 / 하한 4,500자. 측정: `node scripts/count-chars.mjs <file.md>` (macOS `wc -m`은 바이트 카운트라 부정확).
세부 정책은 [docs/asteropos/story-framework-1-30.md](../../docs/asteropos/story-framework-1-30.md) 참조.
