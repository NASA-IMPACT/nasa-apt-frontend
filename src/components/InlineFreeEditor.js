import React from 'react';
import PropTypes from 'prop-types';
import { Editor } from 'slate-react';
import styled from 'styled-components/macro';

import EditorFormatTextToolbar from './EditorFormatTextToolbar';
import controlSkin from '../styles/form/control-skin';

const EditorContainer = styled.div.attrs({
  size: 'large'
})`
  > div {
    ${controlSkin()}
  }
`;

function renderMark(props, editor, next) {
  const {
    mark: { type },
    children
  } = props;
  switch (type) {
    case 'bold': {
      return <strong {...props}>{children}</strong>;
    }
    case 'italic': {
      return <em {...props}>{children}</em>;
    }
    case 'underline': {
      return <u {...props}>{children}</u>;
    }
    case 'superscript': {
      return <sup {...props}>{children}</sup>;
    }
    case 'subscript': {
      return <sub {...props}>{children}</sub>;
    }
    default: {
      return next();
    }
  }
}

const SingleLineSchema = {
  document: {
    nodes: [
      {
        match: { type: 'paragraph' },
        min: 1,
        max: 1
      },
    ],
  },
  blocks: {
    paragraph: {
      marks: [
        { type: 'superscript' },
        { type: 'subscript' }
      ],
      nodes: [
        { match: { object: 'text' } }
      ]
    },
  }
};

export class InlineFreeEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      range: null
    };
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
    let el = e.target;
    do {
      if (el && el === toolbar) {
        e.preventDefault();
        return;
      }
      el = el.parentNode;
    } while (el && el.tagName !== 'BODY' && el.tagName !== 'HTML');
  }

  onChange(event) {
    const { value } = event;
    const { onChange } = this.props;

    // With until next tick to update range state,
    // as it depends on rendering
    setTimeout(() => {
      const { isFocused } = value.selection;
      const selection = window.getSelection();
      this.setState({
        range:
          isFocused && selection && selection.rangeCount
            ? selection.getRangeAt(0).cloneRange()
            : null
      });
    }, 1);

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
    const { range } = this.state;
    const {
      className,
      id,
      invalid,
      value
    } = this.props;

    return (
      <div
        className={className}
        onMouseDown={onMouseDown}
      >
        <EditorFormatTextToolbar
          value={value}
          range={range}
          toggleMark={this.toggleMark}
          insertLink={() => {}} // noop
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
