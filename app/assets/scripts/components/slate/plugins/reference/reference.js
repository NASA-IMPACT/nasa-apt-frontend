import React, { useState } from 'react';
import T from 'prop-types';
import { useFocused, useSelected } from 'slate-react';
import styled, { css } from 'styled-components';
import { glsp, themeVal, rgba } from '@devseed-ui/theme-provider';

import { useRichContext } from '../common/rich-context';
import { formatReference } from '../../../../utils/references';

import Tip from '../../../common/tooltip';

const Ref = styled.span`
  background: ${themeVal('color.baseAlphaB')};
  vertical-align: super;
  padding: ${glsp(0, 0.25)};
  border-radius: ${themeVal('shape.rounded')};
  font-size: 0.75rem;

  ${({ isInvalid }) =>
    isInvalid
      ? css`
          background: ${rgba(themeVal('color.danger'), 0.32)};
        `
      : css`
          background: ${themeVal('color.baseAlphaB')};
        `}

  ${({ isActive, isInvalid }) =>
    isActive &&
    (isInvalid
      ? css`
          box-shadow: inset 0 0 0px 1px ${themeVal('color.danger')};
        `
      : css`
          box-shadow: inset 0 0 0px 1px ${themeVal('color.primary')};
        `)}
`;

const Spacer = styled.span`
  visibility: hidden;
  font-size: 0;
`;

export default function Reference(props) {
  const { attributes, htmlAttributes, children, element } = props;
  const focused = useFocused();
  const selected = useSelected();
  const { references } = useRichContext();

  const [isHoverTipVisible, setHoverTipVisible] = useState(focused && selected);

  const reference = references?.length
    ? references.find((ref) => ref.id === element.refId)
    : null;

  const referenceTitle = reference
    ? formatReference(reference) || 'Empty reference'
    : 'Reference not found';

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
