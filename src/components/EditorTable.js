import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components/macro';

import collecticon from '../styles/collecticons';
import { themeVal } from '../styles/utils/general';
import { getClosestNode, getCurrentSelectionRange } from './common/slateEditor/utils';

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

const TableActionsTopRight = styled.div`
  position: absolute;
  right: 0;
  top: -2rem;
  
  ${controlsVisibility}
  transition: visibility 0.12s ease 0s, opacity 0.24s ease 0s;
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

const RemoveBtn = styled(Button).attrs({
  variation: 'base-raised-light',
  size: 'small',
  hideText: true
})`
  ::before {
    ${collecticon('trash-bin')}
  }
`;

const MinusBtn = styled(Button).attrs({
  variation: 'base-raised-light',
  size: 'small',
  hideText: true
})`
  ::before {
    ${collecticon('minus--small')}
  }
`;

const PlusBtn = styled(Button).attrs({
  variation: 'base-raised-light',
  size: 'small',
  hideText: true
})`
  ::before {
    ${collecticon('plus--small')}
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
    if (!td) return null;

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
          <RemoveBtn
            onClick={remove}
            /* eslint-disable-next-line react/jsx-no-bind */
            onMouseOver={this.onMouseOver.bind(this, 'table-remove')}
            /* eslint-disable-next-line react/jsx-no-bind */
            onFocus={this.onMouseOver.bind(this, 'table-remove')}
            onMouseOut={this.onMouseOut}
            onBlur={this.onMouseOut}
          >
            Remove
          </RemoveBtn>
        </TableActionsTopRight>

        <TableActionsTopLeft leftPos={cellDelta.left} isHidden={hidden}>
          <ButtonGroup orientation="horizontal">
            <MinusBtn
              onClick={removeColumn}
              /* eslint-disable-next-line react/jsx-no-bind */
              onMouseOver={this.onMouseOver.bind(this, 'col-remove')}
              /* eslint-disable-next-line react/jsx-no-bind */
              onFocus={this.onMouseOver.bind(this, 'col-remove')}
              onMouseOut={this.onMouseOut}
              onBlur={this.onMouseOut}
            >
              Remove column
            </MinusBtn>
            <PlusBtn
              onClick={insertColumn}
              /* eslint-disable-next-line react/jsx-no-bind */
              onMouseOver={this.onMouseOver.bind(this, 'col-add')}
              /* eslint-disable-next-line react/jsx-no-bind */
              onFocus={this.onMouseOver.bind(this, 'col-add')}
              onMouseOut={this.onMouseOut}
              onBlur={this.onMouseOut}
            >
              Add column
            </PlusBtn>
          </ButtonGroup>
        </TableActionsTopLeft>

        <TableActionsLeft topPos={cellDelta.top} isHidden={hidden}>
          <ButtonGroup orientation="vertical">
            <MinusBtn
              onClick={removeRow}
              /* eslint-disable-next-line react/jsx-no-bind */
              onMouseOver={this.onMouseOver.bind(this, 'row-remove')}
              /* eslint-disable-next-line react/jsx-no-bind */
              onFocus={this.onMouseOver.bind(this, 'row-remove')}
              onMouseOut={this.onMouseOut}
              onBlur={this.onMouseOut}
            >
              Remove row
            </MinusBtn>
            <PlusBtn
              onClick={insertRow}
              /* eslint-disable-next-line react/jsx-no-bind */
              onMouseOver={this.onMouseOver.bind(this, 'row-add')}
              /* eslint-disable-next-line react/jsx-no-bind */
              onFocus={this.onMouseOver.bind(this, 'row-add')}
              onMouseOut={this.onMouseOut}
              onBlur={this.onMouseOut}
            >
              Add row
            </PlusBtn>
          </ButtonGroup>
        </TableActionsLeft>
      </div>
    );
  }

  render() {
    const { attributes, children } = this.props;
    const { rowIdx, cellIdx, action } = this.state;

    return (
      <TableContainer rowIdx={rowIdx} cellIdx={cellIdx} activeAction={action}>
        {this.renderActions()}
        <table ref={this.tableRef}>
          <tbody {...attributes}>{children}</tbody>
        </table>
      </TableContainer>
    );
  }
}

EditorTable.propTypes = {
  children: PropTypes.node,
  attributes: PropTypes.object.isRequired,
  isFocused: PropTypes.bool,
  remove: PropTypes.func.isRequired,
  insertColumn: PropTypes.func.isRequired,
  removeColumn: PropTypes.func.isRequired,
  insertRow: PropTypes.func.isRequired,
  removeRow: PropTypes.func.isRequired
};

export default EditorTable;
