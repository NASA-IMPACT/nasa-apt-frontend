import React, { useMemo } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { Button } from '@devseed-ui/button';
import { themeVal, rgba } from '@devseed-ui/theme-provider';
import Dropdown, { DropTitle, DropMenu } from '@devseed-ui/dropdown';
import { ToolbarLabel as ToolbarLabel$ } from '@devseed-ui/toolbar';

import { Link } from '../../../styles/clean/link';

import { getDocumentEditStep, getSteps } from './steps';
import { documentEdit } from '../../../utils/url-creator';
import { calculateDocumentStepCompleteness } from '../completeness';
import { DropMenuItemEnhanced } from '../../common/dropdown-menu';

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

const StepMenuItem = styled(DropMenuItemEnhanced)`
  flex-flow: column;
  align-items: flex-start;
  justify-content: center;
  min-height: 3.25rem;

  small {
    display: block;
    font-size: 0.75rem;
    line-height: 1rem;
    font-weight: ${themeVal('type.base.regular')};
  }
`;

export default function StepsMenu(props) {
  const { activeStep, atbdId, atbd } = props;

  const activeStepItem = useMemo(() => getDocumentEditStep(activeStep), [
    activeStep
  ]);

  // TODO: add pdf mode
  const STEPS = useMemo(() => getSteps(), []);

  return (
    <>
      <ToolbarLabel variation='light'>
        Step {activeStepItem.stepNum} of {STEPS.length}
      </ToolbarLabel>
      <StepsDropdown
        alignment='right'
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

            const {
              complete,
              total,
              percent
            } = calculateDocumentStepCompleteness(atbd, step);

            return (
              <li key={id}>
                <StepMenuItem
                  as={Link}
                  title={`Go to step ${label}`}
                  active={id === activeStepItem.id}
                  data-dropdown='click.close'
                  to={documentEdit(atbdId, atbd.version, id)}
                >
                  <span>{label}</span>
                  <small>
                    {total
                      ? `${percent}% complete (${complete} of ${total} sections)`
                      : '—'}
                  </small>
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
  atbd: T.object
};
