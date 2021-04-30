import React from 'react';
import T from 'prop-types';
import styled, { css } from 'styled-components';
import { useReadOnly, useSelected, useSlate } from 'slate-react';
import { ELEMENT_TD, findNode } from '@udecode/slate-plugins';
import { glsp, themeVal } from '@devseed-ui/theme-provider';

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
          border-bottom: 2px solid ${themeVal('color.primary')};
        }
      `;
    case 'add-column':
      return css`
        tbody > tr > td:nth-child(${columnIdx + 1}) {
          border-right: 2px solid ${themeVal('color.primary')};
        }
      `;
    case 'delete-row':
      return css`
        tbody > tr:nth-child(${rowIdx + 1}) > {
          td {
            border: 2px solid ${themeVal('color.danger')};
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
          border: 2px solid ${themeVal('color.danger')};
        }
        tbody > tr:not(:first-child) > td:nth-child(${columnIdx + 1}) {
          border-top: 1px solid ${themeVal('color.baseAlphaE')};
        }
        tbody > tr:not(:last-child) > td:nth-child(${columnIdx + 1}) {
          border-bottom: 1px solid ${themeVal('color.baseAlphaE')};
        }
      `;
    case 'delete-table':
      return css`
        &::before {
          box-shadow: inset 0 0 0 1px ${themeVal('color.danger')};
        }
      `;
  }
};

const TableBlockElement = styled.figure`
  position: relative;

  &::before {
    position: absolute;
    top: -${glsp(0.5)};
    right: -${glsp(0.5)};
    bottom: -${glsp(0.5)};
    left: -${glsp(0.5)};
    content: '';
    pointer-events: none;
    background: transparent;
    box-shadow: inset 0 0 0 1px transparent;
    border-radius: ${themeVal('shape.rounded')};
    transition: all 0.24s ease-in-out 0s;
  }

  table {
    margin-top: 0;
  }

  tbody td {
    border-color: ${themeVal('color.baseAlphaD')};
  }

  ${({ isReadOnly }) =>
    !isReadOnly &&
    css`
        &:hover {
          ::before {
            box-shadow: inset 0 0 0 1px ${themeVal('color.baseAlphaC')};
          }
        }
      }
    `}

  ${({ isSelected, isReadOnly }) =>
    !isReadOnly &&
    isSelected &&
    css`
      &,
      &:hover {
        ::before {
          box-shadow: inset 0 0 0 1px ${themeVal('color.baseAlphaE')};
        }
      }
    `}

  & > * {
    margin-bottom: ${glsp()};
  }

  & > *:last-child {
    margin-bottom: 0;
  }

  ${renderHighlightStyles}
`;

const TableBlockElementInner = styled.div`
  overflow-x: auto;
`;

export default function TableBlock(props) {
  const { attributes, htmlAttributes, children } = props;
  const editor = useSlate();
  const isSelected = useSelected();
  const readOnly = useReadOnly();

  const interactionProps = getTableBlockInteractionProps({
    isSelected,
    editor
  });

  return (
    <TableBlockElement
      {...attributes}
      {...htmlAttributes}
      isSelected={isSelected}
      isReadOnly={readOnly}
      {...interactionProps}
    >
      <TableBlockElementInner>{children}</TableBlockElementInner>
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
const getTableBlockInteractionProps = ({ isSelected, editor }) => {
  if (isSelected && editor.toolbarEvent?.eventType === 'enter') {
    const { item } = editor.toolbarEvent;
    if (item.id === 'delete-table') {
      return {
        actionName: item.id
      };
    }

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
