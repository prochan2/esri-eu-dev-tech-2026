import type { FrameDef, StepDef } from '../engine/types';
import { a, img } from './ui';

/**
 * Admin portal "demo" — recorded walkthrough from screenshots.
 * Put screenshots in public/private/demo/ (git-ignored, internal UI):
 * 01.png, 02.png, … at 1920×1080 or larger, 16:9.
 */
export interface DemoShot {
  file: string;
  label: string;
  notes: string[];
  /** Optional zoom-ins: rectangles in % of the screenshot. */
  zooms?: { x: number; y: number; w: number; h: number; label: string; notes?: string[] }[];
}

export function demoFrames(x: number, y: number, shots: DemoShot[]): FrameDef[] {
  const intro: FrameDef = {
    id: 'demo',
    x,
    y,
    className: 'esri-title demo-intro',
    html: `
      <div class="et-bg"></div>
      ${img('./private/esri/map-teal.png', '', 'et-map')}
      ${img('./private/esri/keyart-demo.png', '', 'demo-keyart')}
      <div class="demo-title"><div class="demo-k">Demo</div><h2>Admin portal</h2></div>
    `,
    steps: [{ title: 'Demo: admin portal', secs: 8, notes: ['We run the whole site from one custom portal.', 'Recorded walkthrough — no VPN roulette on stage.'] }],
  };
  const frames = shots.map((s, i): FrameDef => {
    const steps: StepDef[] = [{ title: s.label, secs: 14, notes: s.notes }];
    (s.zooms ?? []).forEach((z, j) => steps.push({ title: `${s.label} · ${z.label}`, secs: 10, notes: z.notes ?? [], focus: `.dz-${j}`, pad: 0.02 }));
    return {
      id: `demo-${i + 1}`,
      x: x + (i % 3) * 2050 - 2050,
      y: y + 1250 + Math.floor(i / 3) * 1250,
      className: 'demo-shot',
      html: `
        <div class="shot">
          ${img(`./private/demo/${s.file}`, s.label, 'shot-img')}
          <div class="shot-ph"><b>${s.label}</b><span>public/private/demo/${s.file}</span></div>
          ${(s.zooms ?? [])
            .map((z, j) => `<div class="dz dz-${j}" style="left:${z.x}%;top:${z.y}%;width:${z.w}%;height:${z.h}%" ${a({ only: [j + 1], anim: 'fade' })}></div>`)
            .join('')}
        </div>
        <div class="shot-cap">${s.label}</div>
      `,
      steps,
    };
  });
  return [intro, ...frames];
}
