import React, { useCallback } from 'react';
import { useSlate } from 'slate-react';
import styled from 'styled-components';
import { Modal, ModalHeadline } from '@devseed-ui/modal';
import { headingAlt } from '@devseed-ui/typography';

export const ModalSubtitle = styled.p`
  ${headingAlt()}
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
            <a href='http://google.com' title='View latex cheatsheet'>
              website
            </a>
            .
          </ModalSubtitle>
        </ModalHeadline>
      )}
      content={<div>Coming soon.</div>}
    />
  );
}

LatexModal.propTypes = {};
