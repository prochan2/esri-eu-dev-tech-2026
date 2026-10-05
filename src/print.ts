import './styles/print.css';
import { deck } from './deck';
import { highlightAll } from './deck/highlight';
import { VH, VW, boundsCamera, cameraTransform, focusCamera, frameCamera } from './engine/camera';
import { applyLocal, buildFrame, flatten, worldBounds } from './engine/deck';
import { contourSvg } from './engine/terrain';

/**
 * PDF export: one 1920×1080 page per step, each with its frame at that build,
 * animations frozen at their end state. Neighbouring frames are not drawn,
 * so camera "peeks" into other frames are lost — an accepted trade-off.
 *
 * Use the browser's Print → Save as PDF (background graphics on), or `npm run pdf`.
 */
export async function print() {
  document.body.classList.add('view-print');
  document.title = `${deck.title} (PDF)`;
  const steps = flatten(deck).filter((s) => !s.noPrint);
  const b = worldBounds(deck);
  const terrain = contourSvg({ x0: b.x0 - 6000, y0: b.y0 - 6000, x1: b.x1 + 6000, y1: b.y1 + 6000 });

  for (const step of steps) {
    const page = document.createElement('div');
    page.className = 'page stage print';
    page.innerHTML = `<div class="backdrop"></div>`;
    const world = document.createElement('div');
    world.className = 'world';
    world.innerHTML = terrain;
    if (step.overview) {
      if (deck.worldHtml) world.insertAdjacentHTML('beforeend', deck.worldHtml);
      for (const { frames } of deck.sections) for (const f of frames) {
        const el = buildFrame(f);
        applyLocal(el, f.steps.length - 1);
        world.appendChild(el);
      }
    } else {
      const el = buildFrame(step.frame);
      applyLocal(el, step.local);
      el.classList.add('is-current');
      world.appendChild(el);
    }
    page.appendChild(world);
    document.body.appendChild(page);
  }

  await highlightAll(document.body);

  // cameras need layout, so compute after everything is in the DOM
  document.querySelectorAll<HTMLElement>('.page').forEach((page, i) => {
    const step = steps[i];
    const world = page.querySelector<HTMLElement>('.world')!;
    let cam = step.overview ? boundsCamera(b) : frameCamera(step.frame);
    if (step.focus && !step.overview) {
      const fe = world.querySelector<HTMLElement>('.frame')!;
      const t = fe.querySelector<HTMLElement>(step.focus);
      if (t) cam = focusCamera(step.frame, fe, t, step.pad);
    }
    world.style.transform = cameraTransform(cam);
    step.frame.onStep?.(page.querySelector<HTMLElement>('.frame')!, step.local, true);
  });
  document.body.dataset.ready = '1';
  console.log(`print ready: ${steps.length} pages ${VW}x${VH}`);
}
