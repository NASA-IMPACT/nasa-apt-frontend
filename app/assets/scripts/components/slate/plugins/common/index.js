import styled from 'styled-components';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import {
  EditablePlugins as EditablePlugins$,
  pipe as pipe$,
  withInlineVoid as withInlineVoid$
} from '@udecode/slate-plugins';

import { proseInnerSpacing } from '../../../../styles/typography/prose';

export * from './with-history';

// Editable field of the Editor styled.
export const EditableWithPlugins = styled(EditablePlugins$)`
  background-color: ${themeVal('color.surface')};
  padding: ${glsp(2, 1)};

  > div > *:not(:last-child) {
    margin-bottom: ${glsp()};
  }
`;

export const ReadableWithPlugins = styled(EditablePlugins$)`
  > div {
    ${proseInnerSpacing()}
  }
`;

export const EditorWrapper = styled.div`
  border: ${themeVal('layout.border')} solid ${themeVal('color.baseAlphaD')};
  border-radius: ${themeVal('shape.rounded')};
`;

// Pipe function for composition.
// Re-export. See README.md for rationale.
export const pipe = pipe$;
export const EditablePlugins = EditablePlugins$;
export const withInlineVoid = withInlineVoid$;
