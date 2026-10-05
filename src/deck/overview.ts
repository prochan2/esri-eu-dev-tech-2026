import QRCode from 'qrcode';
import { config } from './config';
import { icons } from './icons';
import { a, img, panel, tri, zone } from './ui';
import { monthlyCommits } from './snippets';

const P = './private/esri/';

let qr = '';
QRCode.toString(config.qrUrl, { type: 'svg', margin: 0, errorCorrectionLevel: 'M', color: { dark: '#ffffff', light: '#0000' } }, (err, svg) => {
  if (err) return;
  qr = svg;
  document.querySelectorAll('.qr').forEach((n) => (n.innerHTML = svg));
});

/** Title block on the overview; morphs into "Thank you" and "Questions?" at the end. */
const titleBlock = () => `
  <div class="ov-title">
    ${img(`${P}esri-logo.png`, 'Esri', 'ov-esri')}
    <div class="ov-t" ${a({ out: 'thanks', anim: 'fade' })}>
      <h1>Migrating ArcGIS Server Extensions to the 21st&nbsp;Century</h1>
      <div class="ov-by"><span>${config.speaker}</span><span class="ov-ev">${config.event}</span></div>
      <div class="ov-fix" ${a({ only: ['fix-all'], anim: 'fade' })}>${tri()}<span>The rewrite was unavoidable — so fix <em>everything around</em> it</span></div>
    </div>
    <div class="ov-thanks" ${a({ in: 'thanks', anim: 'fade' })}>
      <div class="qr" role="img" aria-label="QR code: ${config.qrUrl}">${qr}</div>
      <div>
        <h1><span ${a({ only: ['thanks'], anim: 'fade' })}>Thank you</span><span class="ov-q" ${a({ in: 'questions', anim: 'fade' })}>Questions?</span></h1>
        <div class="ov-by"><span>${config.speaker}</span><span class="ov-ev">${config.qrLabel}</span></div>
      </div>
    </div>
    <div class="ov-copy">Esri artwork © 2026 Esri</div>
  </div>`;

/** Arrows between the stations (overview px). */
const flow = `
  <svg class="ov-flow" viewBox="0 0 1920 1080" aria-hidden="true">
    ${[464, 926, 1388]
      .map((x) => `<g transform="translate(${x + 4} 326)"><circle r="15"/><path d="M-5 -6 L4 0 L-5 6"/></g>`)
      .join('')}
  </svg>`;

const bars = (() => {
  const max = Math.max(...monthlyCommits.map(([, n]) => n));
  return monthlyCommits
    .map(([m, n]) => {
      const after = m >= '2026-03';
      return `<div class="bar ${after ? 'after' : ''} ${m === '2026-02' ? 'adopt' : ''}" style="--h:${(n / max) * 100}%"><i>${n}</i><span>${m.slice(2).replace('-', '/')}</span></div>`;
    })
    .join('');
})();

/** Git history ribbon along the bottom: the data source of this talk. */
const milestones: [string, string, string][] = [
  ['2025-03', 'taken over from external supplier', '189 csproj · 53 .sln'],
  ['2025-06', 'GitVersion · ILRepack', '117 packages.config'],
  ['2025-09', 'first SDK-style + CPM', '.NET 8 · 135 → 7'],
  ['2026-01', 'net472 backport', 'OpenAPI docs'],
  ['2026-02', 'Claude Code', 'AGENTS.md'],
  ['2026-04', 'automated deploy', 'git describe versions'],
  ['2026-08', 'Linux CI · portal', '184 commits'],
];
const history = (() => {
  const months = monthlyCommits.map(([m]) => m);
  const max = Math.max(...monthlyCommits.map(([, n]) => n));
  const x = (m: string) => (months.indexOf(m) / (months.length - 1)) * 100;
  return `<div class="history">
    <div class="h-bars">${monthlyCommits.map(([m, n]) => `<i class="${m >= '2026-03' ? 'after' : ''}" style="left:${x(m)}%;height:${(n / max) * 100}%"></i>`).join('')}</div>
    <div class="h-axis"></div>
    ${milestones.map(([m, t, d], i) => `<div class="h-m ${i % 2 ? 'low' : ''}" style="left:${x(m)}%"><b>${t}</b><span>${m} · ${d}</span></div>`).join('')}
    <div class="h-cap">gis-be · 730 commits · Mar 2025 → Oct 2026</div>
  </div>`;
})();

const ai = panel(
  { id: 'ai', x: 983, y: 622, s: 0.2, title: 'How vibe coding helped', fixed: 'ai', tag: '' },
  `<div class="ai">
    <div class="chart">
      ${bars}
      <div class="adopt-mark"><span>Claude Code · 2026-02-25</span></div>
    </div>
    <div class="ai-kpis" ${a({ in: 'ai-wow' })}>
      <div><b>2.2×</b><span>commits / month</span></div>
      <div><b>4.4×</b><span>lines / month</span></div>
      <div><b>100×</b><span>docs written</span></div>
      <div><b>7.5 wk</b><span>whole admin portal</span></div>
    </div>
    <div class="ai-punch" ${a({ in: 'ai-wow', anim: 'zoom' })}>${icons.sparkle}<span>AGENTS.md: 561 lines the agent reads <em>every single time</em></span></div>
  </div>`,
);

const feedback = zone(
  { id: 'feedback', x: 521, y: 622, w: 1920, h: 1080, s: 0.2, cls: 'panel feedback', lod: 20, attrs: { in: 'thanks', anim: 'fade' } },
  `<h3 class="ph">Please share your feedback in the app</h3>
  <div class="pbody"><ol class="fb-list">
    <li>Select “My Event” in the event app main menu</li>
    <li>Select “My Surveys”</li>
    <li>Select the desired survey</li>
    <li>Complete the survey</li>
  </ol></div>`,
);

export const overview = (stations: string) => `
  <div class="ov">
    ${img(`${P}keyart-title.png`, '', 'ov-keyart')}
    ${titleBlock()}
    ${flow}
    ${stations}
    ${ai}
    ${feedback}
    ${history}
    <div class="cetin-plate">${img('./brand/cetin-logo-inverse.svg', 'CETIN', 'cetin-logo')}</div>
  </div>`;
