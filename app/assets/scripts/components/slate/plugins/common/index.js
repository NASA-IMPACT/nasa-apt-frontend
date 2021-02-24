import styled from 'styled-components';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { EditablePlugins, pipe as pipe$ } from '@udecode/slate-plugins';

// Editable field of the Editor styled.
export const EditableWithPlugins = styled(EditablePlugins)`
  padding: ${glsp(1, 2)};
  box-shadow: ${themeVal('boxShadow.elevationA')};

  > div > *:not(:last-child) {
    margin-bottom: ${glsp()};
  }
`;

// Pipe function for composition.
// Re-export. See README.md for rationale.
export const pipe = pipe$;
