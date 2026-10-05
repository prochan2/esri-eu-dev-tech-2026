// Exports the deck to PDF (one 1920×1080 page per step) with headless Edge/Chrome.
// Usage: npm run build && npm run pdf [-- out/slides.pdf]
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const out = resolve(process.argv[2] ?? 'out/Migrating-ArcGIS-Server-Extensions.pdf');
mkdirSync(dirname(out), { recursive: true });

const candidates = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean);
const browser = candidates.find((p) => existsSync(p));
if (!browser) {
  console.error('No Chrome/Edge found. Set CHROME_PATH.');
  process.exit(1);
}
if (!existsSync('dist/index.html')) {
  console.error('Run `npm run build` first.');
  process.exit(1);
}

const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--port', '4173', '--strictPort'], {
  stdio: ['ignore', 'pipe', 'inherit'],
});
await new Promise((ok) => server.stdout.on('data', (d) => /localhost/.test(String(d)) && ok()));

const url = 'http://localhost:4173/?view=print';
console.log(`Printing ${url} with ${browser}`);
const r = spawnSync(
  browser,
  [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--no-pdf-header-footer',
    '--run-all-compositor-stages-before-draw',
    '--virtual-time-budget=20000',
    '--window-size=1920,1080',
    `--print-to-pdf=${out}`,
    url,
  ],
  { stdio: 'inherit' },
);
server.kill();
if (r.status !== 0) process.exit(r.status ?? 1);
console.log(`Wrote ${out}`);
