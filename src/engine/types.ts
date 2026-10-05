/**
 * The deck is ONE nested composition (Prezi-style): a 1920×1080 overview that
 * contains zones, which contain smaller zones, and so on. Steps move the camera
 * to a zone and set the build state of the whole canvas.
 */
export interface StepDef {
  /** Unique id; used by data-in / data-out / data-only and the r-<id> classes. */
  id: string;
  /** Short label for the presenter's jump list. */
  title: string;
  /** Zone id to frame with the camera ("overview" = the whole picture). */
  target: string;
  /** Speaker cues — presenter view only. */
  notes?: string[];
  /** Target duration in seconds, for pacing. */
  secs: number;
  /** Padding around the zone, as a fraction of the viewport (default 0.04). */
  pad?: number;
  /** Skip this step in the PDF export. */
  noPrint?: boolean;
}

export interface Section {
  id: string;
  title: string;
}

export interface Step extends StepDef {
  index: number;
  section: Section;
}

export interface DeckDef {
  title: string;
  /** Total talk budget in seconds. */
  budget: number;
  /** The canvas (overview is 1920×1080; zones nest inside). */
  html: string;
  sections: { section: Section; steps: StepDef[] }[];
  /** Imperative effects per step id (counters etc.). Must also work with instant=true. */
  effects?: Record<string, (world: HTMLElement, instant: boolean) => void>;
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
  runningSince: number | null;
  acc: number;
}

export interface DeckState {
  step: number;
  blackout: boolean;
  overview: boolean;
  timer: TimerState;
  rev: number;
  by: string;
}
