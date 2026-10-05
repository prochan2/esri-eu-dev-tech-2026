/** Small HTML helpers for authoring frames. */

export const esc = (s: string) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]!);

type Attrs = { in?: number; out?: number; only?: number[]; anim?: 'zoom' | 'left' | 'right' | 'fade' | 'drop'; cls?: string; id?: string; style?: string; collapse?: boolean };

export function a(o: Attrs = {}) {
  const r: string[] = [];
  if (o.in !== undefined) r.push(`data-in="${o.in}"`);
  if (o.out !== undefined) r.push(`data-out="${o.out}"`);
  if (o.only) r.push(`data-only="${o.only.join(',')}"`);
  if (o.anim) r.push(`data-anim="${o.anim}"`);
  if (o.collapse) r.push('data-collapse');
  if (o.cls) r.push(`class="${o.cls}"`);
  if (o.id) r.push(`id="${o.id}"`);
  if (o.style) r.push(`style="${o.style}"`);
  return r.join(' ');
}

/** Slide title in sentence case, with the CETIN-style red triangle marker. */
export const title = (text: string, kicker?: string, o: Attrs = {}) =>
  `<header class="t-head" ${a(o)}>${kicker ? `<div class="t-kicker">${kicker}</div>` : ''}<h2 class="t-title">${text}</h2></header>`;

/** Code panel; marks: "2-4=hl;7=del;9=in2" (see highlight.ts). */
export const code = (src: string, o: { lang?: string; mark?: string; file?: string; cls?: string; id?: string; attrs?: Attrs } = {}) =>
  `<figure class="codebox ${o.cls ?? ''}" ${o.id ? `id="${o.id}"` : ''} ${o.attrs ? a(o.attrs) : ''}>${
    o.file ? `<figcaption class="codefile">${esc(o.file)}</figcaption>` : ''
  }<pre class="code" data-lang="${o.lang ?? 'xml'}" ${o.mark ? `data-mark="${o.mark}"` : ''}>${esc(src)}</pre></figure>`;

export const tri = (cls = '') => `<svg class="tri ${cls}" viewBox="0 0 10 10" aria-hidden="true"><path d="M1 1l8 4-8 4z"/></svg>`;

export const img = (src: string, alt: string, cls = '', o: Attrs = {}) =>
  `<img class="${cls}" src="${src}" alt="${esc(alt)}" ${a(o)} onerror="this.classList.add('missing')">`;
