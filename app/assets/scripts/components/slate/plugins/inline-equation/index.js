import React from 'react';
import T from 'prop-types';

import { Transforms } from 'slate';
import { getRenderElement } from '@udecode/slate-plugins';

import { modKey } from '../common/utils';
import { InlineMath } from 'react-katex';

export const INLINE_EQUATION = 'inline-equation';

const Preview = ({ element, children, attributes }) => {
  return (
    <span
      contentEditable={false}
      style={{ userSelect: 'none' }}
      onClick={(e) => {
        e.preventDefault();
        alert('clicked');
      }}
      {...attributes}
    >
      <InlineMath math={element.latex || 'latex~empty~equation'} />
      {children}
    </span>
  );
};
Preview.propTypes = {
  element: T.object,
  children: T.object
};

const insertInlineEquation = (editor) => {
  const node = {
    type: INLINE_EQUATION,
    latex: 'e=mc^2',
    children: [{ text: '' }]
  };

  Transforms.insertNodes(editor, node);
};

const onInlineEuqationUse = (editor, buttonId) => {
  switch (buttonId) {
    case INLINE_EQUATION:
      insertInlineEquation(editor);
      break;
  }
};

export const InlineEquationPlugin = {
  voidTypes: [INLINE_EQUATION],
  inlineTypes: [INLINE_EQUATION],
  name: 'Inline LaTeX equation',
  renderElement: getRenderElement({
    type: INLINE_EQUATION,
    component: Preview
  }),
  toolbar: {
    id: INLINE_EQUATION,
    icon: 'pi',
    hotkey: 'mod+L',
    label: 'Inline Equation',
    tip: (key) => `Inline Equation (${modKey(key)})`
  },
  onUse: onInlineEuqationUse
};
