# novel-config.md — D급 스킬 이세계 용사

> 이 파일은 집필 파이프라인(/create, /polish, /rewrite)의 중앙 설정이다.
> 모든 에이전트가 이 파일을 읽어 프로젝트별 경로, 가드레일, 커스텀 축을 적용한다.

---

## 1. 프로젝트 기본 정보

```yaml
project:
  name: "D급 스킬 이세계 용사"
  target_platform: "self-published"       # Cloudflare Pages 자체 배포 (플랫폼 타겟 없음)
  target_genre: "이세계 회귀 루프물"
  chapter_dir: "src/data/novel/"           # Vite 번들 대상 챕터 원본
  work_dir: "projects/dclass-hero/revision/"
  workspace_dir: "projects/dclass-hero/_workspace/"
  design_dir: "docs/story/"
```

---

## 2. 설정문서 매핑

### 2-1. 공통 문서 (모든 아크)

| 문서 키 | 경로 | 용도 |
|---------|------|------|
| bootstrap | docs/story/worldbuilding.md | 9대 지역, 종족, 세계수, 기둥 구조, 세계관 규칙 |
| magic_systems | docs/story/magic-systems.md | 9개 독립 마법 체계 + 상성 |
| character_core | docs/story/characters.md | 20+ NPC 프로필 (관계, 동기, 배경) |
| character_detail | docs/story/voice-guide.md | 캐릭터 보이스표 (종결어미, 말버릇, 호칭 규칙, 대사 샘플) |
| protagonist_bible | docs/story/protagonist-bible.md | 강지호 상세 바이블 (성격, 재생 스킬, 사망 기록, 성장 궤적) |
| death_regression | docs/story/death-and-regression.md | 기둥 흡수 메커닉, 모래시계, 방출 규칙 |
| tone_style | docs/story/tone-and-style.md | 시점 규칙, 문장 스타일, 유머 규칙, 코미디→고통 공식 |
| foreshadowing | docs/story/foreshadowing.md | 복선 25+개 매트릭스 (배치/회수 씬 쌍) |
| timeline | docs/story/timeline.md | 작중 시간선 정리 |
| glossary | docs/story/glossary.md | 용어 사전 |
| region_connections | docs/story/region-connections.md | 지정학 관계, 마르코 네트워크, 교역 |
| plot_framework | docs/story/story-framework-6-30.md | 전체 스토리 프레임워크 (9 아크 구조) |
| chapter_log | docs/story/chapter-log.md | 화별 요약 (등장인물, 설정, 감정 아크, 훅) |
| feedback_log | docs/story/story-feedback-log.md | 피드백 및 설정 동기화 기록 |

### 2-2. 아크 범위별 설정문서

오케스트레이터가 이 테이블을 파싱하여 챕터 번호에 맞는 설정문서를 자동 선택한다.

| 아크 | 챕터 범위 | 레이블 | 챕터 디렉토리 | 플롯 가이드 | 세부 플롯 (선택) | 세부 캐릭터 (선택) | 상태 |
|------|----------|--------|-------------|------------|-----------------|-------------------|------|
| arc1_azelia | ch001~ch005 | Arc 1 — 아젤리아 | src/data/novel/arc1_azelia/ | docs/story/story-framework-6-30.md | — | — | published |
| arc2_solaris | ch006~ch030 | Arc 2 — 솔라리스 | src/data/novel/arc2_solaris/ | docs/story/story-framework-6-30.md | — | — | writing (ch006~ch012) |
| arc3_kaizer | ch031~ch055 | Arc 3 — 카이젤 | src/data/novel/arc3_kaizer/ | docs/story/story-framework-6-30.md | — | — | planned |
| arc4_frosthel | ch056~ch080 | Arc 4 — 프로스트헬 | src/data/novel/arc4_frosthel/ | docs/story/story-framework-6-30.md | — | — | planned |
| arc5_yonghwa | ch081~ch105 | Arc 5 — 용화국 | src/data/novel/arc5_yonghwa/ | docs/story/story-framework-6-30.md | — | — | planned |
| arc6_liberta | ch106~ch130 | Arc 6 — 리베르타 | src/data/novel/arc6_liberta/ | docs/story/story-framework-6-30.md | — | — | planned |
| arc7_celestia | ch131~ch155 | Arc 7 — 셀레스티아 | src/data/novel/arc7_celestia/ | docs/story/story-framework-6-30.md | — | — | planned |
| arc8_kazmor | ch156~ch180 | Arc 8 — 카즈모르 | src/data/novel/arc8_kazmor/ | docs/story/story-framework-6-30.md | — | — | planned |
| arc9_abyssal | ch181~ch205 | Arc 9 — 아비살 | src/data/novel/arc9_abyssal/ | docs/story/story-framework-6-30.md | — | — | planned |

