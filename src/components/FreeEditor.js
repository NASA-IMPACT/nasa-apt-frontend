import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Value } from 'slate';
import { Editor } from 'slate-react';
import SoftBreak from 'slate-soft-break';
import PluginDeepTable from 'slate-deep-table';
import styled from 'styled-components/macro';
import { rgba } from 'polished';

import EquationEditor from './EquationEditor';
import TrailingBlock from '../slate-plugins/TrailingBlock';
import {
  EquationBtn,
  ParagraphBtn,
  TableBtn,
  Toolbar,
  ToolbarLabel,
  ULBtn,
  OLBtn
} from './Toolbars';
import EditorImage from './EditorImage';
import EditorTable from './EditorTable';
import EditorFigureTool from './EditorFigureTool';
import ReferenceModalEditor from './references/ModalEditor';
import EditorFormatTextToolbar from './EditorFormatTextToolbar';
import EditorInlineMetadata from './EditorInlineMetadata';
import Button from '../styles/button/button';
import ButtonGroup from '../styles/button/group';
import LinkEditorToolbar from './common/slateEditor/LinkToolbar';

import { getValidOrBlankDocument } from './editorBlankDocument';
import schema from './editorSchema';
import { themeVal, stylizeFunction } from '../styles/utils/general';
import { multiply } from '../styles/utils/math';
import {
  isDescendant,
  getCurrentSelectionRange,
  renderMark
} from './common/slateEditor/utils';

const equation = 'equation';
const paragraph = 'paragraph';
const table = 'table';
const reference = 'reference';
const unorderedList = 'unordered-list';
const orderedList = 'ordered-list';
const listItem = 'list-item';

const _rgba = stylizeFunction(rgba);

const EditorStatus = styled.div`
  border-color: ${props => props.invalid
    ? themeVal('color.danger')
    : _rgba(themeVal('color.base'), 0.16)};
  border-radius: ${themeVal('shape.rounded')};
  border-style: solid;
  border-width: ${props => props.invalid
    ? multiply(themeVal('layout.border'), 2)
    : themeVal('layout.border')};
  margin-bottom: 1rem;
`;

const EditorContainer = styled.div`
  background-color: ${themeVal('color.surface')};
  border-bottom-left-radius: ${themeVal('shape.rounded')};
  border-bottom-right-radius: ${themeVal('shape.rounded')};
  padding: 1rem 3rem;

  p {
    margin-bottom: 1rem;
  }

  ul,
  ol {
    margin-bottom: 1rem;
  }

  ul {
    list-style: disc;
  }

  ol {
    list-style: decimal;
  }
`;

const ReferenceNode = styled.sup`
  margin-left: 0.1rem;
  text-decoration: underline;
  * {
    text-decoration: none;
  }
`;

const plugins = [
  TrailingBlock(),
  SoftBreak({ shift: true }),
  PluginDeepTable()
];

