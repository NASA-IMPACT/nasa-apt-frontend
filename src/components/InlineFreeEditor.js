import React from 'react';
import PropTypes from 'prop-types';
import { Editor } from 'slate-react';
import styled from 'styled-components/macro';

import EditorFormatTextToolbar from './EditorFormatTextToolbar';
import controlSkin from '../styles/form/control-skin';
import {
  isDescendant,
  getCurrentSelectionRange,
  renderMark
} from './common/slateEditor/utils';

const EditorContainer = styled.div.attrs({
  size: 'large'
})`
  > div {
    ${controlSkin()}
  }
`;

const SingleLineSchema = {
  document: {
    nodes: [
      {
        match: { type: 'paragraph' },
        min: 1,
        max: 1
      }
    ]
  },
  blocks: {
    paragraph: {
      marks: [{ type: 'superscript' }, { type: 'subscript' }],
      nodes: [{ match: { object: 'text' } }]
    }
  }
};

export class InlineFreeEditor extends React.Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.toggleMark = this.toggleMark.bind(this);
  }

  /* eslint-disable-next-line */
  onMouseDown(e) {
    // The following block verifies if the event is coming from the toolbar
    // by checking if toolbar container (#format-toolbar) is a parent element
    // of target node. If so, it executes e.preventsDefault() to avoid losing
    // focus of selected text.
    const toolbar = document.querySelector('#format-toolbar');
    if (isDescendant(e.target, toolbar)) {
      e.preventDefault();
    }
  }

  onChange({ value }) {
    const { onChange } = this.props;
    onChange(value);
  }

  toggleMark(nextMark) {
    // Ensure sub/superscript are not applied at the same time
    if (nextMark === 'superscript') {
      this.editor.removeMark('subscript');
    } else if (nextMark === 'subscript') {
      this.editor.removeMark('superscript');
    }
    // Apply toggle
    this.editor.toggleMark(nextMark);
  }

  render() {
    const { onChange, onMouseDown } = this;
    const {
      className, id, invalid, value
    } = this.props;

    const { isFocused } = value.selection;
    const range = isFocused ? getCurrentSelectionRange() : null;

    return (
      <div className={className} onMouseDown={onMouseDown}>
        <EditorFormatTextToolbar
          value={value}
          range={range}
          onButtonClick={which => this.toggleMark(which)}
          activeFormatters={['subscript', 'superscript']}
        />
        <EditorContainer invalid={invalid}>
          <Editor
            id={id}
            schema={SingleLineSchema}
            ref={editorValue => (this.editor = editorValue)}
            value={value}
            onChange={onChange}
            renderMark={renderMark}
          />
        </EditorContainer>
      </div>
    );
  }
}

InlineFreeEditor.propTypes = {
  value: PropTypes.object,
  id: PropTypes.string,
  className: PropTypes.string,
  invalid: PropTypes.bool,
  onChange: PropTypes.func
};

export default InlineFreeEditor;
