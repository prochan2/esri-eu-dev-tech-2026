/**
 * Procedural contour-line "map" drawn behind the canvas, so camera moves have
 * a geographic texture without relying on third-party imagery.
 */

function rng(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

function valueNoise(seed: number, cells: number) {
  const r = rng(seed);
  const g: number[] = [];
  for (let i = 0; i < (cells + 1) * (cells + 1); i++) g.push(r());
  const at = (x: number, y: number) => g[y * (cells + 1) + x];
  const smooth = (t: number) => t * t * (3 - 2 * t);
  return (u: number, v: number) => {
    const x = u * cells;
    const y = v * cells;
    const x0 = Math.min(cells - 1, Math.floor(x));
    const y0 = Math.min(cells - 1, Math.floor(y));
    const tx = smooth(x - x0);
    const ty = smooth(y - y0);
    const a = at(x0, y0) + (at(x0 + 1, y0) - at(x0, y0)) * tx;
    const b = at(x0, y0 + 1) + (at(x0 + 1, y0 + 1) - at(x0, y0 + 1)) * tx;
    return a + (b - a) * ty;
  };
}

/** Returns SVG markup of contour lines covering the given world box. */
export function contourSvg(box: { x0: number; y0: number; x1: number; y1: number }, seed = 7): string {
  const W = box.x1 - box.x0;
  const H = box.y1 - box.y0;
  const nx = 150;
  const ny = Math.round((nx * H) / W);
  const n1 = valueNoise(seed, 5);
  const n2 = valueNoise(seed + 1, 11);
  const n3 = valueNoise(seed + 2, 23);
  const f = (i: number, j: number) => {
    const u = i / nx;
    const v = j / ny;
    return 0.6 * n1(u, v) + 0.28 * n2(u, v) + 0.12 * n3(u, v);
  };
  const grid: number[][] = [];
  for (let j = 0; j <= ny; j++) {
    const row: number[] = [];
    for (let i = 0; i <= nx; i++) row.push(f(i, j));
    grid.push(row);
  }
  const sx = W / nx;
  const sy = H / ny;
  const levels: { d: string; major: boolean }[] = [];
  const N = 22;
  for (let k = 1; k < N; k++) {
    const lv = 0.2 + (k / N) * 0.6;
    let d = '';
    for (let j = 0; j < ny; j++) {
      for (let i = 0; i < nx; i++) {
        const a = grid[j][i], b = grid[j][i + 1], c = grid[j + 1][i + 1], e = grid[j + 1][i];
        const idx = (a > lv ? 8 : 0) | (b > lv ? 4 : 0) | (c > lv ? 2 : 0) | (e > lv ? 1 : 0);
        if (idx === 0 || idx === 15) continue;
        const X = box.x0 + i * sx;
        const Y = box.y0 + j * sy;
        const top = [X + sx * ((lv - a) / (b - a)), Y];
        const right = [X + sx, Y + sy * ((lv - b) / (c - b))];
        const bottom = [X + sx * ((lv - e) / (c - e)), Y + sy];
        const left = [X, Y + sy * ((lv - a) / (e - a))];
        const seg = (p: number[], q: number[]) => {
          d += `M${p[0].toFixed(0)} ${p[1].toFixed(0)}L${q[0].toFixed(0)} ${q[1].toFixed(0)}`;
        };
        switch (idx) {
          case 1: case 14: seg(left, bottom); break;
          case 2: case 13: seg(bottom, right); break;
          case 3: case 12: seg(left, right); break;
          case 4: case 11: seg(top, right); break;
          case 6: case 9: seg(top, bottom); break;
          case 7: case 8: seg(left, top); break;
          case 5: seg(left, top); seg(bottom, right); break;
          case 10: seg(top, right); seg(left, bottom); break;
        }
      }
    }
    levels.push({ d, major: k % 5 === 0 });
  }
  return `<svg class="terrain" xmlns="http://www.w3.org/2000/svg" style="left:${box.x0}px;top:${box.y0}px;width:${W}px;height:${H}px" viewBox="${box.x0} ${box.y0} ${W} ${H}" preserveAspectRatio="none" aria-hidden="true">${levels
    .map((l) => `<path class="${l.major ? 'major' : 'minor'}" d="${l.d}"/>`)
    .join('')}</svg>`;
}
