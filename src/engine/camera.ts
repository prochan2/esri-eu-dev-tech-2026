import { gsap } from 'gsap';
import type { Camera, FrameDef } from './types';

export const VW = 1920;
export const VH = 1080;

const rad = (d: number) => (d * Math.PI) / 180;

/** Camera that shows a frame exactly filling the viewport. */
export function frameCamera(f: FrameDef): Camera {
  const s = f.scale ?? 1;
  return { x: f.x, y: f.y, zoom: 1 / s, rot: f.rot ?? 0 };
}

/**
 * Camera that zooms onto an element inside a frame.
 * Uses layout offsets (unaffected by CSS transforms), so it works mid-flight.
 */
export function focusCamera(f: FrameDef, frameEl: HTMLElement, target: HTMLElement, pad = 0.08): Camera {
  let x = 0;
  let y = 0;
  let el: HTMLElement | null = target;
  while (el && el !== frameEl) {
    x += el.offsetLeft;
    y += el.offsetTop;
    el = el.offsetParent as HTMLElement | null;
  }
  const w = target.offsetWidth;
  const h = target.offsetHeight;
  const s = f.scale ?? 1;
  const r = rad(f.rot ?? 0);
  // centre of target in frame-local px, relative to frame centre
  const lx = (x + w / 2 - VW / 2) * s;
  const ly = (y + h / 2 - VH / 2) * s;
  const wx = f.x + lx * Math.cos(r) - ly * Math.sin(r);
  const wy = f.y + lx * Math.sin(r) + ly * Math.cos(r);
  const fit = Math.min((VW * (1 - 2 * pad)) / (w * s), (VH * (1 - 2 * pad)) / (h * s));
  return { x: wx, y: wy, zoom: fit, rot: f.rot ?? 0 };
}

/** Camera that fits a world-space bounding box. */
export function boundsCamera(b: { x0: number; y0: number; x1: number; y1: number }, pad = 0.04): Camera {
  const w = b.x1 - b.x0;
  const h = b.y1 - b.y0;
  return {
    x: (b.x0 + b.x1) / 2,
    y: (b.y0 + b.y1) / 2,
    zoom: Math.min((VW * (1 - 2 * pad)) / w, (VH * (1 - 2 * pad)) / h),
    rot: 0,
  };
}

export function cameraTransform(c: Camera): string {
  return `translate(${VW / 2}px, ${VH / 2}px) rotate(${-c.rot}deg) scale(${c.zoom}) translate(${-c.x}px, ${-c.y}px)`;
}

function shortestRot(from: number, to: number): number {
  let d = (to - from) % 360;
  if (d > 180) d -= 360;
  if (d < -180) d += 360;
  return from + d;
}

/**
 * Prezi-style flight: pan + zoom with an "arc" that zooms out mid-way when
 * the two cameras are far apart (in screen terms), then zooms back in.
 */
export class CameraRig {
  cam: Camera = { x: 0, y: 0, zoom: 1, rot: 0 };
  private tween?: gsap.core.Tween;

  constructor(private world: HTMLElement, private onUpdate?: (c: Camera) => void) {}

  set(c: Camera) {
    this.tween?.kill();
    this.cam = { ...c };
    this.apply();
  }

  fly(to: Camera, opts: { instant?: boolean } = {}) {
    this.tween?.kill();
    if (opts.instant) return this.set(to);

    const from = { ...this.cam };
    const toRot = shortestRot(from.rot, to.rot);
    const lz0 = Math.log(from.zoom);
    const lz1 = Math.log(to.zoom);
    // distance in screen px at the smaller zoom
    const dist = Math.hypot(to.x - from.x, to.y - from.y) * Math.min(from.zoom, to.zoom);
    const span = dist / VW; // 1 = one screen width away
    const bump = span > 0.6 ? Math.min(Math.log(1 + span) * 0.9, 2.6) : 0;
    const dz = Math.abs(lz1 - lz0);
    const duration = Math.min(2.2, 0.75 + 0.35 * Math.log(1 + span) + 0.18 * dz + 0.25 * bump);

    const p = { t: 0 };
    this.world.style.willChange = 'transform';
    this.tween = gsap.to(p, {
      t: 1,
      duration,
      ease: 'power2.inOut',
      onUpdate: () => {
        const t = p.t;
        // zoom in log space with an arc
        const lz = lz0 + (lz1 - lz0) * t - bump * Math.sin(Math.PI * t);
        const z = Math.exp(lz);
        // When diving into a much smaller target, pan early so it stays in view.
        const u = lz1 - lz0 > 1 && bump === 0 ? 1 - Math.pow(1 - t, 2) : t;
        this.cam = {
          x: from.x + (to.x - from.x) * u,
          y: from.y + (to.y - from.y) * u,
          zoom: z,
          rot: from.rot + (toRot - from.rot) * t,
        };
        this.apply();
      },
      onComplete: () => {
        this.cam = { ...to, rot: to.rot };
        this.apply();
        // drop the compositing hint so Chrome re-rasterises text crisply
        this.world.style.willChange = 'auto';
      },
    });
  }

  private apply() {
    this.world.style.transform = cameraTransform(this.cam);
    this.onUpdate?.(this.cam);
  }
}
