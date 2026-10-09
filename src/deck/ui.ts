/** Small HTML helpers for authoring the canvas. */
import QRCode from 'qrcode';
import { siArcgis, siClaude, siGithub, siDocker, siDotnet, siGit, siGithubcopilot, siGitlab, siLinux, siNuget, siOpenapiinitiative, siScalar } from 'simple-icons';

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

/** Code panel; marks: "2-4=hl;7=del" (see highlight.ts). */
export const code = (src: string, o: { lang?: string; mark?: string; file?: string; cls?: string; id?: string; attrs?: Attrs } = {}) =>
  `<figure class="codebox ${o.cls ?? ''}" ${o.id ? `id="${o.id}"` : ''} ${o.attrs ? a(o.attrs) : ''}>${
    o.file ? `<figcaption class="codefile">${esc(o.file)}</figcaption>` : ''
  }<pre class="code" data-lang="${o.lang ?? 'xml'}" ${o.mark ? `data-mark="${o.mark}"` : ''}>${esc(src)}</pre></figure>`;

export const tri = (cls = '') => `<svg class="tri ${cls}" viewBox="0 0 10 10" aria-hidden="true"><path d="M1 1l8 4-8 4z"/></svg>`;

export const img = (src: string, alt: string, cls = '', o: Attrs = {}) =>
  `<img class="${cls}" src="${src}" alt="${esc(alt)}" ${a(o)} onerror="this.classList.add('missing')">`;

// ---------------------------------------------------------------- QR codes

/** QR code as inline SVG (dark modules on white, with quiet zone) — built synchronously. */
export function qrSvg(text: string) {
  const q = QRCode.create(text, { errorCorrectionLevel: 'L' });
  const n = q.modules.size;
  let d = '';
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) if (q.modules.get(x, y)) d += `M${x} ${y}h1v1h-1z`;
  }
  return `<svg class="qr-svg" viewBox="-2 -2 ${n + 4} ${n + 4}" shape-rendering="crispEdges" aria-hidden="true"><rect x="-2" y="-2" width="${n + 4}" height="${n + 4}" fill="#fff"/><path d="${d}" fill="#0b0c20"/></svg>`;
}

/** Small "read more" QR block for the corner of a panel. */
export const docQr = (url: string, cls = '') => {
  const host = new URL(url).hostname.replace(/^www\./, '');
  return `<a class="doc-qr ${cls}" href="${url}" target="_blank" rel="noopener" title="${esc(url)}">${qrSvg(url)}<span>${host}</span></a>`;
};

// ---------------------------------------------------------------- logos

const si = (icon: { path: string; hex: string; title: string }, color = `#${icon.hex}`) =>
  `<svg class="logo" viewBox="0 0 24 24" role="img" aria-label="${icon.title}"><path fill="${color}" d="${icon.path}"/></svg>`;

/**
 * Product logos. Most come from Simple Icons (CC0 artwork; the marks remain
 * trademarks of their owners and are used here only to name the products).
 * Windows is drawn by hand; ChatGPT has no free mark, so it is a wordmark.
 */
export const logos = {
  dotnet: si(siDotnet, '#a58bff'),
  nuget: si(siNuget),
  gitlab: si(siGitlab),
  linux: si(siLinux, '#f5d06a'),
  docker: si(siDocker),
  openapi: si(siOpenapiinitiative),
  scalar: si(siScalar, '#e8e8e8'),
  claude: si(siClaude),
  copilot: si(siGithubcopilot, '#e8e8e8'),
  git: si(siGit),
  github: si(siGithub, '#ffffff'),
  arcgis: si(siArcgis, '#56a5e6'),
  windows: `<svg class="logo" viewBox="0 0 24 24" role="img" aria-label="Windows"><path fill="#4cc2ff" d="M2 4.6l8.2-1.1v7.9H2zM11.2 3.3L22 1.8v9.6H11.2zM2 12.6h8.2v7.9L2 19.4zM11.2 12.6H22v9.6l-10.8-1.5z"/></svg>`,
  chatgpt: `<span class="wordmark gpt">ChatGPT</span>`,
};

export const logoRow = (...names: (keyof typeof logos)[]) => `<span class="logos">${names.map((n) => logos[n]).join('')}</span>`;

// ---------------------------------------------------------------- avatars

/** The two characters of the story (emoji — no generated imagery, per the Esri template rules). */
export const who = {
  old: `<span class="who old" role="img" aria-label="legacy developer">👴</span>`,
  now: `<span class="who now" role="img" aria-label="modern developer">👨‍💻</span>`,
};

// ---------------------------------------------------------------- zones

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

/**
 * A zoomable zone. Nested zones must be direct children of a zone (or inside
 * non-positioned, non-transformed wrappers) — geometry is computed from data-*.
 */
