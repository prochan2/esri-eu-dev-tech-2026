import { icons } from './icons';
import { catCount, catRange, cats, legacyCsproj, legacyLines, legacyMarks, modernCsproj, modernLineCount } from './legacy';
import * as S from './snippets';
import { a, code, docs, esc, panel, station, tri, who, zone } from './ui';

/** Grid cell inside a station: 2 columns of 960×540 (panel scale 0.5). */
export const cell = (col: number, row: number) => ({ x: 64 + col * 1024, y: 260 + row * 604, s: 0.5 });

const tree = (rows: [string, string, string?][], cls = '') =>
  `<div class="tree ${cls}">${rows
    .map(
      ([indent, name, note]) =>
        `<div class="tr ${note?.startsWith('!') ? 'tr-bad' : ''}"><span class="ti">${indent}</span><span class="tn">${esc(name)}</span>${note ? `<span class="tnote">${esc(note.replace(/^!/, ''))}</span>` : ''}</div>`,
    )
    .join('')}</div>`;

// ------------------------------------------------------------------ project files

/** The legacy file as a "wall": a zone scaled down to fit the left column. */
const LH = 28 * 1.45; // line height of .shiki.code
const TOP = 8 + 20; // codebox border + pre padding
const WALL_S = 0.14;
const wallZones = cats
  .map(({ id, name, what }) => {
    const [from, to] = catRange(id);
    const y = TOP + (from - 1) * LH - 190; // room for the label above the lines
    const h = (to - from + 1) * LH + 220;
    return zone(
      { id: `wall-${id}`, x: -40, y, w: 2500, h, cls: `wall-cat c-${id}` },
      `<div class="wc-label" ${a({ only: [`proj-${id}`], anim: 'fade' })}><i class="sw c-${id}"></i><b>${name}</b><span>${catCount(id)} lines · ${what}</span></div>`,
    );
  })
  .join('');

const wall = zone(
  { id: 'wall', x: 100, y: 176, w: 3000, h: TOP * 2 + legacyLines.length * LH, s: WALL_S, cls: 'wall' },
  code(legacyCsproj, { mark: legacyMarks, cls: 'wall-code' }) + wallZones,
);

/** Sub-panels: one per legacy category — the old way and the SDK-style answer. */
const fixPanels = cats
  .map(({ id, name }, i) => {
    const f = S.fixes[id];
    return panel(
      {
        id: `fix-${id}`,
        x: 560 + (i % 3) * 362,
        y: 500 + Math.floor(i / 3) * 214,
        s: 0.18,
        cls: 'sub fix',
        title: `<i class="sw c-${id}"></i>${name}`,
        tag: 'legacy',
        fixed: `fix-${id}`,
        doc: f.doc,
        lod: 30,
        attrs: { in: 'proj-fixes', anim: 'fade' },
      },
      `<div class="fx">
        <div class="fx-row">${who.old}${code(f.legacy, { cls: 'fx-code' })}</div>
        <div class="fx-row now">${who.now}<div class="fx-now"><b class="fx-feat">${f.feature}</b>${code(f.now, { cls: 'fx-code' })}</div></div>
      </div>`,
    );
  })
  .join('');

const proj = panel(
  {
    id: 'proj',
    ...cell(0, 0),
    title: 'Project files',
    fixed: 'proj-11',
    tag: `${legacyLines.length} lines`,
    doc: docs.sdkProjects,
    logos: ['dotnet'],
  },
  `${wall}
  <div class="proj-right">
    <div class="proj-count">
      <span class="n nold" ${a({ out: 'proj-11', anim: 'zoom' })}>${legacyLines.length}</span>
      <span class="n nnew" data-from="${legacyLines.length}" ${a({ in: 'proj-11', anim: 'zoom' })}>${modernLineCount}</span>
      <span class="unit">lines</span>
    </div>
    <div class="proj-file">Wgis.Soe.ModuleB.csproj · one SOE feature module</div>
    ${code(modernCsproj, { cls: 'proj-modern', mark: '4=hl;8=hl', attrs: { in: 'proj-11', anim: 'right' } })}
  </div>
  ${fixPanels}`,
);

