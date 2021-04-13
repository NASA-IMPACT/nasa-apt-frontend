import styled from 'styled-components';

import { glsp, media, themeVal } from '@devseed-ui/theme-provider';
import { headingAlt } from '@devseed-ui/typography';

const DetailsList = styled.dl`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: ${glsp(0.25, 1)};

  ${media.smallUp`
    grid-template-columns: minmax(min-content, max-content) 1fr;
    grid-gap: ${glsp(0.5, 2)};
  `}

  dt {
    ${headingAlt()}
    line-height: inherit;
  }

  dd {
    font-weight: ${themeVal('type.base.bold')};
  }
`;

export default DetailsList;
