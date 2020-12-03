import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { push } from 'connected-react-router';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { StickyContainer, Sticky } from 'react-sticky';
import styled from 'styled-components/macro';
import { rgba } from 'polished';

import { themeVal, stylizeFunction } from '../../styles/utils/general';
import { divide } from '../../styles/utils/math';
import { antialiased } from '../../styles/helpers';
import { headingAlt } from '../../styles/type/heading';
import Button from '../../styles/button/button';
import { VerticalDivider } from '../../styles/divider';
import collecticon from '../../styles/collecticons';

import {
  InpageHeader,
  InpageHeaderInner,
  InpageHeadline,
  InpageTitle,
  InpageTagline,
  InpageToolbar,
  InpageBody,
  InpageBodyInner,
} from './Inpage';

import {
  atbdsedit,
  identifying_information,
  introduction,
  contacts,
  drafts,
  algorithm_description,
  algorithm_usage,
  algorithm_implementation,
  references,
  journal_details,
} from '../../constants/routes';

import Prose from '../../styles/type/prose';

import Dropdown, { DropTitle, DropMenu, DropMenuItem } from './Dropdown';

const _rgba = stylizeFunction(rgba);

const PrevButton = styled(Button)`
  &::before {
    ${collecticon('chevron-left--small')}
  }
`;

const NextButton = styled(Button)`
  &::after {
    ${collecticon('chevron-right--small')}
  }
`;

const StepDropTrigger = styled(Button)`
  &::after {
    ${collecticon('chevron-down--small')}
  }
`;

const StepDrop = styled(Dropdown)`
  min-width: 20rem;
`;

const StepDropMenuItem = styled(DropMenuItem)`
  padding: ${divide(themeVal('layout.space'), 2)} ${themeVal('layout.space')};

  &::after {
    top: ${divide(themeVal('layout.space'), 2)};
  }
`;

const Stepper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  line-height: 2.5rem;
  align-items: center;

  > * {
    display: inline-flex;
  }
`;

const StepperLabel = styled.h6`
  ${headingAlt()}
  font-size: 0.875rem;
  color: ${_rgba('#FFFFFF', 0.64)};
  margin-right: 0.5rem;
  white-space: nowrap;
`;

const ItemCount = styled.span`
  ${antialiased}
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  line-height: 1.5rem;
  color: #fff;
  background-color: ${themeVal('color.link')};
  border-radius: ${themeVal('shape.ellipsoid')};
  width: 1.5rem;
  height: 1.5rem;
  margin-right: 0.5rem;
`;

const InpageLinkedTitle = styled(Link)`
  display: block;

  &,
  &:visited {
    color: inherit;
  }
`;

export const atbdSteps = [
  {
    id: 'identifying_information',
    display: 'Identifying information',
    link: (id, version) => `/${atbdsedit}/${id}/${drafts}/${version}/${identifying_information}`,
  },
  {
    id: 'contacts',
    display: 'Contact information',
    link: (id, version) => `/${atbdsedit}/${id}/${drafts}/${version}/${contacts}`,
  },
  {
    id: 'references',
    display: 'References',
    link: (id, version) => `/${atbdsedit}/${id}/${drafts}/${version}/${references}`,
  },
  {
    id: 'introduction',
    display: 'Introduction',
    link: (id, version) => `/${atbdsedit}/${id}/${drafts}/${version}/${introduction}`,
  },
  {
    id: 'algorithm_description',
    display: 'Algorithm description',
    link: (id, version) => `/${atbdsedit}/${id}/${drafts}/${version}/${algorithm_description}`,
  },
  {
    id: 'algorithm_usage',
    display: 'Algorithm usage',
    link: (id, version) => `/${atbdsedit}/${id}/${drafts}/${version}/${algorithm_usage}`,
  },
  {
    id: 'algorithm_implementation',
    display: 'Algorithm implementation',
    link: (id, version) => `/${atbdsedit}/${id}/${drafts}/${version}/${algorithm_implementation}`,
  }
];

export const getAtbdStep = (id) => {
  const s = atbdSteps.findIndex(v => v.id === id);
  if (s < 0) {
    throw new Error(`Step with id ${id} not found`);
  }

  return {
    stepNum: s + 1,
    step: atbdSteps[s]
  };
};

const EditPage = (props) => {
  const {
    title, step, id, alias, children
  } = props;

  const version = 1;

  const numSteps = atbdSteps.length;
  const stepCount = `Step ${step} of ${numSteps}`;

  return (
    <Fragment>
      <StickyContainer>
        <Sticky>
          {stickyProps => (
            <InpageHeader
              style={stickyProps.style}
              isSticky={stickyProps.isSticky}
            >
              <InpageHeaderInner>
                <InpageHeadline>
                  <InpageLinkedTitle
                    to={`/atbds/${alias || id}`}
                    title="View rendered ATBD"
                  >
                    <InpageTitle>{title || 'Untitled Document'}</InpageTitle>
                  </InpageLinkedTitle>
                  <InpageTagline>Editing document</InpageTagline>
                </InpageHeadline>
                <InpageToolbar>
                  <Stepper>
                    <StepperLabel>{stepCount}</StepperLabel>
                    <StepDrop
                      alignment="right"
                      triggerElement={(
                        <StepDropTrigger
                          variation="achromic-plain"
                          title="Toggle menu options"
                        >
                          {atbdSteps[step - 1].display}
                        </StepDropTrigger>
)}
                    >
                      <DropTitle>Select step</DropTitle>
                      <DropMenu role="menu" selectable>
                        {atbdSteps.map((d, i) => (
                          <li key={d.display}>
                            <StepDropMenuItem
                              onClick={() => d.link(id, version)
                                && props.push(d.link(id, version))
                              }
                              active={i === step - 1}
                            >
                              <ItemCount>{i + 1}</ItemCount>
                              <span>{d.display}</span>
                            </StepDropMenuItem>
                          </li>
                        ))}
                      </DropMenu>
                    </StepDrop>
                  </Stepper>
                  <VerticalDivider />
                  <PrevButton
                    variation="achromic-plain"
                    title="View previous step"
                    onClick={() => atbdSteps[step - 2].link(id, version)
                      && props.push(atbdSteps[step - 2].link(id, version))
                    }
                    disabled={step === 1}
                  >
                    {' '}
                    Prev
                  </PrevButton>
                  <NextButton
                    variation="achromic-plain"
                    title="View next step"
                    onClick={() => atbdSteps[step].link(id, version)
                      && props.push(atbdSteps[step].link(id, version))
                    }
                    disabled={step === atbdSteps.length}
                  >
                    {' '}
                    Next
                  </NextButton>
                </InpageToolbar>
              </InpageHeaderInner>
            </InpageHeader>
          )}
        </Sticky>
        <InpageBody>
          <InpageBodyInner>
            <Prose>{children}</Prose>
          </InpageBodyInner>
        </InpageBody>
      </StickyContainer>
    </Fragment>
  );
};

EditPage.propTypes = {
  title: PropTypes.string.isRequired,
  step: PropTypes.number,
  id: PropTypes.number,
  alias: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  push: PropTypes.func,
};

const mapStateToProps = () => ({});
const mapDispatch = { push };

export default connect(mapStateToProps, mapDispatch)(EditPage);
