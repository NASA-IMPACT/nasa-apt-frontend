import styled from 'styled-components';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { EditablePlugins, pipe as pipe$ } from '@udecode/slate-plugins';

// Editable field of the Editor styled.
export const EditableWithPlugins = styled(EditablePlugins)`
  background-color: ${themeVal('color.surface')};
  padding: ${glsp(2, 1)};

  > div > *:not(:last-child) {
    margin-bottom: ${glsp()};
  }
`;

export const EditorWrapper = styled.div`
  border: ${themeVal('layout.border')} solid ${themeVal('color.baseAlphaD')};
  border-radius: ${themeVal('shape.rounded')};
`;

// Pipe function for composition.
// Re-export. See README.md for rationale.
export const pipe = pipe$;
