# Migrating ArcGIS Server Extensions to the 21st Century

Talk for the Esri European Developer & Technology Summit 2026: 10 minutes plus 5 minutes of Q&A.

The deck is one zoomable picture, "the life of a server extension": **Code → Build → .soe → ArcGIS Server site**. Each topic is a panel nested inside it, and some panels contain smaller sub-panels. Every part starts out "legacy" (dashed border, red tag). It turns "21st century" (blue, ✓) once the talk has covered it, so each time you zoom out the overview shows the progress.

All numbers and snippets come from the `gis-be` repository history. They are sanitised: the supplier's name is removed, and there are no hosts or credentials. See `src/deck/snippets.ts`.

## Run

```bash
npm install
npm run dev
```

1. Open http://localhost:5173/?view=presenter on your laptop screen.
2. Press **A** (or click **Audience window**). Drag the new window to the projector and press **F** in it to go fullscreen.
3. The two windows stay in sync through `BroadcastChannel`, and the state survives a reload.

The deck is designed for 1920×1080 at 125 % scaling (a 1536×864 CSS viewport). It scales to fit any screen.

## Keys (clicker compatible)

| Key | Action |
| --- | --- |
| → ↓ PageDown Space Enter | next step |
| ← ↑ PageUp Backspace | previous step |
| B or . | black screen |
| O | overview, for jumping around during Q&A |
| F, or F5 / Esc from a clicker | fullscreen |
| digits + Enter | go to step *n* |
| T / R / A | presenter only: start or pause the timer, reset it, open the audience window |

The timer starts on the first advance. The pacing badge says whether you are ahead of or behind the planned time for the current step, as set by `secs` in `src/deck/index.ts`.

## PDF

Run `npm run build && npm run pdf`. This uses headless Chrome or Edge and writes to `out/`.

You can also open `?view=print` and use **Print → Save as PDF** with background graphics turned on.

You get one page per step. Animations are frozen at their end state.

## Private assets (git-ignored)

- `public/private/esri/` holds artwork from the Esri speaker template. Rebuild it with `node scripts/extract-template.mjs private/esri-euro-dev-tech-2026-template.pptx`.
- `public/private/demo/01-extensions.png`, `02-services.png`, `03-iis.png` and `04-wall.png` are admin portal screenshots, 16:9. Until you add them, placeholders show instead.

See `private/README.md` for why these are not committed.

## Layout of the code

- `src/engine/` is the engine: camera (smooth zoom and pan), zones, build state, sync, keys and terrain.
- `src/deck/` is the content. `index.ts` holds the step script and speaker notes. `code.ts`, `build.ts` and `site.ts` are the stations. `overview.ts` holds the title, the history ribbon and the AI panel.
- `src/presenter/` is the presenter view. `src/print.ts` is the PDF view.

A step names a zone `target` for the camera to frame. Elements use `data-in="<step>"`, `data-out` and `data-only` to appear and disappear. A zone with `fixed: '<step>'` turns blue at that step.