const props = panel(
  { id: 'props', ...cell(0, 1), title: 'Central project properties', fixed: 'props', tag: '× 189', doc: docs.buildProps, logos: ['dotnet'] },
  `<div class="two">
    ${tree([
      ['', 'src/'],
      ['├─ ', 'Directory.Build.props', 'company · net8.0 · artifacts'],
      ['├─ ', 'Directory.Build.targets', 'version · appsettings'],
      ['├─ ', 'cetin/arcgisserver/src/'],
      ['│  ├─ ', 'Directory.Build.props', 'net472;net8.0'],
      ['│  └─ ', '33 × SOE/SOI .csproj', '359 lines in total'],
      ['└─ ', 'cetin/server/src/'],
      ['   └─ ', 'Directory.Build.props', 'net10.0 · ASP.NET Core'],
    ])}
    <div class="col">
      ${code(S.buildProps, { file: 'src/Directory.Build.props', cls: 'small' })}
      <div class="kpi"><b>13</b> props + <b>2</b> targets <span>children import parents with GetPathOfFileAbove</span></div>
    </div>
  </div>`,
);

const artifacts = panel(
  { id: 'artifacts', x: 1000, y: 230, s: 0.44, cls: 'sub', title: 'artifacts/ — all build output', fixed: 'artifacts', tag: 'bin/ everywhere', doc: docs.artifacts, lod: 30 },
  `<div class="two">
    <div class="col">
      <div class="lbl bad">${who.old} before</div>
      ${tree(
        [
          ['', 'Wgis.Soe/bin/ obj/'],
          ['', 'Wgis.Soe.Common/bin/ obj/'],
          ['', '… × 189 projects'],
          ['', '..\\..\\..\\bin\\debug\\', '!shared drop folder'],
          ['', '258 HintPaths into bin\\', '!read other projects’ output'],
        ],
        'wrap',
      )}
    </div>
    <div class="col">
      <div class="lbl good">${who.now} one &lt;ArtifactsPath&gt;</div>
      ${tree(
        [
          ['', 'artifacts/'],
          ['├─ ', 'bin/Wgis.Soe/debug_net472/'],
          ['├─ ', 'bin/Wgis.Soe/debug_net8.0/'],
          ['├─ ', 'obj/ · publish/ · tests/'],
          ['├─ ', 'soe/Wgis.Soe/debug_10.9.1/'],
          ['├─ ', 'soe/Wgis.Soe/debug_11.5/'],
          ['└─ ', 'version/Version.props'],
        ],
        'wrap',
      )}
    </div>
  </div>`,
);

const repo = panel(
  { id: 'repo', ...cell(0, 2), title: 'Repository layout', fixed: 'artifacts', tag: '53 .sln', doc: docs.artifacts },
  `${tree(
    [
      ['', 'gis-be/'],
      ['├─ ', 'src/', 'code + Directory.*.props'],
      ['├─ ', 'build/', 'NUKE build'],
      ['├─ ', 'ci/', 'GitLab pipelines'],
      ['├─ ', 'config/', 'per environment'],
      ['├─ ', 'docs/', 'MkDocs site'],
      ['├─ ', 'artifacts/', 'build output →'],
      ['├─ ', '*.slnx × 18'],
      ['└─ ', 'build.ps1 · AGENTS.md'],
    ],
    'repo-tree wrap',
  )}
  ${artifacts}`,
);

const stats = panel(
  { id: 'stats', ...cell(0, 3), title: 'Then → now', fixed: 'stats', tag: 'Mar 2025' },
  `<table class="stats">
    <tr><td>Main SOE .csproj</td><td class="o">135 lines</td><td class="nw">7</td></tr>
    <tr><td>SOE/SOI projects</td><td class="o">4,275 lines</td><td class="nw">359</td></tr>
    <tr><td>Solutions</td><td class="o">53 .sln</td><td class="nw">18 .slnx</td></tr>
    <tr><td>HintPaths</td><td class="o">809</td><td class="nw">0</td></tr>
    <tr><td>packages.config</td><td class="o">117</td><td class="nw">0</td></tr>
    <tr><td>ESRI references</td><td class="o">302</td><td class="nw">2</td></tr>
  </table>
  <div class="foot">every project that ships · gis-be, Mar 2025 → Oct 2026</div>`,
);