> **파싱 규칙**:
> - 대상 챕터의 글로벌 번호(ch001, ch016 등)가 어느 아크 범위에 속하는지 확인
> - 세부 플롯 가이드가 있고 파일이 존재하면 우선 사용, 없으면 큰 설계 플롯 가이드
> - 범위 초과 시 마지막 아크의 문서를 사용하고 `[범위초과]` 경고 출력

---

## 3. 에이전트별 문서 매핑

### chapter-architect (설계도 추출)
| 참조 | 문서 키 | 용도 |
|------|---------|------|
| 플롯 구조 | plot_framework | 아크별 플롯 비트, 전환점, 기둥 흡수 시점 |
| 세계관 | bootstrap | 지역 설정, 종족, 세력 구도 |
| 캐릭터 | character_core | 해당 아크 등장인물, 동기, 관계 |
| 보이스 | character_detail | 등장인물 보이스 퀵레프 카드 추출 |
| 주인공 | protagonist_bible | 현재 상태, 능력, 정신 상태 |
| 기둥 메커닉 | death_regression | 기둥 흡수 프로토콜 (해당 시) |
| 톤 | tone_style | 코미디→고통 낙차 설계 |

### continuity-bridge (연속성 수집)
| 참조 | 문서 키 | 용도 |
|------|---------|------|
| 이전 2화 | chapter_dir + arc dir | 직전 2화 전문 정독 |
| 복선 | foreshadowing | 활성 복선 스레드 확인 |
| 시간선 | timeline | 작중 절대 시간 교차검증 |
| 기둥/모래시계 | death_regression | 모래시계 잔량, 기둥 흡수 이력 |
| 관계 추적 | alive-tracker.md | 캐릭터 관계 상태 (롤링 윈도우) |
| 챕터 로그 | chapter_log | 이전 화의 설정 공개, 감정 아크 |

### chapter-creator (본문 집필)
| 참조 | 문서 키 | 용도 |
|------|---------|------|
| 설계도 | _workspace/01_blueprint | chapter-architect 산출물 |
| 연속성 | _workspace/02_continuity | continuity-bridge 산출물 |
| 보이스 | character_detail | 대사 작성 시 보이스표 참조 |
| 톤 | tone_style | 시점 규칙, 문장 스타일, 유머 규칙 |
| 기둥 | death_regression | 기둥 흡수 묘사 프로토콜 (해당 시) |
| 가드레일 | novel-config.md §4 | 보존 가드레일 |

### quality-verifier (CREATE 모드)
| 축 | 참조 문서 키 | 용도 |
|----|------------|------|
| PLOT_BEAT | plot_framework | 설계도 비트가 챕터에 반영되었는지 |
| TIMELINE | timeline, death_regression | 시간 마커 정합성 |
| REGRESSION | death_regression | 재생/기둥 메커닉 일관성 |
| GUARDRAIL | novel-config.md §4 | 보존 가드레일 위반 여부 |
| CONTINUITY | _workspace/02_continuity | 연속성 보고서 항목 반영 |
| HOOK | tone_style | 코미디→고통 낙차 훅 강도 |
| CHAR_VOICE | character_detail | 대사-보이스표 일치 |
| CUSTOM | novel-config.md §5 | 커스텀 축 위반 |

