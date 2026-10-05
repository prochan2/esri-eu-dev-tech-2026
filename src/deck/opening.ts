import type { FrameDef } from '../engine/types';
import { config } from './config';
import { a, img, title, tri } from './ui';

const P = './private/esri/';

export const titleFrame: FrameDef = {
  id: 'title',
  x: 0,
  y: 0,
  className: 'esri-title',
  html: `
    <div class="et-bg"></div>
    ${img(`${P}map-teal.png`, '', 'et-map')}
    ${img(`${P}keyart-title.png`, '', 'et-keyart')}
    ${img(`${P}esri-logo.png`, 'Esri — The Science of Where', 'et-esri')}
    <div class="et-text">
      <h1 class="et-h1">Migrating ArcGIS Server Extensions to the 21st&nbsp;Century</h1>
      <div class="et-speaker">${config.speaker}</div>
    </div>
    <div class="et-event">${config.event.replace('Esri ', 'ESRI ').toUpperCase()}</div>
    <div class="et-copy">Copyright © 2026 Esri. All rights reserved.</div>
    <div class="cetin-plate">${img('./brand/cetin-logo-inverse.svg', 'CETIN', 'cetin-logo')}</div>
  `,
  steps: [
    {
      title: 'Title',
      secs: 15,
      notes: ['Hi, I am Antonín from CETIN.', 'Ten minutes on dragging SOEs/SOIs from 2005 tooling into 2026.'],
    },
  ],
};

export const whyFrame: FrameDef = {
  id: 'why',
  x: 2300,
  y: 300,
  html: `
    ${title('One jump: 10.9.1 → 11.5')}
    <div class="why">
      <div class="why-track">
        <div class="why-node old"><b>10.9.1</b><span>ArcMap runtime<br>.NET Framework 4.8</span></div>
        <div class="why-mid" ${a({ in: 2, anim: 'fade' })}>
          <div class="why-mile m1"><b>11.0</b><span>ArcMap runtime retired</span></div>
          <div class="why-mile m2"><b>11.3</b><span>.NET 8 SOEs/SOIs</span></div>
        </div>
        <svg class="why-arc" viewBox="0 0 1000 260" preserveAspectRatio="none" ${a({ in: 1, anim: 'fade' })}>
          <path d="M40 230 C 300 -40, 700 -40, 960 230" />
        </svg>
        <div class="why-node new" ${a({ in: 1, anim: 'zoom' })}><b>11.5</b><span>ArcGIS Pro runtime<br>.NET 8</span></div>
      </div>
      <div class="why-pay" ${a({ in: 3 })}>
        ${tri()}<span>Rewrite was unavoidable — so we fixed <em>everything around</em> the extensions too</span>
      </div>
    </div>
  `,
  steps: [
    { title: 'Where we started', secs: 10, notes: ['We ran ArcGIS Enterprise 10.9.1.', 'Classic ArcObjects SOEs/SOIs on .NET Framework 4.8.'] },
    { title: 'The jump', secs: 10, notes: ['We went straight to 11.5 — no stops.'] },
    { title: 'What we skipped over', secs: 12, notes: ['11.0 retired the ArcMap runtime.', '11.3 brought .NET 8 SOEs/SOIs on the ArcGIS Pro runtime.', 'Legacy extensions simply do not load any more.'] },
    { title: 'Fix everything around', secs: 10, notes: ['If we have to touch every extension anyway…', '…let us fix the build, packages, versioning and deployment too.'] },
  ],
};
