import { cell } from './code';
import { icons } from './icons';
import { a, code, img, panel, station, tri, zone } from './ui';
import * as S from './snippets';

const servers = panel(
  { id: 'servers', ...cell(0, 0), title: 'One jump: 10.9.1 → 11.5', fixed: 'why-jump', tag: '10.9.1' },
  `<div class="srv">
    <div class="sv old"><b>10.9.1</b><span>ArcMap runtime<br>.NET Framework · ArcObjects COM</span></div>
    <svg class="sv-arc" viewBox="0 0 1000 300" preserveAspectRatio="none" ${a({ in: 'why-jump', anim: 'fade' })}><path d="M30 290 C 280 -60, 720 -60, 970 290"/></svg>
    <div class="sv-mid" ${a({ in: 'why-jump', anim: 'fade' })}>
      <div class="mile"><b>11.0</b><span>ArcMap runtime retired</span></div>
      <div class="mile"><b>11.3</b><span>.NET 8 SOEs/SOIs</span></div>
    </div>
    <div class="sv new" ${a({ in: 'why-jump', anim: 'zoom' })}><b>11.5</b><span>ArcGIS Pro runtime<br>.NET 8 · Enterprise SDK</span></div>
    <div class="sv back" ${a({ in: 'multi', anim: 'drop' })}><b>10.9.1</b><span>Pro services · net472<br>backported, side by side</span></div>
    <div class="sv-db" ${a({ in: 'multi-db', anim: 'fade' })}>${icons.db}<span>geodatabase 10.9.1 — shared</span></div>
  </div>`,
);

const deploy = panel(
  { id: 'deploy', ...cell(1, 0), title: 'Deployment', fixed: 'deploy', tag: 'by hand' },
  `<div class="two deploy">
    <div class="col">
      <div class="lbl bad">${icons.cross} before</div>
      ${code(S.addFiles, { file: 'Build.Wgis.Soe.Debug.xml · 81 × <addFile>', cls: 'tiny' })}
      <div class="note">TeamCity + legacy BuildSOE tool · then upload in Server Manager</div>
    </div>
    <div class="col">
      <div class="lbl good">${icons.check} now</div>
      <code class="cmd">nuke PublishWgisSoe --environment TEST</code>
      <ol class="steps-l">
        <li ${a({ in: 'deploy', anim: 'left' })}>admin/generateToken</li>
        <li ${a({ in: 'deploy', anim: 'left' })}>admin/info <span>→ 10.9.1 or 11.5? pick net472 / net8.0</span></li>
        <li ${a({ in: 'deploy', anim: 'left' })}>uploads/upload</li>
        <li ${a({ in: 'deploy', anim: 'left' })}>extensions/register | update</li>
        <li ${a({ in: 'deploy', anim: 'left' })}>restart services the update stopped</li>
      </ol>
    </div>
  </div>`,
);

const manager = panel(
  { id: 'manager', ...cell(0, 1), title: 'The version ArcGIS shows you', fixed: 'version-desc', tag: 'unknown' },
  `<div class="mgr">
    <div class="mgr-win">
      <div class="mgr-bar"><span>ArcGIS Server Manager</span><span>Site › Extensions</span></div>
      <table class="mgr-t">
        <tr><th>Name</th><th>Description</th></tr>
        <tr class="hl"><td>Wgis.Soe</td><td class="vd">11.5.1.0+4424ac4.topic-soe-fix.debug</td></tr>
        <tr><td>Wgis.Soi</td><td class="vd">11.5.1.0+4424ac4.topic-soe-fix.debug</td></tr>
        <tr><td>Wgis.ServiceAuth.Soi</td><td class="vd">11.5.1.0+4424ac4.topic-soe-fix.debug</td></tr>
      </table>
      <div class="mgr-cap">mock-up</div>
    </div>
    ${code(S.soeConfigXml, { file: 'Wgis.Soe.Config.xml', cls: 'small', mark: '4=hl' })}
  </div>`,
);

const openapi = panel(
  { id: 'openapi', ...cell(1, 1), title: 'OpenAPI + Scalar for SOEs', fixed: 'openapi', tag: 'undocumented' },
  `<div class="oa">
    <div class="oa-flow">
      <span class="chip">/exts/Wgis.Soe?f=schema</span><span class="arr">→</span><span class="chip">OpenAPI</span><span class="arr">→</span><span class="chip">Scalar</span>
    </div>
    <div class="oa-row">
      ${code(S.openApiProbe, { lang: 'csharp', file: 'ArcGisOpenApiDocumentationProvider.cs', cls: 'small' })}
      <div class="scalar">
        <div class="sc-side"><b>Wgis.Soe</b><span class="get">GET</span> /features<span class="post">POST</span> /replicate<span class="get">GET</span> /diagnostics<span class="post">POST</span> /export</div>
        <div class="sc-main"><b>POST /exts/Wgis.Soe/replicate</b><span>parameters from the SOE schema · f=json|html</span><div class="sc-try">Test Request</div></div>
      </div>
    </div>
    <div class="note">${tri()}<span>156 services documented · every PATCH gets a POST twin for esriRequest</span></div>
  </div>`,
);

/** Admin portal demo: screenshots go to public/private/demo/ (internal UI → git-ignored). */
export const shots = [
  { id: 'shot-1', file: '01-extensions.png', label: 'ArcGIS · Extensions — the version each environment runs' },
  { id: 'shot-2', file: '02-services.png', label: 'ArcGIS · Services — start / stop with your own token' },
  { id: 'shot-3', file: '03-iis.png', label: 'IIS — blue/green slots, switch traffic' },
  { id: 'shot-4', file: '04-wall.png', label: 'Office wall — the whole site on a globe' },
];

const portal = zone(
  { id: 'portal', x: 64, y: 260 + 2 * 604, w: 1920, h: 1080, s: 1.033, cls: 'panel portal', lod: 40, fixed: 'portal' },
  `<div class="p-tag legacy">no UI</div><div class="p-tag fixed">✓</div>
  <h3 class="ph">GIS Backstage — our admin portal</h3>
  <div class="pbody">
    <div class="pt-facts">
      <div><b>55</b> commits</div><div><b>7.5</b> weeks</div><div><b>18.9k</b> lines C#</div><div>net10.0 minimal APIs · no SPA</div>
    </div>
    ${shots
      .map((s, i) =>
        zone(
          { id: s.id, x: 130 + (i % 2) * 740, y: 210 + Math.floor(i / 2) * 420, w: 1920, h: 1080, s: 0.36, cls: 'shot', lod: 20 },
          `<div class="shot-ph"><b>${s.label}</b><span>public/private/demo/${s.file}</span></div>${img(`./private/demo/${s.file}`, s.label, 'shot-img')}`,
        ),
      )
      .join('')}
  </div>`,
);

export const siteStation = station(
  { id: 'site', x: 1426, y: 300, w: 2112, h: 2600, s: 0.2, title: 'ArcGIS Server site', sub: '10.9.1 + 11.5 · REST · portal', icon: icons.server },
  servers + deploy + manager + openapi + portal,
);
