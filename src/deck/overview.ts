import { config } from './config';
import { icons } from './icons';
import { monthlyCommits } from './snippets';
import { a, docs, img, logos, panel, qrSvg, tri, who, zone } from './ui';

const P = './private/esri/';

/** Title block on the overview; morphs into "Thank you" and "Questions?" at the end. */
const titleBlock = () => `
  <div class="ov-title">
    ${img(`${P}esri-logo.png`, 'Esri', 'ov-esri')}
    <div class="ov-t" ${a({ out: 'thanks', anim: 'fade' })}>
      <h1>Migrating ArcGIS Server Extensions to the 21st&nbsp;Century</h1>
      <div class="ov-by"><span>${config.speaker} · ${config.role}</span><span class="ov-ev">${config.event}</span></div>
    </div>
    <div class="ov-thanks" ${a({ in: 'thanks', anim: 'fade' })}>
      <div class="qr" role="img" aria-label="QR code: ${config.qrUrl}">${qrSvg(config.qrUrl)}</div>
      <div>
        <h1><span ${a({ only: ['thanks'], anim: 'fade' })}>Thank you</span><span class="ov-q" ${a({ in: 'questions', anim: 'fade' })}>Questions?</span></h1>
        <div class="ov-by"><span>${config.speaker}</span><span class="ov-ev">${config.qrLabel}</span></div>
      </div>
    </div>
    <div class="ov-copy">Esri artwork © 2026 Esri</div>
  </div>
  <div class="ov-fix" ${a({ only: ['fix-all'], anim: 'drop' })}>${who.old}${tri()}<span>The rewrite was unavoidable — so fix <em>everything around</em> it</span>${who.now}</div>`;

/** Arrows between the stations (overview px). */
const flow = `
  <svg class="ov-flow" viewBox="0 0 1920 1080" aria-hidden="true">
    ${[464, 926, 1388]
      .map((x) => `<g transform="translate(${x + 4} 326)"><circle r="15"/><path d="M-5 -6 L4 0 L-5 6"/></g>`)
      .join('')}
  </svg>`;

/** Which tool helped when (speaker's account). */
const eras: { from: string; name: string; logo: string; cls: string }[] = [
  { from: '2025-03', name: 'by hand', logo: who.old, cls: 'e0' },
  { from: '2025-04', name: 'ChatGPT', logo: '', cls: 'e1' },
  { from: '2025-09', name: 'GitHub Copilot', logo: logos.copilot, cls: 'e2' },
  { from: '2026-03', name: 'Claude Code', logo: logos.claude, cls: 'e3' },
];
const eraOf = (m: string) => [...eras].reverse().find((e) => m >= e.from)!;

const bars = (() => {
  const max = Math.max(...monthlyCommits.map(([, n]) => n));
  return monthlyCommits
    .map(([m, n]) => `<div class="bar ${eraOf(m).cls}" style="--h:${(n / max) * 100}%"><i>${n}</i><span>${m.slice(2).replace('-', '/')}</span></div>`)
    .join('');
})();

const eraBand = (() => {
  const months = monthlyCommits.map(([m]) => m);
  return `<div class="eras">${eras
    .map((e, i) => {
      const start = months.indexOf(e.from);
      const end = i + 1 < eras.length ? months.indexOf(eras[i + 1].from) : months.length;
      return `<div class="era ${e.cls}" style="flex:${end - start}">${e.logo}<b>${e.name}</b></div>`;
    })
    .join('')}</div>`;
})();

/** Git history ribbon along the bottom: the data source of this talk. */
const milestones: [string, string, string][] = [
  ['2025-03', 'taken over from external supplier', '189 csproj · 53 .sln'],
  ['2025-06', 'GitVersion · ILRepack', '117 packages.config'],
  ['2025-09', 'first SDK-style + CPM', '.NET 8'],
  ['2026-01', 'net472 backport', 'OpenAPI docs'],
  ['2026-03', 'Claude Code', 'AGENTS.md'],
  ['2026-04', 'automated deploy', 'git describe versions'],
  ['2026-08', 'Linux CI · portal', '184 commits'],
];
const history = (() => {
  const months = monthlyCommits.map(([m]) => m);
  const max = Math.max(...monthlyCommits.map(([, n]) => n));
  const x = (m: string) => (months.indexOf(m) / (months.length - 1)) * 100;
  return `<div class="history">
    <div class="h-who start">${who.old}</div>
    <div class="h-who end">${who.now}</div>
    <div class="h-bars">${monthlyCommits.map(([m, n]) => `<i class="${eraOf(m).cls}" style="left:${x(m)}%;height:${(n / max) * 100}%"></i>`).join('')}</div>
    <div class="h-axis"></div>
    ${milestones.map(([m, t, d], i) => `<div class="h-m ${i % 2 ? 'low' : ''}" style="left:${x(m)}%"><b>${t}</b><span>${m} · ${d}</span></div>`).join('')}
    <div class="h-cap">gis-be · 730 commits · Mar 2025 → Oct 2026</div>
  </div>`;
})();

const ai = panel(
  { id: 'ai', x: 983, y: 622, s: 0.2, title: 'How vibe coding helped', fixed: 'ai', tag: 'by hand', doc: docs.claudeCode, logos: ['claude'] },
  `<div class="ai">
    <div class="chart-wrap">
      <div class="chart">${bars}</div>
      ${eraBand}
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
    ${flow}
    ${stations}
    ${ai}
    ${feedback}
    ${history}
    ${titleBlock()}
    <div class="cetin-plate">${img('./brand/cetin-logo-inverse.svg', 'CETIN', 'cetin-logo')}</div>
  </div>`;