export const zone = (o: ZoneOpts, inner: string) =>
  `<div class="zone ${o.cls ?? ''} ${o.lod !== undefined ? 'lod' : ''}" data-zone="${o.id}"${o.fixed ? ` data-fixed="${o.fixed}"` : ''} data-x="${o.x}" data-y="${o.y}" data-w="${o.w}" data-h="${o.h}" data-s="${o.s ?? 1}" data-r="${o.r ?? 0}"${
    o.lod !== undefined ? ` data-lod="${o.lod}"` : ''
  } style="width:${o.w}px;height:${o.h}px;transform:translate(${o.x}px,${o.y}px) rotate(${o.r ?? 0}deg) scale(${o.s ?? 1})" ${o.attrs ? a(o.attrs) : ''}>${inner}</div>`;

type PanelOpts = Omit<ZoneOpts, 'w' | 'h'> & {
  title: string;
  /** Short label of the legacy state, shown next to the legacy avatar. */
  tag?: string;
  /** Documentation for the topic — rendered as a QR code in the corner. */
  doc?: string;
  /** Logos next to the title. */
  logos?: (keyof typeof logos)[];
};

/** A topic panel: a 1920×1080 slide-sized zone, usually scaled down inside a station. */
export const panel = (o: PanelOpts, body: string) =>
  zone(
    { lod: 40, ...o, w: 1920, h: 1080, cls: `panel ${o.cls ?? ''}` },
    `<div class="p-tag legacy">${who.old}<span>${o.tag ?? 'legacy'}</span></div><div class="p-tag fixed">${who.now}<span>✓</span></div>
    <h3 class="ph">${o.title}${o.logos ? logoRow(...o.logos) : ''}</h3><div class="pbody">${body}</div>${o.doc ? docQr(o.doc) : ''}`,
  );

/** A station on the overview pipeline (Code → Build → .soe → Server). */
export const station = (o: Omit<ZoneOpts, 'cls'> & { title: string; sub: string; icon: string; logos?: (keyof typeof logos)[] }, body: string) =>
  zone(
    { ...o, cls: 'station' },
    `<header class="st-head"><span class="st-icon">${o.icon}</span><div><h2>${o.title}</h2><div class="st-sub">${o.sub}</div></div>${o.logos ? logoRow(...o.logos) : ''}</header>${body}`,
  );

/** Documentation links (verified) used by the QR codes. */
export const docs = {
  sdkProjects: 'https://learn.microsoft.com/en-us/dotnet/core/project-sdk/overview',
  defaultItems: 'https://learn.microsoft.com/en-us/dotnet/core/project-sdk/overview#default-includes-and-excludes',
  assemblyInfo: 'https://learn.microsoft.com/en-us/dotnet/core/project-sdk/msbuild-props#assembly-attribute-properties',
  buildProps: 'https://learn.microsoft.com/en-us/visualstudio/msbuild/customize-by-directory',
  artifacts: 'https://learn.microsoft.com/en-us/dotnet/core/sdk/artifacts-output',
  packageReference: 'https://learn.microsoft.com/en-us/nuget/consume-packages/package-references-in-project-files',
  migrate: 'https://learn.microsoft.com/en-us/nuget/consume-packages/migrate-packages-config-to-package-reference',
  resolution: 'https://learn.microsoft.com/en-us/nuget/concepts/dependency-resolution',
  cpm: 'https://learn.microsoft.com/en-us/nuget/consume-packages/central-package-management',
  pinning: 'https://learn.microsoft.com/en-us/nuget/consume-packages/central-package-management#transitive-pinning',
  globalPackages: 'https://learn.microsoft.com/en-us/nuget/consume-packages/managing-the-global-packages-and-cache-folders',
  createPackage: 'https://learn.microsoft.com/en-us/nuget/create-packages/creating-a-package-msbuild',
  porting: 'https://learn.microsoft.com/en-us/dotnet/core/porting/',
  esriNet8: 'https://developers.arcgis.com/enterprise-sdk/guide/net/net-8-support/',
  esriWhatsNew: 'https://developers.arcgis.com/enterprise-sdk/guide/net/whats-new-11-3-net/',
  esriSdk: 'https://developers.arcgis.com/enterprise-sdk/guide/net/',
  esriDeploy: 'https://developers.arcgis.com/enterprise-sdk/guide/net/deploy-extensions-net/',
  esriAdmin: 'https://developers.arcgis.com/rest/enterprise-administration/server/',
  tfms: 'https://learn.microsoft.com/en-us/dotnet/standard/frameworks',
  ilrepack: 'https://github.com/gluck/il-repack',
  gitDescribe: 'https://git-scm.com/docs/git-describe',
  scalar: 'https://scalar.com/',
  openapi: 'https://spec.openapis.org/oas/latest.html',
  gitlabCi: 'https://docs.gitlab.com/ci/',
  dotnetSdkImage: 'https://hub.docker.com/r/microsoft/dotnet-sdk',
  nuke: 'https://github.com/nuke-build/nuke',
  minimalApis: 'https://learn.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis',
  claudeCode: 'https://code.claude.com/docs/en/overview',
  agentsMd: 'https://agents.md/',
};
