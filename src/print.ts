import './styles/print.css';
import { deck } from './deck';
import { highlightAll } from './deck/highlight';
import { cameraTransform, zoneCamera } from './engine/camera';
import { applyState, flatten, measureZones } from './engine/deck';
import { contourSvg } from './engine/terrain';

/**
 * PDF export: one 1920×1080 page per step — the same canvas, frozen at that
 * step's build state and camera. Use Print → Save as PDF (background graphics on)
 * or `npm run pdf`.
 */
export async function print() {
  document.body.classList.add('view-print');
  document.title = `${deck.title} (PDF)`;
  const all = flatten(deck);

  // build and highlight one canvas, then clone it per page
  const proto = document.createElement('div');
  proto.className = 'world';
  proto.innerHTML = deck.html;
  const terrain = contourSvg({ x0: -2400, y0: -1600, x1: 4320, y1: 2680 });
  const holder = document.createElement('div');
  holder.appendChild(proto);
  await highlightAll(holder);

  for (const step of all) {
    if (step.noPrint) continue;
    const page = document.createElement('div');
    page.className = 'page stage print';
    page.innerHTML = `<div class="backdrop"></div><div class="terrain-layer">${terrain}</div>`;
    const world = proto.cloneNode(true) as HTMLElement;
    applyState(world, all, step.index);
    deck.effects?.[step.id]?.(world, true);
    const z = measureZones(world).get(step.target)!;
    const cam = zoneCamera(z, step.pad ?? (step.target === 'overview' ? 0 : 0.04));
    world.style.transform = cameraTransform(cam);
    page.querySelector<HTMLElement>('.terrain-layer')!.style.transform = cameraTransform({ ...cam, zoom: Math.pow(cam.zoom, 0.3) });
    page.appendChild(world);
    document.body.appendChild(page);
  }
  document.body.dataset.ready = '1';
}
