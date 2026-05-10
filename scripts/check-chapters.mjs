#!/usr/bin/env node
/**
 * 리더 데이터 정합성 검사.
 *
 * 표준 구조 (단일 진실 공급원):
 *   - 활성 프로젝트: src/projects/registry.ts의 PROJECTS (archived: true는 제외)
 *   - EP 본문: projects/{id}/episode/EP{NNN}.md (Vite glob 자동 수집)
 *   - EP 메타: src/projects/episode-titles.ts의 EPISODE_META
 *
 * 검사 항목:
 *   1. registry의 모든 활성 프로젝트가 디렉토리·novel-config.md를 갖는가
 *   2. EP 메타에 정의됐지만 디스크 파일이 없는 entry (orphan meta)
 *   3. 디스크 파일이 있지만 메타에 entry가 없음 — 경고만 (fallback 동작)
 *   4. 빈 파일 (10 bytes 미만)
 *   5. EP 번호 갭 — 정보성 경고만
 *   6. 활성 프로젝트가 아닌 디렉토리에 EP 파일이 있는 경우 (archive 누락 위험)
 *
 * exit code 0 = 모든 검사 통과, 1 = 문제 발견.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const REGISTRY_TS = path.join(ROOT, 'src/projects/registry.ts');
const EPISODE_META_TS = path.join(ROOT, 'src/projects/episode-titles.ts');
const PROJECTS_DIR = path.join(ROOT, 'projects');

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

// ── 1. registry.ts 파싱 — 활성 프로젝트 ID 목록 추출 ──
if (!fs.existsSync(REGISTRY_TS)) {
  err(`✗ registry.ts 없음: ${REGISTRY_TS}`);
  process.exit(1);
}
const registrySrc = fs.readFileSync(REGISTRY_TS, 'utf-8');
// id: 'xxx-yyy' 추출. archived: true 항목은 별도 추적
const projectBlocks = registrySrc.split(/^\s*\{\s*$/m);
const activeIds = [];
const archivedIds = [];
for (const block of projectBlocks) {
  const idMatch = block.match(/id:\s*'([^']+)'/);
  if (!idMatch) continue;
  const id = idMatch[1];
  if (/archived:\s*true/.test(block)) archivedIds.push(id);
  else activeIds.push(id);
}
log(c.cyan(`▸ registry: 활성 ${activeIds.length}개 (${activeIds.join(', ')})${archivedIds.length ? ` / archived ${archivedIds.length}개` : ''}`));

// ── 2. episode-titles.ts 파싱 — 프로젝트별 메타 entry 번호 ──
if (!fs.existsSync(EPISODE_META_TS)) {
  err(`✗ episode-titles.ts 없음: ${EPISODE_META_TS}`);
  process.exit(1);
}
const metaSrc = fs.readFileSync(EPISODE_META_TS, 'utf-8');
// EPISODE_META 안에서 프로젝트별 num 추출
const metaByProject = {};
{
  // 각 프로젝트 키 ("id" 또는 id) 위치 찾기
  const projectKeyRe = /(?:^|\s)['"]?([a-z0-9][a-z0-9_-]*)['"]?:\s*\{\s*\n\s*entries:\s*\[/gm;
  let m;
  while ((m = projectKeyRe.exec(metaSrc)) !== null) {
    const pid = m[1];
    if (!activeIds.includes(pid)) continue;
    // 다음 닫는 ']' (entries 배열 끝) 까지 추출
    let depth = 1;
    let i = m.index + m[0].length;
    while (i < metaSrc.length && depth > 0) {
      if (metaSrc[i] === '[') depth++;
      else if (metaSrc[i] === ']') depth--;
      i++;
    }
    const entriesStr = metaSrc.slice(m.index + m[0].length, i - 1);
    const nums = [];
    const numRe = /\bnum:\s*(\d+)/g;
    let n;
    while ((n = numRe.exec(entriesStr)) !== null) nums.push(parseInt(n[1], 10));
    metaByProject[pid] = nums;
  }
}

// ── 3. 디스크 EP 파일 수집 ──
const diskByProject = {};
const strayDirs = [];
if (!fs.existsSync(PROJECTS_DIR)) {
  err(`✗ projects/ 없음`);
  process.exit(1);
}
for (const dir of fs.readdirSync(PROJECTS_DIR)) {
  const projectRoot = path.join(PROJECTS_DIR, dir);
  if (!fs.statSync(projectRoot).isDirectory()) continue;

  if (!activeIds.includes(dir)) {
    if (archivedIds.includes(dir)) {
      warn(`⚠ ${dir}: registry에 archived: true 표시되어 있지만 projects/ 안에 있음 — archive/로 이동 권장`);
    } else {
      strayDirs.push(dir);
    }
    continue;
  }

  const epDir = path.join(projectRoot, 'episode');
  if (!fs.existsSync(epDir)) {
    warn(`⚠ ${dir}: episode/ 디렉토리 없음 (skill-compiler처럼 EP 미작성이면 OK)`);
    diskByProject[dir] = [];
    continue;
  }
  const nums = [];
  const empty = [];
  for (const f of fs.readdirSync(epDir)) {
    const mm = f.match(/^EP(\d{3})\.md$/);
    if (!mm) continue;
    const fp = path.join(epDir, f);
    if (fs.statSync(fp).size < 10) empty.push(f);
    nums.push(parseInt(mm[1], 10));
  }
  diskByProject[dir] = nums.sort((a, b) => a - b);
  if (empty.length > 0) {
    err(`✗ ${dir}: 빈 또는 거의 빈 EP 파일 (10 bytes 미만): ${empty.join(', ')}`);
    problemCount += empty.length;
  }
}
const diskTotal = Object.values(diskByProject).reduce((s, ns) => s + ns.length, 0);
log(c.cyan(`▸ 디스크: 활성 프로젝트에서 ${diskTotal}개 EP{NNN}.md 발견`));
log('');

// ── 4. stray 프로젝트 디렉토리 (registry 누락) ──
if (strayDirs.length > 0) {
  err(`✗ projects/ 안에 registry에 없는 디렉토리 (${strayDirs.length}개):`);
  for (const d of strayDirs) err(`    ${d} — src/projects/registry.ts에 등록 또는 archive/로 이동`);
  problemCount += strayDirs.length;
  log('');
}

// ── 5. 활성 프로젝트가 registry에 있는데 디렉토리 없음 ──
for (const id of activeIds) {
  const root = path.join(PROJECTS_DIR, id);
  if (!fs.existsSync(root)) {
    err(`✗ registry 활성 프로젝트 '${id}' — projects/${id}/ 디렉토리 없음`);
    problemCount++;
  } else if (!fs.existsSync(path.join(root, 'novel-config.md'))) {
    warn(`⚠ ${id}: novel-config.md 없음 (파이프라인 정상 동작 위해 권장)`);
  }
}

// ── 6. 메타 ↔ 디스크 정합성 ──
for (const id of activeIds) {
  const metaNums = metaByProject[id] ?? [];
  const diskNums = diskByProject[id] ?? [];
  const metaSet = new Set(metaNums);
  const diskSet = new Set(diskNums);

  const orphanMeta = metaNums.filter((n) => !diskSet.has(n));
  if (orphanMeta.length > 0) {
    err(`✗ ${id}: episode-titles.ts에 정의됐지만 디스크 파일 없음 (${orphanMeta.length}개): ${orphanMeta.map((n) => `EP${String(n).padStart(3, '0')}`).join(', ')}`);
    problemCount += orphanMeta.length;
  }

  const fallbackUse = diskNums.filter((n) => !metaSet.has(n));
  if (fallbackUse.length > 0) {
    warn(`⚠ ${id}: 디스크 파일이 있지만 episode-titles.ts에 미정의 — fallback 메타 사용 (${fallbackUse.length}개): ${fallbackUse.map((n) => `EP${String(n).padStart(3, '0')}`).join(', ')}`);
  }
}

// ── 7. EP 번호 갭 (정보성) ──
for (const [id, nums] of Object.entries(diskByProject)) {
  if (nums.length === 0) continue;
  const min = nums[0];
  const max = nums[nums.length - 1];
  const expected = max - min + 1;
  if (nums.length !== expected) {
    const missing = [];
    for (let n = min; n <= max; n++) {
      if (!nums.includes(n)) missing.push(`EP${String(n).padStart(3, '0')}`);
    }
    warn(`⚠ ${id}: EP${String(min).padStart(3, '0')}~EP${String(max).padStart(3, '0')} 중 ${missing.length}개 갭 — ${missing.slice(0, 5).join(', ')}${missing.length > 5 ? ' ...' : ''}`);
  }
}

// ── 결과 ──
log('');
if (problemCount === 0) {
  log(c.green(`✓ 모든 검사 통과: 활성 ${activeIds.length}개 프로젝트, ${diskTotal}개 EP`));
  process.exit(0);
} else {
  err(`✗ ${problemCount}개 문제 발견`);
  process.exit(1);
}
