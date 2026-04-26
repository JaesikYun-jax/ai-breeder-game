#!/usr/bin/env node
/**
 * 리더 UI ↔ 디스크 챕터 파일 매칭 검사.
 *
 * 새 회차를 episode/에 추가하고도 chapters.ts에 import·등록을 잊으면
 * 리더에서 보이지 않는다. 이 스크립트는 그런 누락을 잡는다.
 *
 * 실행: npm run check:chapters  (또는 node scripts/check-chapters.mjs)
 *
 * 검사 항목:
 *   1. 디스크 EP{NNN}.md 파일이 chapters.ts에 import 됐는가
 *   2. chapters.ts의 import가 실제 디스크 파일을 가리키는가
 *   3. import된 식별자가 export 배열(ALL_CHAPTERS 등)에서 사용되는가
 *   4. 빈/거의 빈 파일 없는가 (10 bytes 미만)
 *   5. EP 번호 갭 (참고용 경고만 — asteropos EP007~012는 의도적 갭)
 *
 * exit code 0 = 모든 검사 통과, 1 = 문제 발견.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CHAPTERS_TS = path.join(ROOT, 'src/novel/chapters.ts');
const PROJECTS_DIR = path.join(ROOT, 'projects');
const PROJECTS = ['dclass-hero', 'canned-master', 'asteropos', 'magitech-fire'];

const c = {
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
};

let problemCount = 0;
const log = (msg) => console.log(msg);
const warn = (msg) => console.log(c.yellow(msg));
const err = (msg) => console.error(c.red(msg));

if (!fs.existsSync(CHAPTERS_TS)) {
  err(`✗ chapters.ts 없음: ${CHAPTERS_TS}`);
  process.exit(1);
}

const src = fs.readFileSync(CHAPTERS_TS, 'utf-8');

// 1. import 추출 — `import xxx from '../../projects/{name}/episode/EP{NNN}.md?raw';`
const importRegex = /^import\s+(\w+)\s+from\s+'(\.\.\/\.\.\/projects\/([^/]+)\/episode\/EP(\d{3})\.md)\?raw';/gm;
const imports = [];
let m;
while ((m = importRegex.exec(src)) !== null) {
  const [, ident, relPath, projectId, numStr] = m;
  imports.push({
    ident,
    projectId,
    num: parseInt(numStr, 10),
    relPath,
    absPath: path.resolve(path.dirname(CHAPTERS_TS), relPath),
  });
}
log(c.cyan(`▸ chapters.ts: ${imports.length}개 EP import 발견`));

// 2. 디스크 EP 파일 수집
const diskFiles = [];
for (const projectId of PROJECTS) {
  const dir = path.join(PROJECTS_DIR, projectId, 'episode');
  if (!fs.existsSync(dir)) {
    err(`✗ episode 디렉토리 없음: projects/${projectId}/episode/`);
    problemCount++;
    continue;
  }
  for (const f of fs.readdirSync(dir)) {
    const mm = f.match(/^EP(\d{3})\.md$/);
    if (!mm) continue;
    diskFiles.push({
      projectId,
      num: parseInt(mm[1], 10),
      filename: f,
      absPath: path.join(dir, f),
    });
  }
}
log(c.cyan(`▸ 디스크: ${diskFiles.length}개 EP{NNN}.md 파일 발견`));
log('');

// 3. 디스크 ⊅ chapters.ts (가장 흔한 누락 — 새 회차 등록 잊음)
const importedAbsPaths = new Set(imports.map((i) => i.absPath));
const orphans = diskFiles.filter((f) => !importedAbsPaths.has(f.absPath));
if (orphans.length > 0) {
  err(`✗ 디스크에 있지만 chapters.ts에 미등록 (${orphans.length}개) — 리더에서 안 보임:`);
  for (const f of orphans) err(`    projects/${f.projectId}/episode/${f.filename}`);
  log('');
  problemCount += orphans.length;
}

// 4. chapters.ts ⊅ 디스크 (잘못된 import — 빌드 실패 원인)
const diskAbsPaths = new Set(diskFiles.map((f) => f.absPath));
const ghosts = imports.filter((i) => !diskAbsPaths.has(i.absPath));
if (ghosts.length > 0) {
  err(`✗ chapters.ts에 import 됐지만 디스크에 없음 (${ghosts.length}개) — 빌드 실패:`);
  for (const i of ghosts) err(`    ${i.relPath}`);
  log('');
  problemCount += ghosts.length;
}

// 5. import만 하고 사용처 없음 (식별자가 ALL_CHAPTERS 등에 안 들어감)
const unused = [];
for (const i of imports) {
  // 단어 경계 매칭, src 전체에서 등장 횟수
  const usageRegex = new RegExp(`\\b${i.ident}\\b`, 'g');
  const matches = src.match(usageRegex) || [];
  if (matches.length < 2) unused.push(i); // import line 1번만 있음
}
if (unused.length > 0) {
  err(`✗ import만 됐고 ALL_CHAPTERS 등 export 배열에 사용 안 됨 (${unused.length}개):`);
  for (const i of unused) {
    err(`    ${i.ident} (projects/${i.projectId}/episode/EP${String(i.num).padStart(3, '0')}.md)`);
  }
  log('');
  problemCount += unused.length;
}

// 6. 빈/거의 빈 파일
const empty = diskFiles.filter((f) => fs.statSync(f.absPath).size < 10);
if (empty.length > 0) {
  err(`✗ 빈 또는 거의 빈 파일 (10 bytes 미만, ${empty.length}개):`);
  for (const f of empty) err(`    projects/${f.projectId}/episode/${f.filename}`);
  log('');
  problemCount += empty.length;
}

// 7. EP 번호 갭 — 경고만. asteropos는 EP007~EP012 갭이 의도적
const byProject = {};
for (const f of diskFiles) {
  (byProject[f.projectId] ||= []).push(f.num);
}
for (const [pid, nums] of Object.entries(byProject)) {
  nums.sort((a, b) => a - b);
  const min = nums[0];
  const max = nums[nums.length - 1];
  const expected = max - min + 1;
  if (nums.length !== expected) {
    const missing = [];
    for (let n = min; n <= max; n++) {
      if (!nums.includes(n)) missing.push(`EP${String(n).padStart(3, '0')}`);
    }
    warn(`⚠ ${pid}: EP${String(min).padStart(3, '0')}~EP${String(max).padStart(3, '0')} 중 ${missing.length}개 갭 — ${missing.slice(0, 5).join(', ')}${missing.length > 5 ? ' ...' : ''}`);
  }
}

// 결과
log('');
if (problemCount === 0) {
  log(c.green(`✓ 모든 검사 통과: ${imports.length} imports = ${diskFiles.length} disk files`));
  process.exit(0);
} else {
  err(`✗ ${problemCount}개 문제 발견`);
  process.exit(1);
}
