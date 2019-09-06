import styled from 'styled-components/macro';
import { rgba } from 'polished';
import { themeVal, stylizeFunction } from '../../styles/utils/general';
import { divide } from '../../styles/utils/math';

import { antialiased } from '../../styles/helpers';

const _rgba = stylizeFunction(rgba);

const getBg = ({ variation }) => {
  switch (variation) {
    case 'success':
      return themeVal('color.success');
    case 'danger':
      return themeVal('color.danger');
    case 'warning':
      return themeVal('color.warning');
    case 'info':
      return themeVal('color.info');
    default:
      return _rgba(themeVal('color.base'), 0.64);
  }
};

const StatusPill = styled.span`
  ${antialiased}
  display: flex;
  justify-content: center;
  padding: 0 ${divide(themeVal('layout.space'), 2)};
  background-color: ${getBg};
  border-radius: ${themeVal('shape.ellipsoid')};
  color: #fff;
  white-space: nowrap;
  font-size: 0.875rem;
  font-weight: ${themeVal('type.base.bold')};
  line-height: 1.5rem;
  min-width: 6rem;
`;

export default StatusPill;
