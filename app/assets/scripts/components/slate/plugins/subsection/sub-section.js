import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { useReadOnly } from 'slate-react';

import DeletableBlock from '../common/deletable-block';

import { useRichContext } from '../common/rich-context';

const SectionHeading = styled.h2`
  position: relative;
  font-size: 1.5rem;
  line-height: 2.25rem;
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

    return (
      <Element {...attributes} {...htmlAttributes} {...readAttributes}>
        {children}
      </Element>
    );
  }

  return (
    <DeletableBlock deleteAction='delete-heading'>
      <Element {...attributes} {...htmlAttributes} {...readAttributes}>
        {children}
      </Element>
    </DeletableBlock>
  );
}

SubSection.propTypes = {
  attributes: T.object,
  htmlAttributes: T.object,
  element: T.object,
  children: T.node
};
