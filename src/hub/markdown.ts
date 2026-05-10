/**
 * Mini Markdown → HTML renderer for design documents.
 *
 * Supports:
 *   - Headings (#, ##, ###, ####, #####, ######)
 *   - Tables (GFM pipe tables)
 *   - Code blocks (```lang ... ```)
 *   - Inline code (`...`)
 *   - Bullets (-, *, +) including nested
 *   - Ordered lists (1. 2. 3.)
 *   - Bold (**...**), Italic (*...*), Strike (~~...~~)
 *   - Links [text](url)
 *   - Blockquote (> ...)
 *   - Horizontal rule (---, ___, ***)
 *   - Hard line breaks (preserved within paragraphs)
 *
 * Design docs use heavier markdown than novel chapters,
 * so we don't reuse src/novel/renderer.ts.
 */

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

function applyInline(text: string): string {
  let out = escapeHtml(text);
  // inline code first (so emphasis inside is left alone)
  out = out.replace(/`([^`\n]+)`/g, (_, c) => `<code>${c}</code>`);
  // bold (** **)
  out = out.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
  // italic (* *) — but skip already-converted strong markers
  out = out.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, '$1<em>$2</em>');
  // strike (~~ ~~)
  out = out.replace(/~~([^~\n]+)~~/g, '<del>$1</del>');
  // links [text](url)
  out = out.replace(
    /\[([^\]\n]+)\]\(([^)\s]+)\)/g,
    (_, label, url) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`
  );
  return out;
}

function isTableSeparator(line: string): boolean {
  // | --- | --- | or | :--- | ---: |
  const cells = line
    .replace(/^\||\|$/g, '')
    .split('|')
    .map((c) => c.trim());
  return cells.length > 0 && cells.every((c) => /^:?-{2,}:?$/.test(c));
}

function splitTableRow(line: string): string[] {
  return line
    .replace(/^\||\|$/g, '')
    .split('|')
    .map((c) => c.trim());
}

function detectAlign(separatorLine: string): ('left' | 'center' | 'right')[] {
  return splitTableRow(separatorLine).map((c) => {
    const left = c.startsWith(':');
    const right = c.endsWith(':');
    if (left && right) return 'center';
    if (right) return 'right';
    return 'left';
  });
}

