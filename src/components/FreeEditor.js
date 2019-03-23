import React from 'react';
import PropTypes from 'prop-types';
import ImmutableTypes from 'react-immutable-proptypes';
import { Editor } from 'slate-react';
import SoftBreak from 'slate-soft-break';
import PluginDeepTable from 'slate-deep-table';
import styled from 'styled-components/macro';
import EquationEditor from './EquationEditor';
import { Button, Icon, Toolbar } from './Toolbars';
import EditorImage from './EditorImage';
import schema from './editorSchema';

const plugins = [
  SoftBreak(),
  PluginDeepTable()
];

class FreeEditor extends React.Component {
  constructor(props) {
    super(props);
    const { value } = props;
    this.state = { value };
    this.onChange = this.onChange.bind(this);
    this.renderNode = this.renderNode.bind(this);
    this.insertEquation = this.insertEquation.bind(this);
    this.insertParagraph = this.insertParagraph.bind(this);
    this.insertTable = this.insertTable.bind(this);
    this.save = this.save.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { value } = nextProps;
    this.setState({ value });
  }

  onChange({ value }) {
    this.setState({ value });
  }

  save(e) {
    e.preventDefault();
    const { save } = this.props;
    const jsonValue = this.editor.value.toJSON();
    save(jsonValue);
  }

  insertEquation(e) {
    e.preventDefault();
    this.editor
      .insertBlock({
        type: 'equation',
        nodes: [
          {
            object: 'text',
            leaves: [{
              text: '\\',
            }]
          },
        ],
      })
      .focus();
  }

  insertParagraph(e) {
    e.preventDefault();
    this.editor
      .insertBlock({
        type: 'paragraph',
        nodes: [
          {
            object: 'text',
            leaves: [{
              text: '',
            }]
          },
        ],
      })
      .focus();
  }

  insertTable(e) {
    e.preventDefault();
    this.onChange(this.editor.insertTable());
  }

  /* eslint-disable-next-line */
  renderNode(props, editor, next) {
    const { attributes, node, isFocused } = props;
    switch (node.type) {
      case 'equation':
        return <EquationEditor {...props} />;
      case 'image': {
        const src = node.data.get('src');
        return (
          <EditorImage
            isFocused={isFocused}
            src={src}
            {...attributes}
          />
        );
      }
      default:
        return next();
    }
  }

  render() {
    const {
      state: { value },
      insertEquation,
      insertParagraph,
      insertTable,
      save,
      onChange,
      renderNode
    } = this;
    const { className } = this.props;
    return (
      <div className={className}>
        <Toolbar>
          <Button onMouseDown={insertEquation}>
            <Icon>Equation</Icon>
          </Button>
          <Button onMouseDown={insertParagraph}>
            <Icon>Paragraph</Icon>
          </Button>
          <Button onMouseDown={insertTable}>
            <Icon>Table</Icon>
          </Button>
          <Button onClick={save}>
            <Icon>Save</Icon>
          </Button>
        </Toolbar>
        <Editor
          schema={schema}
          ref={editor => (this.editor = editor)}
          value={value}
          onChange={onChange}
          renderNode={renderNode}
          plugins={plugins}
        />
      </div>
    );
  }
}

FreeEditor.propTypes = {
  value: ImmutableTypes.record.isRequired,
  save: PropTypes.func.isRequired,
  className: PropTypes.string.isRequired
};

const StyledFreeEditor = styled(FreeEditor)`
  table {
    width: 100%;
    border-collapse: collapse;
    border-top: 1px solid black;
  }
  table tr {
    border: none;
    border-bottom: 1px solid black;
    border-right: 1px solid black;
  }
  table thead tr {
    background: #f5f5f5;
    font-weight: bold;
  }
  table td {
    border: 1px solid black;
    border-top: none;
    border-bottom: none;
    border-right: none;
    padding: .5em;
    position: relative;
  }
`;

export default StyledFreeEditor;
