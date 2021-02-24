import {
  DEFAULTS_PARAGRAPH,
  isBlockAboveEmpty,
  isSelectionAtBlockStart,
  ResetBlockTypePlugin as ResetBlockTypePlugin$
} from '@udecode/slate-plugins';

// This is disabled for now.
// This is used to change the block type when certain conditions are met.
// I'd use this on lists, but they have this built in.
const resetBlockTypesCommonRule = {
  types: [],
  defaultType: DEFAULTS_PARAGRAPH.type
};

export const ResetBlockTypePlugin = ResetBlockTypePlugin$({
  rules: [
    {
      ...resetBlockTypesCommonRule,
      hotkey: 'Enter',
      predicate: isBlockAboveEmpty
    },
    {
      ...resetBlockTypesCommonRule,
      hotkey: 'Backspace',
      predicate: isSelectionAtBlockStart
    }
  ]
});
