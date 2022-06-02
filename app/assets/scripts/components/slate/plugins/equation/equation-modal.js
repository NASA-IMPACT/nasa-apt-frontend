import React, { useCallback } from 'react';
import { useSlate } from 'slate-react';

import { Modal } from '@devseed-ui/modal';
import EquationEditor from './equation-editor';

export function EquationModal() {
  const editor = useSlate();
  const { visible, element } = editor.equationModal.getData();

  const closeModal = useCallback(() => {
    editor.equationModal.reset();
  }, [editor]);

  const title = `${element ? 'Edit' : 'Insert'} equation`;

  return (
    <Modal
      id='modal'
      size='large'
      revealed={visible}
      onCloseClick={closeModal}
      title={title}
      content={<EquationEditor element={element} />}
    />
  );
}
