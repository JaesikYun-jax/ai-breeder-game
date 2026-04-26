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

  # 글로벌 서술체 v2 (2026-04-25 도입 + 전체 소급)
  narrative_style: "docs/narrative-style.md"  # 1차 참조, 작품별 tone_style보다 우선
  legacy_quotes_until: null                    # 2026-04-25: 전체 소급 적용 — 모든 챕터 평서문 융합 강제
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
| plot_framework | docs/story/story-framework-6-30.md | Part 1 프레임워크 (ch006~030) |
| plot_framework_p2 | docs/story/story-framework-21-70.md | **Part 2 프레임워크 (ch021~070)** — 리트콘·새 가드레일·아크 구조 |
| chapter_log | docs/story/chapter-log.md | 화별 요약 (등장인물, 설정, 감정 아크, 훅) |
| feedback_log | docs/story/story-feedback-log.md | 피드백 및 설정 동기화 기록 |

### 2-2. 아크 범위별 설정문서

오케스트레이터가 이 테이블을 파싱하여 챕터 번호에 맞는 설정문서를 자동 선택한다.

| 아크 | 챕터 범위 | 레이블 | 챕터 디렉토리 | 플롯 가이드 | 세부 플롯 (선택) | 세부 캐릭터 (선택) | 상태 |
|------|----------|--------|-------------|------------|-----------------|-------------------|------|
| arc1_azelia | ch001~ch005 | Arc 1 — 아젤리아 | src/data/novel/arc1_azelia/ | docs/story/story-framework-6-30.md | — | — | published |
| arc2_solaris | ch006~ch013 | Arc 2 — 솔라리스 | src/data/novel/arc2_solaris/ | docs/story/story-framework-6-30.md | — | — | writing |
| arc3_awakening | ch014~ch020 | Arc 3 — 각성과 귀환 | src/data/novel/arc3_awakening/ | docs/story/story-framework-6-30.md | — | — | writing |
| arc4_internal | ch021~ch028 | Arc 4 — 내정의 해 | src/data/novel/arc4_internal/ | docs/story/story-framework-21-70.md | — | — | planned |
| arc5_caravan | ch029~ch034 | Arc 5 — 사막의 캐러밴 | src/data/novel/arc5_caravan/ | docs/story/story-framework-21-70.md | — | — | planned |
| arc6_kaizer | ch035~ch042 | Arc 6 — 강철의 궁정 | src/data/novel/arc6_kaizer/ | docs/story/story-framework-21-70.md | — | — | planned |
| arc7_frosthel | ch043~ch050 | Arc 7 — 얼어붙은 경계 | src/data/novel/arc7_frosthel/ | docs/story/story-framework-21-70.md | — | — | planned |
| arc8_dragon | ch051~ch058 | Arc 8 — 천명 너머 | src/data/novel/arc8_dragon/ | docs/story/story-framework-21-70.md | — | — | planned |
| arc9_liberta | ch059~ch064 | Arc 9 — 파도의 맹세 | src/data/novel/arc9_liberta/ | docs/story/story-framework-21-70.md | — | — | planned |
| arc10_return | ch065~ch070 | Arc 10 — 돌아온 자 | src/data/novel/arc10_return/ | docs/story/story-framework-21-70.md | — | — | planned |

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

8. **마르코 일관성** (2026-04-25 빈도 축소):
   - "또 만났군" 패턴 유지. 최소 등장 최대 존재감.
   - **아크당 0~1회 등장으로 제한** (누적 ch004·020·022·028·032·034·036 7회는 과다).
   - 신규 챕터(ch038~) 마르코 등장은 핵심 정보 전달이나 구조적 전환점에만. 안 나오는 아크가 더 많아도 된다.
   - 등장 시 짧고 결정적, 정체 모호.

9. **검은 로브 여인**: 지역마다 다른 직업이지만 같은 깨진 모래시계 목걸이.
   정체 힌트는 점진적 공개.

10. **대사 교환 불가성**: 각 캐릭터의 대사는 다른 캐릭터와 교환할 수 없어야 한다.
    voice-guide.md의 보이스표와 1:1 대조 필수.

11. **모래시계 메커닉** (2026-04-25 리디파인):
    - **사용자 의지 도구화 금지**: 흔들기·돌리기·발동 절대 X. 들여다본다·관찰 OK.
    - **박자 어긋남 디테일 묘사 폐기**: "한 박자 빠르게", "반 박자 어긋남", "박자 가속", "한 호흡 어긋남" 어휘 신규 챕터(ch038~) 사용 금지.
    - **잔량 한 알 감소** 미세 카운트다운도 절제: 큰 변화·플롯 전환점에만 (Arc당 0~1회).
    - **두 가지 극적 용도로만 등장**:
      (a) 종말 남은 시간 자각 → 지호가 서두르게 만드는 트리거 (위기·결정 순간, Arc당 1~2회)
      (b) 위험 시 자동 발동 — 주마등 효과로 시간 가속, 재생 완료 또는 판단 보조 (Arc당 0~1회). **자동 발동은 지호 의지 X**, 지호가 부르려 해도 안 됨. 대가: 잔량 미세 감소 + 본인 수명 미세 지불(Arc 7~ 흰머리 누적).
    - **묘사 톤**: 짧고 무게감만. 디테일 디스크립션 금지.
    - **이전 챕터 박자 묘사** (ch029~037): 톤 다운 1패스 (박자 어휘 → 무게감/자각 톤으로 치환).
    - ch005에서의 0.3초 정지는 일회성 동기화 현상으로 재해석. 마르코가 ch022에서 진실 공개.