export function renderDesignDocHTML(raw: string): string {
  const lines = raw.replace(/\r\n/g, '\n').split('\n');
  const out: string[] = [];

  let i = 0;
  let paraBuf: string[] = [];
  let listStack: { type: 'ul' | 'ol'; indent: number }[] = [];
  let quoteBuf: string[] = [];
  let inCodeBlock = false;
  let codeBuf: string[] = [];
  let codeLang = '';

  function flushPara() {
    if (paraBuf.length === 0) return;
    const text = paraBuf.join('\n').trim();
    if (text) {
      const html = applyInline(text).replace(/\n/g, '<br>');
      out.push(`<p>${html}</p>`);
    }
    paraBuf = [];
  }

  function closeAllLists() {
    while (listStack.length > 0) {
      const last = listStack.pop()!;
      out.push(`</${last.type}>`);
    }
  }

  function flushQuote() {
    if (quoteBuf.length === 0) return;
    const inner = quoteBuf
      .map((l) => l.replace(/^>\s?/, ''))
      .join('\n')
      .trim();
    if (inner) {
      const html = applyInline(inner).replace(/\n/g, '<br>');
      out.push(`<blockquote>${html}</blockquote>`);
    }
    quoteBuf = [];
  }

  while (i < lines.length) {
    const line = lines[i];

    // ── code block fence ──
    if (/^```/.test(line)) {
      if (!inCodeBlock) {
        flushPara();
        flushQuote();
        closeAllLists();
        inCodeBlock = true;
        codeLang = line.replace(/^```/, '').trim();
        codeBuf = [];
      } else {
        const code = escapeHtml(codeBuf.join('\n'));
        const cls = codeLang ? ` class="lang-${escapeHtml(codeLang)}"` : '';
        out.push(`<pre><code${cls}>${code}</code></pre>`);
        inCodeBlock = false;
        codeBuf = [];
        codeLang = '';
      }
      i++;
      continue;
    }
    if (inCodeBlock) {
      codeBuf.push(line);
      i++;
      continue;
    }

    // ── horizontal rule ──
    if (/^\s*(-{3,}|_{3,}|\*{3,})\s*$/.test(line)) {
      flushPara();
      flushQuote();
      closeAllLists();
      out.push('<hr>');
      i++;
      continue;
    }

    // ── heading ──
    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      flushPara();
      flushQuote();
      closeAllLists();
      const level = headingMatch[1].length;
      const text = applyInline(headingMatch[2].trim());
      out.push(`<h${level} class="dd-h${level}">${text}</h${level}>`);
      i++;
      continue;
    }

    // ── table ──
    if (line.includes('|') && i + 1 < lines.length && isTableSeparator(lines[i + 1])) {
      flushPara();
      flushQuote();
      closeAllLists();
      const headerCells = splitTableRow(line);
      const aligns = detectAlign(lines[i + 1]);
      const bodyRows: string[][] = [];
      let j = i + 2;
      while (j < lines.length) {
        const l = lines[j];
        if (l.trim() === '' || !l.includes('|')) break;
        bodyRows.push(splitTableRow(l));
        j++;
      }
      const thead =
        '<thead><tr>' +
        headerCells
          .map(
            (c, idx) =>
              `<th style="text-align:${aligns[idx] ?? 'left'}">${applyInline(c)}</th>`
          )
          .join('') +
        '</tr></thead>';
      const tbody =
        '<tbody>' +
        bodyRows
          .map(
            (row) =>
              '<tr>' +
              row
                .map(
                  (c, idx) =>
                    `<td style="text-align:${aligns[idx] ?? 'left'}">${applyInline(c)}</td>`
                )
                .join('') +
              '</tr>'
          )
          .join('') +
        '</tbody>';
      out.push(`<table class="dd-table">${thead}${tbody}</table>`);
      i = j;
      continue;
    }

    // ── blockquote ──
    if (/^>\s?/.test(line)) {
      flushPara();
      closeAllLists();
      quoteBuf.push(line);
      i++;
      continue;
    } else if (quoteBuf.length > 0) {
      flushQuote();
    }

    // ── lists ──
    const ulMatch = line.match(/^(\s*)[-*+]\s+(.+)$/);
    const olMatch = line.match(/^(\s*)\d+\.\s+(.+)$/);
    if (ulMatch || olMatch) {
      flushPara();
      const m = (ulMatch ?? olMatch)!;
      const indent = m[1].length;
      const content = m[2];
      const wantType: 'ul' | 'ol' = ulMatch ? 'ul' : 'ol';

      // close deeper lists
      while (
        listStack.length > 0 &&
        (listStack[listStack.length - 1].indent > indent ||
          (listStack[listStack.length - 1].indent === indent &&
            listStack[listStack.length - 1].type !== wantType))
      ) {
        const last = listStack.pop()!;
        out.push(`</${last.type}>`);
      }
      // open new list if needed
      if (
        listStack.length === 0 ||
        listStack[listStack.length - 1].indent < indent ||
        listStack[listStack.length - 1].type !== wantType
      ) {
        out.push(`<${wantType}>`);
        listStack.push({ type: wantType, indent });
      }
      out.push(`<li>${applyInline(content)}</li>`);
      i++;
      continue;
    } else if (listStack.length > 0 && line.trim() === '') {
      // blank may continue list — peek ahead
      const next = lines[i + 1] ?? '';
      if (!/^(\s*)[-*+]\s+/.test(next) && !/^(\s*)\d+\.\s+/.test(next)) {
        closeAllLists();
      }
      i++;
      continue;
    }

    // ── blank line ──
    if (line.trim() === '') {
      flushPara();
      i++;
      continue;
    }

    // ── normal paragraph ──
    paraBuf.push(line);
    i++;
  }

  // flush remaining
  flushPara();
  flushQuote();
  closeAllLists();
  if (inCodeBlock && codeBuf.length > 0) {
    out.push(`<pre><code>${escapeHtml(codeBuf.join('\n'))}</code></pre>`);
  }

  return out.join('\n');
}
