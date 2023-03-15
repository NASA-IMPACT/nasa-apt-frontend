import React, { useState } from 'react';
import T from 'prop-types';
import { useFocused, useReadOnly, useSelected } from 'slate-react';
import styled, { css } from 'styled-components';
import { glsp, rgba, themeVal } from '@devseed-ui/theme-provider';
import { headingAlt } from '@devseed-ui/typography';

import { useRichContext } from '../common/rich-context';
import { formatCitation, formatReference } from '../../../../utils/references';

import Tip from '../../../common/tooltip';

const Ref = styled.span`
  ${headingAlt()}
  font-size: 0.75rem;
  vertical-align: super;
  padding: ${glsp(0, 0.25)};
  margin: ${glsp(0, 0.125)};
  border-radius: ${themeVal('shape.rounded')};
  box-shadow: inset 0 0 0 1px ${themeVal('color.baseAlphaD')};
  cursor: help;
  user-select: none;
  transition: all 0.24s ease-in-out 0s;

  &:hover {
    box-shadow: inset 0 0 0 1px ${rgba(themeVal('color.link'), 0.24)};
  }

  ${({ isInvalid }) =>
    isInvalid
      ? css`
          &,
          &:hover {
            box-shadow: inset 0 0 0 1px ${themeVal('color.danger')};
          }
        `
      : css`
          box-shadow: inset 0 0 0 1px ${themeVal('color.baseAlphaD')};
        `}

  ${({ isActive, isInvalid }) =>
    isActive &&
    (isInvalid
      ? css`
          &,
          &:hover {
            box-shadow: inset 0 0 0px 1px ${themeVal('color.danger')};
          }
        `
      : css`
          &,
          &:hover {
            box-shadow: inset 0 0 0 1px ${rgba(themeVal('color.link'), 0.48)};
          }
        `)}

  > * {
    align-items: baseline;
  }
`;

const RefReadOnly = styled.span`
  padding: ${glsp(0, 0.25)};
  font-size: 0.75rem;
`;

const Spacer = styled.span`
  visibility: hidden;
  font-size: 0;
`;

export default function Reference(props) {
  const { attributes, htmlAttributes, children, element } = props;
  const focused = useFocused();
  const selected = useSelected();
  const readOnly = useReadOnly();
  const { references, referencesUseIndex } = useRichContext();

  const [isHoverTipVisible, setHoverTipVisible] = useState(focused && selected);

  const reference = references?.length
    ? references.find((ref) => ref.id === element.refId)
    : null;

  const referenceTitle = reference
    ? formatReference(reference) || 'Empty reference'
    : 'Reference not found';

  // The read only version of the references is much simpler that the editor.
  // There's no need to allow selection and the text instead of `ref` shows the
  // index at which the reference appears in the document.
  if (readOnly) {
    const refId = referencesUseIndex?.[element.refId]?.docIndex || 0;
    return (
      <RefReadOnly>
        <Tip tag='span' title={referenceTitle} refId={refId}>
          {`(${formatCitation(reference)})`}
          {children}
        </Tip>
      </RefReadOnly>
    );
  }

  return (
    <Ref
      {...attributes}
      {...htmlAttributes}
      spellCheck={false}
      isActive={focused && selected}
      isInvalid={!reference}
      onMouseEnter={() => setHoverTipVisible(true)}
      onMouseLeave={() => setHoverTipVisible(false)}
    >
      <Tip
        open={(focused && selected) || isHoverTipVisible}
        trigger='manual'
        tag='span'
        title={referenceTitle}
        // The spacer is used to fool the spell checker into thinking that
        // there's a space between the work and the reference indicator.
        // Otherwise this would be read as "wordref" and be marked as
        // misspelled.
      >
        <Spacer> </Spacer>
        ref
        {children}
      </Tip>
    </Ref>
  );
}

Reference.propTypes = {
  attributes: T.object,
  htmlAttributes: T.object,
  element: T.object,
  children: T.node
};
