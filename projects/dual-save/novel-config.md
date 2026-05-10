# novel-config.md — 「부모님이 도윤마무를 걸어버렸다」

> awesome-novel-studio 파이프라인 중앙 설정 (작성 일자: 2026-05-10).
> 모든 에이전트가 이 파일을 읽어 프로젝트별 경로·플롯 가이드·설정문서를 자동 선택한다.
>
> **이 초안은 큰 설계 직후 자동 생성되었습니다. 검토 후 보존 가드레일·EP 범위·커스텀 축을 조정하세요.**

---

## 1. 프로젝트 기본 정보

```yaml
project:
  name: "부모님이 도윤마무를 걸어버렸다"
  slug: "dual-save"
  target_platform: "문피아"
  target_genre: "회귀물 + 헌터물 + 차원 이동 만류귀종 (현대판타지)"
  episode_dir: "projects/dual-save/episode/"
  work_dir: "projects/dual-save/revision/"
  design_dir: "projects/dual-save/design/"
  episode_format: "5,500자 ± 500자"
  total_episodes_target: "200~250화 (1년+ 연재)"
```

---

## 2. 설정문서 매핑

### 2-1. 공통 문서 (모든 EP)

| 문서 키 | 경로 | 용도 |
|---------|------|------|
| character_core | projects/dual-save/design/dual-save_캐릭터시트.md | 캐릭터 핵심 프로필·관계·호칭·12명 캐스트 |
| character_detail | projects/dual-save/design/dual-save_캐릭터시트.md | 보이스 톤 다이얼·비언어 태그·시그니처 대사 |
| dialogue_dna | projects/dual-save/design/dual-save_캐릭터시트.md#dialogue-dna | Dialogue DNA — 도윤·부모·빌런·조력자별 말투 패턴 |
| bootstrap | projects/dual-save/design/dual-save_부트스트랩.md | 컨셉·세계관·핵심 역량 모듈·플랫폼 전략·보존 가드레일 |
| plot_framework | projects/dual-save/design/dual-save_플롯훅가이드.md | 8개 아크·25화 마일스톤·R4 격동기 매핑·빌런 대결·로맨스·유료 전환 |
| writing_rules | CLAUDE.md | 글로벌 서술체 v2·금지 표현·집필 규칙 |
| narrative_style | docs/narrative-style.md | 글로벌 서술체 v2 (1차 참조) |

### 2-2. EP 범위별 설정문서 (8개 아크)

| EP 범위 | 레이블 | 플롯 가이드 경로 | 세부 플롯 가이드 (선택) | 세부 캐릭터 시트 (선택) |
|---------|--------|----------------|----------------------|----------------------|
| EP001~EP005 | Arc 1 — 자각 (1차 사이클: 부자→A급→자살) | projects/dual-save/design/dual-save_플롯훅가이드.md | projects/dual-save/design/dual-save_세부설계_1~10화.md | projects/dual-save/design/dual-save_세부설계_1~10화.md |
| EP006~EP010 | Arc 2 — 준비성 만렙 (차원 이동 준비) | projects/dual-save/design/dual-save_플롯훅가이드.md | projects/dual-save/design/dual-save_세부설계_1~10화.md | projects/dual-save/design/dual-save_세부설계_1~10화.md |
| EP011~EP025 | Arc 3 — 무협 차원 입문 (정파·25화 유료 클리프) | projects/dual-save/design/dual-save_플롯훅가이드.md | | |
| EP026~EP050 | Arc 4 — 무협 정점 (마교·검결 통달·1차 자살 회귀) | projects/dual-save/design/dual-save_플롯훅가이드.md | | |
| EP051~EP100 | Arc 5 — 판타지 차원 (마법탑·1차 빌런 재대결) | projects/dual-save/design/dual-save_플롯훅가이드.md | | |
| EP101~EP150 | Arc 6 — 선협 차원 (도술·연단·부모 살해범 첫 등장) | projects/dual-save/design/dual-save_플롯훅가이드.md | | |
| EP151~EP200 | Arc 7 — 검술 정점 (일검만류·메인 빌런 첫 등장) | projects/dual-save/design/dual-save_플롯훅가이드.md | | |
| EP201~EP250 | Arc 8 — 종국 (만류귀종 완성·도윤마무 해주) | projects/dual-save/design/dual-save_플롯훅가이드.md | | |

### 2-3. 리서치 자료 (참조용)

