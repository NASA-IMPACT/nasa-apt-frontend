import React from 'react';
import styled from 'styled-components';
import T from 'prop-types';

import { ToolbarIconButton as ToolbarIconButton$ } from '@devseed-ui/toolbar';

import Tip from '../tooltip';

const ToolbarIconButton = styled(ToolbarIconButton$)`
  justify-content: center;
`;

// This is needed so that the tooltip doesn't have a div wrapper and the focus
// works.
const TooltipTagComponent = React.forwardRef((props, ref) => (
  <ToolbarIconButton
    ref={ref}
    useIcon='circle-information'
    size='small'
    {...props}
  />
));

TooltipTagComponent.displayName = 'TooltipTagComponent';

export default function FormInfoTip({ title, ...rest }) {
  return (
    <Tip title={title} tag={TooltipTagComponent} interactive {...rest}>
      More information
    </Tip>
  );
}

FormInfoTip.propTypes = {
  title: T.node
};
