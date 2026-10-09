import { cell } from './code';
import { icons } from './icons';
import * as S from './snippets';
import { a, code, docs, img, logos, panel, station, tri, who, zone } from './ui';

const yes = `<span class="m yes">${icons.check}</span>`;
const no = `<span class="m no">${icons.cross}</span>`;

const net = panel(
  { id: 'net', ...cell(0, 0), title: '.NET Framework vs .NET', fixed: 'net-where', tag: 'net472', doc: docs.esriNet8, logos: ['dotnet', 'arcgis'] },
  `<div class="net">
    <div class="net-cols">
      <div class="net-c old">${who.old}<div><b>.NET Framework 4.x</b><span>Windows only · 4.8.1 is the last one</span></div></div>
      <div class="net-c new">${who.now}<div><b>.NET 8 / 10</b><span>Windows · Linux · macOS · LTS releases</span></div></div>
    </div>
    <table class="matrix" ${a({ in: 'net-where', anim: 'fade' })}>
      <tr><th></th><th>${logos.windows} Windows</th><th>${logos.linux} Linux</th></tr>
      <tr><td>${logos.dotnet} .NET 8 runtime</td><td>${yes}</td><td>${yes}</td></tr>
      <tr><td>${logos.arcgis} ArcGIS Server 11.5</td><td>${yes}</td><td>${yes}</td></tr>
      <tr class="hl2"><td>${logos.arcgis} ArcGIS Server hosts a .NET SOE/SOI</td><td>${yes}</td><td>${no}<small>Java SOEs only</small></td></tr>
    </table>
    <div class="note net-why" ${a({ in: 'net-where', anim: 'fade' })}>${tri()}<span>The ✗ is <em>ArcGIS Server</em>, not .NET — .NET 8 runs on Linux just fine.</span></div>
  </div>`,
);

const multi = panel(
  { id: 'multi', ...cell(1, 0), title: 'Multitargeting', fixed: 'multi', tag: 'two branches', doc: docs.tfms, logos: ['dotnet'] },
  `<div class="multi">
    ${code(S.soeProps, { file: 'src/cetin/arcgisserver/src/Directory.Build.props', cls: 'small', mark: '3=hl' })}
    <div class="fork">
      <div class="fk src">one codebase</div>
      <svg class="fk-lines" viewBox="0 0 600 120" preserveAspectRatio="none"><path d="M300 0 C300 60 80 50 80 120"/><path d="M300 0 C300 60 520 50 520 120"/></svg>
      <div class="fk-row">
        <div class="fk tfm old"><b>net472</b><span>Wgis.Soe.soe → ArcGIS Server 10.9.1<br>Pro services · .NET Framework 4.8 runtime</span></div>
        <div class="fk tfm new"><b>net8.0</b><span>Wgis.Soe.soe → ArcGIS Server 11.5<br>Pro runtime · .NET 8</span></div>
      </div>
      <div class="fk db" ${a({ in: 'multi-db', anim: 'zoom' })}>${icons.db}<span>both in parallel, one 10.9.1 geodatabase</span></div>
    </div>
  </div>`,
);

/** A version string, exploded into labelled parts (labels sit in their own row — no overlap). */
const vstr = (v: (typeof S.versions)['clean'], cls: string, o: Parameters<typeof a>[0]) => {
  const parts: [string, string, string][] = [
    [v.tag, 'git tag', 'p1'],
    [v.rev, Number(v.rev.slice(1)) % 2 ? 'commits × 2 + 1 → odd = dirty' : 'commits × 2 → even = clean', 'p2'],
    [v.sha, 'commit', 'p3'],
    [v.branch, 'branch', 'p4'],
    ...(v.dirty ? [[v.dirty, 'hash of the local changes', 'p6'] as [string, string, string]] : []),
    [v.cfg, 'configuration', 'p5'],
  ];
  return `<div class="vstr ${cls}" ${a(o)}>${parts.map(([t, l, c]) => `<div class="vp ${c}"><b>${t}</b><i>${l}</i></div>`).join('')}</div>`;
};

const version = panel(
  { id: 'version', ...cell(0, 1), title: 'Versioning', fixed: 'version', tag: '10.8.1.3', doc: docs.gitDescribe, logos: ['git'] },
  `<div class="ver">
    <div class="ver-old">
      ${who.old}
      <div class="vo"><s>[assembly: AssemblyFileVersion("10.8.1.3")]</s><span>typed by hand</span></div>
    </div>
    ${code(S.versionHelper, { file: 'build/VersionHelper.cs · one git describe → artifacts/version/Version.props', cls: 'small xs' })}
    ${vstr(S.versions.clean, 'clean', { in: 'version-parts', anim: 'zoom' })}
    ${vstr(S.versions.dirty, 'dirty', { in: 'version-dirty', anim: 'zoom' })}
  </div>`,
);

const pipeline = zone(
  { id: 'pipeline', x: 110, y: 640, w: 2000, h: 638, s: 0.6, cls: 'shot wide', lod: 20 },
  `<div class="shot-ph"><b>GitLab pipeline</b><span>public/private/shots/pipeline.png</span></div>${img('./private/shots/pipeline.png', 'GitLab pipeline: plan, build, resolve, deploy', 'shot-img contain')}`,
);

