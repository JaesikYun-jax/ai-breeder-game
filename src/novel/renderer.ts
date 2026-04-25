/**
 * Markdown → HTML renderer for novel chapters.
 *
 * Block classification (per paragraph):
 *   - paragraph wrapped entirely in "…"  → <p class="dialogue">"…"</p>
 *   - paragraph wrapped entirely in '…'  → <p class="thought">…</p>
 *   - otherwise                          → <p>…</p>
 * Inline emphasis (*…*) is preserved as <em>.
 * Section breaks (---) become <div class="scene-break">✦ ✦ ✦</div>.
 */

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

function applyEmphasis(text: string): string {
  return text.replace(/\*([^*\n]+)\*/g, '<em>$1</em>');
}

export function renderChapterHTML(raw: string): string {
  const sections = raw.split(/\n---\n/);
  let html = '';

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i].trim();
    if (!section) continue;

    if (i > 0) {
      html += '<div class="scene-break" aria-hidden="true">✦ ✦ ✦</div>';
    }

    const paragraphs = section.split(/\n\n+/);

    for (const para of paragraphs) {
      const p = para.trim();
      if (!p) continue;
      if (p.startsWith('# ')) continue;
      // Skip the trailing "*N화 끝…*" marker
      if (/^\*[^*\n]*끝[^*\n]*\*\s*$/.test(p)) continue;

      const isDialogue = /^["“][\s\S]*["”]$/.test(p);
      const isThought = /^['‘][\s\S]*['’]$/.test(p);

      const inner = applyEmphasis(escapeHtml(p)).replace(/\n/g, '<br>');

      if (isDialogue) {
        const stripped = inner.replace(/^&quot;|^[“]/, '').replace(/&quot;$|[”]$/, '');
        html += `<p class="dialogue">“${stripped}”</p>`;
      } else if (isThought) {
        const stripped = inner.replace(/^&#x27;|^[‘]/, '').replace(/&#x27;$|[’]$/, '');
        html += `<p class="thought">${stripped}</p>`;
      } else {
        // Inline dialogue / thought spans for mixed paragraphs
        const mixed = inner
          .replace(/&#x27;([\s\S]*?)&#x27;/g, '‘$1’')
          .replace(/&quot;([\s\S]*?)&quot;/g, '“$1”');
        html += `<p>${mixed}</p>`;
      }
    }
  }

  return html;
}
