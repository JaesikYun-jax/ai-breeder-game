#!/usr/bin/env node
/**
 * 리더 카운트 = 한국 웹소설 공백 포함 자수 표준
 *
 * 사용법:
 *   node scripts/count-chars.mjs <file.md> [<file2.md> ...]
 *   node scripts/count-chars.mjs src/data/novel/arc1_village/*.md
 *
 * 카운트 로직 (src/novel/main.ts:countChapterChars 동일):
 *   - 마크다운 헤더 (# ...) 제외
 *   - 씬 구분선 (---) 제외
 *   - 파라텍스트 (*N화 끝...*) 제외
 *   - 이탤릭 마커 (*텍스트*) 의 마커만 제외 (텍스트는 유지)
 *   - 모든 개행·CR·탭 제외
 *   - 공백·일반 문자는 유지 (한국 웹소설 공백 포함 자수와 동일)
 *
 * 주의: macOS 기본 wc -m은 LC_CTYPE에 따라 바이트 카운트로 동작 가능.
 *       한글 UTF-8 = 3바이트 → 실제 문자수의 약 2.4배 부풀려질 수 있음.
 *       반드시 이 스크립트 또는 동등한 측정 도구 사용.
 */

import { readFileSync } from 'node:fs';
import { basename } from 'node:path';

function countChapterChars(raw) {
  return raw
    .replace(/^# .+$/gm, '')
    .replace(/^---\s*$/gm, '')
    .replace(/^\*[^*\n]*끝[^*\n]*\*\s*$/gm, '')
    .replace(/\*([^*\n]+)\*/g, '$1')
    .replace(/[\n\r\t]/g, '').length;
}

function main() {
  const files = process.argv.slice(2);
  if (files.length === 0) {
    console.error('Usage: node scripts/count-chars.mjs <file.md> [<file2.md> ...]');
    process.exit(1);
  }

  let total = 0;
  for (const file of files) {
    const raw = readFileSync(file, 'utf8');
    const count = countChapterChars(raw);
    total += count;
    console.log(`${count.toString().padStart(6)} ${basename(file)}`);
  }
  if (files.length > 1) {
    console.log(`${'─'.repeat(20)}`);
    console.log(`${total.toString().padStart(6)} total (${files.length} files, avg ${Math.round(total / files.length)})`);
  }
}

main();
