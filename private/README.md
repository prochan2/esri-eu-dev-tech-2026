# Private assets (not committed)

This folder and `public/private/` are git-ignored on purpose.

| File | Why it is not in git |
| --- | --- |
| `esri-euro-dev-tech-2026-template.pptx` | © 2026 Esri, all rights reserved; contains Adobe Stock images used under Esri's license. Speaker use only. |
| `cetin-brand-manual.pdf` | CETIN internal brand guidelines; not published for redistribution. |
| `../public/private/esri/*` | Logo, key art and map backgrounds extracted from the Esri template. |

The presentation works without them (it falls back to drawn gradients and patterns),
but looks like the official template only when they are present.

To restore on a new machine, run `node scripts/extract-template.mjs <path-to-template.pptx>`.
