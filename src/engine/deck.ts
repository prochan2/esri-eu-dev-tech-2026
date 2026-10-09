import { gsap } from 'gsap';
import { CameraRig, I, VH, VW, cameraTransform, local, mul, zoneCamera, type ZoneGeom } from './camera';
import type { Camera, DeckDef, Step } from './types';

export function flatten(def: DeckDef): Step[] {
  const steps: Step[] = [];
  for (const { section, steps: ss } of def.sections) for (const s of ss) steps.push({ ...s, index: steps.length, section });
  const ids = new Set<string>();
  for (const s of steps) {
    if (ids.has(s.id)) console.error(`duplicate step id ${s.id}`);
    ids.add(s.id);
  }
  return steps;
}

/** Elements whose numbers count up on arrival. */
const COUNTERS = '.kpi b, .stats .nw, .pt-facts b, .ai-kpis b, .proj-count .n, [data-count]';

/** Reads zone geometry from data attributes (+ border widths, so the world must be in the DOM). */
export function measureZones(world: HTMLElement): Map<string, ZoneGeom> {
  const out = new Map<string, ZoneGeom>();
  out.set('overview', { id: 'overview', el: world, w: VW, h: VH, m: I, scale: 1, rot: 0 });
  // Absolutely positioned children start inside the parent's border, so a
  // child's origin is offset by the parent zone's border width (clientLeft/Top).
  const walk = (el: Element, m: typeof I, scale: number, rot: number, bx = 0, by = 0) => {
    for (const c of el.children) {
      const h = c as HTMLElement;
      if (h.classList?.contains('zone')) {
        const d = h.dataset;
        const s = Number(d.s ?? 1);
        const r = Number(d.r ?? 0);
        const zm = mul(m, local(bx + Number(d.x ?? 0), by + Number(d.y ?? 0), s, r));
        const g: ZoneGeom = { id: d.zone!, el: h, w: Number(d.w), h: Number(d.h), m: zm, scale: scale * s, rot: rot + r };
        out.set(g.id, g);
        walk(h, zm, g.scale, g.rot, h.clientLeft, h.clientTop);
      } else walk(h, m, scale, rot, bx, by);
    }
  };
  walk(world, I, 1, 0);
  return out;
}

/**
 * Applies the build state for a step to the whole canvas. Pure CSS state, so it
 * is the same live, instant and in print:
 *  - data-in="stepId"   visible from that step on
 *  - data-out="stepId"  hidden from that step on
 *  - data-only="a,b"    visible only during those steps
 *  - classes r-<id> on the world for every reached step, at-<id> for the current one
 */
export function applyState(world: HTMLElement, steps: Step[], index: number) {
  const pos = new Map(steps.map((s) => [s.id, s.index]));
  const idx = (id: string) => {
    const i = pos.get(id);
    if (i === undefined) console.warn(`unknown step id in build: ${id}`);
    return i ?? Infinity;
  };
  const keep = [...world.classList].filter((c) => !/^(r|at)-/.test(c));
  world.className = keep.join(' ');
  for (let i = 0; i <= index; i++) world.classList.add(`r-${steps[i].id}`);
  world.classList.add(`at-${steps[index].id}`);
  world.querySelectorAll<HTMLElement>('[data-in],[data-out],[data-only]').forEach((n) => {
    const din = n.dataset.in ? idx(n.dataset.in) : -Infinity;
    const dout = n.dataset.out ? idx(n.dataset.out) : Infinity;
    let vis = index >= din && index < dout;
    if (n.dataset.only) vis = n.dataset.only.split(',').some((id) => idx(id.trim()) === index);
    n.classList.toggle('b-on', vis);
    n.classList.toggle('b-pre', !vis && index < din);
    n.classList.toggle('b-off', !vis && !(index < din));
  });
  // data-fixed="stepId": the part turns from "legacy" to "21st century" once covered
  world.querySelectorAll<HTMLElement>('[data-fixed]').forEach((n) => n.classList.toggle('is-fixed', index >= idx(n.dataset.fixed!)));
  // the zone the camera is on gets .is-target
  world.querySelectorAll<HTMLElement>('[data-zone]').forEach((n) => n.classList.toggle('is-target', n.dataset.zone === steps[index].target));
}

/** The rendered canvas. Used by the audience window, previews and print. */
export class DeckView {
  readonly steps: Step[];
  readonly world: HTMLElement;
  readonly rig: CameraRig;
  zones: Map<string, ZoneGeom>;
  private current = -1;
  private overview = false;

  constructor(readonly def: DeckDef, readonly stage: HTMLElement, world?: HTMLElement) {
    this.steps = flatten(def);
    if (world) this.world = world;
    else {
      this.world = document.createElement('div');
      this.world.className = 'world';
      this.world.innerHTML = def.html;
      stage.appendChild(this.world);
    }
    this.zones = measureZones(this.world);
    for (const s of this.steps) if (!this.zones.has(s.target)) console.error(`step ${s.id}: unknown zone ${s.target}`);
    this.rig = new CameraRig(this.world, (c, moving) => {
      stage.classList.toggle('moving', moving);
      // background terrain: parallax layer that zooms much less than the content
      const t = stage.querySelector<HTMLElement>('.terrain-layer');
      if (t) t.style.transform = cameraTransform({ ...c, zoom: Math.pow(c.zoom, 0.3) });
      // synchronous: a deferred rAF would be cancelled by every animation tick
      // and culled zones would stay hidden for the whole flight
      this.lod(c);
    });
  }

