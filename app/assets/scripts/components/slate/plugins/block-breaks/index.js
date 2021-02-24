import {
  SoftBreakPlugin as SoftBreakPlugin$,
  ExitBreakPlugin as ExitBreakPlugin$
} from '@udecode/slate-plugins';

import { EQUATION } from '../equation';

export const SoftBreakPlugin = SoftBreakPlugin$({
  rules: [
    {
      hotkey: 'shift+enter',
      query: {
        exclude: [EQUATION]
      }
    }
  ]
});

export const ExitBreakPlugin = ExitBreakPlugin$({
  rules: [
    {
      hotkey: 'mod+enter'
    },
    {
      hotkey: 'mod+shift+enter',
      before: true
    },
    {
      hotkey: 'enter',
      query: {
        // On an equation block, an enter automatically exits.
        allow: [EQUATION]
      }
    }
  ]
});
