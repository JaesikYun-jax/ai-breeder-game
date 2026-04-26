---
name: apply-feedback
description: 인라인 피드백 분석 및 적용 — pending 코멘트를 분석하고 원문 수정. '/apply-feedback', '/apply-feedback dclass-hero' 으로 실행.
user-invocable: true
---

# /apply-feedback — 인라인 피드백 분석 및 적용

## 개요
리더에서 축적된 인라인 코멘트를 분석하고, 원문 마크다운을 수정하는 워크플로.

**프로젝트 독립적**: `novel-config.md`를 읽어 피드백 파일 경로와 챕터 디렉토리를 자동 결정한다.

## 인자 파싱

```
/apply-feedback                      → 프로젝트 자동 감지
/apply-feedback dclass-hero          → dclass-hero 프로젝트
```

## 실행 절차

### Step 0: 프로젝트 설정 로드

1. **프로젝트 결정**:
   - $ARGUMENTS에서 프로젝트명 추출 (예: "dclass-hero")
   - 프로젝트명 지정 없으면: `projects/` 디렉토리에서 `novel-config.md`가 있는 하위 디렉토리 탐색
   - `status: "completed"` 프로젝트는 제외

2. **novel-config.md 로드**:
   - `projects/{project}/novel-config.md` 읽기
   - `chapter_dir` 추출 → 챕터 파일 위치 결정
   - 아크 범위 테이블 로드 → 챕터 ID → 파일 경로 매핑

### Step 1: 피드백 로드
1. `docs/story/inline-feedback.json` 파일을 읽는다
2. `status: "pending"` 인 항목만 필터링
3. 챕터별로 그룹핑

pending 피드백이 없으면 "처리할 피드백이 없습니다"를 출력하고 종료.

### Step 2: 피드백 요약 보고
챕터별로 다음 포맷으로 요약 출력:

```
## 피드백 요약

### ch001 — 트럭이 오는 건 알고 있었다 (3건)
1. [fb-1234] "택시를 탈 돈이 있는 사람과..." → "이 부분 좀 더 웃기게"
2. [fb-1235] "나는 당연히 후자다..." → "너무 직설적"
3. [fb-1236] "'아 씨, 검귀 이 새끼...'" → "욕설 톤 다운"

### ch003 — 용사라는 직업의 현실 (1건)
1. [fb-1237] "칼을 잡아본 적이..." → "묘사 더 구체적으로"
```

### Step 3: 개선안 제시
각 피드백에 대해:
1. 해당 챕터 마크다운 파일(`src/data/novel/`)을 읽는다
2. `quotedText`를 파일에서 찾는다
3. 피드백 코멘트의 의도를 분석하여 **수정 전/후** 대비를 제시:

```
#### [fb-1234] ch001 — "이 부분 좀 더 웃기게"

**인용**: "택시를 탈 돈이 있는 사람과, 없는 사람."

**수정 전**:
> 야근을 마치고 회사를 나서면 세상은 대충 두 종류로 나뉜다. 택시를 탈 돈이 있는 사람과, 없는 사람.

**수정 후**:
> 야근을 마치고 회사를 나서면 세상은 정확히 두 종류로 나뉜다. 택시를 탈 카드 잔고가 남은 자와, 새벽 2시에 걸어서 귀환하는 용사.

**변경 의도**: 후반의 이세계 용사 복선을 살리면서 유머 강화
```

사용자에게 전체 개선안을 보여주고 컨펌을 기다린다.

### Step 4: 컨펌 & 적용
사용자가 승인하면:
1. 각 챕터의 마크다운 파일에서 Edit 도구로 원문 수정
2. `docs/story/inline-feedback.json`에서 해당 피드백의 status를 `"applied"`로 변경
3. 적용 결과 요약 출력

사용자가 개별 항목을 거부하면:
- 해당 피드백의 status를 `"rejected"`로 변경

### Step 5: 설정집 영향 체크
수정된 내용이 설정집(캐릭터, 세계관 등)에 영향을 미치는지 간단히 체크:
- 캐릭터 이름/호칭 변경 → characters.md 동기화 필요
- 세계관 설정 변경 → worldbuilding.md 동기화 필요
- 복선 변경 → foreshadowing.md 동기화 필요

영향이 있으면 `/settings-sync` 실행을 권장.

## 챕터 파일 매핑
- novel-config.md의 아크 범위 테이블에서 챕터 ID → 아크 디렉토리 → 파일 경로 매핑
- 예: ch001 → arc1_azelia → `src/data/novel/arc1_azelia/1_트럭이 오는 건 알고있었다.md`
- novel-config.md가 없으면 fallback: chapters.ts의 import 경로 참조

## 주의사항
- quotedText가 파일에서 정확히 매칭되지 않을 수 있음 (HTML escape 차이). 유사 텍스트 검색으로 대응
- 수정 시 마크다운 서식(독백 따옴표, 대사 따옴표, *강조* 등) 유지
- 한 번에 너무 많은 수정 시 사용자에게 배치 단위(5~10건)로 나눠서 제안