| 문서 키 | 경로 | 용도 |
|---------|------|------|
| research_genre | projects/dual-save/_workspace/00_research/R1_장르DNA.md | 회귀물 5대 코어·자조 마지노선 |
| research_platform | projects/dual-save/_workspace/00_research/R2_플랫폼전략.md | 문피아 도입부·25화·50화·100화 절대값 |
| research_industry | projects/dual-save/_workspace/00_research/R3_업계구조.md | 한국 헌터 협회 3층 구조·이중 포털 룰 |
| research_timeline | projects/dual-save/_workspace/00_research/R4_사건연표.md | ★ 격동기 18~22개 이벤트 (1차 사이클 800억 절대값) |
| research_competitors | projects/dual-save/_workspace/00_research/R5_기존작분석.md | 화산귀환·전독시 등 차별화 포지셔닝 |
| research_conflicts | projects/dual-save/_workspace/00_research/R6_갈등사례.md | 빌런 3층 시트·차원별 빌런 톤 |
| research_r7 | projects/dual-save/_workspace/00_research/R7_전문지식_1~10화.md | EP001~010 전문 지식 디테일 (episode-creator 인용) |
| research_r8 | projects/dual-save/_workspace/00_research/R8_사건상세_1~10화.md | EP001~010 사건 상세 시간선 (★ 작품 캐논 절대값) |
| intro_finalized | projects/dual-save/_workspace/05_intro_v2.md | ★ 도입부 1~10화 비트 절대값 |

---

## 3. 에이전트별 문서 매핑

### rule-checker
| 축 | 참조 문서 키 | 용도 |
|----|------------|------|
| VOICE | character_detail, dialogue_dna | 보이스 톤 다이얼·종결어미·시그니처 대사 |
| TITLE | character_core | 호칭 표 (도윤↔부모/조력자/빌런/차원 토착민) |
| BANNED | bootstrap | 영웅적 결의 절대 금지·"박자" 회피·시 톤 회피 |
| TRANS | — | grep 기반 (번역체) |

### story-analyst
| 축 | 참조 문서 키 | 용도 |
|----|------------|------|
| TIMELINE | plot_framework, research_timeline | R4 격동기 사건 시점·도윤 1차 사이클 800억 매핑 |
| NUMBER | bootstrap, plot_framework | 자산 수치(1억→800억→수천억)·등급(F→A→S)·잔여 횟수 |
| PLAUSIBILITY | bootstrap, research_industry | 한국 헌터 협회 룰·이중 포털 룰·차원 이주민 시스템 정합 |
| FORESHADOW | plot_framework | 부모 미스터리 단계적 노출 (25/50/100/200화) |

### platform-optimizer
| 축 | 참조 문서 키 | 용도 |
|----|------------|------|
| HOOK | plot_framework | 회당 클리프행어 5대 패턴·시그니처 대사 |
| OPENING | plot_framework, intro_finalized | 1~10화 비트 절대값 |
| MOBILE | narrative_style | 글로벌 서술체 v2 (단락 1~3줄·산문 호흡) |

### alive-enhancer
| 축 | 참조 문서 키 | 용도 |
|----|------------|------|
| 메아리 | dialogue_dna | 캐릭터별 말투 차별화 |
| 침묵→비언어 | character_detail | 비언어 태그 카탈로그 |
| 관계 곡선 | character_core | 관계망 5축·차원별 토착민 비극형 로맨스 |

---

## 4. 보존 가드레일 (★ 7개)

부트스트랩 §7에서 추출. 이 가드레일은 본작의 시그니처를 보존하기 위한 **절대 규칙**이다.

### G1. 자조 5~7% 마지노선 (★ 매우 중요)
- 자조 분량: 5% 마지노선 (5화 좌절 시 일시 7% 허용)
- 자조 → 행동 1:5 비율 (자조 1줄 → 5줄 이내 행동·결정·사이다 전환)
- **영웅적 결의 대사 절대 금지** — 행동만 영웅, 독백은 자조

### G2. 도윤마무 시스템 메시지 시그니처 (변형 금지)
```
『저주 발동: 도윤마무.』
『앵커로 회귀합니다.』
```
- 매 회차 자각 시 필수 노출
- 변형·축약·확장 금지

### G3. 미래 정보 = R4 사건 연표 절대값
- 도윤이 활용하는 미래 정보는 R4 격동기(2033~2036) 18~22개 이벤트 *수치 그대로*
- 종목명·시점·변동률·금액을 본문에 녹임 → 정보 우위 사이다 *구체화*
- 1~5화 자산 누적의 절대값: 1화 노트 메모 → 2화 1억 → 3화 800억 → 4화 수천억

### G4. 준비성 만렙 캐릭터 톤 (★ 캐릭터 정체성)
- 영웅 톤 X / 효율 마니아 / 짐꾼 출신 현실주의 / 거래자 마인드
- 한 줄 정의: *"준비할 수 있는 모든 걸 준비하고, 안 되면 죽고 다시 시작하는 자."*
- 거래자 마인드 시그니처: *"~로 시작할까요"* (1주 1억 / 50억 시작 / 거래 무대)

