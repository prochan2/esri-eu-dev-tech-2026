import type { DeckState } from './types';

const CHANNEL = 'migrating-soe-deck';
const STORE = 'migrating-soe-deck:state';

type Msg = { type: 'state'; state: DeckState } | { type: 'hello'; from: string };

const initial = (by: string): DeckState => ({
  step: 0,
  blackout: false,
  overview: false,
  timer: { runningSince: null, acc: 0 },
  rev: 0,
  by,
});

function newer(a: DeckState, b: DeckState) {
  return a.rev > b.rev || (a.rev === b.rev && a.by > b.by);
}

/**
 * Keeps all windows of this origin on the same state via BroadcastChannel.
 * Last writer wins (rev + window id). State survives reloads via localStorage.
 */
export class Sync {
  readonly id = Math.random().toString(36).slice(2, 10);
  state: DeckState;
  private ch: BroadcastChannel;
  private listeners = new Set<(s: DeckState, local: boolean) => void>();

  constructor(private readonly writable = true) {
    this.state = initial(this.id);
    try {
      const saved = localStorage.getItem(STORE);
      if (saved) this.state = { ...this.state, ...JSON.parse(saved) };
    } catch {
      /* storage unavailable: start fresh */
    }
    this.ch = new BroadcastChannel(CHANNEL);
    this.ch.onmessage = (e: MessageEvent<Msg>) => {
      const m = e.data;
      if (m.type === 'hello') {
        if (this.writable) this.ch.postMessage({ type: 'state', state: this.state } satisfies Msg);
      } else if (m.type === 'state' && newer(m.state, this.state)) {
        this.state = m.state;
        this.persist();
        this.emit(false);
      }
    };
    this.ch.postMessage({ type: 'hello', from: this.id } satisfies Msg);
    window.addEventListener('storage', (e) => {
      if (e.key !== STORE || !e.newValue) return;
      const s = JSON.parse(e.newValue) as DeckState;
      if (newer(s, this.state)) {
        this.state = s;
        this.emit(false);
      }
    });
  }

  on(fn: (s: DeckState, local: boolean) => void) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  update(patch: Partial<Omit<DeckState, 'rev' | 'by'>>) {
    if (!this.writable) return;
    this.state = { ...this.state, ...patch, rev: this.state.rev + 1, by: this.id };
    this.persist();
    this.ch.postMessage({ type: 'state', state: this.state } satisfies Msg);
    this.emit(true);
  }

  private persist() {
    try {
      localStorage.setItem(STORE, JSON.stringify(this.state));
    } catch {
      /* ignore */
    }
  }

  private emit(local: boolean) {
    for (const fn of this.listeners) fn(this.state, local);
  }
}

export function elapsedMs(s: DeckState, now = Date.now()) {
  return s.timer.acc + (s.timer.runningSince ? now - s.timer.runningSince : 0);
}
