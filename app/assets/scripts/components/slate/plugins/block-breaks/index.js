import {
  SoftBreakPlugin as SoftBreakPlugin$,
  ExitBreakPlugin as ExitBreakPlugin$
} from '@udecode/slate-plugins';

import { EQUATION } from '../equation';
import { SUB_SECTION } from '../subsection';
import { CAPTION } from '../caption';

// A Soft Break allows the user to add a new like to a block without exiting it.
// This is used to for example changing line in a paragraph without creating a
// new one. In a code block for example, the `enter` key could create a new
// line, instead of creating a whole new block.
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

// An Exit Break, exits the current blocks and creates a new one of default type
// which is a paragraph.
// For a code block this would need to be implemented as a way to provide a way
// to finish the code block, as the simple `enter` just adds a new line.
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
        allow: [EQUATION, SUB_SECTION, CAPTION]
      }
    }
  ]
});