export class FreeEditor extends React.Component {
  constructor(props) {
    super(props);
    const { initialValue } = props;
    this.state = {
      value: Value.fromJSON(getValidOrBlankDocument(initialValue)),
      activeTool: null,
      urlEditorData: {
        enabled: false,
        value: ''
      },
      lastSelectedRange: null
    };
    this.insertColumn = this.insertColumn.bind(this);
    this.insertEquation = this.insertEquation.bind(this);
    this.insertImage = this.insertImage.bind(this);
    this.insertLink = this.insertLink.bind(this);
    this.insertParagraph = this.insertParagraph.bind(this);
    this.insertReference = this.insertReference.bind(this);
    this.insertRow = this.insertRow.bind(this);
    this.insertTable = this.insertTable.bind(this);
    this.insertUnorderedList = this.insertUnorderedList.bind(this);
    this.insertOrderedList = this.insertOrderedList.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.removeColumn = this.removeColumn.bind(this);
    this.removeRow = this.removeRow.bind(this);
    this.removeTable = this.removeTable.bind(this);
    this.renderNode = this.renderNode.bind(this);
    this.save = this.save.bind(this);
    this.selectTool = this.selectTool.bind(this);
    this.toggleMark = this.toggleMark.bind(this);
    this.onFocus = this.onFocus.bind(this);

    this.enableUrlEditor = this.enableUrlEditor.bind(this);
    this.disableUrlEditor = this.disableUrlEditor.bind(this);
    this.onLinkDelete = this.onLinkDelete.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { initialValue } = nextProps;
    const { initialValue: previousInitialValue } = this.props;

    if (initialValue !== previousInitialValue) {
      this.setState({
        value: Value.fromJSON(getValidOrBlankDocument(initialValue))
      });
    }
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

  onKeyDown(event, change, next) {
    const { value } = change;
    // List handling
    if (event.key === 'Enter') {
      const block = value.startBlock;
      const currentItem = block && block.type === listItem ? block : null;
      // Not in a list
      if (!currentItem) {
        return next();
      }
      if (currentItem.text.trim() === '') {
        return change
          .setBlocks(paragraph)
          .unwrapBlock(unorderedList)
          .unwrapBlock(orderedList);
      }
    }
    // List handling END

    if (!event.metaKey) return next();

    let nextMark;
    switch (event.key) {
      case 'b': {
        nextMark = 'bold';
        break;
      }
      case 'i': {
        nextMark = 'italic';
        break;
      }
      case 'u': {
        nextMark = 'underline';
        break;
      }
      default: {
        return next();
      }
    }

    if (nextMark) {
      event.preventDefault();
      this.toggleMark(nextMark);
    }
  }

  onFocus() {
    // Wait one tick to allow editor focus value to get set.
    setTimeout(() => {
      this.setState({
        hasCursor: true
      });
    }, 1);
  }

  onChange(event) {
    const { value } = event;
    this.setState({
      value,
      activeTool: null
    });
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

  selectTool(tool) {
    this.setState((state) => {
      if (state.activeTool === tool) {
        return { activeTool: null };
      }
      return { activeTool: tool };
    });
  }

  save(e) {
    e.preventDefault();
    const { save } = this.props;
    const jsonValue = this.editor.value.toJSON();
    save(jsonValue);
  }

  insertEquation() {
    this.editor
      .insertBlock({
        type: equation,
        nodes: [
          {
            object: 'text',
            leaves: [
              {
                text: '\\'
              }
            ]
          }
        ]
      })
      .focus();
  }

  insertImage(src, caption) {
    this.editor
      .insertBlock({
        type: 'image',
        data: {
          src,
          caption
        }
      })
      .insertBlock({
        type: paragraph,
        nodes: [
          {
            object: 'text',
            leaves: [
              {
                text: ''
              }
            ]
          }
        ]
      });
  }

  insertLink(url) {
    // NextTick to ensure the editor has the correct value.
    setTimeout(() => {
      const { value } = this.state;

      const hasLink = value.inlines.some(inline => inline.type === 'link');

      if (hasLink) {
        this.editor
          .setInlines({
            type: 'link',
            data: { url }
          })
          .focus();
      } else {
        this.editor
          .wrapInline({
            type: 'link',
            data: { url }
          })
          .focus()
          .moveToEnd();
      }
    }, 1);
  }

  insertReference(newReference) {
    const { publication_reference_id: id, title: name } = newReference;
    this.editor
      .insertInline({
        type: reference,
        data: { id, name },
        nodes: [
          {
            object: 'text',
            leaves: [
              {
                // TODO: decide if we want to render something
                // more meaningful than this stand-in.
                text: 'ref'
              }
            ]
          }
        ]
      })
      .focus();
  }

  insertParagraph() {
    this.editor
      .insertBlock({
        type: paragraph,
        nodes: [
          {
            object: 'text',
            leaves: [
              {
                text: ''
              }
            ]
          }
        ]
      })
      .focus();
  }

  insertTable() {
    this.editor.insertTable();
  }

  insertColumn() {
    this.onChange(this.editor.insertColumn());
  }

  insertRow() {
    this.onChange(this.editor.insertRow());
  }

  removeColumn() {
    this.onChange(this.editor.removeColumn());
  }

  removeRow() {
    this.onChange(this.editor.removeRow());
  }

  removeTable() {
    this.onChange(this.editor.removeTable());
  }

  hasBlock(type) {
    const { value } = this.state;
    return value.blocks.some(node => node.type === type);
  }

  insertOrderedList() {
    this.insertList(orderedList);
    this.editor.focus();
  }

  insertUnorderedList() {
    this.insertList(unorderedList);
    this.editor.focus();
  }

  insertList(type) {
    const { editor } = this;
    const { value } = editor;
    const { document } = value;

    const isList = this.hasBlock(listItem);
    const isType = value.blocks.some(
      block => !!document.getClosest(block.key, parent => parent.type === type)
    );

    if (isList && isType) {
      editor
        .setBlocks(paragraph)
        .unwrapBlock(unorderedList)
        .unwrapBlock(orderedList);
    } else if (isList) {
      editor
        .unwrapBlock(type === unorderedList ? orderedList : unorderedList)
        .wrapBlock(type);
    } else {
      editor.setBlocks(listItem).wrapBlock(type);
    }
  }

  isButtonActive(type) {
    let isActive = this.hasBlock(type);

    if ([unorderedList, orderedList].includes(type)) {
      const {
        value: { document, blocks }
      } = this.state;

      if (blocks.size > 0) {
        const parent = document.getParent(blocks.first().key);
        isActive = this.hasBlock(listItem) && parent && parent.type === type;
      }
    }
    return isActive;
  }

  /* eslint-disable-next-line */
  renderNode(props, editor, next) {
    const {
      attributes, children, node, isFocused
    } = props;

    switch (node.type) {
      case 'equation':
        return <EquationEditor {...props} />;
      case 'image': {
        const src = node.data.get('src');
        const caption = node.data.get('caption');
        return (
          <figure>
            <EditorImage isFocused={isFocused} src={src} {...attributes} />
            <figcaption>{caption}</figcaption>
          </figure>
        );
      }
      case 'table': {
        return (
          <EditorTable
            remove={this.removeTable}
            insertRow={this.insertRow}
            removeRow={this.removeRow}
            insertColumn={this.insertColumn}
            removeColumn={this.removeColumn}
            {...props}
          />
        );
      }
      case 'paragraph': {
        return <p {...attributes}>{children}</p>;
      }

      case 'link': {
        const url = node.data.get('url');

        return (
          <a
            href={url}
            rel="noopener noreferrer"
            target="_blank"
            title={url}
            {...attributes}
            onClick={(e) => {
              let range;
              // Create a range selection without actually selecting anything.
              if (document.body.createTextRange) {
                range = document.body.createTextRange();
                range.moveToElementText(e.target);
              } else if (window.getSelection) {
                range = document.createRange();
                range.selectNodeContents(e.target);
              }

              if (range) {
                this.setState({
                  urlEditorData: {
                    enabled: true,
                    value: url
                  },
                  lastSelectedRange: range
                });
              }
            }}
          >
            {children}
          </a>
        );
      }

      case reference: {
        return (
          <ReferenceNode
            data-reference-id={node.data.get('id')}
            {...attributes}
          >
            {children}
          </ReferenceNode>
        );
      }
      case unorderedList:
        return <ul {...attributes}>{children}</ul>;

      case orderedList:
        return <ol {...attributes}>{children}</ol>;

      case listItem:
        return <li {...attributes}>{children}</li>;

      default:
        return next();
    }
  }

  disableUrlEditor() {
    this.setState({
      urlEditorData: {
        enabled: false,
        value: ''
      }
    });
  }

  enableUrlEditor(value = '') {
    this.setState({
      urlEditorData: {
        enabled: true,
        value
      },
      lastSelectedRange: getCurrentSelectionRange()
    });
  }

  onLinkDelete() {
    const {
      urlEditorData: { value }
    } = this.state;
    if (value) {
      setTimeout(() => {
        this.editor.unwrapInline('link');
      }, 1);
    }
    this.disableUrlEditor();
  }

  render() {
    const {
      value, hasCursor, urlEditorData, lastSelectedRange
    } = this.state;

    const {
      save,
      onChange,
      onMouseDown,
      onKeyDown,
      onKeyUp,
      renderNode,
      onFocus
    } = this;

    const { className, inlineSaveBtn, invalid } = this.props;

    const { isFocused } = value.selection;
    const range = isFocused ? getCurrentSelectionRange() : null;

    return (
      <div className={className} onMouseDown={onMouseDown}>
        <EditorFormatTextToolbar
          value={value}
          range={range}
          onButtonClick={which => which === 'link' ? this.enableUrlEditor() : this.toggleMark(which)
          }
        />
        {urlEditorData.enabled && (
          <LinkEditorToolbar
            onCancel={this.disableUrlEditor}
            onConfirm={(url) => {
              if (url.trim()) this.insertLink(url);
              this.disableUrlEditor();
            }}
            onDelete={this.onLinkDelete}
            value={urlEditorData.value}
            range={lastSelectedRange}
          />
        )}
        <EditorInlineMetadata value={value} />
        <EditorStatus invalid={invalid}>
          <Toolbar>
            <ToolbarLabel>Insert</ToolbarLabel>
            <ButtonGroup orientation="horizontal">
              <EquationBtn
                id={equation}
                onClick={this.insertEquation}
                disabled={!hasCursor}
              >
                Equation
              </EquationBtn>

              <ParagraphBtn
                id={paragraph}
                onClick={this.insertParagraph}
                disabled={!hasCursor}
              >
                Paragraph
              </ParagraphBtn>

              <TableBtn
                id={table}
                onClick={this.insertTable}
                disabled={!hasCursor}
              >
                Table
              </TableBtn>

              <EditorFigureTool
                disabled={!hasCursor}
                onSaveSuccess={(uploadedFile, caption) => {
                  this.insertImage(uploadedFile, caption);
                }}
              />

              <ReferenceModalEditor
                disabled={!hasCursor}
                insertReference={this.insertReference}
              />

              <ULBtn
                id={unorderedList}
                active={this.isButtonActive(unorderedList)}
                onClick={this.insertUnorderedList}
                disabled={!hasCursor}
              >
                Unordered list
              </ULBtn>

              <OLBtn
                id={orderedList}
                active={this.isButtonActive(orderedList)}
                onClick={this.insertOrderedList}
                disabled={!hasCursor}
              >
                Ordered list
              </OLBtn>

              {inlineSaveBtn && (
                <Button onClick={save} variation="base-plain" size="large">
                  Save
                </Button>
              )}
            </ButtonGroup>
          </Toolbar>
          <EditorContainer>
            <Editor
              ref={editorValue => (this.editor = editorValue)}
              schema={schema}
              value={value}
              onChange={onChange}
              onKeyDown={onKeyDown}
              onKeyUp={onKeyUp}
              onFocus={onFocus}
              renderNode={renderNode}
              renderMark={renderMark}
              plugins={plugins}
            />
          </EditorContainer>
        </EditorStatus>
        {!inlineSaveBtn && (
          <Button onClick={save} variation="base-raised-light" size="large">
            Save
          </Button>
        )}
      </div>
    );
  }
}

FreeEditor.propTypes = {
  initialValue: PropTypes.object,
  save: PropTypes.func.isRequired,
  className: PropTypes.string,
  lastCreatedReference: PropTypes.object,
  inlineSaveBtn: PropTypes.bool,
  invalid: PropTypes.bool
};

const StyledFreeEditor = styled(FreeEditor)`
  table {
    width: 100%;
    border-collapse: collapse;
    border-top: 1px solid ${themeVal('color.gray')};
    margin-bottom: ${themeVal('layout.space')};
    table-layout: fixed;
  }
  table tr {
    border: none;
    border-bottom: 1px solid ${themeVal('color.gray')};
    border-right: 1px solid ${themeVal('color.gray')};
  }
  table thead tr {
    background: #f5f5f5;
    font-weight: bold;
  }
  table td {
    border: 1px solid ${themeVal('color.gray')};
    border-top: none;
    border-bottom: none;
    border-right: none;
    line-height: 1;
    padding: 0.5rem;
    position: relative;
  }
`;

const mapStateToProps = (state) => {
  const { lastCreatedReference } = state.application;
  return { lastCreatedReference };
};

export default connect(
  mapStateToProps,
  null
)(StyledFreeEditor);
