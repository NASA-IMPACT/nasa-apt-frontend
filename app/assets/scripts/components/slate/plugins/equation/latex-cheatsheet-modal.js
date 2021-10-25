import React, { useCallback } from 'react';
import T from 'prop-types';
import { useSlate } from 'slate-react';
import styled from 'styled-components';
import { InlineMath } from 'react-katex';
import { glsp, multiply, themeVal } from '@devseed-ui/theme-provider';
import { Modal, ModalHeadline } from '@devseed-ui/modal';
import { headingAlt } from '@devseed-ui/typography';

import { CheatSheetSection, CheatSheetSectionTitle } from '../shortcuts-modal';

import { general } from './cheatsheet';

export const ModalSubtitle = styled.p`
  ${headingAlt()}
`;

const Table = styled.table`
  width: 100%;
  max-width: 100%;
  border-color: ${themeVal('color.baseAlphaC')};
  border-collapse: collapse;

  tbody,
  td,
  tfoot,
  th,
  thead,
  tr {
    border-color: inherit;
    border-bottom-color: inherit;
    border-style: solid;
    border-width: 0;
    border-bottom-width: 0px;
  }

  & > *:not(caption) > * > * {
    border-bottom-width: ${themeVal('layout.border')};
  }

  & > :not(:last-child) > :last-child > * {
    border-bottom-width: ${multiply(themeVal('layout.border'), 2)};
  }

  td,
  th {
    padding: ${glsp(1 / 4)};
    vertical-align: top;
    text-align: left;
  }

  th:first-child,
  td:first-child {
    padding-left: ${glsp()};
  }

  th:last-child,
  td:last-child {
    padding-right: ${glsp()};
  }

  /* Table zebra */
  tbody tr:nth-of-type(odd) {
    background: ${themeVal('color.baseAlphaB')};
  }
`;

export function LatexModal() {
  const editor = useSlate();

  const { visible, id } = editor.simpleModal.getData();

  const closeModal = useCallback(() => {
    editor.simpleModal.reset();
  }, [editor]);

  return (
    <Modal
      id='modal'
      size='medium'
      revealed={visible && id === 'latex-modal'}
      onCloseClick={closeModal}
      title='LaTeX cheatsheet'
      renderHeadline={() => (
        <ModalHeadline>
          <h1>LaTeX cheatsheet</h1>
          <ModalSubtitle>
            For a more comprehensive list check this{' '}
            <a
              href='https://kapeli.com/cheat_sheets/LaTeX_Math_Symbols.docset/Contents/Resources/Documents/index'
              title='View latex cheatsheet'
            >
              website
            </a>
            .
          </ModalSubtitle>
        </ModalHeadline>
      )}
      content={
        <CheatSheetSection>
          <CheatSheetSectionTitle>General</CheatSheetSectionTitle>
          <LatexCheatSheet data={general} />
        </CheatSheetSection>
      }
    />
  );
}

LatexModal.propTypes = {};

function LatexCheatSheet(props) {
  const { data } = props;

  return (
    <Table>
      <thead>
        <tr>
          <th>Action</th>
          <th>Example</th>
          <th>Command</th>
        </tr>
      </thead>
      <tbody>
        {data.map((d) => (
          <tr key={d.label}>
            <td>{d.label}</td>
            <td>
              <InlineMath math={d.code} />
            </td>
            <td>
              <code>{d.code}</code>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

LatexCheatSheet.propTypes = {
  data: T.array
};
