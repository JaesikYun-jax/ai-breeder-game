---
name: settings-sync
description: 완성된 챕터 배치를 기반으로 설정집 문서들을 비교·검증·업데이트하는 에이전트 팀 실행. '/settings-sync', '/settings-sync dclass-hero', '/settings-sync dclass-hero 6-10' 으로 실행.
user_invocable: true
---

# 설정집 동기화 에이전트 팀

완성된 챕터 배치(5화 단위)를 읽고, 각 설정 문서와 비교하여 누락·불일치·추가 필요 사항을 찾아 업데이트한다.

**프로젝트 독립적**: `novel-config.md`를 읽어 설정문서 경로를 자동 결정한다.

## 인자 파싱

```
/settings-sync                        → 프로젝트 자동 감지, complete 상태 챕터 자동 탐지
/settings-sync dclass-hero            → dclass-hero 프로젝트, complete 챕터 자동 탐지
/settings-sync dclass-hero 6-10       → dclass-hero 프로젝트, 6~10화 지정
/settings-sync 6-10                   → 프로젝트 자동 감지, 6~10화 지정
```

## 실행 조건

- 대상 챕터들의 status가 `complete`인지 확인 (`src/novel/chapters.ts` 또는 `_arc_meta.json`)
- `writing` 상태인 챕터가 포함되어 있으면 경고 후 사용자 확인

## 실행 절차

### Step 0: 프로젝트 설정 로드

1. **프로젝트 결정**:
   - $ARGUMENTS에서 프로젝트명 추출 (예: "dclass-hero")
   - 프로젝트명 지정 없으면: `projects/` 디렉토리에서 `novel-config.md`가 있는 하위 디렉토리 탐색
   - `novel-config.md`가 여러 개면: 사용자에게 선택 요청
   - `status: "completed"` 프로젝트는 제외 (예: british-food)

2. **novel-config.md 로드**:
   - `projects/{project}/novel-config.md` 읽기
   - 설정문서 매핑 추출 → 에이전트별 경로 결정
   - `chapter_dir` 추출 → 챕터 파일 위치 결정

### Step 1: 대상 챕터 파악

사용자가 지정한 챕터 범위 (예: "6-10화", "ch006~ch010")를 파악한다.
지정하지 않으면, `complete` 상태이면서 아직 설정집 동기화가 안 된 챕터를 자동 탐지한다.

novel-config.md의 아크 범위 테이블에서 해당 챕터의 아크 디렉토리를 확인하고,
해당 챕터의 마크다운 파일들을 모두 읽는다:
```
{chapter_dir}/{arc_dir}/{num}_{title}.md
```

### Step 2: 병렬 에이전트 팀 실행

아래 6개 에이전트를 **Agent 도구로 병렬 실행**한다. 각 에이전트는:
- 대상 챕터 전문을 읽고
- 담당 설정 문서의 현재 내용과 비교하고
- **추가/수정/삭제** 필요 항목을 리스트로 보고한다

#### 에이전트 1: 캐릭터 동기화
- **담당**: `docs/story/characters.md`
- **체크 항목**:
  - 새로 등장한 캐릭터 (이름, 외모, 성격, 역할)
  - 기존 캐릭터의 새로운 정보 (비밀, 과거, 관계 변화)
  - 캐릭터 간 새로운 관계/갈등
  - 호칭/말투 변화
- **액션**: characters.md에 직접 추가/수정

#### 에이전트 2: 세계관 동기화
- **담당**: `docs/story/worldbuilding.md`
- **체크 항목**:
  - 새로 밝혀진 지역 정보 (지명, 문화, 정치)
  - 역사적 사실/사건 추가
  - 종족/세력 정보 변경
  - 마법/기술 체계 관련 새 정보 → `docs/story/magic-systems.md`도 함께 확인
- **액션**: worldbuilding.md, magic-systems.md에 직접 추가/수정

#### 에이전트 3: 복선 동기화
- **담당**: `docs/story/foreshadowing.md`
- **체크 항목**:
  - 새로 배치된 복선 (떡밥, 암시, 상징)
  - 기존 복선의 회수/진전
  - 복선 등급 변경 (S/A/B/C)
  - 배치 씬 ↔ 회수 씬 매핑