// ------------------------------------------------------------------ packages

const pkg = panel(
  { id: 'pkg', ...cell(1, 0), title: 'packages.config → PackageReference', fixed: 'pkg', tag: '117 files', doc: docs.migrate, logos: ['nuget'] },
  `<div class="two pkg">
    <div class="col">
      ${code(S.packagesConfig, { file: 'packages.config · 28 entries, flat', cls: 'tiny', mark: '3-4,9,14=hl;8,10-13=tr' })}
    </div>
    <div class="col pkg-right">
      <div class="pkg-a" ${a({ out: 'pkg-trans', anim: 'fade' })}>
        <div class="kpi big"><b>117</b> packages.config <span>284 entries · 127 id+version combos</span></div>
        ${code(S.packageReference, { file: '.csproj · what you actually asked for', cls: 'pkgref' })}
      </div>
      <div class="pkg-b" ${a({ in: 'pkg-trans', anim: 'fade' })}>
        <div class="lbl">transitive = a dependency of a dependency</div>
        <div class="dep">
          <div class="dep-root">Microsoft.Extensions.Caching.Memory <i>you</i></div>
          ${['Caching.Abstractions', 'DependencyInjection.Abstractions', 'Logging.Abstractions', 'Options', 'Primitives']
            .map((n, i, all) => `<div class="dep-kid">${i === all.length - 1 ? '└─' : '├─'} Microsoft.Extensions.${n} <i>restore</i></div>`)
            .join('')}
        </div>
        <div class="note">${who.old}<span>packages.config: all of them, flat — which did <em>you</em> choose?</span></div>
        <div class="note">${who.now}<span>PackageReference: 1 line — the graph lives in obj/project.assets.json</span></div>
      </div>
    </div>
  </div>`,
);

const pin = panel(
  { id: 'cpm-pin', x: 1000, y: 230, s: 0.44, cls: 'sub', title: 'Transitive pinning', fixed: 'cpm-pin', tag: 'whatever comes', doc: docs.pinning, lod: 30 },
  `<div class="pin">
    <div class="pin-g">
      <div class="pg a">Wgis.Soe</div><div class="pg-arrow">→</div><div class="pg b">some package</div><div class="pg-arrow">→</div>
      <div class="pg c"><s>Newtonsoft.Json 13.0.4</s><b>13.0.3</b></div>
    </div>
    ${code(S.pinning, { cls: 'small', mark: '1=hl;4=add' })}
    <div class="note">${tri()}<span>13.0.4 compiles — then <em>MissingMethodException</em> inside ArcGIS Server</span></div>
  </div>`,
);

const cpm = panel(
  { id: 'cpm', ...cell(1, 1), title: 'Central package management', fixed: 'cpm-one', tag: '5 versions', doc: docs.cpm, logos: ['nuget'] },
  `<div class="cpm">
    <div class="nj">
      <div class="lbl bad">${who.old} Newtonsoft.Json, 6 ways</div>
      ${S.newtonsoftHintPaths.map(([n, p]) => `<div class="nj-row"><b>${n}×</b><code>${esc(p)}</code></div>`).join('')}
    </div>
    <div class="cpm-now" ${a({ in: 'cpm-one', anim: 'fade' })}>
      <div class="lbl good">${who.now} one place, one version</div>
      ${code(S.packagesProps.split('\n').filter((l) => !/Transitive/.test(l)).join('\n'), { file: 'src/Directory.Packages.props · 58 packages', cls: 'small xs', mark: '1=hl;5=add' })}
      ${code(S.cpmCsproj, { cls: 'small xs' })}
    </div>
  </div>
  ${pin}`,
);

