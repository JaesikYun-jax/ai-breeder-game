/**
 * Markdown → HTML renderer for novel chapters
 */

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

export function renderChapterHTML(raw: string): string {
  const sections = raw.split(/\n---\n/);
  let html = '';

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i].trim();
    if (!section) continue;

    if (i > 0) {
      html += '<div class="r-divider" aria-hidden="true">\u2022 \u2022 \u2022</div>';
    }

    const paragraphs = section.split(/\n\n+/);

    for (const para of paragraphs) {
      const p = para.trim();
      if (!p) continue;

      if (p.startsWith('# ')) {
        // Skip — title is rendered separately
        continue;
      }

      let text = escapeHtml(p);
      // Line breaks within a paragraph
      text = text.replace(/\n/g, '<br>');
      // Inner monologue: '...'
      text = text.replace(
        /&#x27;([\s\S]*?)&#x27;/g,
        '<span class="thought">\u2018$1\u2019</span>'
      );
      // Emphasis: *...*
      text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
      // Dialogue: "..."
      text = text.replace(
        /&quot;([\s\S]*?)&quot;/g,
        '<span class="dialogue">\u201c$1\u201d</span>'
      );

      html += `<p>${text}</p>`;
    }
  }

  return html;
}
