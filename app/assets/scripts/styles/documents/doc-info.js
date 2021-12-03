import styled from 'styled-components';
import { glsp } from '@devseed-ui/theme-provider';

import DetailsList from '../../styles/typography/details-list';

export const DocInfoList = styled(DetailsList)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: ${glsp(0, 1)};

  margin-bottom: ${glsp(-1)};

  dt {
    font-size: 0.75rem;
    line-height: 1rem;
  }

  dd {
    margin-bottom: ${glsp()};
  }

  dt:nth-of-type(1),
  dt:nth-of-type(2),
  dt:nth-of-type(3) {
    grid-row: 1;
  }

  dt:nth-of-type(4),
  dt:nth-of-type(5),
  dt:nth-of-type(6) {
    grid-row: 3;
  }

  dd:nth-of-type(1),
  dd:nth-of-type(2),
  dd:nth-of-type(3) {
    grid-row: 2;
  }

  dd:nth-of-type(4),
  dd:nth-of-type(5),
  dd:nth-of-type(6) {
    grid-row: 5;
  }
`;
