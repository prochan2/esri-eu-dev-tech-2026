import type { Sync } from './sync';

export interface KeyOpts {
  count: number;
  /** Extra handlers (presenter-only keys etc.). Return true when handled. */
  extra?: (e: KeyboardEvent) => boolean;
}

/**
 * Keyboard + presentation clicker bindings.
 * Clickers send PageDown/PageUp (or arrows), "b"/"." for black screen,
 * and F5 / Shift+F5 / Esc for their "start" button.
 */
export function bindKeys(sync: Sync, opts: KeyOpts) {
  let typed = '';
  const go = (i: number) => {
    const step = Math.max(0, Math.min(opts.count - 1, i));
    const s = sync.state;
    const patch: Parameters<Sync['update']>[0] = { step, overview: false, blackout: false };
    // first advance starts the clock
    if (step > 0 && s.timer.runningSince === null && s.timer.acc === 0) {
      patch.timer = { runningSince: Date.now(), acc: 0 };
    }
    sync.update(patch);
  };

  window.addEventListener('keydown', (e) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
    if (opts.extra?.(e)) {
      e.preventDefault();
      return;
    }
    const s = sync.state;
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
      case 'PageDown':
      case ' ':
      case 'Enter':
      case 'n':
        if (e.key === 'Enter' && typed) {
          go(Number(typed) - 1);
          typed = '';
        } else if (s.overview || s.blackout) {
          sync.update({ overview: false, blackout: false });
        } else go(s.step + 1);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
      case 'PageUp':
      case 'Backspace':
      case 'p':
        if (s.overview || s.blackout) sync.update({ overview: false, blackout: false });
        else go(s.step - 1);
        break;
      case 'Home':
        go(0);
        break;
      case 'End':
        go(opts.count - 1);
        break;
      case 'b':
      case 'B':
      case '.':
        sync.update({ blackout: !s.blackout });
        break;
      case 'o':
      case 'O':
        sync.update({ overview: !s.overview, blackout: false });
        break;
      case 'F5':
      case 'Escape':
        // clicker "start/stop" button: toggle fullscreen instead of reloading
        if (e.key === 'Escape' && !document.fullscreenElement) return;
        toggleFullscreen();
        break;
      case 'f':
      case 'F':
        toggleFullscreen();
        break;
      default:
        if (/^\d$/.test(e.key)) {
          typed += e.key;
          return;
        }
        return;
    }
    typed = '';
    e.preventDefault();
  });
}

export function toggleFullscreen() {
  if (document.fullscreenElement) void document.exitFullscreen();
  else void document.documentElement.requestFullscreen().catch(() => {});
}
