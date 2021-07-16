import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';

import { rgba, themeVal } from '@devseed-ui/theme-provider';

const StyledStrong = styled.strong`
  /* styled-component */
`;

function PillSelf(props) {
  const { children, ...rest } = props;

  return (
    <StyledStrong {...rest}>
      <span>{children}</span>
    </StyledStrong>
  );
}

PillSelf.propTypes = {
  children: T.node
};

const Pill = styled(PillSelf)`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: ${themeVal('type.base.bold')};
  text-transform: uppercase;
  color: ${themeVal('color.baseLight')};
  background-color: ${rgba(themeVal('color.base'), 0.48)};
  border-radius: ${themeVal('shape.ellipsoid')};
  padding: 0.5em 1em;
  font-size: 0.75em;
  line-height: 1;
  white-space: nowrap;

  > * {
    position: relative;
    z-index: 2;
  }
`;

export default Pill;