const ci = panel(
  { id: 'ci', ...cell(1, 1), title: 'CI/CD on Linux', fixed: 'linux', tag: 'local builds', doc: docs.gitlabCi, logos: ['gitlab', 'docker', 'linux'] },
  `<div class="ci">
    <div class="runner">${logos.linux}<div><b>Linux container</b><span>mcr.microsoft.com/dotnet/sdk:10.0 · GitLab shared runners · plan → build → resolve → deploy</span></div></div>
    ${code(S.linuxRun, { lang: 'shellscript', cls: 'term small xs', mark: '4=add' })}
    <div class="note" ${a({ in: 'linux-next', anim: 'fade' })}>${tri()}<span>ArcGIS Server hosts .NET extensions on Windows only — today. The pipeline is ready when that changes.</span></div>
  </div>
  ${pipeline}`,
);

export const buildStation = station(
  { id: 'build', x: 502, y: 300, w: 2112, h: 1472, s: 0.2, title: 'Build', sub: '.NET · targets · version · CI', icon: icons.build, logos: ['dotnet', 'gitlab', 'linux'] },
  net + multi + version + ci,
);

// ---------------- .soe ----------------

const split = panel(
  { id: 'split', ...cell(0, 0), title: 'One SOE/SOI per feature', fixed: 'split-8', tag: 'monolith', doc: docs.esriSdk, logos: ['arcgis'] },
  `<div class="split">
    <div class="mono" ${a({ out: 'split-8', anim: 'fade' })}>
      <div class="mono-box"><b>Wgis.Soe</b><span>17 feature modules</span></div>
      <div class="mono-mods">${Array.from({ length: 17 }, (_, i) => `<span>Module ${String.fromCharCode(65 + i)}</span>`).join('')}</div>
      <div class="note">${who.old}<span>3 archives · touch one feature → redeploy everything</span></div>
    </div>
    <div class="arch" ${a({ in: 'split-8', anim: 'zoom' })}>
      ${[
        ['Wgis.Soe', 'SOE', '17'],
        ['Wgis.Soe.Integration', 'SOE', '4'],
        ['Wgis.Soe.FeatureA', 'SOE', '2'],
        ['Wgis.Soe.FeatureB', 'SOE', '2'],
        ['Wgis.Soe.FeatureC', 'SOE', '2'],
        ['Wgis.Soi', 'SOI', ''],
        ['Wgis.Filter.Soi', 'SOI', '2'],
        ['Wgis.ServiceAuth.Soi', 'SOI', '1'],
      ]
        .map(([n, k, m]) => `<div class="ar ${k.toLowerCase()}"><i>${k}</i><b>${n}</b><span>${m ? `${m} module${m === '1' ? '' : 's'}` : ''}</span></div>`)
        .join('')}
      <div class="note">${who.now}<span>8 archives · each references only the modules it needs</span></div>
    </div>
  </div>`,
);

/** ILRepack as a picture: our assemblies fly into one DLL named after the SOE. */
const ours = ['Wgis.dll', 'Wgis.Soe.Common.dll', 'Wgis.Soe.ModuleA.dll', 'Wgis.GeoDatabase.dll', 'Shared.Common.dll', 'Wgis.Carto.dll'];
const theirs = ['Castle.Windsor.dll', 'Newtonsoft.Json.dll', 'NLog.dll'];

const merge = panel(
  { id: 'merge', ...cell(1, 0), title: 'No DLL hell in a shared service', fixed: 'merge-fix', tag: 'DLL hell', doc: docs.ilrepack },
  `<div class="merge">
    <div class="proc">
      <div class="proc-h">${icons.server} one ArcGIS service process</div>
      <div class="ext e1"><b>SOE A</b><span class="dll">Wgis.dll <i>v1</i></span></div>
      <div class="ext e2"><b>SOI B</b><span class="dll">Wgis.dll <i>v2</i></span></div>
      <div class="boom" ${a({ only: ['merge'], anim: 'zoom' })}>${icons.warn} first loaded wins · the other breaks</div>
      <div class="fixed-b" ${a({ in: 'merge-fix', anim: 'zoom' })}>${icons.check}<span>A → <b>Wgis.Soe.dll</b>, B → <b>Wgis.Soi.dll</b></span></div>
    </div>
    <div class="rp" ${a({ in: 'merge-fix', anim: 'fade' })}>
      ${ours.map((d, i) => `<div class="rp-in" style="--i:${i}">${d}</div>`).join('')}
      <div class="rp-tool">ILRepack</div>
      <div class="rp-out">
        <div class="rp-head">${icons.box}<b>Wgis.Soe.dll</b></div>
        <div class="rp-inside">${ours.map((d) => `<span>${d.replace(/\.dll$/, '')}</span>`).join('')}</div>
        <span class="rp-cap">one private copy of our code per SOE</span>
      </div>
      <div class="rp-3rd">${theirs.map((d) => `<span>${d}</span>`).join('')}<i>third-party: shipped beside it, pinned centrally</i></div>
    </div>
  </div>`,
);

const soefile = `<div class="soefile">
  <div class="sf-icon">${icons.box}<b>Wgis.Soe.soe</b></div>
  <div class="sf-tree">
    <div><span>Config.xml</span><em class="sf-desc">&lt;Description&gt;<span ${a({ in: 'version', anim: 'fade' })}>11.5.3.220+06be7b2c…</span>&lt;/Description&gt;</em></div>
    <div><span>Install/Wgis.Soe.dll</span><em ${a({ in: 'merge-fix', anim: 'fade' })}>Shared.* · Wgis.* merged</em></div>
    <div><span>Install/Castle.Core.dll · Newtonsoft.Json.dll · NLog.dll …</span><em>third-party, beside it</em></div>
  </div>
</div>`;

export const soeStation = station(
  { id: 'soe', x: 964, y: 300, w: 2112, h: 1464, s: 0.2, title: '.soe', sub: 'per feature · merged · stamped', icon: icons.box, logos: ['arcgis'] },
  split + merge + soefile,
);
