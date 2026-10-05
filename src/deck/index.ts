import '../styles/frames.css';
import type { DeckDef } from '../engine/types';
import { feedbackFrame, questionsFrame, thanksFrame } from './closing';
import { config } from './config';
import { titleFrame, whyFrame } from './opening';

export const deck: DeckDef & { title: string } = {
  title: config.title,
  budget: config.budget,
  sections: [
    { section: { id: 'open', title: 'Opening' }, frames: [titleFrame, whyFrame] },
    {
      section: { id: 'close', title: 'Close' },
      frames: [thanksFrame(4600, 1500), questionsFrame(2300, -1400), feedbackFrame(4600, 2800)],
    },
  ],
};
