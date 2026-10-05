import { createHighlighterCore, type HighlighterCore } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';

let hl: Promise<HighlighterCore> | undefined;

function highlighter() {
  hl ??= createHighlighterCore({
    themes: [import('shiki/themes/github-dark-default.mjs')],
    langs: [
      import('shiki/langs/xml.mjs'),
      import('shiki/langs/csharp.mjs'),
      import('shiki/langs/json.mjs'),
      import('shiki/langs/yaml.mjs'),
      import('shiki/langs/powershell.mjs'),
      import('shiki/langs/shellscript.mjs'),
    ],
    engine: createJavaScriptRegexEngine(),
  });
  return hl;
}

/** Parses "1-3,7=hl;9=del" into a line → class map (1-based lines). */
function parseMarks(spec: string | undefined) {
  const m = new Map<number, string[]>();
  if (!spec) return m;
  for (const part of spec.split(';')) {
    const [ranges, cls] = part.split('=');
    for (const r of ranges.split(',')) {
      const [a, b] = r.split('-').map(Number);
      for (let i = a; i <= (b || a); i++) m.set(i, [...(m.get(i) ?? []), cls.trim()]);
    }
  }
  return m;
}

/**
 * Replaces every `<pre class="code" data-lang="…">` with highlighted markup.
 * Optional data-mark="2-4=hl;7=del" adds classes to lines; data-line-in="3:2,4:2"
 * makes line 3 and 4 appear at local build 2 (data-in on the line).
 */
export async function highlightAll(root: ParentNode) {
  const blocks = [...root.querySelectorAll<HTMLElement>('pre.code:not(.shiki-done)')];
  if (!blocks.length) return;
  const h = await highlighter();
  for (const pre of blocks) {
    const lang = pre.dataset.lang ?? 'xml';
    const src = (pre.textContent ?? '').replace(/^\n/, '').replace(/\s+$/, '');
    const html = h.codeToHtml(src, { lang, theme: 'github-dark-default' });
    const tpl = document.createElement('template');
    tpl.innerHTML = html;
    const out = tpl.content.firstElementChild as HTMLElement;
    out.classList.add('code', 'shiki-done', ...[...pre.classList].filter((c) => c !== 'code'));
    out.removeAttribute('style');
    for (const [k, v] of Object.entries(pre.dataset)) if (k !== 'lang') out.dataset[k] = v!;
    if (pre.id) out.id = pre.id;
    const lines = out.querySelectorAll<HTMLElement>('.line');
    const marks = parseMarks(pre.dataset.mark);
    lines.forEach((ln, i) => {
      for (const c of marks.get(i + 1) ?? []) {
        // "in2" → appears at build 2, "out3" → hidden from build 3
        const mi = /^in(\d+)$/.exec(c);
        const mo = /^out(\d+)$/.exec(c);
        if (mi) ln.dataset.in = mi[1];
        else if (mo) ln.dataset.out = mo[1];
        else ln.classList.add(c);
      }
    });
    pre.replaceWith(out);
  }
}