### rule-checker (규칙 위반 진단)
| 참조 | 문서 키 | 용도 |
|------|---------|------|
| 보이스 | character_detail | 보이스표 대사 1:1 대조 (VOICE) |
| 호칭 | character_detail + character_core | 호칭 매트릭스 (TITLE) |
| 가드레일 | novel-config.md §4 | 보존 가드레일 위반 여부 |

### story-analyst (서사 분석)
| 참조 | 문서 키 | 용도 |
|------|---------|------|
| 시간선 | timeline | TIMELINE 교차검증 |
| 기둥 메커닉 | death_regression | NUMBER 교차검증, REGRESSION 축 |
| 복선 | foreshadowing | FORESHADOW 축 |
| 주인공 | protagonist_bible | MODERN_REF 축 |
| 톤 | tone_style | TONEDROP 축 |
| 챕터 로그 | chapter_log | 인접 화 참조 |
| 세계관 | bootstrap | PLAUSIBILITY 검증 |
| 가드레일 | novel-config.md §4-§5 | 가드레일 + 커스텀 축 |

### alive-enhancer (생동감 강화)
| 참조 | 문서 키 | 용도 |
|------|---------|------|
| 보이스 | character_detail | 캐릭터 대사 패턴 |
| 캐릭터 | character_core | 조연 목표/동기 |
| 관계 추적 | alive-tracker.md | 관계 곡선, 비언어 메모리 |

### revision-executor (교정 실행)
| 참조 | 문서 키 | 용도 |
|------|---------|------|
| 보이스 | character_detail | VOICE 수정 시 참조 |
| 기둥 메커닉 | death_regression | NUMBER/REGRESSION 수정 시 참조 |
| 가드레일 | novel-config.md §4, §7 | 가드레일 + 수치 우선순위 |

### revision-reviewer (교정 검증)
| 참조 | 문서 키 | 용도 |
|------|---------|------|
| 시간선 | timeline | TIMELINE 최종 재검증 |
| 기둥 메커닉 | death_regression | NUMBER 최종 재검증 |
| 복선 | foreshadowing | FORESHADOW 최종 재검증 |
| 주인공 | protagonist_bible | 커스텀 축 최종 재검증 |
| 가드레일 | novel-config.md §4-§7 | 가드레일 + 수치 우선순위 + create 설정 |

---

## 4. 보존 가드레일

교정/집필 시 절대 훼손하지 않는 요소. 모든 에이전트가 매 챕터 검증한다.

```markdown
1. **시점 제한**: 1인칭 내면 독백 중심 (강지호). 타인 심리 직접 서술 금지.
   3인칭 전환 씬은 챕터의 30% 이내. `---` 구분선으로 전환 명시.

2. **재생 스킬 일관성**: D랭크 재생은 신경 세포까지 완벽 복구.
   고통에 대한 생리학적 내성 형성 불가. N번째 화상 = 1번째와 동일 강도.

3. **기둥 흡수 규칙**: 같은 기둥에 두 번 흡수되지 않음.
   지역의 본질이 흡수 양상에 반영. 흡수 중 0.3초 정지로 관찰 가능.

4. **모래시계 잔량 (감소만 허용)**:
   - 5화 끝: 25%
   - 솔라리스 아크 끝: 20%
   - 카이젤 아크 끝: 15%
   역행 절대 불가. 발동마다 감소.

5. **능력치 없음**: 분기/성장은 플래그·메타 플래그·호감도·루프 횟수로만 결정.
   숫자 빌드(STR/INT 등) 절대 금지.

6. **톤 공식**: 코미디로 시작해서 고통으로 착지.
   독자는 웃다가 얼어붙는 경험을 반복. 이 낙차가 핵심.

7. **문장 스타일**: 짧은 단문 위주.
   전투/사망 = 매우 짧음 (파편화). 분석/추론 = 길어짐. 유머 = 짧음 (펀치라인).

8. **마르코 일관성**: 모든 지역에서 "우연히" 같은 타이밍에 등장.
   "또 만났군" 패턴 유지. 최소 등장으로 최대 존재감.

9. **검은 로브 여인**: 지역마다 다른 직업이지만 같은 깨진 모래시계 목걸이.
   정체 힌트는 점진적 공개.

10. **대사 교환 불가성**: 각 캐릭터의 대사는 다른 캐릭터와 교환할 수 없어야 한다.
    voice-guide.md의 보이스표와 1:1 대조 필수.
```