const storePath = panel(
  { id: 'store-path', x: 130, y: 640, s: 0.3, cls: 'sub', title: 'The relative path trap', fixed: 'store-path', tag: 'works on my sln', lod: 30, doc: docs.migrate },
  `<div class="sp">
    <div class="sp-col ok">
      ${tree([
        ['', 'A.sln'],
        ['├─ ', 'packages\\Castle.Core.4.4.1\\'],
        ['└─ ', 'Proj\\Proj.csproj'],
      ])}
      <div class="sp-v">${icons.check} ..\\packages\\ found</div>
    </div>
    <div class="sp-col bad">
      ${tree([
        ['', 'deep\\B.sln'],
        ['├─ ', 'deep\\packages\\Castle.Core.4.4.1\\'],
        ['└─ ', '..\\Proj\\Proj.csproj'],
      ])}
      <div class="sp-v">${icons.cross} ..\\packages\\ — wrong folder</div>
    </div>
    <code class="sp-hint">&lt;HintPath&gt;..\\packages\\Castle.Core.4.4.1\\lib\\net45\\Castle.Core.dll&lt;/HintPath&gt;</code>
    <div class="sp-n"><b>157</b> HintPaths into ..\\packages\\ · <b>53</b> solutions</div>
  </div>`,
);

const storeGen = panel(
  { id: 'store-gen', x: 1060, y: 640, s: 0.3, cls: 'sub', title: 'Who edits your .csproj?', fixed: 'store-gen', tag: 'NuGet does', lod: 30, doc: docs.packageReference },
  `<div class="sg">
    <div class="lbl bad">${who.old} packages.config: Install-Package edits it</div>
    ${code(S.nugetEdits, { cls: 'sg-code' })}
    <div class="lbl good">${who.now} PackageReference: restore generates</div>
    ${tree([
      ['', 'obj/'],
      ['├─ ', 'Proj.csproj.nuget.g.props'],
      ['├─ ', 'Proj.csproj.nuget.g.targets'],
      ['└─ ', 'project.assets.json', 'your .csproj stays small'],
    ])}
  </div>`,
);

const store = panel(
  { id: 'store', ...cell(1, 2), title: 'Downloaded package store', fixed: 'store', tag: 'per solution', doc: docs.globalPackages, logos: ['nuget'] },
  `<div class="two store">
    <div class="col">
      <div class="lbl bad">${who.old} per solution</div>
      <div class="store-sln">${Array.from({ length: 12 }, (_, i) => `<span>${i % 3 === 0 ? 'X.sln' : 'packages\\'}</span>`).join('')}</div>
      <div class="note">one copy next to every .sln</div>
    </div>
    <div class="col">
      <div class="lbl good">${who.now} per user</div>
      <code class="store-user">%USERPROFILE%\\.nuget\\packages\\</code>
      <div class="note">CI: NUGET_PACKAGES=/nuget-cache</div>
    </div>
  </div>
  ${storePath}${storeGen}`,
);

const nuget = panel(
  { id: 'nuget', ...cell(1, 3), title: 'Esri SDK as our own NuGet package', fixed: 'nuget', tag: '302 refs', doc: docs.createPackage, logos: ['nuget', 'arcgis'] },
  `<div class="two">
    ${code(S.esriRefCsproj, { file: 'Esri.ArcGIS.Enterprise.Sdk.Ref.csproj', cls: 'small xs' })}
    <div class="col">
      <div class="kpi"><b>302</b> ESRI &lt;Reference&gt; <span>→ <b>2</b> PackageReferences, the rest flows transitively</span></div>
      <div class="ver-pair"><span class="chip">10.9.1 <small>net472</small></span><span class="chip">13.5.1 <small>net8.0</small></span></div>
      <div class="note">${icons.warn}<span>licensed Esri files: internal feed only — never nuget.org</span></div>
    </div>
  </div>`,
);

export const codeStation = station(
  { id: 'code', x: 40, y: 300, w: 2112, h: 2680, s: 0.2, title: 'Code', sub: 'project files · packages', icon: icons.code, logos: ['dotnet', 'nuget'] },
  proj + props + repo + stats + pkg + cpm + store + nuget,
);