### G5. 부모 미스터리 페이싱 (★ 단계적 노출)
- 1차 사이클: 도윤이 영원히 *어떤 고대 유물* 윤곽만 잡음
- 25화·50화·100화·200화·300화 단계적 노출
- *시간 신*이라는 단어는 *100화 이후*에 처음 등장
- *대회수자 결사*는 *200화 이후*
- *부모 살해범 #7*은 *50~70화 이후* 첫 등장 → *200화 추적* → *300화 처단*

### G6. 차원 순서 엄수 (★ 만류귀종 골격)
1. 무협 (★ 첫) — EP011~050
2. 판타지 — EP051~100
3. 선협 — EP101~150
4. 검술 정점 — EP151~200
5. 종국 (지구·차원 너머) — EP201~250

### G7. 자살 회귀 시그니처 (변형 금지)
- 매 차원 마지막에 *옥상/산속/탑/절벽에서 웃으며 자살*
- 시그니처 대사: *"도윤마무, 거래를 다시 하러 왔습니다."*
- 자살 직전 단락: *그쪽 사람들의 표정이 회귀 후 신촌 반지하 천장에서 떠오름*
- 50화 무협=산속 절벽 / 100화 판타지=마법탑 옥상 / 150화 선협=천도 절벽 / 200화 검술 정점=검신 묘 앞

---

## 5. 추가 커스텀 축 (검토 후 추가 가능)

### 도윤 보이스 시그니처 KPI
- 매 화 *시그니처 자조 1번* 의무 (예: *"부모님, 거래의 무대가 좀 멀어집니다"*)
- 매 화 *거래자 마인드 대사 1번* 권장 (*"~로 시작할까요"*)

### 차원별 톤 변주
- 무협 차원: 검결·내공·기경팔맥 정통 어휘
- 판타지 차원: 마탑·룬·고전 4원소·소환술
- 선협 차원: 도술·연단·법보·삼시충
- 검술 정점 차원: 일검만류·검신·심검합일

### "박자" 어휘 — 강력 회피
- 사용자 메모리 적용: AI 시간 미세 단위 말습관으로 격상. 한 화 0~1회만 허용
- 캐논 시그니처(필요 시 신규 정의)에서만 예외

### 글로벌 서술체 v2 적용
- `docs/narrative-style.md` 참조
- 단락 1~3줄 기본·작은따옴표 생각풍선 폐기·평서문 융합·대시 절제
- 시 톤 회피, 산문 호흡 우선 (사용자 강력 피드백)

---

## 6. 수치 교차검증 정본 우선순위

1. **plot_framework** — EP별 확정 수치 (자산·등급·차원 진행도)
2. **research_timeline (R4)** — 격동기 사건 시점·종목·변동률 (★ 1차 사이클 절대값)
3. **bootstrap** — 매크로 수치 (분량·아크 길이·단계적 노출 시점)
4. **verification** — 검증 완료 수치 (story-analyst 확인분)
5. **직전 에피소드** — 서사 연속성 (continuity-bridge 인계분)

---

## 7. 진행 현황

| 단계 | 상태 |
|------|------|
| Phase 1 컨셉 분석 | ✅ 완료 (00_concept_analysis.md) |
| Phase 1.5 자동 리서치 (R1·R2·R3·R4·R5·R6) | ✅ 완료 |
| Phase 3a 부트스트랩 | ✅ 완료 (design/dual-save_부트스트랩.md) |
| Phase 3b 캐릭터 시트 | ✅ 완료 (design/dual-save_캐릭터시트.md) |
| Phase 3c 플롯 훅 가이드 | ✅ 완료 (design/dual-save_플롯훅가이드.md) |
| Phase 4 통합 검증 + 산출물 정리 | ✅ 완료 |
| Phase 5 novel-config.md 초안 | ✅ 완료 (이 파일) |
| **작은 설계 EP001~010** | ✅ 완료 (design/dual-save_세부설계_1~10화.md — 통합본 / 메인 흐름 직접 작성) |
| **다음 단계** | **/create EP001 (1화 시범 본문 집필) 또는 /design-small EP011~025 (다음 아크 작은 설계)** |

---

## 8. 다음 단계 안내

### 권장: /design-small (작은 설계 — 25화 단위)
- Arc 1~2 (EP001~010) 비트 세부화 → episode-architect가 EP별 설계도 추출 용이
- domain-researcher가 해당 아크의 추가 리서치 자동 수행
- 작은 설계 완료 시 본 config의 §2-2 "세부 플롯 가이드 (선택)" 컬럼 자동 갱신

### 대안: /create EP001 (직접 창작 진입)
- 큰 설계만으로 epi-architect가 EP001 설계도 추출 가능
- 단, EP별 플롯 비트 세부화 부족 → 작은 설계 권장

---

*큰 설계 완료. 작은 설계 또는 창작 진입 시 본 config가 모든 에이전트의 1차 참조점이 된다.*
