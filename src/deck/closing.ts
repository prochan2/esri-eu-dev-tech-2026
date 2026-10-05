import QRCode from 'qrcode';
import type { FrameDef } from '../engine/types';
import { config } from './config';
import { img } from './ui';

const P = './private/esri/';

let qrSvg = '';
QRCode.toString(config.qrUrl, { type: 'svg', margin: 0, errorCorrectionLevel: 'M', color: { dark: '#ffffff', light: '#0000' } }, (err, svg) => {
  if (!err) {
    qrSvg = svg;
    document.querySelectorAll('.qr').forEach((n) => (n.innerHTML = svg));
  }
});

export const thanksFrame = (x: number, y: number): FrameDef => ({
  id: 'thanks',
  x,
  y,
  className: 'esri-title thanks',
  html: `
    <div class="et-bg"></div>
    ${img(`${P}map-teal.png`, '', 'et-map')}
    ${img(`${P}keyart-closing.png`, '', 'et-keyart closing')}
    <div class="th-wrap">
      <h2 class="th-h">Thank you</h2>
      <div class="th-name">${config.speaker}</div>
      <div class="qr-box">
        <div class="qr" role="img" aria-label="QR code: ${config.qrUrl}">${qrSvg}</div>
        <div class="qr-label">${config.qrLabel}</div>
      </div>
    </div>
    <div class="cetin-plate">${img('./brand/cetin-logo-inverse.svg', 'CETIN', 'cetin-logo')}</div>
  `,
  steps: [{ title: 'Thank you + QR', secs: 10, notes: ['Thank you!', 'QR: slides and links.'] }],
});

export const questionsFrame = (x: number, y: number): FrameDef => ({
  id: 'questions',
  x,
  y,
  className: 'questions',
  html: `<h2 class="q-h">Questions?</h2><div class="q-hint">pick any stop on the map</div>`,
  steps: [
    {
      title: 'Questions — topic map',
      secs: 5,
      overview: true,
      notes: ['Q&A: click a chip in the jump list to fly to that topic.', 'Press O to return to the overview.'],
    },
  ],
});

export const feedbackFrame = (x: number, y: number): FrameDef => ({
  id: 'feedback',
  x,
  y,
  html: `
    <div class="fb">
      <h2 class="t-title">Please share your feedback in the app</h2>
      <ol class="fb-list">
        <li>Select “My Event” in the event app main menu</li>
        <li>Select “My Surveys”</li>
        <li>Select the desired survey</li>
        <li>Complete the survey</li>
      </ol>
    </div>
  `,
  steps: [{ title: 'Feedback survey', secs: 0, notes: ['Leave up after Q&A.'] }],
});
