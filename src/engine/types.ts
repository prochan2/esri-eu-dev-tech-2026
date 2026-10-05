/** A frame is one 1920×1080 "scene" placed somewhere on the infinite canvas. */
export interface FrameDef {
  id: string;
  /** World position of the frame centre (world px). */
  x: number;
  y: number;
  /** Size relative to a 1920×1080 viewport. 0.25 = a small detail you zoom into. */
  scale?: number;
  /** Rotation in degrees. */
  rot?: number;
  /** Extra CSS classes on the frame element. */
  className?: string;
  /** Frame HTML. Elements may use data-in / data-out (local step numbers). */
  html: string;
  /** Builds (steps) of this frame, in order. */
  steps: StepDef[];
  /** Called after the frame enters a new local step (for imperative effects). */
  onStep?: (el: HTMLElement, local: number, instant: boolean) => void;
}

export interface StepDef {
  /** Short label for the presenter's jump list. */
  title: string;
  /** Speaker cues — short bullets, shown only in the presenter view. */
  notes?: string[];
  /** Target duration in seconds, for pacing. */
  secs: number;
  /** CSS selector inside the frame to zoom the camera onto, instead of the whole frame. */
  focus?: string;
  /** Padding around the focus target (fraction of viewport), default 0.08. */
  pad?: number;
  /** Show the whole canvas (overview) instead of the frame. */
  overview?: boolean;
  /** Skip this step in the PDF export. */
  noPrint?: boolean;
}

export interface Section {
  id: string;
  title: string;
}

/** A step flattened across the deck. */
export interface Step extends StepDef {
  index: number;
  frame: FrameDef;
  local: number;
  section: Section;
}

export interface DeckDef {
  sections: { section: Section; frames: FrameDef[] }[];
  /** Static decorations on the canvas (routes, labels), world coordinates. */
  worldHtml?: string;
  /** Total talk budget in seconds. */
  budget: number;
}

export interface Camera {
  x: number;
  y: number;
  /** Screen px per world px. */
  zoom: number;
  /** Degrees. */
  rot: number;
}

export interface TimerState {
  /** Epoch ms when the timer (re)started, null when paused/not started. */
  runningSince: number | null;
  /** Accumulated ms before runningSince. */
  acc: number;
}

export interface DeckState {
  step: number;
  blackout: boolean;
  overview: boolean;
  timer: TimerState;
  /** Logical clock for last-writer-wins sync. */
  rev: number;
  /** Writer id, to break ties. */
  by: string;
}
