// Re-creates public/private/esri/* from the Esri speaker template (.pptx).
// Usage: node scripts/extract-template.mjs path/to/template.pptx
import { spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const pptx = process.argv[2] ?? 'private/esri-euro-dev-tech-2026-template.pptx';
const tmp = mkdtempSync(join(tmpdir(), 'pptx-'));
const r = spawnSync('tar', ['-xf', pptx, '-C', tmp], { stdio: 'inherit' });
if (r.status !== 0) process.exit(1);
const map = {
  'image1.png': 'esri-logo.png',
  'image4.png': 'map-teal.png',
  'image7.png': 'map-orange.png',
  'image5.png': 'keyart-title.png',
  'image13.png': 'keyart-section.png',
  'image17.png': 'keyart-demo.png',
  'image14.png': 'keyart-closing.png',
  'image16.png': 'map-topic.png',
};
mkdirSync('public/private/esri', { recursive: true });
for (const [src, dst] of Object.entries(map)) copyFileSync(join(tmp, 'ppt/media', src), join('public/private/esri', dst));
console.log('Extracted Esri template assets to public/private/esri/');
