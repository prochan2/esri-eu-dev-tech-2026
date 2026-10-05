import './styles/base.css';
import './styles/deck.css';
import { deck } from './deck';
import { highlightAll } from './deck/highlight';
import { DeckView, fitStage } from './engine/deck';
import { bindKeys } from './engine/keys';
import { Sync } from './engine/sync';
import { contourSvg } from './engine/terrain';

const params = new URLSearchParams(location.search);
const view = params.get('view') ?? 'audience';

export async function createStage(host: HTMLElement) {
  const stage = document.createElement('div');
  stage.className = 'stage';
  stage.innerHTML = `<div class="backdrop"></div>`;
  host.appendChild(stage);
  const dv = new DeckView(deck, stage);
  dv.world.insertAdjacentHTML('beforebegin', `<div class="terrain-layer">${contourSvg({ x0: -2400, y0: -1600, x1: 4320, y1: 2680 })}</div>`);
  stage.insertAdjacentHTML('beforeend', `<div class="blackout"></div>`);
  await highlightAll(stage);
  return { stage, dv };
}

async function audience() {
  document.body.classList.add('view-audience');
  document.title = deck.title;
  const { stage, dv } = await createStage(document.body);
  fitStage(stage);
  const sync = new Sync(true);
  const render = (instant: boolean) => {
    const s = sync.state;
    dv.go(s.step, { instant, overview: s.overview });
    stage.classList.toggle('is-black', s.blackout);
  };
  render(true);
  sync.on(() => render(false));
  bindKeys(sync, { count: dv.steps.length });
  // dev helper: jump without animation, e.g. __go(12) in the console
  if (import.meta.env.DEV) Object.assign(window, { __go: (i: number) => (sync.update({ step: i }), dv.go(i, { instant: true }), dv.steps[i]?.id) });
}

/** Preview inside the presenter window: shows a given step, driven by postMessage. */
async function preview() {
  document.body.classList.add('view-preview');
  const { stage, dv } = await createStage(document.body);
  fitStage(stage);
  dv.go(Number(params.get('step') ?? 0), { instant: true });
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
    void audience();
}
