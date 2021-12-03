import styled from 'styled-components';
import { Heading } from '@devseed-ui/typography';

import { ContentBlock } from './content-block';
import Prose from './typography/prose';

export const FormBlock = styled(ContentBlock)`
  grid-gap: 2rem;

  > * {
    grid-column: content-start / content-end;
  }
`;

export const FormBlockHeading = styled(Heading)`
  margin: 0;
`;

export const FormSectionNotes = styled(Prose)`
  max-width: 40rem;
`;
