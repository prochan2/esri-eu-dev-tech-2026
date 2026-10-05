import { gsap } from 'gsap';
import type { Camera } from './types';

export const VW = 1920;
export const VH = 1080;

const rad = (d: number) => (d * Math.PI) / 180;

/** 2D affine matrix [a b c d e f]: x' = a x + c y + e, y' = b x + d y + f */
export type Mat = [number, number, number, number, number, number];

export const I: Mat = [1, 0, 0, 1, 0, 0];

export function mul(m: Mat, n: Mat): Mat {
  return [
    m[0] * n[0] + m[2] * n[1],
    m[1] * n[0] + m[3] * n[1],
    m[0] * n[2] + m[2] * n[3],
    m[1] * n[2] + m[3] * n[3],
    m[0] * n[4] + m[2] * n[5] + m[4],
    m[1] * n[4] + m[3] * n[5] + m[5],
  ];
}

export function local(x: number, y: number, s: number, r: number): Mat {
  const c = Math.cos(rad(r)) * s;
  const n = Math.sin(rad(r)) * s;
  return [c, n, -n, c, x, y];
}

export function apply(m: Mat, x: number, y: number): [number, number] {
  return [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
}

export interface ZoneGeom {
  id: string;
  el: HTMLElement;
  w: number;
  h: number;
  /** zone-local → world */
  m: Mat;
  /** world px per local px */
  scale: number;
  /** world rotation, degrees */
  rot: number;
}

/** Camera that frames a zone (rotated to the zone's orientation). */
export function zoneCamera(z: ZoneGeom, pad = 0.04): Camera {
  const [cx, cy] = apply(z.m, z.w / 2, z.h / 2);
  const zoom = Math.min((VW * (1 - 2 * pad)) / (z.w * z.scale), (VH * (1 - 2 * pad)) / (z.h * z.scale));
  return { x: cx, y: cy, zoom, rot: z.rot };
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
 * Smooth zoom-and-pan (after van Wijk & Nuij, "Smooth and efficient zooming and panning").
 * Moves along the optimal path in (x, y, log zoom) space: when two views are far apart
 * it zooms out first, then in — the Prezi feel — and it keeps on-screen motion uniform.
 */
export function flightPath(a: Camera, b: Camera) {
  const rho = 1.42;
  const w0 = VW / a.zoom;
  const w1 = VW / b.zoom;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const d = Math.hypot(dx, dy);
  const rot1 = shortestRot(a.rot, b.rot);
  const lerpRot = (t: number) => a.rot + (rot1 - a.rot) * t;

  if (d < 1e-6 * Math.max(w0, w1)) {
    // pure zoom
    const S = Math.abs(Math.log(w1 / w0)) / rho;
    return {
      S,
      at: (t: number): Camera => ({ x: a.x + dx * t, y: a.y + dy * t, zoom: VW / (w0 * Math.exp(Math.log(w1 / w0) * t)), rot: lerpRot(t) }),
    };
  }
  const b0 = (w1 * w1 - w0 * w0 + rho ** 4 * d * d) / (2 * w0 * rho * rho * d);
  const b1 = (w1 * w1 - w0 * w0 - rho ** 4 * d * d) / (2 * w1 * rho * rho * d);
  const r0 = Math.log(-b0 + Math.sqrt(b0 * b0 + 1));
  const r1 = Math.log(-b1 + Math.sqrt(b1 * b1 + 1));
  const S = (r1 - r0) / rho;
  const ux = dx / d;
  const uy = dy / d;
  return {
    S,
    at: (t: number): Camera => {
      const s = t * S;
      const u = (w0 / (rho * rho)) * Math.cosh(r0) * Math.tanh(rho * s + r0) - (w0 / (rho * rho)) * Math.sinh(r0);
      const w = (w0 * Math.cosh(r0)) / Math.cosh(rho * s + r0);
      return { x: a.x + ux * u, y: a.y + uy * u, zoom: VW / w, rot: lerpRot(t) };
    },
  };
}

export class CameraRig {
  cam: Camera = { x: VW / 2, y: VH / 2, zoom: 1, rot: 0 };
  private tween?: gsap.core.Tween;

  constructor(private world: HTMLElement, private onUpdate?: (c: Camera, moving: boolean) => void) {}

  set(c: Camera) {
    this.tween?.kill();
    this.cam = { ...c };
    this.apply(false);
  }

  fly(to: Camera, opts: { instant?: boolean } = {}) {
    this.tween?.kill();
    if (opts.instant) return this.set(to);
    const path = flightPath(this.cam, to);
    const duration = Math.min(2.6, Math.max(0.7, 0.55 + path.S * 0.42));
    const p = { t: 0 };
    this.tween = gsap.to(p, {
      t: 1,
      duration,
      ease: 'power2.inOut',
      onUpdate: () => {
        this.cam = path.at(p.t);
        this.apply(true);
      },
      onComplete: () => {
        this.cam = { ...to };
        this.apply(false);
      },
    });
  }

  private apply(moving: boolean) {
    this.world.style.transform = cameraTransform(this.cam);
    this.onUpdate?.(this.cam, moving);
  }
}
