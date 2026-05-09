# Flag Registry -- 플래그 총목록 (Red Team Master Reference)

> **최종 수정**: v1.0  
> **담당**: Red Team (Story Architect)  
> **용도**: 게임 내 모든 플래그의 단일 진실 원천 (Single Source of Truth)  
> **규칙**: 새 플래그 추가 시 반드시 이 문서에 먼저 등록 후 구현

---

## 목차

1. [Session Flags (세션 플래그 -- 루프 내 한정)](#1-session-flags)
2. [Meta Flags -- Truth (진실 플래그)](#2-meta-flags--truth)
3. [Meta Flags -- Bond (관계 플래그)](#3-meta-flags--bond)
4. [Meta Flags -- Melody (멜로디 플래그)](#4-meta-flags--melody)
5. [Meta Flags -- Loop (회귀 플래그)](#5-meta-flags--loop)
6. [Meta Flags -- Death (사망 경험 플래그)](#6-meta-flags--death)
7. [Meta Flags -- Soul Items (영혼 귀속 아이템)](#7-meta-flags--soul-items)
8. [Meta Flags -- Visit (방문 기록)](#8-meta-flags--visit)
9. [Meta Flags -- Ending (엔딩 해금)](#9-meta-flags--ending)

---

## 플래그 명명 규칙

```
카테고리_지역_세부내용
예: session_azelia_king_medicine_seen
    meta_truth_kaizer
    meta_bond_erina
    meta_death_combat_first
```

- **ID는 영문 snake_case**
- **설명은 한국어 병기**
- 세션 플래그는 `session_` 접두사 생략 가능 (루프 내 스코프 명확)
- 메타 플래그는 카테고리 접두사 필수

---

## 1. Session Flags

> **범위**: 현재 루프 한정. 사망/엔딩 시 전부 초기화.  
> **저장**: `SessionState.flags: Record<string, boolean>`  
> **용도**: 분기 판단, 선택지 잠금/해금, NPC 반응 변화

---

### 1-1. 아젤리아 왕국 (Azelia)

| # | Flag ID | 한국어 | Set 조건 | Used by | Persists |
|---|---------|--------|----------|---------|----------|
| 1 | `king_medicine_seen` | 왕의 약 목격 | 007-D 왕의 침실 PER >= 4 | 030 에리나 고백 트리거, 050 왕 해독 루트 | session |
| 2 | `erina_confession` | 에리나 독살 고백 | 030 에리나 호감 >= 15 + king_medicine_seen | 042 밀서 추적 강화, 050 진실의 추적자 루트 | session |
| 3 | `mordeus_spy_seen` | 밀서 목격 | 042 PER >= 7 (밀서 관찰 성공) | 010 증거 기반 대면, 050 루트 B/D 해금 | session |
| 4 | `erina_warned_early` | 에리나 조기 경고 (메타 선택지) | 001 메타 선택지 "대신관을 조심해" (loop >= 3 + truth_azelia) | 003 에리나 초기 호감 +15, 전체 타임라인 단축 | session |
| 5 | `crypt_explored` | 지하 성소 탐험 | 007-C 대신전 지하 진입 성공 | 이전 용사 9관 발견, 모르데우스 대면 근거 | session |
| 6 | `spy_evidence_gathered` | 스파이 증거 확보 | 042 밀서 목격 + 043 추가 조사 | 050 루트 D 왕좌의 전복 조건 | session |
| 7 | `garen_trust` | 기사단장 가렌 신뢰 | 020 마을 전투 + 가렌 호감 이벤트 | 040 전장 호위, 043 궁전 방어 보너스 | session |
| 8 | `blessing_accepted` | 축복 수락 | 005 빛의 축복 수락 선택 | FAT +2, soul_light_shard 조건, 기둥 연결 강화 | session |
| 9 | `blessing_refused` | 축복 거절 | 005 빛의 축복 거절 선택 | INT +1, CHA +1, 모르데우스 의심 | session |
| 10 | `duty_followed` | 호송 명령 수행 | 010 왕명 수락, 마을 호송 | 020 마을 이벤트 정상 진행 | session |
| 11 | `evidence_collected` | 증거 수집 | 007-B 도서관 + 042 밀서 + 043 추가 | 050 모르데우스 대면 루트 전반 | session |
| 12 | `refugee_testimony` | 유민 증언 | 020 마을 생존자와 대화 | 043 궁전 연설 CHA 보너스, 정치적 근거 | session |
| 13 | `village_saved` | 마을 구출 시도 | 020 전투 성공 (STR/INT >= 5) | 040 기사단 평판, 가렌 신뢰 강화 | session |
| 14 | `velta_rebellion_seed` | 벨타 반란의 씨앗 | 카이젤 크로스 이벤트: 벨타 반란 정보 입수 | 050 카이젤 연합 루트 힌트 | session |
| 15 | `serenia_trust` | 세레니아(에리나) 신뢰 | 003 밤의 정원에서 신뢰 선택 | 대신관 경계 루트 진입, 세레니아 정보 제공 | session |
| 16 | `serenia_doubt` | 세레니아 의심 | 003 밤의 정원에서 의심 선택 | 독자적 조사 루트, 더 많은 PER 체크 | session |
| 17 | `luminas_reported` | 대신관에게 보고 | 003에서 세레니아 밀고 | 다크 루트, 세레니아 처형 트리거 | session |
| 18 | `marco_met` | 마르코 만남 | 003 마르코 이벤트 | 마르코 대화 카운트 +1, 크로스 지역 힌트 | session |
| 19 | `blackrobe_library` | 검은 로브 여인 (도서관) | 007-B 도서관 특정 시간대 방문 | 목걸이 관찰 가능, bond_blackrobe 진행 | session |

---

### 1-2. 카이젤 제국 (Kaizer)

| # | Flag ID | 한국어 | Set 조건 | Used by | Persists |
|---|---------|--------|----------|---------|----------|
| 1 | `conscripted` | 징집 수락 | 장면 2 징집 선택 | 전체 카이젤 메인 루트 진입 | session |
| 2 | `iron_baptism_received` | 철의 세례 수령 | 장면 3 훈련소 의식 참가 | STR/REF 강화, 수명 감소 인지 조건 | session |
| 3 | `lize_theory_heard` | 리제의 수명 이론 청취 | 장면 3 리제 대화 선택 | 수명 착취 의심 루트, 반란 씨앗 | session |
| 4 | `lifespan_harvest_witnessed` | 수명 수확 의식 목격 | 장면 4 전투 후 점령 마을 | 리제 반란 루트, 브루노 각성 | session |
| 5 | `emperor_audience` | 황제 알현 | 장면 6 황제 대면 이벤트 | 황제 설득/대결 분기, 수명 시스템 핵심 정보 | session |
| 6 | `velta_sister_known` | 벨타 동생 희생 인지 | 벨타 호감 이벤트 + 사진 관찰 | 벨타 반란 동지 루트, bond_velta 조건 | session |
| 7 | `lifespan_tax_document` | 수명세 문서 발견 | 훈련소 의무실 서류 발견 (PER 체크) | 황제 대면 시 증거 자료 | session |
| 8 | `baice_secret_known` | 바이스 대위의 비밀 | 바이스 호감 + 불안정 수명 목격 | 근위대 내부 협력자 확보 | session |
| 9 | `iron_tower_vision` | 철의 첨탑 환영 | 수명 수확 목격 시 자동 발동 | 황제 대면 대화 선택지 추가 | session |
| 10 | `rebellion_joined` | 반란 합류 | 벨타 + 리제 + 특정 조건 충족 | 카이젤 히든 엔딩 루트 | session |

---

### 1-3. 솔라리스 화염 지대 (Solaris)

| # | Flag ID | 한국어 | Set 조건 | Used by | Persists |
|---|---------|--------|----------|---------|----------|
| 1 | `ethel_bond` | 에셀(불꽃 정령) 유대 | 장면 1 에셀 구조 이벤트 자동 | 정령 교감 수련 진입, 부족 합류 | session |
| 2 | `ashura_accepted` | 아쉬라 부족 합류 | 장면 2 나하라 수락 | 부족 수련, 태양의 심판 참가 자격 | session |
| 3 | `spirit_communion_success` | 정령 교감 성공 | 장면 3 에셀 공명 수련 성공 | 화염의 심장 인지, 정령문 각인 자격 | session |
| 4 | `trial_fire_passed` | 태양의 심판 통과 | 장면 4 불의 신전 시험 (조건부) | 부족 정식 구성원, 정령문(불완전) 획득 | session |
| 5 | `salamandra_warning` | 살라만드라 경고 | 장면 4 살라만드라 "타지 않는 불" 언급 | 10번째 기둥 인식 강화, 마하르 대화 해금 | session |
| 6 | `sandstorm_survived` | 태양의 심판(폭풍) 생존 | 장면 5 모래폭풍 대피 성공 | 정령 교감 진실 의심, 나하라 갈등 | session |
| 7 | `mahar_prophecy` | 마하르의 예언 청취 | 장면 5 마하르 "교감이 기둥을 죽인다" | 정령 교감 딜레마, truth_solaris 조건 | session |
| 8 | `kayla_trust` | 카일라 신뢰 | 카일라 호감 이벤트 선택지 | 카일라 비밀(영혼 연결) 해금 루트 | session |
| 9 | `hassan_confrontation` | 하산 대결 | 장면 5 하산 공격 이벤트 | 전사장 설득 or 결투 분기 | session |
| 10 | `pillar_crack_witnessed` | 기둥 균열 목격 | 장면 4 시험 중 기둥 표면 금 관찰 | 정령 교감의 대가 인식, 진실 루트 | session |

---

### 1-4. 프로스트헬 (Frosthel)

| # | Flag ID | 한국어 | Set 조건 | Used by | Persists |
|---|---------|--------|----------|---------|----------|
| 1 | `seira_rescued` | 세이라에게 구출됨 | 장면 2 자동 이벤트 | 프림 부족 합류, 생존 훈련 진입 | session |
| 2 | `erna_warning` | 장로 에르나의 경고 | 장면 3 에르나 "시간의 냄새" 언급 | 10번째 기둥 인식, 봉인의 문 접근 동기 | session |
| 3 | `kai_wolf_hostile` | 늑대 카이 적대 반응 | 장면 4 카이(늑대) 경계 이벤트 | 카이 교감 퀘스트 시작, 기둥 공명 복선 | session |
| 4 | `wendigo_speech` | 웬디고 인간 발화 목격 | 장면 5 첫 사냥 웬디고 대사 | 봉인의 문 조사 동기, 세이라 과거 해금 | session |
| 5 | `seira_brother_known` | 세이라 오빠 실종 인지 | 장면 6 세이라 과거 대화 | 봉인의 문 조사 합류, 구원 가능성 플래그 | session |
| 6 | `seal_door_touched` | 봉인의 문 접촉 | 장면 7 봉인의 문 손대기 | 10번째 기둥 플래시백, 관리자 목소리 | session |
| 7 | `rescue_possibility` | 구원 가능성 인지 | 장면 6 선택지 C "오빠 의식이 남아있을 수도" | 웬디고 구원 서브 퀘스트 해금 | session |
| 8 | `frost_rune_learned` | 서리 룬 습득 | 장면 4 수렵 훈련 완료 | 봉인의 문 룬 일부 해독, 소통 수단 | session |
| 9 | `kai_wolf_bonded` | 늑대 카이 유대 성공 | 카이 교감 퀘스트 성공 | 봉인지 동행, 기둥 감지 능력 | session |
| 10 | `guardian_voice_heard` | 관리자 목소리 청취 | 봉인의 문 접촉 후 PER 체크 성공 | 봉인 해제 동기, truth_frosthel 조건 | session |

---

### 1-5. 용화국 (Yonghwa)

| # | Flag ID | 한국어 | Set 조건 | Used by | Persists |
|---|---------|--------|----------|---------|----------|
| 1 | `soyeon_saved` | 소연 구출 | 장면 2 전투 개입 (STR/INT 체크) | 청운검파 입문 자격, 소연 호감도 | session |
| 2 | `baekyheon_disciple` | 백현 문하 입문 | 장면 4 문주 면담 → 제자 수락 | 정식 수련 시작, 천명 시스템 접근 | session |
| 3 | `qi_reversal_witnessed` | 기 역류 목격 | 장면 6 수련 중 시간 왜곡 | 10번째 기둥 반응, 풍아 경계 | session |
| 4 | `mandate_system_learned` | 천명 시스템 학습 | 장면 5 소연 설명 이벤트 | 천명 수락/거부 분기의 전제 | session |
| 5 | `hyeonmu_deep_teaching` | 현무진인 심화 가르침 | 사부 호감 + truth_solaris 보유 시 | 천명 시스템의 인위성 인지, bond_hyeonmu 조건 | session |
| 6 | `seolhwa_mandate_seen` | 설화의 천명서 목격 | 밤 이벤트 (PER 체크) | 설화 "배신 운명" 인지, 구원 루트 | session |
| 7 | `dogeom_suspicion` | 도검(대사형) 의심 | 도검 호감 이벤트 | 문파 내 정치, 천명 감시 인지 | session |
| 8 | `blood_sect_encountered` | 혈라교 조우 | 장면 2 혈라교 도인 전투 | 사파 루트 가능성, 무림 갈등 인지 | session |
| 9 | `mandate_refused` | 천명 거부 | 천명 각인 이벤트에서 거부 선택 | 역천 수련 루트, 기둥의 적 인식 | session |
| 10 | `time_distortion_caused` | 시간 왜곡 발생 | 기 폭주 이벤트 시 자동 | 백현 심화 대화, 10번째 기둥 추적 | session |

---

### 1-6. 리베르타 군도 (Liberta)

| # | Flag ID | 한국어 | Set 조건 | Used by | Persists |
|---|---------|--------|----------|---------|----------|
| 1 | `storm_crow_joined` | 폭풍까마귀호 합류 | 장면 2 모르간 수락 | 해적 생활 시작, 갑판원 임무 | session |
| 2 | `wind_whisper_heard` | 바람의 속삭임 청취 | 장면 5 야간 당직 이벤트 | 바람의 기둥 반응, 제로 경계 | session |
| 3 | `zero_secret_known` | 제로의 비밀 인지 | 제로 호감 + 대화 | 바람 기둥 제사장 후보였던 과거 | session |
| 4 | `morgan_trust` | 선장 모르간 신뢰 | 모르간 호감 이벤트 | 왕좌 섬 접근 허가, 해적왕 면담 | session |
| 5 | `leon_met` | 해적왕 레온 만남 | 왕좌 섬 방문 이벤트 | 전이자 정체 대화, bond_leon 조건 | session |
| 6 | `leon_transmigrator_known` | 레온 전이자 인지 | 레온 호감 + truth 1개 보유 | 현대 대화 해금, 선배 멘토 루트 | session |
| 7 | `red_tide_conflict` | 홍조 연합 충돌 | 교역 이벤트 중 전투 | 군도 정치 이해, 세력 선택 분기 | session |
| 8 | `windmill_weakening` | 바람개비 탑 약화 인지 | 제로/마르코 대화 | 바람 기둥 위기 인식 | session |
| 9 | `luna_abyssal_hint` | 루나의 아비살 힌트 | 루나 호감 이벤트 | 아비살 연결 정보, 크로스 지역 | session |
| 10 | `smartphone_found` | 레온의 스마트폰 발견 | 레온 선실 탐색 (PER 체크) | 전이자 물증, truth_liberta 조건 | session |

---

### 1-7. 셀레스티아 (Celestia)

| # | Flag ID | 한국어 | Set 조건 | Used by | Persists |
|---|---------|--------|----------|---------|----------|
| 1 | `aeris_rescued_by` | 아에리스에게 구조됨 | 장면 3 아에리스 만남 | 셀레스티아 진입, 임시 체류 | session |
| 2 | `ruin_tablet_read` | 폐허 석판 해독 | 장면 2 INT 체크 "열 번째를 부순 날" | 10번째 기둥 파괴 첫 단서 | session |
| 3 | `tilt_phenomenon_known` | 기울기 현상 인지 | 아에리스 설명 이벤트 | 셀레스티아 위기 이해, 구조 동기 | session |
| 4 | `dust_district_explored` | 하계인 구역(더스트) 탐험 | 장면 6 더스트 방문 | 하계인 동료 확보, 정보 수집 | session |
| 5 | `etherno_met` | 역사가 에테르노 만남 | 도서관/기록실 이벤트 | 대몰락 기록 열람 조건, 금지 기록 접근 | session |
| 6 | `council_secret_known` | 평의회의 비밀 인지 | 아리엘 호감 + 에테르노 기록 | truth_celestia 조건, 10번째 기둥 파괴 주모자 | session |
| 7 | `aeris_wing_broken` | 아에리스 날개 파손 | 다크 선택지: 폐허 추가 조사 중 사고 | 아에리스 호감 -20, 10번째 기둥 정보 +1 | session |
| 8 | `caelum_memory_unlocked` | 카엘룸의 기억 해금 | 폐허 석판 활성화 이벤트 | 아에리스 가문의 비밀, 대몰락 연결 | session |
| 9 | `pillar_resonance_detected` | 기둥 공명 감지 | 검문소 마력 탐지기 반응 | 의회 보수파 주목, 감시 강화 | session |
| 10 | `falling_island_witnessed` | 추락 섬 목격 | 장면 4 순찰선 이동 중 | 셀레스티아 위기의 심각성 인지 | session |

---

### 1-8. 카즈모르 (Kazmor)

| # | Flag ID | 한국어 | Set 조건 | Used by | Persists |
|---|---------|--------|----------|---------|----------|
| 1 | `boltan_rescued` | 볼탄에게 구출됨 | 장면 2 볼탄 구조대 이벤트 | 대장간 합류, 카즈모르 체류 | session |
| 2 | `vein_mark_received` | 맥문(맥紋) 각인 | 장면 4 루미나 광맥 접촉 | 광맥 공명 능력, 코어 길드 관심 | session |
| 3 | `deep_tremor_felt` | 깊은 진동 감지 | 장면 4 여진 이벤트 | 대지의 기둥 불안정 인식 | session |
| 4 | `core_guild_known` | 코어 길드 인지 | 장면 5 볼탄 설명 + 시장 소동 | 광맥 독점 정치, 사회 구조 이해 | session |
| 5 | `thorg_apprentice` | 토르그 제자 입문 | 토르그 대장간 이벤트 | 단조 수련, 광맥 심층 접근 자격 | session |
| 6 | `living_metal_discovered` | 살아있는 금속 발견 | 심층 광맥 탐험 (토르그 동행) | truth_kazmor 조건, 기둥 뿌리 인식 | session |
| 7 | `pim_ancient_blueprint` | 핌의 고대 도면 발견 | 핌 호감 이벤트 + 지하 탐험 | 세계수 분할 장치 단서 | session |
| 8 | `illegal_mining_witnessed` | 불법 채굴 목격 | 장면 5 시장 소동 이벤트 | 사회 갈등 이해, 하층민 루트 | session |
| 9 | `forge_core_reached` | 위대한 대장간 심층 도달 | 심층 탐험 퀘스트 완료 | soul_forge_core 조건, 특수 장비 | session |
| 10 | `earthquake_cause_known` | 지진 원인 인지 | living_metal_discovered + 분석 | 채굴 = 기둥 파괴 인식, 토르그 딜레마 | session |

---

### 1-9. 아비살 (Abyssal)

| # | Flag ID | 한국어 | Set 조건 | Used by | Persists |
|---|---------|--------|----------|---------|----------|
| 1 | `siren_rescued` | 세이렌에게 구출됨 | 장면 1 익사 후 구조 자동 | 수중 호흡 부여, 아비살 체류 | session |
| 2 | `water_breathing_active` | 수중 호흡 활성화 | 세이렌의 마력 부여 (12시간 제한) | 수중 활동 가능, 갱신 의존 | session |
| 3 | `thalassa_audience` | 여왕 탈라사 알현 | 장면 4 궁전 이벤트 | "또 왔어" 복선, 전생 기억 트리거 | session |
| 4 | `thalassa_deja_vu` | 여왕의 기시감 인지 | 장면 4 "그 이름도 같구나" | 전생 기억 추적, truth_abyssal 조건 | session |
| 5 | `deep_call_warned` | 심연의 부름 경고 | 세이렌 설명 이벤트 | 심층 접근 금지 인식, 위험 분기 | session |
| 6 | `coral_garden_visited` | 산호 정원 방문 | 여왕 밤 초대 수락 | 여왕 개인 대화, 전생 기억 편린 | session |
| 7 | `deep_one_sensed` | 심해의 것 감지 | 심층 접근 이벤트 | 기둥 약화 위기, 공포 이벤트 | session |
| 8 | `maria_surveillance_known` | 마리아 감시 임무 인지 | 마리아 호감 + 특정 대화 | 마리아 진심 전환, 신뢰 강화 | session |
| 9 | `siren_12h_truth` | 12시간 제한의 진실 | 세이렌 호감 MAX + 직접 질문 | 세이렌의 의도 인지, 관계 재정립 | session |
| 10 | `queen_lullaby_heard` | 여왕의 자장가 청취 | 산호 정원 이벤트 + 특정 조건 | melody_abyssal 조건, 전생 기억 연결 | session |

---

## 2. Meta Flags -- Truth

> **범위**: 영구 보존 (루프 간 유지)  
> **해금 효과**: 다음 루프에서 새 선택지/루트/대화 해금  
> **트루 엔딩 조건**: 9개 중 최소 6개 (공존 엔딩은 9개 전부)

| # | Flag ID | 지역 | 한국어 | 해금 조건 | 체크 위치 | 열리는 것 | Persists |
|---|---------|------|--------|----------|-----------|-----------|----------|
| 1 | `truth_azelia` | 아젤리아 | 대신관의 음모 폭로 | crypt_explored + erina_confession + 050 진실 루트 완주 | 아젤 2회차+ 001, 카이젤 황제 대면, 아비살 여왕 대화 | 에리나 조기 경고 선택지, 전쟁 방지 루트, 여왕 전생 트리거 | meta |
| 2 | `truth_kaizer` | 카이젤 | 황제의 수명 착취 발견 | emperor_audience + lifespan_harvest_witnessed + 반란/대면 루트 | 카이젤 2회차+ 시작, 아젤리아 040 전쟁, 프로스 동맹 | 제국 반란 루트, 전쟁 진실, 기둥 의존 인식 | meta |
| 3 | `truth_solaris` | 솔라리스 | 정령 = 기둥 파편 인지 | mahar_prophecy + pillar_crack_witnessed + 정령 대화 확장 | 솔라리스 2회차+ 정령 대화, 용화국 사부 심화 | 정령 대화 새 선택지, 천명 의심 강화 | meta |
| 4 | `truth_frosthel` | 프로스트헬 | 봉인 존재의 정체 확인 | seal_door_touched + guardian_voice_heard + 봉인 탐사 완료 | 프로스트헬 2회차+ 봉인지, 카이젤 협상, 아비살 전생 촉매 | 봉인지 직접 접근, 황제 협상 카드, 관리자 인지 | meta |
| 5 | `truth_yonghwa` | 용화국 | 천명 시스템의 인위성 발견 | hyeonmu_deep_teaching + mandate_refused + 역천 수련 | 용화국 2회차+ 수련, 솔라리스 정령 교감 | 천명 거부 루트, 정령 교감 진실 보강 | meta |
| 6 | `truth_liberta` | 리베르타 | 해적왕 = 전이자 확인 | leon_transmigrator_known + smartphone_found + 레온 고백 | 리베르타 2회차+ 레온 대화, 아젤리아 마르코 대화 | 레온과 현대 대화, 크로스 지역 분석 | meta |
| 7 | `truth_celestia` | 셀레스티아 | 대몰락 = 천인의 죄 발견 | council_secret_known + etherno 기록 열람 + 아리엘 동행 | 셀레스티아 2회차+ 의회, 전 지역 기둥 기원 | 천인 평의회 대면, 세계수 분할 이해 | meta |
| 8 | `truth_kazmor` | 카즈모르 | 광맥 = 기둥의 뿌리 발견 | living_metal_discovered + earthquake_cause_known | 카즈모르 2회차+ 심층, 카이젤 대안 기술, 셀레 복원 | 광맥 심층 루트, 대안 단조 기술, 분할 장치 | meta |
| 9 | `truth_abyssal` | 아비살 | 여왕 = 전이자 환생 인지 | thalassa_deja_vu + coral_garden_visited + 전생 기억 각성 이벤트 | 아비살 2회차+ 여왕, 아젤리아 마르코, 프로스 관리자 | 여왕 전생 기억 각성, 시간의 기둥 정보 | meta |

---

## 3. Meta Flags -- Bond

> **범위**: 영구 보존  
> **해금 효과**: 해당 NPC 관계 엔딩 + 타 지역 특수 루트

| # | Flag ID | NPC | 한국어 | 해금 조건 | 영향 대화/루트 | Persists |
|---|---------|-----|--------|----------|---------------|----------|
| 1 | `bond_erina` | 에리나 공주 | 에리나 신뢰도 MAX | 호감도 MAX + truth_azelia + 대신관 타도 성공 | RE-01 가면 벗은 공주 엔딩, 아비살에서 루프 종결 약속 | meta |
| 2 | `bond_velta` | 소대장 벨타 | 벨타와 반란 공모 | 호감도 MAX + velta_sister_known + rebellion_joined | RE-02 전우의 자유 엔딩, 카이젤 반란 루트 | meta |
| 3 | `bond_naira` | 나이라 (솔라) | 나이라의 비밀 수용 | 호감도 MAX + 정령 교감 해소 이벤트 | RE-03 정령의 선택 엔딩, 정령 교감 공유 이벤트 | meta |
| 4 | `bond_kai` | 사냥꾼 카이 | 카이와 생사고락 | 호감도 MAX + kai_wolf_bonded + 봉인 탐사 동행 | RE-04 동토의 맹세 엔딩, 봉인지 동행 가능 | meta |
| 5 | `bond_hyeonmu` | 현무진인 | 사부의 가르침 완수 | 호감도 MAX + 역천 수련 완료 + 설화 천명 이벤트 | RE-05 천명을 넘어 엔딩 (설화), 천명 바깥의 힘 해금 | meta |
| 6 | `bond_leon` | 해적왕 레온 | 레온과 동맹 | 호감도 MAX + leon_transmigrator_known + 현대 이야기 공유 | RE-06 선배의 등 엔딩, 다지역 항해 루트, 현대 분석 시점 | meta |
| 7 | `bond_ariel` | 아리엘 (셀레) | 아리엘과 진실 추적 | 호감도 MAX + council_secret_known + 진실 공개 결정 | RE-07 부러진 날개의 비상 엔딩, 대몰락 기록 열람 | meta |
| 8 | `bond_thorg` | 토르그 (카즈모르) | 토르그 대장간 수료 | 호감도 MAX + thorg_apprentice + 살아있는 금속 진실 이해 | RE-08 대장간의 불꽃 엔딩, 특수 무기 제작 가능 | meta |
| 9 | `bond_abigail` | 여왕 아비게일 | 여왕 전생 기억 회복 | 호감도 MAX + truth_abyssal + 전생 기억 완전 각성 | RE-09 기억의 바다 엔딩, 시간의 기둥 정보, TE-03 공존 조건 | meta |
| 10 | `bond_marco` | 마르코 | 마르코 진심 대화 3회 | 3개+ 지역 방문 + 각 지역 마르코 심층 대화 | 세계수 직접 언급, TE-03 공존 엔딩 조건, SE-02 관측자 엔딩 | meta |
| 11 | `bond_blackrobe` | 검은 로브 여인 | 시간의 기둥 관리자 인지 | 3개+ 지역에서 검은 로브 여인 대화 + 목걸이(모래시계) 질문 | 관리자 정체 해금, TE-01 복원 엔딩 조건, 모르데우스 견제 | meta |

---

## 4. Meta Flags -- Melody

> **범위**: 영구 보존  
> **수집 효과**: 9개 전부 → `melody_complete` → 세계수 복원/파괴 최종 선택지  
> **UI**: 해금 시 음악 재생 가능 (메뉴 → 기억의 서재)

| # | Flag ID | 지역 | 한국어 | 발견 장소/이벤트 | 조건 | Persists |
|---|---------|------|--------|----------------|------|----------|
| 1 | `melody_azelia` | 아젤리아 | 빛의 간주곡 | 궁정 연회 참석 시 간주에서 발견 | 003 연회 이벤트 PER 체크 | meta |
| 2 | `melody_kaizer` | 카이젤 | 철의 행진곡 | 야간 행군 중 병사가 부르는 노래 | 장면 4 행군 이벤트 PER 체크 | meta |
| 3 | `melody_solaris` | 솔라리스 | 화염의 주문 선율 | 정령 소환 의식 참관 | 정령 교감 성공 후 의식 참관 | meta |
| 4 | `melody_frosthel` | 프로스트헬 | 서리 바람의 허밍 | 대빙하 위에서 바람 소리 경청 | 봉인의 문 접근 후 빙하 탐험 PER 체크 | meta |
| 5 | `melody_yonghwa` | 용화국 | 내면의 공명 | 내공 수련 중 내면에서 들림 | 기 순환 수련 심화 단계 | meta |
| 6 | `melody_liberta` | 리베르타 | 바다의 뱃노래 | 레온이 술 마시며 부르는 뱃노래 | leon_met + 주점 이벤트 | meta |
| 7 | `melody_celestia` | 셀레스티아 | 고대 악보 선율 | 에테르노의 기록실에서 고대 악보 발견 | etherno_met + 기록실 접근 INT 체크 | meta |
| 8 | `melody_kazmor` | 카즈모르 | 대지의 진동음 | 최심층 광맥에서 울려오는 진동 | 심층 탐험 완료 (forge_core_reached) | meta |
| 9 | `melody_abyssal` | 아비살 | 여왕의 자장가 | 여왕의 자장가 청취 | queen_lullaby_heard | meta |
| 10 | `melody_complete` | 전역 | 10번째 기둥의 노래 완성 | 위 9개 전부 수집 시 자동 | melody_azelia ~ melody_abyssal 전부 true | meta |

---

## 5. Meta Flags -- Loop

> **범위**: 영구 보존 (자동 해금)  
> **기준**: `metaFlags.loopCount` 값 기반 자동 부여

### 5-1. 회귀 횟수 플래그

| # | Flag ID | 한국어 | 조건 | 효과 | Persists |
|---|---------|--------|------|------|----------|
| 1 | `loop_3` | 3회 회귀 | loopCount >= 3 | 선택지 텍스트에 (기시감) 표시, 기시감 독백 삽입 | meta |
| 2 | `loop_5` | 5회 회귀 | loopCount >= 5 | NPC 대사 "전에도..." 류 선택지, 스킵 옵션 일부 | meta |
| 3 | `loop_10` | 10회 회귀 | loopCount >= 10 | 주인공 독백 냉소화, 냉소적 선택지 추가, 대사 전문 변조 | meta |
| 4 | `loop_20` | 20회 회귀 | loopCount >= 20 | "모든 것이 익숙하다" 스킵 가능, TE-02 파괴 엔딩 조건 | meta |
| 5 | `loop_30` | 30회 회귀 | loopCount >= 30 | SE-01 고독 엔딩 조건 (bond 0개 시) | meta |

### 5-2. 기둥 각성 플래그

| # | Flag ID | 한국어 | 조건 | 효과 | Persists |
|---|---------|--------|------|------|----------|
| 6 | `pillar_awakening_1` | 기둥 각성 1단계 | loopCount >= 5 | 손끝 발광 이펙트 시작 (UI 미세 이펙트) | meta |
| 7 | `pillar_awakening_2` | 기둥 각성 2단계 | loopCount >= 10 | NPC 반응 "빛이 보인다", 일부 NPC 경계 | meta |
| 8 | `pillar_awakening_3` | 기둥 각성 3단계 | loopCount >= 20 | 시간 정지 능력 (짧은) 해금, [시간의 힘] 선택지 | meta |
| 9 | `pillar_awakening_4` | 기둥 각성 4단계 | loopCount >= 30 | 주인공 변질 경고, 기둥화 진행, SE-03 조건 | meta |

---

## 6. Meta Flags -- Death

> **범위**: 영구 보존  
> **해금 조건**: 특정 사망 유형을 경험해야만 부여  
> **설계 의도**: "죽음이 진보" -- 사망에 가치를 부여하는 루프물 핵심 메커닉

### 6-1. 아젤리아 사망 플래그 (7종)

| # | Flag ID | 한국어 | 사망 노드 | 사망 조건 | 해금 효과 | Persists |
|---|---------|--------|----------|-----------|-----------|----------|
| 1 | `death_combat_first` | 첫 전투 패배 사망 | 020 | STR/INT < 3 | 2회차+ 전투 기시감 독백, 전투 경계 선택지 | meta |
| 2 | `imperial_encounter` | 전장 전사 | 041 | STR < 5 | 2회차+ 제국 침공 사전 경고 선택지 | meta |
| 3 | `palace_fall` | 궁전 함락 사망 | 043 | CHA < 6 & STR < 4 | 2회차+ 궁전 방어 준비 루트 해금 | meta |
| 4 | `mordeus_execution_seen` | 모르데우스 처형 | 011d | CHA < 8 & INT < 8 | 빛의 사슬 대응법 인지, 대면 필수 전제 | meta |
| 5 | `spy_network_aware` | 스파이망 발각 사망 | 007-D 확장 | 증거 확보 시도 발각 | 스파이 추적 루트 해금, 은밀 접근법 | meta |
| 6 | `pillar_direct_danger` | 기둥 폭주 사망 | 005 후 | 기둥 직접 접근 | 매개체 탐색 루트, 기둥 안전 접근법 | meta |
| 7 | `king_manipulation_known` | 왕의 재판 사망 | 050-C 실패 | 왕이 대신관 편 | 왕 해독 루트 해금, 왕 설득 전략 | meta |

### 6-2. 카이젤 사망 플래그 (5종)

| # | Flag ID | 한국어 | 사망 노드 | 사망 조건 | 해금 효과 | Persists |
|---|---------|--------|----------|-----------|-----------|----------|
| 8 | `death_conscript_battle` | 징집병 첫 전투 사망 | 장면 4 | STR < 3 전투 실패 | 전투 전술 기시감, 참호 지식 | meta |
| 9 | `death_iron_baptism` | 철의 세례 부작용 사망 | 장면 3 | 특수 조건 (연속 세례) | 수명 시스템 직관적 이해, 리제 즉시 신뢰 | meta |
| 10 | `death_emperor_wrath` | 황제의 분노 사망 | 장면 6+ | 황제 직접 대결 실패 | 황제 전투 패턴 인지, 약점 선택지 | meta |
| 11 | `death_rebellion_failed` | 반란 실패 사망 | 카이젤 후반 | 반란 루트 실패 | 반란 전략 개선, 동맹 선택지 | meta |
| 12 | `death_lifespan_zero` | 수명 0 사망 | 아무 노드 | 수명 고갈 (수명세 누적) | 수명 관리 의식, 의식 회피 루트 | meta |

### 6-3. 솔라리스 사망 플래그 (4종)

| # | Flag ID | 한국어 | 사망 노드 | 사망 조건 | 해금 효과 | Persists |
|---|---------|--------|----------|-----------|-----------|----------|
| 13 | `death_sandstorm` | 모래폭풍 사망 | 장면 5 | 대피 실패 | 폭풍 패턴 인식, 사전 준비 루트 | meta |
| 14 | `death_spirit_burn` | 정령 소각 사망 | 장면 4 | 시험 실패 | 정령 교감 안전 접근법, 영혼 보호 | meta |
| 15 | `death_tribe_exile` | 부족 추방 후 사망 | 하산 결투 | 하산 결투 패배 + 추방 | 부족 정치 이해, 하산 설득 루트 | meta |
| 16 | `death_ifrit_rampage` | 이프리트 폭주 사망 | 솔라리스 후반 | 기둥 불안정으로 이프리트 폭주 | 정령 진정법, 기둥 안정화 선택지 | meta |

### 6-4. 프로스트헬 사망 플래그 (4종)

| # | Flag ID | 한국어 | 사망 노드 | 사망 조건 | 해금 효과 | Persists |
|---|---------|--------|----------|-----------|-----------|----------|
| 17 | `death_hypothermia` | 동사 사망 | 장면 1 | 첫 시퀀스에서 생존 실패 | 설원 생존 기시감, 세이라 즉시 신뢰 | meta |
| 18 | `death_wendigo_kill` | 웬디고에게 사망 | 장면 5 | 첫 사냥 전투 실패 | 웬디고 패턴 인지, 약점 선택지 | meta |
| 19 | `death_seal_backlash` | 봉인 역류 사망 | 장면 7+ | 봉인의 문 무리한 접촉 | 봉인 안전 접근법, 룬 해독 단서 | meta |
| 20 | `death_guardian_test` | 관리자 시험 사망 | 프로스트헬 후반 | 관리자 해방 시험 실패 | 관리자 의도 이해, 재시험 선택지 | meta |

### 6-5. 용화국 사망 플래그 (4종)

| # | Flag ID | 한국어 | 사망 노드 | 사망 조건 | 해금 효과 | Persists |
|---|---------|--------|----------|-----------|-----------|----------|
| 21 | `death_blood_sect` | 혈라교 사망 | 장면 2 | 전투 개입 실패 | 혈라교 전투 패턴, 기 운용법 인지 | meta |
| 22 | `death_qi_explosion` | 기 폭주 사망 | 장면 6 | 기 역류 제어 실패 | 시간 왜곡 제어법, 기맥 안정화 | meta |
| 23 | `death_mandate_punishment` | 천명 거역 처벌 사망 | 용화국 후반 | 천명 거부 후 기둥의 보복 | 천명 우회법, 역천 수련 강화 | meta |
| 24 | `death_betrayal_fate` | 배신 운명 사망 | 설화 관련 | 설화 천명 발동 (사부 배신) | 설화 구원법, 천명 해제 단서 | meta |

### 6-6. 리베르타 사망 플래그 (4종)

| # | Flag ID | 한국어 | 사망 노드 | 사망 조건 | 해금 효과 | Persists |
|---|---------|--------|----------|-----------|-----------|----------|
| 25 | `death_drowning` | 익수 사망 | 장면 1 근처 | 구조 전 사망 (FAT 극저) | 바다 생존 기시감, 모르간 즉시 신뢰 | meta |
| 26 | `death_pirate_duel` | 해적 결투 사망 | 해적 이벤트 | 결투 패배 | 해적 전투 패턴, 결투 규칙 인지 | meta |
| 27 | `death_storm_brotherhood` | 폭풍 형제단 사망 | 세력 충돌 | 폭풍 형제단 전투 패배 | 세력 정치 이해, 동맹 전략 | meta |
| 28 | `death_wind_pillar_rage` | 바람 기둥 분노 사망 | 리베르타 후반 | 바람개비 탑 붕괴 이벤트 | 기둥 안정화법, 탑 수리 루트 | meta |

### 6-7. 셀레스티아 사망 플래그 (4종)

| # | Flag ID | 한국어 | 사망 노드 | 사망 조건 | 해금 효과 | Persists |
|---|---------|--------|----------|-----------|-----------|----------|
| 29 | `death_fall_impact` | 추락 사망 | 장면 1 | 착지 실패 (HP 0) | 추락 제어 기시감, 중력 완충 이해 | meta |
| 30 | `death_council_purge` | 평의회 숙청 사망 | 셀레스티아 후반 | 의회 비밀 폭로 시도 실패 | 의회 내부 구조 이해, 우회 전략 | meta |
| 31 | `death_tilt_collapse` | 기울기 붕괴 사망 | 외곽 섬 이벤트 | 섬 추락 회피 실패 | 기울기 패턴 인지, 사전 대피 | meta |
| 32 | `death_sky_pillar_overload` | 하늘 기둥 과부하 사망 | 셀레스티아 후반 | 기둥 직접 접촉 시도 | 기둥 안전 접근법, 천인 기술 단서 | meta |

### 6-8. 카즈모르 사망 플래그 (4종)

| # | Flag ID | 한국어 | 사망 노드 | 사망 조건 | 해금 효과 | Persists |
|---|---------|--------|----------|-----------|-----------|----------|
| 33 | `death_cave_in` | 갱도 매몰 사망 | 장면 1 | 초기 탈출 실패 | 갱도 구조 이해, 탈출 기시감 | meta |
| 34 | `death_core_guild_execution` | 코어 길드 처형 | 카즈모르 중반 | 불법 채굴 혐의 | 길드 정치 이해, 면죄 루트 | meta |
| 35 | `death_living_metal_absorb` | 살아있는 금속 흡수 사망 | 심층 광맥 | 기둥 뿌리 직접 접촉 부작용 | 광맥 안전 채취법, 맥문 제어 | meta |
| 36 | `death_deep_quake` | 대지진 사망 | 카즈모르 후반 | 기둥 불안정 대지진 | 지진 예측 능력, 대피 경로 | meta |

### 6-9. 아비살 사망 플래그 (4종)

| # | Flag ID | 한국어 | 사망 노드 | 사망 조건 | 해금 효과 | Persists |
|---|---------|--------|----------|-----------|-----------|----------|
| 37 | `death_drowning_deep` | 심해 익사 사망 | 장면 1 | 구조 전 의식 상실 | 수중 생존 기시감, 세이렌 즉시 신뢰 | meta |
| 38 | `death_deep_call` | 심연의 부름 사망 | 심층 접근 | 심연의 부름에 끌려감 | 심연 저항법, 심층 안전 접근 | meta |
| 39 | `death_deep_one_attack` | 심해의 것 공격 사망 | 아비살 후반 | The Deep One 조우 | 심해 존재 패턴 인지, 기둥 보호 전략 | meta |
| 40 | `death_queen_wrath` | 여왕의 분노 사망 | 아비살 중후반 | 여왕의 전생 기억 자극 실패 | 여왕 접근법, 기억 각성 안전 경로 | meta |

---

## 7. Meta Flags -- Soul Items

> **범위**: 영구 보존 (영혼 귀속)  
> **핵심 규칙**: 이벤트 경험 + **사망**이 결합해야 영혼에 각인. 살아서 끝내면 일반 인벤토리(루프 시 소멸).  
> **총 18개** (지역당 2개)

### 7-1. 아젤리아 (2종)

| # | Item ID | 이름 | 한국어 | 획득 조건 | 사용처 | Persists |
|---|---------|------|--------|----------|--------|----------|
| 1 | `soul_light_shard` | 빛의 파편 | 빛의 기둥 에너지 결정 | 005 축복 수락(blessing_accepted) 후 사망 | 아젤 2회차+ 005 "이미 빛이 있다" → 모르데우스 동요 | meta |
| 2 | `soul_mordeus_seal` | 모르데우스의 인장 | 대신관의 권위 증표 | 042 밀서 목격(PER 7+, mordeus_spy_seen) 후 사망 | 아젤 2회차+ 010 증거 기반 대면, 카이젤 제국 정보 | meta |

### 7-2. 카이젤 (2종)

| # | Item ID | 이름 | 한국어 | 획득 조건 | 사용처 | Persists |
|---|---------|------|--------|----------|--------|----------|
| 3 | `soul_magitech_blueprint` | 마기공학 설계도 | 기둥 의존 기술 도면 | 수도 연구소 잠입 + 설계도 열람 후 사망 | 카즈모르 대안 기술, 리베르타 융합 프로젝트 | meta |
| 4 | `soul_leon_journal` | 레온의 전이자 일지 | 선대 전이자의 기록 | 레온에게 전이자 고백 청취(leon_transmigrator_known) + 카이젤 사망 | 리베르타 반란 정당성, 벨타 설득 자료 | meta |

### 7-3. 솔라리스 (2종)

| # | Item ID | 이름 | 한국어 | 획득 조건 | 사용처 | Persists |
|---|---------|------|--------|----------|--------|----------|
| 5 | `soul_flame_essence` | 화염의 정수 | 이프리트 에너지 결정 | 이프리트 교감 절정(spirit_communion_success 심화) + 사망 | 프로스트헬 봉인 해제 보조 에너지 | meta |
| 6 | `soul_spirit_memory` | 정령의 기억 | 기둥 파편의 기억 조각 | 정령의 기둥 기억 목격(mahar_prophecy 확장) + 사망 | 셀레스티아 분할 연구 보조 자료 | meta |

### 7-4. 프로스트헬 (2종)

| # | Item ID | 이름 | 한국어 | 획득 조건 | 사용처 | Persists |
|---|---------|------|--------|----------|--------|----------|
| 7 | `soul_frost_essence` | 서리의 정수 | 얼음 기둥 에너지 결정 | 빙문술 극한 수련(frost_rune_learned 심화) + 사망 | 솔라리스 기둥 대화 이벤트 (기둥 간 공명) | meta |
| 8 | `soul_guardian_fragment` | 관리자의 파편 | 10번째 기둥 관리자 잔재 | 봉인 접촉(seal_door_touched 심화) + 사망 | 셀레스티아 복원 실험, 대몰락 복원 핵심 재료 | meta |

### 7-5. 용화국 (2종)

| # | Item ID | 이름 | 한국어 | 획득 조건 | 사용처 | Persists |
|---|---------|------|--------|----------|--------|----------|
| 9 | `soul_qi_scroll` | 역천(逆天) 비서 | 천명 외부의 기 운용서 | 역천 수련 시도(mandate_refused + 심화 수련) + 사망 | 어디서든 천명 감지 가능, 천인 통제 인식 | meta |
| 10 | `soul_mandate_shard` | 천명서 파편 | 깨진 천명 각인의 잔해 | 천명서 파괴 시도(seolhwa_mandate_seen + 파괴 선택) + 사망 | 셀레스티아 통제 시스템 해석 자료 | meta |

### 7-6. 리베르타 (2종)

| # | Item ID | 이름 | 한국어 | 획득 조건 | 사용처 | Persists |
|---|---------|------|--------|----------|--------|----------|
| 11 | `soul_leon_journal` | 레온의 전이자 일지 | (카이젤과 공유 아이템) | 레온 고백(leon_transmigrator_known) + 사망 | 카이젤 반란 자료, 전이자 증거 | meta |
| 12 | `soul_surface_map` | 지상 항해도 | 전 지역 해로 정보 | 항해도 완성 퀘스트(morgan_trust + 탐험 완료) + 사망 | 아비살 지상 연결 루트 복원 | meta |

### 7-7. 셀레스티아 (2종)

| # | Item ID | 이름 | 한국어 | 획득 조건 | 사용처 | Persists |
|---|---------|------|--------|----------|--------|----------|
| 13 | `soul_celestia_archive` | 대몰락 기록 사본 | 천인 금지 기록 복사본 | 금지 기록 열람(etherno_met + truth 3개+) + 사망 | 아젤/프로스/카즈모르 핵심 자료, 모르데우스 설득 | meta |
| 14 | `soul_celestia_formula` | 세계 분할 공식 | 세계수 분할 수학적 공식 | 분할 공식 발견(pim_ancient_blueprint 연결) + 사망 | 프로스트헬 봉인 안전 해제 경로 | meta |

### 7-8. 카즈모르 (2종)

| # | Item ID | 이름 | 한국어 | 획득 조건 | 사용처 | Persists |
|---|---------|------|--------|----------|--------|----------|
| 15 | `soul_living_metal` | 살아있는 금속 | 기둥 뿌리의 금속 조각 | 기둥 뿌리 채취(living_metal_discovered) + 사망 | 카이젤/셀레 대안 기술 재료, 천문술 복원 | meta |
| 16 | `soul_forge_core` | 위대한 대장간의 핵 | 원초적 단조 에너지 | 위대한 대장간 심층 도달(forge_core_reached) + 사망 | 어디서든 특수 장비 제작 가능 | meta |

### 7-9. 아비살 (2종)

| # | Item ID | 이름 | 한국어 | 획득 조건 | 사용처 | Persists |
|---|---------|------|--------|----------|--------|----------|
| 17 | `soul_deep_pearl` | 심연의 진주 | 심해 최심부의 결정체 | 심연 깊은곳 도달(deep_call 회피 + 심층 탐험) + 사망 | 리베르타 루나 고향 귀환 루트 | meta |
| 18 | `soul_time_aria` | 시간의 아리아 | 시간의 기둥 공명 음파 | 여왕 자장가 완전 청취(queen_lullaby_heard + 전생 대화) + 사망 | 어디서든 시간 멜로디 공명 (기둥 감지 강화) | meta |

---

## 8. Meta Flags -- Visit

> **범위**: 영구 보존 (자동 설정)  
> **설정 시점**: 해당 지역 첫 진입 시 자동 true  
> **효과**: 이미 방문한 지역 직접 선택 가능 (회귀 후), 크로스 지역 대화 해금

| # | Flag ID | 지역 | 한국어 | Set 조건 | 효과 | Persists |
|---|---------|------|--------|----------|------|----------|
| 1 | `visited_azelia` | 아젤리아 | 아젤리아 방문 | 아젤리아 001 진입 | 레온에게 왕국 정보, 크로스 대화 | meta |
| 2 | `visited_kaizer` | 카이젤 | 카이젤 방문 | 카이젤 001 진입 | 프림족 동맹 정보, 크로스 대화 | meta |
| 3 | `visited_solaris` | 솔라리스 | 솔라리스 방문 | 솔라리스 001 진입 | 정령 교감 경험 참조, 크로스 대화 | meta |
| 4 | `visited_frosthel` | 프로스트헬 | 프로스트헬 방문 | 프로스트헬 001 진입 | 봉인 관련 대화 해금 (검은 로브 여인) | meta |
| 5 | `visited_yonghwa` | 용화국 | 용화국 방문 | 용화국 001 진입 | 기 수련 경험 참조, 크로스 대화 | meta |
| 6 | `visited_liberta` | 리베르타 | 리베르타 방문 | 리베르타 001 진입 | "레온이라는 전이자" 마르코 질문 | meta |
| 7 | `visited_celestia` | 셀레스티아 | 셀레스티아 방문 | 셀레스티아 001 진입 | 도서관 천인 문자 인식, 크로스 대화 | meta |
| 8 | `visited_kazmor` | 카즈모르 | 카즈모르 방문 | 카즈모르 001 진입 | "지하에서도 진동" 크로스 인식 | meta |
| 9 | `visited_abyssal` | 아비살 | 아비살 방문 | 아비살 001 진입 | 심해 경험 참조, 크로스 대화 | meta |

---

## 9. Meta Flags -- Ending

> **범위**: 영구 보존  
> **설정 시점**: 해당 엔딩 최초 도달 시 자동  
> **UI**: 엔딩 갤러리에서 열람 가능 (메뉴 → 기억의 서재 → 엔딩)

### 9-1. 일반 엔딩 (Normal Endings, 9개)

| # | Flag ID | 한국어 | 엔딩 이름 | 조건 | Persists |
|---|---------|--------|----------|------|----------|
| 1 | `ending_NE01` | 아젤리아 일반 | "빛의 용사" | 대신관 음모 미인지 + 마왕 토벌 완료 | meta |
| 2 | `ending_NE02` | 카이젤 일반 | "철의 병사" | 황제 비밀 미인지 + 전쟁 종결 | meta |
| 3 | `ending_NE03` | 솔라리스 일반 | "불꽃의 무사" | 정령 진실 미인지 + 부족 시험 통과 + 정령 교감 | meta |
| 4 | `ending_NE04` | 프로스트헬 일반 | "서리 사냥꾼" | 봉인 유지 + 프림족 동화 | meta |
| 5 | `ending_NE05` | 용화국 일반 | "무림의 검객" | 천명대로 생존 + 문파 수련 완료 | meta |
| 6 | `ending_NE06` | 리베르타 일반 | "바다의 자유인" | 해적왕 비밀 미인지 + 보물 찾기 완료 | meta |
| 7 | `ending_NE07` | 셀레스티아 일반 | "하늘의 날개" | 천인 사회 적응 + 평의회 승인 | meta |
| 8 | `ending_NE08` | 카즈모르 일반 | "대지의 장인" | 광맥 진실 미인지 + 토르그 수련 완료 + 걸작 완성 | meta |
| 9 | `ending_NE09` | 아비살 일반 | "심해의 이방인" | 여왕 비밀 미인지 + 수중 적응 + 마리아 우정 | meta |

### 9-2. 관계 엔딩 (Relationship Endings, 9개)

| # | Flag ID | 한국어 | 엔딩 이름 | 조건 | Persists |
|---|---------|--------|----------|------|----------|
| 10 | `ending_RE01` | 에리나 관계 | "가면 벗은 공주" | bond_erina + 대신관 타도 성공 | meta |
| 11 | `ending_RE02` | 벨타 관계 | "전우의 자유" | bond_velta + 황제 타도 성공 | meta |
| 12 | `ending_RE03` | 나이라 관계 | "정령의 선택" | bond_naira + 정령 교감 해소 성공 | meta |
| 13 | `ending_RE04` | 카이 관계 | "동토의 맹세" | bond_kai + 봉인 안정화 | meta |
| 14 | `ending_RE05` | 설화 관계 | "천명을 넘어" | bond_hyeonmu (사부) + 설화 천명 거부 성공 | meta |
| 15 | `ending_RE06` | 레온 관계 | "선배의 등" | bond_leon + 현대 이야기 공유 | meta |
| 16 | `ending_RE07` | 아리엘 관계 | "부러진 날개의 비상" | bond_ariel + 대몰락 진실 공개 | meta |
| 17 | `ending_RE08` | 토르그 관계 | "대장간의 불꽃" | bond_thorg + 살아있는 금속 진실 발견 | meta |
| 18 | `ending_RE09` | 아비게일 관계 | "기억의 바다" | bond_abigail + 여왕 전생 기억 완전 회복 | meta |

### 9-3. 트루 엔딩 (True Endings, 3개)

| # | Flag ID | 한국어 | 엔딩 이름 | 조건 | Persists |
|---|---------|--------|----------|------|----------|
| 19 | `ending_TE01` | 복원 엔딩 | "세계수의 심장" | melody_complete + truth 6개+ + bond_blackrobe | meta |
| 20 | `ending_TE02` | 파괴 엔딩 | "자유의 대가" | melody_complete + truth 6개+ + loop_20 | meta |
| 21 | `ending_TE03` | 공존 엔딩 | "10번째 기둥" | melody_complete + truth 9개 + bond_abigail + bond_marco | meta |

### 9-4. 특수 엔딩 (Special Endings, 3개)

| # | Flag ID | 한국어 | 엔딩 이름 | 조건 | Persists |
|---|---------|--------|----------|------|----------|
| 22 | `ending_SE01` | 고독 엔딩 | "관광객" | loop_30 + bond 0개 (어떤 관계 플래그도 미해금) | meta |
| 23 | `ending_SE02` | 관측자 엔딩 | "세계수의 잎사귀" | bond_marco MAX + 마르코 최종 "함께 관찰하겠다" | meta |
| 24 | `ending_SE03` | 각성 실패 엔딩 | "기둥이 된 자" | pillar_awakening_4 + 트루 엔딩 조건 미충족 | meta |

---

## 부록 A: 복선 연동 플래그 (Foreshadowing Tracker 연계)

> 복선 문서(`docs/story/foreshadowing.md`)와의 매핑

| 복선 ID | 연동 플래그 | 회수 시점 |
|---------|-----------|----------|
| FS-S01 "또 만났군" | `bond_marco` (3지역 대화) | 마르코 정체 해금 |
| FS-S02 모래시계 목걸이 | `bond_blackrobe` (3지역 대화) | 관리자 정체 해금 |
| FS-S03 10번째 기둥의 노래 | `melody_complete` (9개 수집) | 세계수 최종 선택지 |
| FS-S04 천인의 죄 | `truth_celestia` | 대몰락 진실 |
| FS-S05 주인공 변질 | `pillar_awakening_1~4` | 기둥화 경고 |
| FS-A01 왕의 병 | `king_medicine_seen` | 에리나 비밀 공유 |
| FS-A02 사라지는 마을 | `lifespan_harvest_witnessed` | 수명 착취 발견 |
| FS-A03 태양의 심판 주기 | `mahar_prophecy` | 정령 교감 = 기둥 약화 |
| FS-A04 봉인 아래의 목소리 | `guardian_voice_heard` | 관리자 존재 인지 |
| FS-A05 천명 거부자 | `hyeonmu_deep_teaching` | 천명 인위성 발견 |
| FS-A06 해적왕의 스마트폰 | `smartphone_found` | 레온 전이자 확인 |
| FS-A07 추락한 섬 | `falling_island_witnessed` | 대몰락 현장 |
| FS-A08 살아있는 금속 | `living_metal_discovered` | 광맥 = 기둥 뿌리 |
| FS-A09 여왕의 자장가 | `queen_lullaby_heard` | 여왕 전생 기억 |

---

## 부록 B: 크로스 지역 플래그 효과 (Cross-Region Effects)

> 특정 메타 플래그 보유 시 다른 지역에서 발생하는 추가 효과

| 보유 플래그 | 영향 지역 | 효과 |
|------------|----------|------|
| `truth_azelia` | 카이젤 | 황제에게 "다른 기둥도 착취당한다" 정보 → 동요 |
| `truth_azelia` | 셀레스티아 | 천인 도서관 "빛의 기둥 관련 기록" 추가 열람 |
| `truth_azelia` | 아비살 | 여왕에게 "빛의 기둥의 용사 소환" → 전생 트리거 |
| `truth_kaizer` | 아젤리아 | 040 제국 침공 시 "양면 전쟁의 진실" → 전쟁 방지 루트 |
| `truth_kaizer` | 프로스트헬 | "제국도 기둥에 의존" → 프림족 동맹 자료 |
| `truth_kaizer` | 카즈모르 | 마기공학 대안 기술 도면 관련 대화 |
| `truth_solaris` | 용화국 | "기도 기둥의 에너지?" → 사부 심화 가르침 |
| `truth_solaris` | 셀레스티아 | "정령도 분할의 산물" → 대몰락 연구 |
| `truth_frosthel` | 카이젤 | "기둥 관리자가 있다" → 황제 협상 카드 |
| `truth_frosthel` | 셀레스티아 | 관리자 정보 → 대몰락 복원 연구 |
| `truth_frosthel` | 아비살 | 관리자-여왕 연결 → 전생 기억 촉매 |
| `truth_yonghwa` | 솔라리스 | 정령 교감 진실 해석 보강 |
| `truth_yonghwa` | 셀레스티아 | 천명과 천인 통제의 유사성 → 대몰락 연구 |
| `truth_liberta` | 아젤리아 | 마르코에게 "시간의 기둥을 기억하는 존재" 질문 |
| `truth_celestia` | 모든 지역 | 기둥의 기원(세계수 분할) 이해 → 각 지역 NPC 설득 가능 |
| `truth_kazmor` | 카이젤 | 마기공학 대안 재료 정보 |
| `truth_kazmor` | 셀레스티아 | 천문술 복원 재료 정보 |
| `truth_abyssal` | 아젤리아 | 마르코 진실 대화 가속 |
| `truth_abyssal` | 프로스트헬 | 관리자-여왕 연결 정보 |
| `visited_azelia` | 리베르타 | 레온에게 "왕국 내부 사정" 공유 |
| `visited_frosthel` | 아젤리아 | "봉인된 것의 정체" 대화 선택지 (검은 로브 여인) |
| `visited_liberta` | 아젤리아 | "레온이라는 전이자를 아는가?" 마르코 질문 |
| `visited_celestia` | 아젤리아 | 도서관에서 천인 문자 인식 |
| `bond_blackrobe` | 아젤리아 | 005에서 검은 로브 여인이 모르데우스 견제 |
| `bond_leon` | 아젤리아 | 모르데우스 의식 현대 과학 관점 분석 |
| `bond_abigail` | 아젤리아 | 에리나에게 "루프의 끝" 약속 가능 |
| `bond_marco` | 전역 | 세계수에 대한 직접 언급 가능 |

---

## 부록 C: 플래그 저장 구조 (TypeScript Interface)

```typescript
interface GameState {
  // === 세션 플래그 (루프 내 한정, 사망 시 초기화) ===
  sessionFlags: Record<string, boolean>;
  
  // === 메타 플래그 (영구 보존) ===
  meta: {
    // 진실 플래그 (9개)
    truths: {
      truth_azelia: boolean;
      truth_kaizer: boolean;
      truth_solaris: boolean;
      truth_frosthel: boolean;
      truth_yonghwa: boolean;
      truth_liberta: boolean;
      truth_celestia: boolean;
      truth_kazmor: boolean;
      truth_abyssal: boolean;
    };
    
    // 관계 플래그 (11개)
    bonds: {
      bond_erina: boolean;
      bond_velta: boolean;
      bond_naira: boolean;
      bond_kai: boolean;
      bond_hyeonmu: boolean;
      bond_leon: boolean;
      bond_ariel: boolean;
      bond_thorg: boolean;
      bond_abigail: boolean;
      bond_marco: boolean;
      bond_blackrobe: boolean;
    };
    
    // 멜로디 플래그 (9 + 1 완성)
    melodies: {
      melody_azelia: boolean;
      melody_kaizer: boolean;
      melody_solaris: boolean;
      melody_frosthel: boolean;
      melody_yonghwa: boolean;
      melody_liberta: boolean;
      melody_celestia: boolean;
      melody_kazmor: boolean;
      melody_abyssal: boolean;
      melody_complete: boolean;  // 9개 전부 시 자동
    };
    
    // 루프 관련
    loopCount: number;
    loopFlags: {
      loop_3: boolean;
      loop_5: boolean;
      loop_10: boolean;
      loop_20: boolean;
      loop_30: boolean;
    };
    pillarAwakening: {
      pillar_awakening_1: boolean;
      pillar_awakening_2: boolean;
      pillar_awakening_3: boolean;
      pillar_awakening_4: boolean;
    };
    
    // 사망 경험 (40개)
    deaths: Record<string, boolean>;
    
    // 영혼 귀속 아이템 (18개)
    soulItems: Record<string, boolean>;
    
    // 방문 기록 (9개)
    visits: {
      visited_azelia: boolean;
      visited_kaizer: boolean;
      visited_solaris: boolean;
      visited_frosthel: boolean;
      visited_yonghwa: boolean;
      visited_liberta: boolean;
      visited_celestia: boolean;
      visited_kazmor: boolean;
      visited_abyssal: boolean;
    };
    
    // 엔딩 해금 (24개)
    endings: Record<string, boolean>;
  };
  
  // === 영혼 스탯 (루프 간 누적) ===
  soulStats: {
    STR: number;  // 상한 12
    INT: number;
    CHA: number;
    PER: number;
    FAT: number;
  };
  
  // === 이벤트 완료 로그 (수확체감용) ===
  eventLog: Record<string, number>;  // key: 이벤트 ID, value: 완료 횟수
}
```

---

## 부록 D: 플래그 총 개수 요약

| 카테고리 | 개수 | 비고 |
|---------|------|------|
| Session Flags | ~100+ | 지역당 10-19개 (루프 내 한정) |
| Meta -- Truth | 9 | 지역당 1개 |
| Meta -- Bond | 11 | NPC별 1개 |
| Meta -- Melody | 10 | 지역당 1개 + 완성 1개 |
| Meta -- Loop | 5 | 회귀 횟수 기반 자동 |
| Meta -- Pillar Awakening | 4 | 회귀 횟수 기반 자동 |
| Meta -- Death | 40 | 지역별 4-7개 |
| Meta -- Soul Items | 18 | 지역당 2개 |
| Meta -- Visit | 9 | 지역당 1개 |
| Meta -- Ending | 24 | NE 9 + RE 9 + TE 3 + SE 3 |
| **메타 플래그 총계** | **130** | 영구 보존 |
| **전체 총계** | **~230+** | 세션 포함 |

---

> **Red Team Note**: 이 문서는 살아있는 문서(Living Document)입니다. 새로운 스토리 노드, 분기, 이벤트 추가 시 반드시 이 문서를 먼저 업데이트하세요. 플래그 ID의 일관성이 StoryEngine 구현의 핵심입니다. 네이밍 충돌은 게임 전체의 분기 로직을 깨뜨립니다.
