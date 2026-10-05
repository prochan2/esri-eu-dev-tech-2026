import { CameraRig, VH, VW, boundsCamera, focusCamera, frameCamera } from './camera';
import type { Camera, DeckDef, FrameDef, Step } from './types';

export function flatten(def: DeckDef): Step[] {
  const steps: Step[] = [];
  for (const { section, frames } of def.sections) {
    for (const frame of frames) {
      frame.steps.forEach((s, local) => {
        steps.push({ ...s, index: steps.length, frame, local, section });
      });
    }
  }
  return steps;
}

/** Applies a frame's local build step to its DOM. Pure CSS state: works in print too. */
export function applyLocal(el: HTMLElement, local: number) {
  el.dataset.local = String(local);
  // ge-N classes allow CSS morphs: `.ge-3 .thing { ... }`
  const keep = [...el.classList].filter((c) => !/^ge-\d+$/.test(c) && c !== 'at-end');
  el.className = keep.join(' ');
  for (let i = 0; i <= local; i++) el.classList.add(`ge-${i}`);
  el.querySelectorAll<HTMLElement>('[data-in],[data-out],[data-only]').forEach((n) => {
    const din = n.dataset.in !== undefined ? Number(n.dataset.in) : -Infinity;
    const dout = n.dataset.out !== undefined ? Number(n.dataset.out) : Infinity;
    let visible = local >= din && local < dout;
    if (n.dataset.only !== undefined) {
      visible = n.dataset.only.split(',').map(Number).includes(local);
    }
    n.classList.toggle('b-pre', local < din && !visible);
    n.classList.toggle('b-on', visible);
    n.classList.toggle('b-off', !visible && local >= din);
  });
}

export function buildFrame(f: FrameDef): HTMLElement {
  const el = document.createElement('section');
  el.className = `frame ${f.className ?? ''}`.trim();
  el.id = `f-${f.id}`;
  el.dataset.frame = f.id;
  const s = f.scale ?? 1;
  el.style.transform = `translate(${f.x}px, ${f.y}px) rotate(${f.rot ?? 0}deg) scale(${s}) translate(${-VW / 2}px, ${-VH / 2}px)`;
  el.innerHTML = f.html;
  return el;
}

export function worldBounds(def: DeckDef) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const { frames } of def.sections) {
    for (const f of frames) {
      const s = f.scale ?? 1;
      const r = Math.hypot(VW, VH) / 2 * s;
      const hw = f.rot ? r : (VW / 2) * s;
      const hh = f.rot ? r : (VH / 2) * s;
      x0 = Math.min(x0, f.x - hw);
      x1 = Math.max(x1, f.x + hw);
      y0 = Math.min(y0, f.y - hh);
      y1 = Math.max(y1, f.y + hh);
    }
  }
  return { x0, y0, x1, y1 };
}

/** The rendered canvas: world, frames, camera. Used by audience, previews and print. */
export class DeckView {
  readonly steps: Step[];
  readonly world: HTMLElement;
  readonly rig: CameraRig;
  readonly frames = new Map<string, HTMLElement>();
  private current = -1;
  private overview = false;

  constructor(readonly def: DeckDef, readonly stage: HTMLElement) {
    this.steps = flatten(def);
    this.world = document.createElement('div');
    this.world.className = 'world';
    if (def.worldHtml) this.world.insertAdjacentHTML('beforeend', def.worldHtml);
    for (const { frames } of def.sections) {
      for (const f of frames) {
        const el = buildFrame(f);
        this.frames.set(f.id, el);
        this.world.appendChild(el);
      }
    }
    stage.appendChild(this.world);
    this.rig = new CameraRig(this.world, (c) => {
      // expose zoom for CSS (e.g. thicker routes when zoomed out)
      stage.style.setProperty('--cam-zoom', String(c.zoom));
    });
    // initial state: everything at build 0
    for (const el of this.frames.values()) applyLocal(el, 0);
  }

  get index() {
    return this.current;
  }

  cameraFor(step: Step): Camera {
    if (step.overview) return boundsCamera(worldBounds(this.def));
    const el = this.frames.get(step.frame.id)!;
    if (step.focus) {
      const t = el.querySelector<HTMLElement>(step.focus);
      if (t) return focusCamera(step.frame, el, t, step.pad);
      console.warn(`focus target not found: ${step.focus}`);
    }
    return frameCamera(step.frame);
  }

  go(index: number, opts: { instant?: boolean; overview?: boolean } = {}) {
    index = Math.max(0, Math.min(this.steps.length - 1, index));
    const step = this.steps[index];
    const changedStep = index !== this.current;
    const overview = !!opts.overview;
    this.current = index;

    // Frames before the current one show their final state; later ones show build 0.
    for (const [id, el] of this.frames) {
      const fs = this.steps.filter((s) => s.frame.id === id);
      const first = fs[0].index;
      const last = fs[fs.length - 1].index;
      let local: number;
      if (index > last) local = fs.length - 1;
      else if (index < first) local = 0;
      else local = index - first;
      const prev = el.dataset.local;
      applyLocal(el, local);
      el.classList.toggle('is-current', id === step.frame.id);
      el.classList.toggle('is-past', index > last);
      if (prev !== String(local) || (id === step.frame.id && changedStep)) {
        step.frame.id === id && step.frame.onStep?.(el, local, !!opts.instant);
      }
    }
    this.stage.classList.toggle('instant', !!opts.instant);
    if (opts.instant) requestAnimationFrame(() => requestAnimationFrame(() => this.stage.classList.remove('instant')));

    if (changedStep || overview !== this.overview || opts.instant) {
      this.overview = overview;
      const cam = overview ? boundsCamera(worldBounds(this.def)) : this.cameraFor(step);
      this.rig.fly(cam, { instant: opts.instant });
    }
  }
}

/** Scales the fixed 1920×1080 stage to fit its container (letterboxed). */
export function fitStage(stage: HTMLElement, container: HTMLElement = document.body) {
  const fit = () => {
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    const s = Math.min(w / VW, h / VH);
    stage.style.transform = `translate(${(w - VW * s) / 2}px, ${(h - VH * s) / 2}px) scale(${s})`;
  };
  fit();
  new ResizeObserver(fit).observe(container);
  window.addEventListener('resize', fit);
  return fit;
}
