import { cell } from './code';
import { icons } from './icons';
import { a, code, panel, station, tri } from './ui';
import * as S from './snippets';

const yes = `<span class="m yes">${icons.check}</span>`;
const no = `<span class="m no">${icons.cross}</span>`;

const net = panel(
  { id: 'net', ...cell(0, 0), title: '.NET Framework vs .NET', fixed: 'net-where', tag: 'net472' },
  `<div class="net">
    <div class="net-cols">
      <div class="net-c old"><b>.NET Framework 4.x</b><span>Windows only · 4.8.1 is the last · maintenance</span></div>
      <div class="net-c new"><b>.NET 8 / 10</b><span>cross-platform · LTS every 2 years · fast</span></div>
    </div>
    <table class="matrix" ${a({ in: 'net-where', anim: 'fade' })}>
      <tr><th></th><th>${icons.windows} Windows</th><th>${icons.linux} Linux</th></tr>
      <tr><td>.NET 8 runtime</td><td>${yes}</td><td>${yes}</td></tr>
      <tr class="hl"><td>ArcGIS Server 11.5</td><td>${yes}</td><td>${yes}</td></tr>
      <tr class="hl2"><td>.NET SOE / SOI</td><td>${yes}</td><td>${no}<small>Java only</small></td></tr>
      <tr><td>our build (CI)</td><td>${yes}</td><td>${yes}</td></tr>
    </table>
  </div>`,
);

const multi = panel(
  { id: 'multi', ...cell(1, 0), title: 'Multitargeting', fixed: 'multi', tag: 'two branches' },
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

const version = panel(
  { id: 'version', ...cell(0, 1), title: 'Versioning', fixed: 'version', tag: '10.8.1.3' },
  `<div class="ver">
    <div class="ver-old">
      <div class="vo"><s>[assembly: AssemblyFileVersion("10.8.1.3")]</s><span>typed by hand</span></div>
      <div class="vo"><s>GitVersion.MsBuild in 117 packages.config</s><span>2025-06</span></div>
    </div>
    ${code(S.versionHelper, { file: 'build/VersionHelper.cs · one git describe → artifacts/version/Version.props', cls: 'small', attrs: { in: 'version', anim: 'fade' } })}
    <div class="vstr" ${a({ in: 'version-parts', anim: 'zoom' })}>
      <span class="vp p1">11.5.1<i>tag</i></span><span class="vp p2">.0<i>commits×2 (+1 dirty)</i></span><span class="vp p3">+4424ac4<i>sha</i></span><span class="vp p4">.topic-soe-fix<i>branch</i></span><span class="vp p5">.debug<i>config</i></span>
    </div>
  </div>`,
);

const ci = panel(
  { id: 'ci', ...cell(1, 1), title: 'CI/CD on Linux', fixed: 'linux', tag: 'TeamCity' },
  `<div class="ci">
    <div class="pipe">
      <span class="stage-b">plan</span><span class="arr">→</span>
      <span class="stage-b multi-b">build × component × config × ArcGIS</span><span class="arr">→</span>
      <span class="stage-b">deploy</span>
    </div>
    <div class="runner">${icons.linux}<div><b>Linux container</b><span>mcr.microsoft.com/dotnet/sdk:10.0 · GitLab shared runners</span></div></div>
    ${code(S.linuxRun, { lang: 'shellscript', cls: 'term small', mark: '4=add' })}
    <div class="note" ${a({ in: 'linux-next', anim: 'fade' })}>${tri()}<span>ArcGIS Server runs .NET extensions on Windows only — today. Our pipeline is ready when it moves.</span></div>
  </div>`,
);

export const buildStation = station(
  { id: 'build', x: 502, y: 300, w: 2112, h: 1472, s: 0.2, title: 'Build', sub: '.NET · targets · version · CI', icon: icons.build },
  net + multi + version + ci,
);

// ---------------- .soe ----------------

const split = panel(
  { id: 'split', ...cell(0, 0), title: 'One SOE/SOI per feature', fixed: 'split-8', tag: 'monolith' },
  `<div class="split">
    <div class="mono" ${a({ out: 'split-8', anim: 'fade' })}>
      <div class="mono-box"><b>Wgis.Soe</b><span>17 feature modules</span></div>
      <div class="mono-mods">${Array.from({ length: 17 }, (_, i) => `Module ${String.fromCharCode(65 + i)}`)
        .map((m) => `<span>${m}</span>`)
        .join('')}</div>
      <div class="note">3 archives · touch one feature → redeploy everything</div>
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
      <div class="note">8 archives · each references only the modules it needs</div>
    </div>
  </div>`,
);

const merge = panel(
  { id: 'merge', ...cell(1, 0), title: 'No DLL hell in a shared service', fixed: 'merge-fix', tag: 'DLL hell' },
  `<div class="merge">
    <div class="proc">
      <div class="proc-h">${icons.server} one ArcGIS service process</div>
      <div class="ext e1"><b>SOE A</b><span class="dll">Wgis.dll <i>v1</i></span></div>
      <div class="ext e2"><b>SOI B</b><span class="dll">Wgis.dll <i>v2</i></span></div>
      <div class="boom" ${a({ only: ['merge'], anim: 'zoom' })}>${icons.warn} first loaded wins · the other breaks</div>
      <div class="fixed-b" ${a({ in: 'merge-fix', anim: 'zoom' })}>${icons.check}<span>A → <b>Wgis.Soe.dll</b>, B → <b>Wgis.Soi.dll</b></span></div>
    </div>
    ${code(S.repack, { lang: 'csharp', file: 'build/SoeArchiveBuilder.cs · ILRepack 2.0.44', cls: 'small xs', attrs: { in: 'merge-fix', anim: 'right' } })}
  </div>`,
);

const soefile = `<div class="soefile">
  <div class="sf-icon">${icons.box}<b>Wgis.Soe.soe</b></div>
  <div class="sf-tree">
    <div><span>Config.xml</span><em class="sf-desc">&lt;Description&gt;<span ${a({ in: 'version', anim: 'fade' })}>11.5.1.0+4424ac4…</span>&lt;/Description&gt;</em></div>
    <div><span>Install/Wgis.Soe.dll</span><em ${a({ in: 'merge-fix', anim: 'fade' })}>Shared.* · Wgis.* merged</em></div>
    <div><span>Install/Castle.Core.dll · Newtonsoft.Json.dll · NLog.dll …</span><em>third-party, beside it</em></div>
  </div>
</div>`;

export const soeStation = station(
  { id: 'soe', x: 964, y: 300, w: 2112, h: 1464, s: 0.2, title: '.soe', sub: 'per feature · merged · stamped', icon: icons.box },
  split + merge + soefile,
);
