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
- Arc 2(라이덴 마법학원), Arc 3(자유 도시) 진입 시 별도 framework 추가 예정

## 5. 분량 정책 (재생용사와 통일, 2026-04-26 재정의)

- **챕터 분량: 5,000~7,000자** (공백 포함, 리더 카운트)
- **평균 6,000자 권장**
- **하한 5,000자 / 상한 7,000자** — 엄수
- **프롤로그·서장 예외**: 2,500~3,500자 (EP000은 1,607자로 이미 작성 — 유지)
- **측정**: `node scripts/count-chars.mjs <file.md>` (macOS `wc -m`은 바이트 카운트라 부정확)

> 이전 정책(1~3 아크 4,500~5,500자 / 4~6 아크 5,000~6,500자 / 7~8 아크 5,500~7,000자)은 폐기.
> 재생용사(dclass-hero) 정책과 통일하여 모든 아크 일률 5,000~7,000자.

세부 리듬 가이드(일상·사건 비중, 금안 발현 빈도 등)는 [docs/asteropos/story-framework-1-30.md](../../docs/asteropos/story-framework-1-30.md) 참조.

---

## 6. 보존 가드레일

재작성·창작 시 절대 훼손하지 않는 항목 (rewrite·create 스킬이 자동 로드).

1. **EP 분량 5,000~7,000자** (공백 포함, 리더 카운트) — 하한·상한 엄수. 프롤로그만 예외.
2. **시점**: 1인칭 X. 카엘 밀착 자유간접 (POV 캐릭터 밀착, 외부 인물 내면 직접 서술 X) — `docs/narrative-style.md` v2.
3. **금지 단어 (1~3 아크)**: "성석", "아스테로포스", "마계" — 1 아크 등장 X. 카엘 본인이 결합 메커닉의 진실을 모름.
4. **위장 톤 정착**: "신의 은총" + "현자의 재림" 별칭 + 능력 시연 시 의식적 위장 톤 ("우연이에요" 등).
5. **글로벌 서술체 v2 우선**: 작은따옴표 생각풍선 폐기, 평서문 융합. 단락 1~3줄 기본. 박자 시그니처 위치만(화당 1회).
6. **미래 예고 클로징** 패턴 유지 (ast000·ast001·ast003·ast006 끝 형식).
7. **chapter-log.md의 화별 비트·박힌 떡밥·감정 아크는 누적 캐논** — rewrite 시 분량 확장하더라도 비트·떡밥은 유지.
8. **누런 소가죽 안대 (FS-117)**: 결합 직후 한스가 만들어 줌 → ch003에서 빛 컨트롤 자각 후 안대 졸업. 이후 미사용.
9. **사라진 따뜻한 돌 (FS-115)**: 결합 직후 한스의 방 수색에서 사라짐 → 4 아크 회수.
10. **리나의 그늘 시드 (FS-110)**: "어차피 ~니까" 화법 유지.

---

## 7. Rewrite 보존 가드레일 (rewrite 스킬 전용)

- **스토리·플롯 비트는 유지**, 분량 확장 + 캐릭터 입체성 + 글로벌 서술체 v2 적용.
- **박힌 떡밥(FS-XXX)·등장 인물·감정 아크는 chapter-log.md의 누적 캐논과 정합**.
- **시간선·인벤토리 누적 상태(소지품·머릿속·능력 자각·관계)는 chapter-log.md "1 아크 종료 시점 카엘 인벤토리·상태"와 정합**.
- **카엘의 자조·위장 톤**, **한스의 부드러운 부성 + 정치 감각**, **이르마의 떨리는 손**, **리나의 단호한 보호 + 그늘** 보이스 보존.
- **외부 인물 내면 직접 서술 금지** (POV 카엘 밀착).