  get index() {
    return this.current;
  }

  cameraFor(step: Step): Camera {
    const z = this.zones.get(step.target) ?? this.zones.get('overview')!;
    return zoneCamera(z, step.pad ?? (step.target === 'overview' ? 0 : 0.04));
  }

  go(index: number, opts: { instant?: boolean; overview?: boolean } = {}) {
    index = Math.max(0, Math.min(this.steps.length - 1, index));
    const step = this.steps[index];
    const changed = index !== this.current;
    const overview = !!opts.overview;
    this.current = index;
    this.stage.classList.toggle('instant', !!opts.instant);
    applyState(this.world, this.steps, index);
    if (changed) this.def.effects?.[step.id]?.(this.world, !!opts.instant);
    if (opts.instant) requestAnimationFrame(() => requestAnimationFrame(() => this.stage.classList.remove('instant')));
    if (changed || overview !== this.overview || opts.instant) {
      this.overview = overview;
      const cam = overview ? zoneCamera(this.zones.get('overview')!, 0) : this.cameraFor(step);
      const fly = this.rig.fly(cam, { instant: opts.instant });
      // arrival animations (CSS) start near the end of the flight
      this.stage.style.setProperty('--fly', `${fly}s`);
      this.stage.style.setProperty('--land', `${Math.max(0, fly * 0.6)}s`);
      this.countUp(step.target, opts.instant ? -1 : Math.max(0, fly * 0.6));
    }
  }

  /**
   * Numbers count up when their zone becomes the camera target, or when they
   * appear in a build. data-from="137" counts from another value (e.g. down).
   * delay < 0 → show the final value immediately.
   */
  private countUp(target: string, delay: number) {
    const zone = this.zones.get(target)?.el;
    this.world.querySelectorAll<HTMLElement>(COUNTERS).forEach((el) => {
      el.dataset.final ??= el.textContent ?? '';
      const inTarget = !!zone && zone !== this.world && zone.contains(el);
      const visible = inTarget && !el.closest('.b-pre,.b-off');
      const run = visible && (el.dataset.cTarget !== target || el.dataset.cVis !== '1');
      el.dataset.cTarget = inTarget ? target : '';
      el.dataset.cVis = visible ? '1' : '0';
      if (!run) return;
      const m = /^(\D*?)(\d[\d,]*(?:\.\d+)?)(.*)$/s.exec(el.dataset.final);
      if (!m || delay < 0) {
        el.textContent = el.dataset.final;
        return;
      }
      const [, pre, num, post] = m;
      const decimals = num.includes('.') ? num.split('.')[1].length : 0;
      const comma = num.includes(',');
      const end = Number(num.replace(/,/g, ''));
      const o = { v: Number(el.dataset.from ?? 0) };
      const fmt = (v: number) => {
        const t = v.toFixed(decimals);
        return comma ? Number(t).toLocaleString('en-US', { minimumFractionDigits: decimals }) : t;
      };
      gsap.killTweensOf(el);
      el.textContent = pre + fmt(o.v) + post;
      gsap.to(o, { v: end, duration: 1.1, delay: delay + 0.15, ease: 'power2.out', onUpdate: () => (el.textContent = pre + fmt(o.v) + post), onComplete: () => (el.textContent = el.dataset.final!) });
    });
  }

  /**
   * Level of detail: zones marked .lod hide their contents when they are tiny on
   * screen, which keeps rasterising the huge canvas cheap during flights.
   */
  lod(c: Camera) {
    // world → screen for the current camera
    const r = (-c.rot * Math.PI) / 180;
    const cos = Math.cos(r) * c.zoom;
    const sin = Math.sin(r) * c.zoom;
    const toScreen = (x: number, y: number) => [VW / 2 + cos * (x - c.x) - sin * (y - c.y), VH / 2 + sin * (x - c.x) + cos * (y - c.y)];
    const margin = 200;
    for (const z of this.zones.values()) {
      if (z.id === 'overview') continue;
      const lodded = z.el.classList.contains('lod');
      if (lodded) z.el.classList.toggle('lod-hide', z.w * z.scale * c.zoom < Number(z.el.dataset.lod ?? 90));
      // cull zones that are entirely off screen (cheap rasterisation when zoomed in)
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      for (const [lx, ly] of [[0, 0], [z.w, 0], [0, z.h], [z.w, z.h]]) {
        const [wx, wy] = [z.m[0] * lx + z.m[2] * ly + z.m[4], z.m[1] * lx + z.m[3] * ly + z.m[5]];
        const [sx, sy] = toScreen(wx, wy);
        x0 = Math.min(x0, sx); x1 = Math.max(x1, sx); y0 = Math.min(y0, sy); y1 = Math.max(y1, sy);
      }
      z.el.classList.toggle('off-screen', x1 < -margin || y1 < -margin || x0 > VW + margin || y0 > VH + margin);
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
  return fit;
}
