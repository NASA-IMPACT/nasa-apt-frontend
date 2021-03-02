import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { glsp, themeVal } from '@devseed-ui/theme-provider';

const SectionHeading = styled.h2`
  position: relative;
  font-size: 1.5rem;
  line-height: 2rem;
  margin-top: ${glsp(2)};

  &::before {
    position: absolute;
    top: ${glsp(-0.5)};
    left: 0;
    content: '';
    width: 5rem;
    height: 2px;
    background-color: ${themeVal('color.baseAlphaD')};
  }
`;

export default function SubSection(props) {
  const { attributes, children } = props;

  return <SectionHeading {...attributes}>{children}</SectionHeading>;
}

SubSection.propTypes = {
  attributes: T.object,
  children: T.node
};
