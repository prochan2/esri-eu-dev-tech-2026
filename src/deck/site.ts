import { cell } from './code';
import { icons } from './icons';
import * as S from './snippets';
import { a, code, docQr, docs, img, logoRow, panel, station, tri, who, zone } from './ui';

const servers = panel(
  { id: 'servers', ...cell(0, 0), title: 'One jump: 10.9.1 → 11.5', fixed: 'why-jump', tag: '10.9.1', doc: docs.esriWhatsNew, logos: ['arcgis'] },
  `<div class="srv">
    <div class="sv old">${who.old}<b>10.9.1</b><span>ArcMap runtime<br>.NET Framework · ArcObjects COM</span></div>
    <svg class="sv-arc" viewBox="0 0 1000 300" preserveAspectRatio="none" ${a({ in: 'why-jump', anim: 'fade' })}><path d="M30 290 C 280 -60, 720 -60, 970 290"/></svg>
    <div class="sv-mid" ${a({ in: 'why-jump', anim: 'fade' })}>
      <div class="mile"><b>11.0</b><span>ArcMap runtime retired</span></div>
      <div class="mile"><b>11.3</b><span>.NET 8 SOEs/SOIs</span></div>
    </div>
    <div class="sv new" ${a({ in: 'why-jump', anim: 'zoom' })}>${who.now}<b>11.5</b><span>ArcGIS Pro runtime<br>.NET 8 · Enterprise SDK</span></div>
    <div class="sv back" ${a({ in: 'multi', anim: 'drop' })}><b>10.9.1</b><span>Pro services · net472<br>backported, side by side</span></div>
    <div class="sv-db" ${a({ in: 'multi-db', anim: 'fade' })}>${icons.db}<span>geodatabase 10.9.1 — shared</span></div>
  </div>`,
);

const deploy = panel(
  { id: 'deploy', ...cell(1, 0), title: 'Deployment', fixed: 'deploy', tag: 'by hand', doc: docs.esriAdmin, logos: ['arcgis'] },
  `<div class="two deploy">
    <div class="col">
      <div class="lbl bad">${who.old} before</div>
      ${code(S.addFiles, { file: 'BuildSOE XML · 81 × <addFile>, kept by hand', cls: 'tiny' })}
      <div class="note">built locally · uploaded by hand in Server Manager</div>
    </div>
    <div class="col">
      <div class="lbl good">${who.now} now</div>
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
  { id: 'manager', ...cell(0, 1), title: 'The version ArcGIS shows you', fixed: 'version-desc', tag: 'unknown', doc: docs.esriDeploy, logos: ['arcgis'] },
  `<div class="mgr">
    <div class="mgr-shot">
      <div class="mgr-win">
        <div class="mgr-bar"><span>ArcGIS Server Manager</span><span>Site › Extensions</span></div>
        <table class="mgr-t">
          <tr><th>Extension</th><td>Cetin WGIS Utility SOE</td></tr>
          <tr class="hl"><th>Description</th><td class="vd">11.5.3.220+06be7b2c.topic-entra-crisp-v2.debug</td></tr>
          <tr><th>Type</th><td>REST SOE</td></tr>
        </table>
      </div>
      ${img('./private/shots/manager.png', 'ArcGIS Server Manager: extension information with the build version in the description', 'mgr-img')}
    </div>
    ${code(S.soeConfigXml, { file: 'Wgis.Soe.Config.xml', cls: 'small xs', mark: '4=hl' })}
  </div>`,
);

const shotZone = (id: string, file: string, label: string, x: number, y: number, w: number, h: number, s: number) =>
  zone(
    { id, x, y, w, h, s, cls: 'shot', lod: 20 },
    `<div class="shot-ph"><b>${label}</b><span>public/private/shots/${file}</span></div>${img(`./private/shots/${file}`, label, 'shot-img contain')}`,
  );

const openapi = panel(
  { id: 'openapi', ...cell(1, 1), title: 'OpenAPI + Scalar for every service', fixed: 'openapi', tag: 'undocumented', doc: docs.scalar, logos: ['openapi', 'scalar'] },
  `<div class="oa">
    <div class="oa-flow">
      <span class="chip">${logoRow('arcgis')} REST directory + /exts/…?f=schema</span><span class="arr">→</span><span class="chip">${logoRow('openapi')} OpenAPI</span><span class="arr">→</span><span class="chip">${logoRow('scalar')} Scalar</span>
    </div>
    <div class="note oa-note">${tri()}<span>156 services documented · custom SOE operations next to the standard ones · every PATCH gets a POST twin for esriRequest</span></div>
  </div>
  ${shotZone('oa-rest', 'rest.png', 'ArcGIS REST directory', 100, 330, 1845, 727, 0.3)}
  ${shotZone('oa-doc', 'scalar-op.png', 'Scalar: submit job', 690, 330, 2000, 1236, 0.27)}
  ${shotZone('oa-try', 'scalar-client.png', 'Scalar: API client', 1260, 330, 2000, 1741, 0.3)}`,
);

/** Admin portal demo: screenshots go to public/private/demo/ (internal UI → git-ignored). */
export const shots = [
  { id: 'shot-1', file: '01-extensions.png', label: 'ArcGIS · Extensions — every SOE, the version each environment runs' },
  { id: 'shot-2', file: '02-services.png', label: 'ArcGIS · Services — start / stop / restart with your own token' },
  { id: 'shot-3', file: '03-iis.png', label: 'IIS — blue/green slots, switch traffic' },
  { id: 'shot-4', file: '04-wall.png', label: 'Operations wall — the whole site at a glance' },
  { id: 'shot-5', file: '05-office.png', label: '…on the wall of our office' },
];

const portal = zone(
  { id: 'portal', x: 64, y: 260 + 2 * 604, w: 1920, h: 1080, s: 1.033, cls: 'panel portal', lod: 40, fixed: 'portal' },
  `<div class="p-tag legacy">${who.old}<span>no UI</span></div><div class="p-tag fixed">${who.now}<span>✓</span></div>
  <h3 class="ph">GIS Backstage — our admin portal${logoRow('dotnet')}</h3>
  <div class="pbody">
    <div class="pt-facts">
      <div><b>55</b> commits</div><div><b>7.5</b> weeks</div><div><b>18.9k</b> lines C#</div><div>net10.0 minimal APIs · no SPA</div>
    </div>
    ${shots
      .map((s, i) =>
        zone(
          { id: s.id, x: 100 + (i % 3) * 500, y: 220 + Math.floor(i / 3) * 300, w: 1920, h: 1080, s: 0.25, cls: 'shot', lod: 20 },
          `<div class="shot-ph"><b>${s.label}</b><span>public/private/demo/${s.file}</span></div>${img(`./private/demo/${s.file}`, s.label, 'shot-img contain')}<div class="shot-cap">${s.label}</div>`,
        ),
      )
      .join('')}
  </div>
  ${docQr(docs.minimalApis)}`,
);

export const siteStation = station(
  { id: 'site', x: 1426, y: 300, w: 2112, h: 2600, s: 0.2, title: 'ArcGIS Server site', sub: '10.9.1 + 11.5 · REST · portal', icon: icons.server, logos: ['arcgis'] },
  servers + deploy + manager + openapi + portal,
);