---

## 5. 커스텀 진단 축

story-analyst / quality-verifier가 기본 축 외에 추가로 검증하는 프로젝트 고유 축.

### REGRESSION — 기둥/재생 설정 정합성

```yaml
custom_axis:
  name: REGRESSION
  description: "기둥 흡수, 재생 스킬, 모래시계 관련 서술이 death-and-regression.md 규칙과 일치하는지 검증"
  agent: story-analyst
  reference: docs/story/death-and-regression.md
```

**탐지 키워드**: `재생`, `기둥`, `흡수`, `모래시계`, `분해`, `방출`, `통증`, `신경`, `화상`
**판별 기준**:
- 고통 내성 획득 서술 → VIOLATION (신경 재생으로 불가)
- 같은 기둥 재흡수 → VIOLATION
- 모래시계 잔량 역행 → CRITICAL
- 흡수 프로토콜 6단계 순서 위반 → MAJOR
- 재생 시간이 death-and-regression.md 표와 불일치 → MAJOR

### FORESHADOW — 복선 정합성

```yaml
custom_axis:
  name: FORESHADOW
  description: "배치된 복선이 foreshadowing.md에 등록되어 있고, 회수 시점이 적절한지 검증"
  agent: story-analyst
  reference: docs/story/foreshadowing.md
```

**탐지 키워드**: 복선별 키워드 (foreshadowing.md 참조)
**판별 기준**:
- 등록되지 않은 복선 배치 → WARNING (등록 필요)
- 예정보다 이른 회수 → MAJOR
- 복선 모순 (배치 내용과 회수 내용 불일치) → CRITICAL

### MODERN_REF — 현대 지식 정합성

```yaml
custom_axis:
  name: MODERN_REF
  description: "강지호의 현대 지식 활용이 프로그래머 배경에 일관되는지 검증"
  agent: story-analyst
  reference: docs/story/protagonist-bible.md
```

**탐지 키워드**: `프로그래머`, `코드`, `버그`, `스펙`, `서버`, `웹소설`, `트로프`, `편의점`
**판별 기준**:
- 프로그래머/웹소설 독자가 모를 전문 지식 시연 → VIOLATION
- IT/개발 비유의 과잉 사용 (3회+/챕터) → WARNING
- 이세계물 트로프 인식이 실제 장르 관습과 불일치 → MINOR

---

## 6. create 설정

```yaml
create:
  draft_chars: 12000-18000        # 초안 목표 (넉넉하게 작성)
  final_chars: 10000-16000        # 트리밍 후 최종 목표
  dialogue_ratio: 35-55%          # 1인칭 내면 독백이 많으므로 대화 비율 낮음
  max_scenes: 5                   # 아크 기반 장편 챕터
  continuity_lookback: 2          # 이전 참조 화수
  hook_targets:
    opening_intensity: 3          # 오프닝 훅 (1-5)
    ending_intensity: 4           # 엔딩 클리프행어 (1-5)
  point_scenes_per_chapter: 2-3   # 포인트 장면 수
  dead_zone_threshold: 4000       # 포인트 장면 없는 최대 허용 글자수
```

