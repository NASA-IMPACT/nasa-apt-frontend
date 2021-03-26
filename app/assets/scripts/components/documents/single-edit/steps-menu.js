import React, { useMemo } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { Button } from '@devseed-ui/button';
import { themeVal, rgba } from '@devseed-ui/theme-provider';
import Dropdown, {
  DropTitle,
  DropMenu,
  DropMenuItem
} from '@devseed-ui/dropdown';
import { ToolbarLabel as ToolbarLabel$ } from '@devseed-ui/toolbar';

import { getATBDEditStep, STEPS } from './steps';
import { atbdEdit } from '../../../utils/url-creator';
import { Link } from '../../../styles/clean/link';

// TODO: Remove once the ui library is updated.
const ToolbarLabel = styled(ToolbarLabel$)`
  color: ${({ variation }) =>
    variation === 'light'
      ? themeVal('color.baseLight')
      : rgba(themeVal('color.base'), 0.64)};
`;

const StepsDropdown = styled(Dropdown)`
  max-width: 18rem;
`;

const StepMenuItem = styled(DropMenuItem)`
  flex-flow: column;
  align-items: flex-start;

  small {
    font-size: 0.75rem;
    font-weight: ${themeVal('type.base.regular')};
  }
`;

export default function StepsMenu(props) {
  const { activeStep, atbdId, currentVersion } = props;

  const activeStepItem = useMemo(() => getATBDEditStep(activeStep), [
    activeStep
  ]);

  return (
    <>
      <ToolbarLabel variation='light'>
        Step {activeStepItem.stepNum} of {STEPS.length}
      </ToolbarLabel>
      <StepsDropdown
        alignment='center'
        direction='down'
        triggerElement={(props) => (
          <Button
            variation='achromic-plain'
            title='Open dropdown'
            useIcon={['chevron-down--small', 'after']}
            {...props}
          >
            {activeStepItem.label}
          </Button>
        )}
      >
        <DropTitle>Steps</DropTitle>
        <DropMenu selectable>
          {STEPS.map((step) => {
            const { id, label } = step;

            return (
              <li key={id}>
                <StepMenuItem
                  as={Link}
                  title={`Go to step ${label}`}
                  active={id === activeStepItem.id}
                  data-dropdown='click.close'
                  to={atbdEdit(atbdId, currentVersion, id)}
                >
                  <span>{label}</span>
                  <small>75% complete</small>
                </StepMenuItem>
              </li>
            );
          })}
        </DropMenu>
      </StepsDropdown>
    </>
  );
}

StepsMenu.propTypes = {
  activeStep: T.string,
  atbdId: T.string,
  currentVersion: T.string
};
