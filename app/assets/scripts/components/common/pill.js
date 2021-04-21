import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';

import { rgba, themeVal, glsp } from '@devseed-ui/theme-provider';

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
  height: 1.25rem;
  min-width: 2rem;
  font-size: 0.75rem;
  font-weight: ${themeVal('type.base.bold')};
  text-transform: uppercase;
  color: ${themeVal('color.baseLight')};
  background-color: ${rgba(themeVal('color.base'), 0.48)};
  border-radius: ${themeVal('shape.ellipsoid')};
  padding: ${glsp(0, 0.5)};
  overflow: hidden;

  > * {
    position: relative;
    z-index: 2;
  }
`;

export default Pill;
