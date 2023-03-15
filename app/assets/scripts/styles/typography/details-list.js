import styled from 'styled-components';

import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { headingAlt } from '@devseed-ui/typography';

const DetailsList = styled.dl`
  display: grid;
  grid-template-columns: minmax(min-content, max-content) 1fr;
  grid-gap: ${glsp(0.5, 2)};

  dt {
    ${headingAlt()}
    line-height: inherit;
  }

  dd {
    font-weight: ${themeVal('type.base.bold')};
    word-break: break-word;
  }
`;

export default DetailsList;
