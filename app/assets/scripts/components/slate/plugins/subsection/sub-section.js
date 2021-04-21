import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { useReadOnly } from 'slate-react';
import { glsp, themeVal } from '@devseed-ui/theme-provider';

import { useRichContext } from '../common/rich-context';

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
  const { attributes, htmlAttributes, element, children } = props;

  const readOnly = useReadOnly();
  const { subsectionLevel, sectionId } = useRichContext();

  let readAttributes = {};
  let Element = SectionHeading;

  if (readOnly) {
    if (subsectionLevel) {
      Element = subsectionLevel;
    }
    if (sectionId) {
      readAttributes.id = `${sectionId}--${element.id}`;
      readAttributes['data-scroll'] = 'target';
    }
  }

  return (
    <Element {...attributes} {...htmlAttributes} {...readAttributes}>
      {children}
    </Element>
  );
}

SubSection.propTypes = {
  attributes: T.object,
  htmlAttributes: T.object,
  element: T.object,
  children: T.node
};
