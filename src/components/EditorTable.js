import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components/macro';

import collecticon from '../styles/collecticons';
import { themeVal } from '../styles/utils/general';
import { getClosestNode, getCurrentSelectionRange } from './common/slateEditor/utils';
import { glsp } from '../styles/utils/theme-values';

import Button from '../styles/button/button';
import ButtonGroup from '../styles/button/group';


const controlsVisibility = ({ isHidden }) => isHidden
  ? css`
    visibility: hidden;
    opacity: 0;
  `
  : css`
    visibility: visible;
    opacity: 1;
  `;

const controlsTableHighlights = ({
  rowIdx,
  cellIdx,
  activeAction
}) => {
  switch (activeAction) {
    case 'row-add':
      return css`
        tbody > tr:nth-child(${rowIdx + 1}) > td {
          border-bottom: 2px solid ${themeVal('color.primary')};
        }
      `;
    case 'col-add':
      return css`
        tbody > tr > td:nth-child(${cellIdx + 1}) {
          border-right: 2px solid ${themeVal('color.primary')};
        }
      `;
    case 'row-remove':
      return css`
        tbody > tr:nth-child(${rowIdx + 1}) > {
          td {
            border: 2px solid ${themeVal('color.danger')};
          }

          td:not(:first-child) {
            border-left: 1px solid ${themeVal('color.gray')};
          }

          td:not(:last-child) {
            border-right: 1px solid ${themeVal('color.gray')};
          }
        }
      `;
    case 'col-remove':
      return css`
        tbody > tr > td:nth-child(${cellIdx + 1}) {
          border: 2px solid ${themeVal('color.danger')};
        }
        tbody > tr:not(:first-child) > td:nth-child(${cellIdx + 1}) {
          border-top: 1px solid ${themeVal('color.gray')};
        }
        tbody > tr:not(:last-child) > td:nth-child(${cellIdx + 1}) {
          border-bottom: 1px solid ${themeVal('color.gray')};
        }
      `;
    case 'table-remove':
      return css`
        tbody > tr > {
          td:first-child {
            border-left: 2px solid ${themeVal('color.danger')};
          }
          td:last-child {
            border-right: 2px solid ${themeVal('color.danger')};
          }
        }

        tbody > tr:first-child > td {
          border-top: 2px solid ${themeVal('color.danger')};
        }

        tbody > tr:last-child > td {
          border-bottom: 2px solid ${themeVal('color.danger')};
        }
      `;
    default:
      return null;
  }
};

const TableContainer = styled.div`
  position: relative;
  ${controlsTableHighlights}
`;

const TableCaption = styled.p`
  font-style: italic;
  text-align: center;
`;

const TableActionsTopRight = styled.div`
  position: absolute;
  right: 0;
  top: -2rem;
  
  ${controlsVisibility}
  transition: visibility 0.12s ease 0s, opacity 0.24s ease 0s;

  > *:not(:last-child) {
    margin-right: ${glsp(0.5)};
  }
`;

const TableActionsTopLeft = styled.div`
  position: absolute;
  left: ${({ leftPos }) => leftPos}px;
  top: -2rem;
  
  ${controlsVisibility}
  transition: visibility 0.12s ease 0s, opacity 0.24s ease 0s, left 0.24s ease 0s;
`;

const TableActionsLeft = styled.div`
  position: absolute;
  top: ${({ topPos }) => topPos}px;
  left: -2rem;
  height: 100%;

  ${controlsVisibility}
  transition: visibility 0.12s ease 0s, opacity 0.24s ease 0s, top 0.24s ease 0s;
`;

const SmallBtn = styled(Button).attrs(props => ({
  variation: 'base-raised-light',
  size: 'small',
  hideText: props.hideText !== undefined
    ? props.hideText
    : true
}))`
  ::before {
    ${({ useIcon }) => collecticon(useIcon)}
  }
`;

class EditorTable extends React.Component {
  constructor(props) {
    super(props);

    this.tableRef = React.createRef();

    this.state = {
      rowIdx: null,
      cellIdx: null,
      action: null
    };

    this.onMouseOut = this.onMouseOut.bind(this);
    this.editCaption = this.editCaption.bind(this);
  }


  getCurrentCell() {
    const { isFocused } = this.props;

    if (!isFocused) return null;
    const range = getCurrentSelectionRange();

    if (!range || !range.collapsed) return null;

    const rangeNode = range.startContainer.parentElement;
    return getClosestNode(rangeNode, 'td');
  }

  getCurrentCellDelta() {
    const td = this.getCurrentCell();
    if (!td || !this.tableRef.current) return null;

    const tablePos = this.tableRef.current.getBoundingClientRect();
    const tdPos = td.getBoundingClientRect();
    return {
      top: tdPos.top - tablePos.top,
      left: tdPos.left - tablePos.left,
    };
  }

  onMouseOver(what) {
    const td = this.getCurrentCell();
    this.setState({
      rowIdx: td.parentNode.rowIndex,
      cellIdx: td.cellIndex,
      action: what
    });
  }

