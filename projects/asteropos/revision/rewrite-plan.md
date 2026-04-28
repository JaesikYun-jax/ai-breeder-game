# Rewrite Plan — 아스테로포스 EP002~EP006 분량 통일·내용 보강 재작성

## 대상: EP002~EP006
## 발동 사유:
- 분량 정책 통일 (5,000~7,000자, 재생용사 dclass-hero §15와 동일)
- 전체적 내용 부족 보강 (사용자 피드백 2026-04-26)
- 1 아크 일상 슬라이스 디테일·내면 묘사·관계망 결을 충분히 풀어 채울 것

## 보존 원칙 (절대 훼손 금지)
- 스토리·플롯 비트·박힌 떡밥(FS-XXX)·감정 아크는 chapter-log.md 누적 캐논과 정합
- 글로벌 서술체 v2 (`docs/narrative-style.md`) 적용
- 1 아크 금지 단어 ("성석"/"아스테로포스"/"마계") 절대 등장 X
- 카엘 본인이 결합 메커닉의 진실을 모름
- "신의 은총" 위장 + "현자의 재림" 별칭 정착
- 분량 5,000~7,000자 하한·상한 엄수
- EP000(프롤로그, 1,607자), EP001(구덩이, 2,696자)은 제외 — 사용자 명시

## 현황: 5/5 완료 ✅ REWRITE_COMPLETE

### EP별 상태
- [x] EP002 | REWRITTEN | 신의 은총 — 4,657→**6,471자** | 비트 12/12 보존 + 신부/노인 입체화 + 미래 예고 추가 | KOREAN 변주(있었다 20→3, 고있었다 7→0) 직접 적용 | 캐릭터 8.9 평균 PASS
- [x] EP003 | REWRITTEN | 현자의 재림 — 3,114→**6,494자** | 비트 8/8 보존 + 마을 조연 5명 입체화 + 한스 침묵 빌드업 3자리 + 캐논 클로징 정정 | 한 번 0/있었다 1/고있었다 0 | 0c/0m PASS
- [x] EP004 | REWRITTEN | 마당의 끝 — 2,750→**6,491자** | 비트 7/7 + 신규 식탁 신 (이르마 시그니처 회수) + 카엘 13세 진입 톤 + 한스 고유 비언어 + FS-106 신부 인연 회수 | 있었다 3/한 번 3/고있었다 2 | 캐릭터 7.1 평균 PASS
- [x] EP005 | REWRITTEN | 사라진 마을 — 3,274→**6,487자** | 비트 7/7 + 펠릭스/촌장 첫 등장 입체화 + 한스 검 선물 무게 + FS-103 옛 종군 시드 + 미래 예고 클로징 | 있었다 3/한 번 0/고있었다 1 | 캐릭터 7.3 평균 PASS
- [x] EP006 | REWRITTEN | 마차 위에서 (1 아크 마지막) — 2,366→**6,499자** | 비트 6/6 + 9개 보존 자구 정확 + 한스 시그니처 회복 + 리나 어차피 변주 + 마차 위 사진 기억 의미 전환 + 1 아크 종료 인벤토리 정합 100% | 있었다 5/한 번 3/고있었다 1/한 호흡 4 | 캐릭터 7.8 평균 PASS

### 5화 합계
- **총합: 32,442자 / 평균 6,488자** (목표 평균 6,000자 / 범위 5,800~6,500자 — 모두 범위 안)

### 보강 폭
| EP | 전 | 후 | 보강 |
|----|-----|-----|-----|
| EP002 | 4,657 | 6,471 | +1,814 |
| EP003 | 3,114 | 6,494 | +3,380 |
| EP004 | 2,750 | 6,491 | +3,741 |
| EP005 | 3,274 | 6,487 | +3,213 |
| EP006 | 2,366 | 6,499 | +4,133 |
| **합계** | **16,161** | **32,442** | **+16,281** |

### 변수 치환 (Step 0.5)
```
{EPISODE_DIR}        = projects/asteropos/episode/
{REWRITE_WORK_DIR}   = projects/asteropos/revision/
{WRITING_RULES}      = CLAUDE.md
{CHAR_CORE/DETAIL/DNA} = docs/asteropos/characters.md
{BOOTSTRAP}          = docs/asteropos/worldbuilding.md
{PLOT_DOC}           = docs/asteropos/story-framework-1-30.md
{NARRATIVE_STYLE}    = docs/narrative-style.md
{CHAPTER_LOG}        = docs/asteropos/chapter-log.md
{FORESHADOWING}      = docs/asteropos/foreshadowing.md
```

## REWRITE_COMPLETE — 다음 단계: /polish asteropos EP002~EP006