- **액션**: foreshadowing.md에 추가/상태 업데이트

#### 에이전트 4: 지역연결 동기화
- **담당**: `docs/story/region-connections.md`
- **체크 항목**:
  - 지역 간 새로운 관계/교역/갈등 언급
  - 마르코 네트워크 관련 새 정보
  - 정치적 변화
- **액션**: region-connections.md에 추가/수정

#### 에이전트 5: 챕터 로그 업데이트
- **담당**: `docs/story/chapter-log.md` (없으면 생성)
- **기록 항목** (화별):
  - 한 줄 시놉시스
  - 등장 캐릭터
  - 새로 공개된 설정
  - 감정 아크 (코미디/공포/감동 비율)
  - 다음 화 훅
  - 배치된 복선 번호
- **액션**: chapter-log.md에 5화분 추가

#### 에이전트 6: 주인공 바이블 동기화
- **담당**: `docs/story/protagonist-bible.md` (없으면 생성)
- **체크 항목**:
  - 강지호의 새로운 경험/지식
  - 감정 변화/성장 포인트
  - 새로 획득한 능력/스킬
  - 이세계 지식 DB 업데이트 (패러디한 트로프 등)
  - 사망 경험 추가 (해당 시)
  - 관계 변화 (호감도, 신뢰도)
- **액션**: protagonist-bible.md에 추가/수정

### Step 3: 결과 집계 및 보고

모든 에이전트 완료 후:

1. **변경 요약 테이블** 출력:
   | 설정 문서 | 추가 | 수정 | 비고 |
   |----------|------|------|------|
   | characters.md | 2건 | 1건 | 새 캐릭터: OOO |
   | ... | | | |

2. **story-feedback-log.md**에 동기화 기록 추가:
   ```
   ### SYNC-XXX — YYYY-MM-DD
   **대상**: N화~M화
   **변경 요약**: (에이전트별 변경 내역)
   **상태**: 동기화 완료
   ```

3. **챕터 상태 전환**: 사용자에게 `complete` → `published` 전환 여부 확인

### Step 4: 미완성 설정 문서 체크

아직 생성되지 않은 설정 문서 목록을 표시하고, 이번 배치에서 생성 가능한 것이 있으면 제안:
- `docs/story/protagonist-bible.md`
- `docs/story/tone-and-style.md`
- `docs/story/voice-guide.md`
- `docs/story/death-and-regression.md`
- `docs/story/glossary.md`
- `docs/story/timeline.md`
- `docs/story/chapter-log.md`

## 에이전트 프롬프트 템플릿

각 에이전트에 전달할 프롬프트의 공통 구조:

```
당신은 [역할] 에이전트입니다.

## 임무
아래 완성된 챕터들을 읽고, [담당 설정 문서]와 비교하여 누락·불일치·추가 필요 사항을 찾아 직접 업데이트하세요.

## 프로젝트
[프로젝트명] (novel-config.md 경로: projects/{project}/novel-config.md)

## 대상 챕터
[챕터 파일 경로 목록 — novel-config.md의 chapter_dir + 아크 디렉토리 기반]

## 담당 설정 문서
[설정 문서 경로 — novel-config.md의 설정문서 매핑 기반]

## 작업 규칙
1. 챕터 전문을 먼저 읽으세요
2. 설정 문서의 현재 내용을 읽으세요
3. 챕터에서 설정 문서에 없는 새로운 정보를 찾으세요
4. 기존 내용과 충돌하는 부분을 찾으세요
5. 설정 문서를 직접 수정하세요 (Edit 도구 사용)
6. 변경한 내역을 간결하게 보고하세요

## 주의
- 챕터에 명시적으로 나온 정보만 반영 (추론/추측 금지)
- 기존 설정과 충돌 시: 챕터 내용이 정본, 설정 문서를 수정
- 소설 톤 유지: 설정집도 같은 세계관 용어 사용
```

### Step 5: alive-tracker 갱신 (선택)

`projects/{project}/revision/alive-tracker.md`가 존재하면, 동기화된 챕터의 캐릭터 관계 변화를 반영한다.
- 새로운 관계 이벤트 추가
- 호칭 변화 기록
- 20화 윈도우 초과 항목은 아카이브로 이동
