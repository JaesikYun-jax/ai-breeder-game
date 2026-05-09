/**
 * Design document renderer — full GFM markdown via marked.
 *
 * The chapter renderer (renderer.ts) is tuned for EP body cadence (paragraph
 * rhythm + scene breaks + dialogue) and intentionally skips tables, deep
 * headings, and code blocks. Design docs need the opposite: tables, h1~h6,
 * code, blockquotes, nested lists. So we ship a separate parser here.
 *
 * Output is wrapped by the caller as `<div class="design-md">…</div>` (see
 * styles.css `.design-md` for the typography rules — slightly smaller than the
 * reader body, with proper table/heading/code styling).
 */

import { marked } from 'marked';

marked.setOptions({
  gfm: true,        // tables, strikethrough, task lists
  breaks: false,    // single newline ≠ <br>; respects paragraph semantics
});

export function renderDesignHTML(raw: string): string {
  // marked.parse is synchronous when no async extensions are registered.
  return marked.parse(raw) as string;
}