12. **정령 수명 대가의 비대칭** (Part 2~): 일반인은 머리색 탈색·수명 단축 큼.
    지호는 D급 재생 + 무재능 체질 덕에 미미. 다중 정령 계약 가능.
    노화 신호: Arc 7부터 흰머리 1가닥, Arc 10에서 명백히 보이지 X (Part 3에서 가속).
    챕터당 머리색 변화 묘사 1줄 이내.

13. **아젤리아 혁신은 프로그래머 가능 범위만** (Part 2~):
    가능: 행정 DB, 복식부기, 카드 색인, 공정 분업, 위생 가이드라인, 표음문자.
    불가: 증기기관, 화약, 금속 야금, 전기 — 시연 절대 금지.

14. **영웅적 결의 대사 금지** (Part 2~): 행동은 영웅이어도 1인칭 독백은 자조·돈미새·여미새 톤 유지.
    "이 세계를 구하겠다" 류 대사 절대 금지. 책임감은 행동으로만 보여줌.

15. **챕터 분량** (Part 2~): 5,000~7,000자 (구 10,000~16,000자에서 변경).

16. **단문 적용 범위 제한** (Part 2~): 한 줄 단락은 챕터당 5~7회 이내.
    전투·사망·펀치라인에만 단문. 일상·정서는 2~3문장을 쉼표/접속사로 묶음.
    1인칭 내면독백 비중 60% 이하 (Part 1은 ~70%).

17. **메인 서사 방향** (2026-04-25 강화): 주인공 무쌍 + 나라 부강 + 전쟁 승리가 메인 비트.
    - 정령술 + 문신 코딩 + D급 재생 + 기후 프로그래밍(FS-A11) 통합 운용으로 압도적 시연 점진 확대
    - 외교·기술·정령석 양산 등 부강 시연 매 아크 핵심
    - 큰 전쟁 (카이젤 내전·천인 평의회 충돌·이계 침공 격퇴 등) 결정적 승리
    - **§14 영웅적 결의 0회는 유지** — 무쌍·부강·승리 후도 자조 톤 ("이긴 게 아니라 이겨놓은 것")
    - 마르코·검은 로브 등 미스터리 라인은 부차 — 메인 비트에 종속
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
  # Part 2(ch021~) 분량 룰. Part 1은 이전 룰(10000-16000자)로 유지.
  draft_chars: 6000-8500          # 초안 목표 (Part 2)
  final_chars: 5000-7000          # 트리밍 후 최종 목표 (Part 2, 유저 지정)
  dialogue_ratio: 40-55%          # 대화 비율 소폭 상승(내면독백 경감)
  max_scenes: 3-4                 # 짧아진 챕터에 맞춰 축소
  continuity_lookback: 2          # 이전 참조 화수
  hook_targets:
    opening_intensity: 3          # 오프닝 훅 (1-5)
    ending_intensity: 4           # 엔딩 클리프행어 (1-5)
  point_scenes_per_chapter: 2     # 포인트 장면 수
  dead_zone_threshold: 2500       # 포인트 장면 없는 최대 허용 글자수
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
| ch007 | arc2_solaris | 7_불을 빌리는 자들.md | writing |
| ch008 | arc2_solaris | 8_계약.md | writing |
| ch009 | arc2_solaris | 9_모래폭풍.md | writing |
| ch010 | arc2_solaris | 10_꺼지지 않는 불.md | writing |
| ch011 | arc2_solaris | 11_명예로운 노예들.md | writing |
| ch012 | arc2_solaris | 12_최적화.md | writing |
| ch013 | arc2_solaris | 13_열사병은 걸리지 않는다.md | writing |
| ch014 | arc3_awakening | 14_이를 갈다.md | writing |
| ch015 | arc3_awakening | 15_번개를 맞는 자.md | writing |
| ch016 | arc3_awakening | 16_과부하.md | writing |
| ch017 | arc3_awakening | 17_코드를 새기다.md | writing |
| ch018 | arc3_awakening | 18_빛의 왕국으로.md | writing |
| ch019 | arc3_awakening | 19_심판.md | writing |
| ch020 | arc3_awakening | 20_용사의 길.md | writing |
| ch021 | arc4_internal | 21_부왕은 부왕이 아니다.md | writing |
| ch022 | arc4_internal | 22_재회.md | writing |
| ch023 | arc4_internal | 23_약한 세계의 용사.md | writing |
| ch024 | arc4_internal | 24_지하의 말.md | writing |
| ch025 | arc4_internal | 25_두 나라의 그림.md | writing |
| ch026 | arc4_internal | 26_솔라리스 가는 길.md | writing |
| ch027 | arc4_internal | 27_모래의 약속.md | writing |
| ch028 | arc4_internal | 28_비장의 무기.md | writing |
| ch029 | arc5_caravan | 29_사막의 새 호흡.md | writing |
| ch030 | arc5_caravan | 30_일곱 번째 오아시스.md | writing |
| ch031 | arc5_caravan | 31_정령석 작업장.md | writing |
| ch032 | arc5_caravan | 32_두 태양의 길.md | writing |
| ch033 | arc5_caravan | 33_모래 너머.md | writing |
| ch034 | arc5_caravan | 34_북쪽으로.md | writing |
| ch035 | arc6_kaizer | 35_강철의 첫날.md | writing |
| ch036 | arc6_kaizer | 36_강철의 식탁.md | writing |
| ch037 | arc6_kaizer | 37_변경의 침묵.md | writing |
