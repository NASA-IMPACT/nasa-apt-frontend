import { modKey } from '../common/utils';

export const toolbarTable = {
  id: 'table',
  icon: 'table',
  hotkey: 'mod+H',
  label: 'Table',
  tip: (key) => `Table (${modKey(key)})`
};
