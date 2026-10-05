import '../styles/presenter.css';
import { deck } from '../deck';
import { flatten } from '../engine/deck';
import { bindKeys } from '../engine/keys';
import { Sync, elapsedMs } from '../engine/sync';
import type { Step } from '../engine/types';

const fmt = (ms: number) => {
  const neg = ms < 0;
  const s = Math.round(Math.abs(ms) / 1000);
  return `${neg ? '−' : ''}${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

export function presenter() {
  document.body.classList.add('view-presenter');
  document.title = `Presenter · ${deck.title}`;
  const steps = flatten(deck);
  const sync = new Sync(true);

  // cumulative target start time of each step
  const startAt: number[] = [];
  steps.reduce((t, s, i) => ((startAt[i] = t), t + s.secs), 0);
  const total = steps.reduce((t, s) => t + s.secs, 0);

  const sections = deck.sections.map(({ section }) => {
    const ss = steps.filter((s) => s.section.id === section.id);
    return { section, steps: ss, secs: ss.reduce((t, s) => t + s.secs, 0) };
  });

  document.body.innerHTML = `
  <div class="p-root">
    <header class="p-bar">
      <div class="p-clock">
        <div class="p-elapsed" id="elapsed">0:00</div>
        <div class="p-sub"><span id="remaining"></span> left of ${fmt(deck.budget * 1000)}</div>
      </div>
      <div class="p-pace" id="pace" title="Ahead (green) or behind (red) the plan for this step"></div>
      <div class="p-where">
        <div class="p-section" id="section"></div>
        <div class="p-stepno" id="stepno"></div>
      </div>
      <div class="p-buttons">
        <button id="b-audience" title="Open the audience window (A)">Audience window</button>
        <button id="b-timer" title="Start / pause timer (T)">Start</button>
        <button id="b-reset" title="Reset timer (R)">Reset</button>
        <button id="b-black" title="Black screen (B or .)">Black</button>
        <button id="b-over" title="Overview (O)">Overview</button>
      </div>
    </header>
    <main class="p-main">
      <div class="p-current">
        <div class="p-label">Now</div>
        <div class="p-frame"><iframe id="cur" name="cur" src="?view=preview&step=0"></iframe></div>
      </div>
      <div class="p-side">
        <div class="p-label">Next · <span id="nexttitle"></span></div>
        <div class="p-frame small"><iframe id="next" name="next" src="?view=preview&step=1"></iframe></div>
        <div class="p-label">Notes</div>
        <div class="p-notes" id="notes"></div>
      </div>
    </main>
    <footer class="p-map" id="map">
      ${sections
        .map(
          (s) => `<div class="p-sec" data-sec="${s.section.id}" style="flex:${s.secs}">
            <div class="p-sec-head"><span>${esc(s.section.title)}</span><span class="p-sec-t">${fmt(s.secs * 1000)}</span></div>
            <div class="p-chips">${s.steps
              .map((st: Step) => `<button class="p-chip" data-step="${st.index}" title="${st.index + 1}. ${esc(st.title)}" style="flex:${st.secs}">${st.index + 1}</button>`)
              .join('')}</div>
          </div>`,
        )
        .join('')}
      <div class="p-now" id="now"></div>
      <div class="p-plan" id="plan"></div>
    </footer>
  </div>`;

  const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
  const cur = $<HTMLIFrameElement>('cur');
  const next = $<HTMLIFrameElement>('next');
  const ready = new Set<string>();

  const post = (f: HTMLIFrameElement, msg: object) => {
    if (ready.has(f.name)) f.contentWindow?.postMessage(msg, location.origin);
  };

  const render = (instant = false) => {
    const s = sync.state;
    const st = steps[s.step];
    const nx = steps[Math.min(steps.length - 1, s.step + 1)];
    post(cur, { step: s.step, instant, overview: s.overview, blackout: s.blackout });
    post(next, { step: nx.index, instant: true });
    $('section').textContent = st.section.title;
    $('stepno').textContent = `${s.step + 1} / ${steps.length} · ${st.title}`;
    $('nexttitle').textContent = s.step + 1 < steps.length ? nx.title : '— end —';
    $('notes').innerHTML = (st.notes ?? []).map((n) => `<li>${esc(n)}</li>`).join('') || '<li class="muted">—</li>';
    document.querySelectorAll<HTMLElement>('.p-chip').forEach((c) => {
      const i = Number(c.dataset.step);
      c.classList.toggle('done', i < s.step);
      c.classList.toggle('active', i === s.step);
    });
    document.querySelectorAll<HTMLElement>('.p-sec').forEach((c) => c.classList.toggle('active', c.dataset.sec === st.section.id));
    $('b-timer').textContent = s.timer.runningSince ? 'Pause' : s.timer.acc ? 'Resume' : 'Start';
    $('b-black').classList.toggle('on', s.blackout);
    $('b-over').classList.toggle('on', s.overview);
    document.body.classList.toggle('is-black', s.blackout);
    tick();
  };

  const tick = () => {
    const s = sync.state;
    const el = elapsedMs(s);
    $('elapsed').textContent = fmt(el);
    $('remaining').textContent = fmt(deck.budget * 1000 - el);
    $('elapsed').classList.toggle('over', el > deck.budget * 1000);
    $('elapsed').classList.toggle('paused', !s.timer.runningSince);
    // pacing: compare elapsed with the planned window of the current step
    const planStart = startAt[s.step] * 1000;
    const planEnd = planStart + steps[s.step].secs * 1000;
    let delta = 0;
    if (el > planEnd) delta = el - planEnd; // behind
    else if (el < planStart) delta = el - planStart; // ahead
    const pace = $('pace');
    pace.textContent = !s.timer.runningSince && !s.timer.acc ? 'not started' : delta === 0 ? 'on time' : delta > 0 ? `${fmt(delta)} behind` : `${fmt(-delta)} ahead`;
    pace.className = `p-pace ${delta > 15000 ? 'late' : delta > 0 ? 'warn' : delta < -15000 ? 'early' : 'ok'}`;
    // markers on the map: where you are (step) vs where the clock says you should be
    $('now').style.left = `${((startAt[s.step] + steps[s.step].secs / 2) / total) * 100}%`;
    $('plan').style.left = `${Math.min(100, (el / 1000 / total) * 100)}%`;
  };

  window.addEventListener('message', (e) => {
    if (e.origin !== location.origin || !e.data?.previewReady) return;
    ready.add(e.data.name);
    render(true);
  });

  const openAudience = () => window.open('?view=audience', 'audience', 'popup,width=1280,height=720');
  const toggleTimer = () => {
    const t = sync.state.timer;
    sync.update({
      timer: t.runningSince ? { runningSince: null, acc: t.acc + Date.now() - t.runningSince } : { runningSince: Date.now(), acc: t.acc },
    });
  };
  const resetTimer = () => sync.update({ timer: { runningSince: null, acc: 0 } });

  $('b-audience').onclick = openAudience;
  $('b-timer').onclick = toggleTimer;
  $('b-reset').onclick = () => confirm('Reset the timer?') && resetTimer();
  $('b-black').onclick = () => sync.update({ blackout: !sync.state.blackout });
  $('b-over').onclick = () => sync.update({ overview: !sync.state.overview });
  $('map').addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>('.p-chip');
    if (b) sync.update({ step: Number(b.dataset.step), overview: false, blackout: false });
  });
  // clicking the current preview advances (mouse as a fallback clicker)
  cur.addEventListener('load', () => {
    cur.contentDocument?.addEventListener('click', () => sync.update({ step: Math.min(steps.length - 1, sync.state.step + 1) }));
  });

  bindKeys(sync, {
    count: steps.length,
    extra: (e) => {
      if (e.key === 't' || e.key === 'T') return toggleTimer(), true;
      if (e.key === 'r' || e.key === 'R') return confirm('Reset the timer?') && resetTimer(), true;
      if (e.key === 'a' || e.key === 'A') return openAudience(), true;
      return false;
    },
  });
  // forward key presses that land in the preview iframes
  for (const f of [cur, next]) {
    f.addEventListener('load', () => {
      f.contentWindow?.addEventListener('keydown', (e) => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: e.key, shiftKey: e.shiftKey }));
        e.preventDefault();
      });
    });
  }

  sync.on(() => render(false));
  render(true);
  setInterval(tick, 250);
}