  onMouseOut() {
    this.setState({
      rowIdx: null,
      cellIdx: null,
      action: null
    });
  }

  editCaption() {
    const { editor, node } = this.props;
    const currentValue = node.data.get('caption');
    const caption = window.prompt('Insert caption', currentValue);
    if (caption !== null) {
      editor.setNodeByKey(node.key, { data: { caption: caption.trim() } });
    }
  }

  renderActions() {
    const {
      remove,
      insertColumn,
      removeColumn,
      insertRow,
      removeRow
    } = this.props;

    let cellDelta = this.getCurrentCellDelta();
    const hidden = !cellDelta;

    cellDelta = cellDelta || {
      top: 0,
      left: 0
    };

    return (
      <div contentEditable={false}>
        <TableActionsTopRight isHidden={hidden}>
          <SmallBtn
            useIcon="trash-bin"
            onClick={(e) => { this.onMouseOut(); remove(e); }}
            /* eslint-disable-next-line react/jsx-no-bind */
            onMouseOver={this.onMouseOver.bind(this, 'table-remove')}
            /* eslint-disable-next-line react/jsx-no-bind */
            onFocus={this.onMouseOver.bind(this, 'table-remove')}
            onMouseOut={this.onMouseOut}
            onBlur={this.onMouseOut}
          >
            Remove
          </SmallBtn>
          <SmallBtn
            useIcon="pencil"
            hideText={false}
            onClick={() => { this.editCaption(); }}
          >
            Caption
          </SmallBtn>
        </TableActionsTopRight>

        <TableActionsTopLeft leftPos={cellDelta.left} isHidden={hidden}>
          <ButtonGroup orientation="horizontal">
            <SmallBtn
              useIcon="minus--small"
              onClick={(e) => { this.onMouseOut(); removeColumn(e); }}
              /* eslint-disable-next-line react/jsx-no-bind */
              onMouseOver={this.onMouseOver.bind(this, 'col-remove')}
              /* eslint-disable-next-line react/jsx-no-bind */
              onFocus={this.onMouseOver.bind(this, 'col-remove')}
              onMouseOut={this.onMouseOut}
              onBlur={this.onMouseOut}
            >
              Remove column
            </SmallBtn>
            <SmallBtn
              useIcon="plus--small"
              onClick={(e) => { this.onMouseOut(); insertColumn(e); }}
              /* eslint-disable-next-line react/jsx-no-bind */
              onMouseOver={this.onMouseOver.bind(this, 'col-add')}
              /* eslint-disable-next-line react/jsx-no-bind */
              onFocus={this.onMouseOver.bind(this, 'col-add')}
              onMouseOut={this.onMouseOut}
              onBlur={this.onMouseOut}
            >
              Add column
            </SmallBtn>
          </ButtonGroup>
        </TableActionsTopLeft>

        <TableActionsLeft topPos={cellDelta.top} isHidden={hidden}>
          <ButtonGroup orientation="vertical">
            <SmallBtn
              useIcon="minus--small"
              onClick={(e) => { this.onMouseOut(); removeRow(e); }}
              /* eslint-disable-next-line react/jsx-no-bind */
              onMouseOver={this.onMouseOver.bind(this, 'row-remove')}
              /* eslint-disable-next-line react/jsx-no-bind */
              onFocus={this.onMouseOver.bind(this, 'row-remove')}
              onMouseOut={this.onMouseOut}
              onBlur={this.onMouseOut}
            >
              Remove row
            </SmallBtn>
            <SmallBtn
              useIcon="plus--small"
              onClick={(e) => { this.onMouseOut(); insertRow(e); }}
              /* eslint-disable-next-line react/jsx-no-bind */
              onMouseOver={this.onMouseOver.bind(this, 'row-add')}
              /* eslint-disable-next-line react/jsx-no-bind */
              onFocus={this.onMouseOver.bind(this, 'row-add')}
              onMouseOut={this.onMouseOut}
              onBlur={this.onMouseOut}
            >
              Add row
            </SmallBtn>
          </ButtonGroup>
        </TableActionsLeft>
      </div>
    );
  }

  render() {
    const { attributes, children, node } = this.props;
    const { rowIdx, cellIdx, action } = this.state;
    const caption = node.data.get('caption');

    return (
      <TableContainer rowIdx={rowIdx} cellIdx={cellIdx} activeAction={action}>
        {this.renderActions()}
        <table ref={this.tableRef}>
          <tbody {...attributes}>{children}</tbody>
        </table>
        {caption && <TableCaption contentEditable={false}>{caption}</TableCaption>}
      </TableContainer>
    );
  }
}

EditorTable.propTypes = {
  editor: PropTypes.object,
  children: PropTypes.node,
  node: PropTypes.object,
  attributes: PropTypes.object.isRequired,
  isFocused: PropTypes.bool,
  remove: PropTypes.func.isRequired,
  insertColumn: PropTypes.func.isRequired,
  removeColumn: PropTypes.func.isRequired,
  insertRow: PropTypes.func.isRequired,
  removeRow: PropTypes.func.isRequired
};

export default EditorTable;
