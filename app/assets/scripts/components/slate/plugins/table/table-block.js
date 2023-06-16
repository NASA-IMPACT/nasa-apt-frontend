import React from 'react';
import T from 'prop-types';
import styled, { css } from 'styled-components';
import { useSelected, useSlate } from 'slate-react';
import { ELEMENT_TD, findNode } from '@udecode/slate-plugins';
import { themeVal } from '@devseed-ui/theme-provider';

import DeletableBlock from '../common/deletable-block';

/**
 * Renders the styles for the actions that will modify the table.
 *
 * @prop {string} actionName The action to render styles for.
 * @prop {int} columnIdx Index of the selected column
 * @prop {int} rowIdx Index of the selected row
 */
const renderHighlightStyles = (props) => {
  const { actionName, columnIdx, rowIdx } = props;

  switch (actionName) {
    case 'add-row':
      return css`
        tbody > tr:nth-child(${rowIdx + 1}) > td {
          border-bottom: 1px solid ${themeVal('color.primary')};
        }
      `;
    case 'add-column':
      return css`
        tbody > tr > td:nth-child(${columnIdx + 1}) {
          border-right: 1px solid ${themeVal('color.primary')};
        }
      `;
    case 'delete-row':
      return css`
        tbody > tr:nth-child(${rowIdx + 1}) > {
          td {
            border: 1px solid ${themeVal('color.danger')};
            box-shadow: 0 -1px 0 0 ${themeVal('color.danger')};
          }

          td:not(:first-child) {
            border-left: 1px solid ${themeVal('color.baseAlphaE')};
          }

          td:not(:last-child) {
            border-right: 1px solid ${themeVal('color.baseAlphaE')};
          }
        }
      `;
    case 'delete-column':
      return css`
        tbody > tr > td:nth-child(${columnIdx + 1}) {
          border: 1px solid ${themeVal('color.danger')};
          box-shadow: -1px 0 0 0 ${themeVal('color.danger')};
        }
        tbody > tr:not(:first-child) > td:nth-child(${columnIdx + 1}) {
          border-top: 1px solid ${themeVal('color.baseAlphaE')};
        }
        tbody > tr:not(:last-child) > td:nth-child(${columnIdx + 1}) {
          border-bottom: 1px solid ${themeVal('color.baseAlphaE')};
        }
      `;
  }
};

const TableBlockElement = styled(DeletableBlock).attrs({
  forwardedAs: 'figure'
})`
  table {
    margin-top: 0;
    width: 100%;
  }

  tbody td {
    transition: all 0.24s ease-in-out 0s;
    border-color: ${themeVal('color.baseAlphaD')};
    word-break: break-word;
  }

  ${renderHighlightStyles}
`;

export default function TableBlock(props) {
  const { attributes, htmlAttributes, children } = props;

  // actionName
  // columnIdx
  // rowIdx
  const interactionProps = useTableBlockInteractionProps();

  return (
    <TableBlockElement
      deleteAction='delete-table'
      {...attributes}
      {...htmlAttributes}
      {...interactionProps}
    >
      {children}
    </TableBlockElement>
  );
}

TableBlock.propTypes = {
  attributes: T.object,
  htmlAttributes: T.object,
  element: T.object,
  children: T.node
};

/**
 * Returns the props to spread on the element that are needed for the styling
 * according to the user interaction.
 *
 * @param {boolean} obj.isSelected Whether or not the element is selected
 * @param {Editor} obj.editor Slate editor instance.
 */
const useTableBlockInteractionProps = () => {
  const editor = useSlate();
  const isSelected = useSelected();

  if (isSelected && editor.toolbarEvent?.eventType === 'enter') {
    const { item } = editor.toolbarEvent;

    const cell = findNode(editor, { match: { type: ELEMENT_TD } });
    if (cell) {
      const [, cellPath] = cell;
      // The cellPath contains the node path to the TD element. The last value
      // is the TD index which gives us the column and the one before last will
      // give us the row.
      const column = cellPath[cellPath.length - 1];
      const row = cellPath[cellPath.length - 2];

      const actions = ['delete-row', 'add-row', 'delete-column', 'add-column'];

      if (actions.includes(item.id)) {
        return {
          actionName: item.id,
          columnIdx: column,
          rowIdx: row
        };
      }
    }
  }

  // Return nothing to spread.
  return {};
};
