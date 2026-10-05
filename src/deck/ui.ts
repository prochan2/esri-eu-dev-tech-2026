/** Small HTML helpers for authoring frames. */

export const esc = (s: string) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]!);

type Attrs = { in?: string; out?: string; only?: string[]; anim?: 'zoom' | 'left' | 'right' | 'fade' | 'drop'; cls?: string; id?: string; style?: string; collapse?: boolean };

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

export interface ZoneOpts {
  id: string;
  /** Position of the zone's top-left corner in the parent zone's local px. */
  x: number;
  y: number;
  /** Local size (content is laid out at this size, then scaled by s). */
  w: number;
  h: number;
  s?: number;
  r?: number;
  cls?: string;
  /** Hide contents when narrower than this many screen px (level of detail). */
  lod?: number;
  /** Step id from which this part shows as "fixed" (21st century) instead of legacy. */
  fixed?: string;
  attrs?: Attrs;
}

/** A topic panel: a 1920×1080 slide-sized zone, usually scaled down inside a station. */
export const panel = (o: Omit<ZoneOpts, 'w' | 'h'> & { title: string; tag?: string }, body: string) =>
  zone(
    { lod: 40, ...o, w: 1920, h: 1080, cls: `panel ${o.cls ?? ''}` },
    `<div class="p-tag legacy">${o.tag ?? 'legacy'}</div><div class="p-tag fixed">✓</div><h3 class="ph">${o.title}</h3><div class="pbody">${body}</div>`,
  );

/** A station on the overview pipeline (Code → Build → .soe → Server). */
export const station = (o: Omit<ZoneOpts, 'cls'> & { title: string; sub: string; icon: string }, body: string) =>
  zone({ ...o, cls: 'station' }, `<header class="st-head"><span class="st-icon">${o.icon}</span><div><h2>${o.title}</h2><div class="st-sub">${o.sub}</div></div></header>${body}`);

/**
 * A zoomable zone. Nested zones must be direct children of a zone (or inside
 * non-positioned, non-transformed wrappers) — geometry is computed from data-*.
 */
export const zone = (o: ZoneOpts, inner: string) =>
  `<div class="zone ${o.cls ?? ''} ${o.lod !== undefined ? 'lod' : ''}" data-zone="${o.id}"${o.fixed ? ` data-fixed="${o.fixed}"` : ''} data-x="${o.x}" data-y="${o.y}" data-w="${o.w}" data-h="${o.h}" data-s="${o.s ?? 1}" data-r="${o.r ?? 0}"${
    o.lod !== undefined ? ` data-lod="${o.lod}"` : ''
  } style="width:${o.w}px;height:${o.h}px;transform:translate(${o.x}px,${o.y}px) rotate(${o.r ?? 0}deg) scale(${o.s ?? 1})" ${o.attrs ? a(o.attrs) : ''}>${inner}</div>`;
