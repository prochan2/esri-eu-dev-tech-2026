import './styles/base.css';
import './styles/deck.css';
import { deck } from './deck';
import { DeckView, fitStage, worldBounds } from './engine/deck';
import { bindKeys } from './engine/keys';
import { Sync } from './engine/sync';
import { contourSvg } from './engine/terrain';
import { highlightAll } from './deck/highlight';

const params = new URLSearchParams(location.search);
const view = params.get('view') ?? 'audience';

async function createStage(host: HTMLElement) {
  const stage = document.createElement('div');
  stage.className = 'stage';
  stage.innerHTML = `<div class="backdrop"></div>`;
  host.appendChild(stage);
  const b = worldBounds(deck);
  const m = 6000;
  const dv = new DeckView(deck, stage);
  dv.world.insertAdjacentHTML(
    'afterbegin',
    contourSvg({ x0: b.x0 - m, y0: b.y0 - m, x1: b.x1 + m, y1: b.y1 + m }),
  );
  stage.insertAdjacentHTML('beforeend', `<div class="blackout"></div>`);
  await highlightAll(stage);
  return { stage, dv };
}

async function audience(opts: { writable: boolean }) {
  document.body.classList.add('view-audience');
  const { stage, dv } = await createStage(document.body);
  fitStage(stage);
  const sync = new Sync(opts.writable);
  const render = (instant: boolean) => {
    const s = sync.state;
    dv.go(s.step, { instant, overview: s.overview });
    stage.classList.toggle('is-black', s.blackout);
  };
  render(true);
  sync.on(() => render(false));
  if (opts.writable) bindKeys(sync, { count: dv.steps.length });
  document.title = deck.title;
}

/** Preview inside the presenter window: shows a given step, driven by postMessage. */
async function preview() {
  document.body.classList.add('view-preview');
  const { stage, dv } = await createStage(document.body);
  fitStage(stage);
  const start = Number(params.get('step') ?? 0);
  dv.go(start, { instant: true });
  window.addEventListener('message', (e) => {
    if (e.origin !== location.origin) return;
    const m = e.data as { step: number; instant?: boolean; overview?: boolean; blackout?: boolean };
    if (typeof m?.step !== 'number') return;
    dv.go(m.step, { instant: m.instant, overview: m.overview });
    stage.classList.toggle('is-black', !!m.blackout);
  });
  parent.postMessage({ previewReady: true, name: window.name }, location.origin);
}

switch (view) {
  case 'presenter':
    void import('./presenter/presenter').then((m) => m.presenter());
    break;
  case 'preview':
    void preview();
    break;
  case 'print':
    void import('./print').then((m) => m.print());
    break;
  default:
    void audience({ writable: true });
}
