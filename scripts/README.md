# scripts/

웹소설 리더앱 보조 스크립트.

## check-chapters.mjs

리더 UI(`src/novel/chapters.ts`)와 디스크의 챕터 파일(`projects/{name}/episode/EP{NNN}.md`)이 정확히 매칭되는지 검사한다.

**왜 필요한가:** 새 회차를 `episode/`에 추가하고 `chapters.ts`에 import·등록을 잊으면 리더에서 보이지 않는다. 마이그레이션 직후·신규 회차 작성 시 가장 흔한 실수.

### 실행

```bash
npm run check:chapters
```

### 언제 실행

- 신규 회차 작성 직후 (작성 → 등록 → 검사)
- 챕터 파일 이름·위치 변경 시
- 리더에서 어떤 챕터가 안 보일 때
- `npm run build` 실패 시 1차 진단
- 마이그레이션·대량 리네이밍 후

### 검사 항목

| # | 항목 | 의미 | exit code |
|---|------|------|-----------|
| 1 | **orphan** | 디스크에 EP 파일이 있는데 `chapters.ts`에 import 안 됨 | 1 |
| 2 | **ghost** | `chapters.ts`에 import 됐는데 디스크 파일이 없음 | 1 |
| 3 | **unused** | import만 되고 ALL_CHAPTERS 등 export 배열에 사용 안 됨 | 1 |
| 4 | **empty** | EP 파일이 10 bytes 미만 (실수로 빈 파일 만든 경우) | 1 |
| 5 | **gap** | EP 번호 사이 갭 (asteropos EP007~012는 의도적이라 경고만) | 0 |

exit code 0 = 모든 검사 통과 (gap은 경고지만 통과)
exit code 1 = 1번~4번 중 하나라도 발견

### 출력 예시 (실패)

```
▸ chapters.ts: 69개 EP import 발견
▸ 디스크: 71개 EP{NNN}.md 파일 발견

✗ 디스크에 있지만 chapters.ts에 미등록 (2개) — 리더에서 안 보임:
    projects/dclass-hero/episode/EP038.md
    projects/dclass-hero/episode/EP039.md

✗ 빈 또는 거의 빈 파일 (10 bytes 미만, 1개):
    projects/dclass-hero/episode/EP039.md

✗ 3개 문제 발견
```

### 신규 회차 등록 절차 (체크리스트)

1. `projects/{name}/episode/EP{NNN}.md`에 본문 작성
2. `src/novel/chapters.ts` 상단에 raw import 추가
   ```ts
   import dh038 from '../../projects/dclass-hero/episode/EP038.md?raw';
   ```
3. 같은 파일의 `DCLASS_TITLES` 배열(또는 해당 프로젝트 배열)에 항목 추가
4. `DCLASS_RAWS` 배열(또는 해당 프로젝트 raws 배열)에 식별자 추가
5. `npm run check:chapters`로 검증
6. `npm run build`로 빌드 확인
7. `npm run dev`로 리더에서 실제 확인

## count-chars.mjs

(별도 도구 — 챕터 분량 측정용. 사용법은 파일 상단 주석 참조.)