### create 가드레일 (보존 가드레일에 추가)

```markdown
- 기둥 흡수 씬은 death-and-regression.md의 6단계 프로토콜을 반드시 준수
- 새 지역 첫 챕터는 3인칭 씬으로 지역 분위기를 먼저 보여준 뒤 지호 시점 전환
- 마르코 등장은 아크당 최대 2-3회. 등장 시점은 plot_framework 참조
```

### polish 설정

```yaml
polish:
  max_revise_retry: 1              # REVISE 시 재시도 최대 횟수
  silence_limit: 4                 # 챕터당 침묵 직접 서술 상한
  aitone_threshold: 3              # 신규 AITONE 패턴 auto-REVISE 임계값
  banned_limits:                   # 금칙어 상한 (rule-checker에서 사용)
    있었다: 5
    고 있었다: 3
    것이었다: 1
    수 있었다: 3
    하게 되었다: 2
  silence_exception_characters: [] # 침묵 예외 캐릭터 (이름 목록)
  volume_tolerance: 15             # 수정 전후 분량 변동 허용률 (%)
```

---

## 7. 수치 교차검증 정본 우선순위

수치 불일치 발견 시 어느 문서를 정본으로 삼을지 순서.

```markdown
1. death_regression — 모래시계 잔량, 재생 시간, 기둥 흡수 규칙 (최우선)
2. plot_framework — 아크별 기둥 유형, 예상 화수, 획득 능력
3. chapter_log — 이전 화에서 확정된 사실
4. 직전 2화 원문 — 서사 연속성
5. bootstrap — 세계관 매크로 수치
```

---

## 8. 챕터 파일 명명 규칙

```yaml
naming:
  pattern: "{global_num}_{korean_title}.md"
  examples:
    - "1_트럭이 오는 건 알고있었다.md"
    - "6_모래 위의 사람들.md"
    - "16_새로운_챕터_제목.md"
  registry:
    arc_meta: "src/data/novel/{arc}/_arc_meta.json"
    chapters_ts: "src/novel/chapters.ts"
  import_format: "import chXXXRaw from '../data/novel/{arc}/{filename}?raw';"
```

---

## 9. 챕터 배포 파이프라인 (create 후)

PASS 판정 후 오케스트레이터가 수행하는 자동 등록 절차:

```markdown
1. 챕터 파일 저장: src/data/novel/{arc_dir}/{num}_{title}.md
2. _arc_meta.json 업데이트: chapters 배열에 신규 항목 추가
3. chapters.ts 업데이트:
   - 파일 상단에 raw import 추가
   - CHAPTERS 배열에 ChapterMeta 항목 추가 (status: 'writing')
4. npm run dev로 리더에서 즉시 확인 가능
```

---

## 10. 현재 연재 현황

| 화 | 아크 | 파일 | 상태 |
|----|------|------|------|
| ch001 | arc1_azelia | 1_트럭이 오는 건 알고있었다.md | published |
| ch002 | arc1_azelia | 2_아젤리아 왕궁의 밤은 길다.md | published |
| ch003 | arc1_azelia | 3_용사라는 직업의 현실.md | published |
| ch004 | arc1_azelia | 4_이 세계에도 편의점은 없다.md | published |
| ch005 | arc1_azelia | 5_축복이라 쓰고 제물이라 읽는다.md | published |
| ch006 | arc2_solaris | 6_모래 위의 사람들.md | writing |
| ch007 | arc2_solaris | 7_정령은 계약서를 안 읽는다.md | writing |
| ch008 | arc2_solaris | 8_나이라의 별.md | writing |
| ch009 | arc2_solaris | 9_불은 기억한다.md | writing |
| ch010 | arc2_solaris | 10_쌍둥이 태양 아래서.md | writing |
| ch011 | arc2_solaris | 11_말라가는 사람들.md | writing |
| ch012 | arc2_solaris | 12_오아시스의 조건.md | writing |
