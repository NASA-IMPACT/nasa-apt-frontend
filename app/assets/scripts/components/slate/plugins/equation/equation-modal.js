import React, { useCallback } from 'react';
import { useSlate } from 'slate-react';

import { Modal } from '@devseed-ui/modal';
import EquationEditor from './equation-editor';

export function EquationModal() {
  const editor = useSlate();
  const { visible, selection, equation } = editor.equationModal.getData();

  const element = {
    type: 'equation',
    children: [{ text: 'latex~example: e=mc^2' }]
  };

  const closeModal = useCallback(() => {
    editor.equationModal.reset();
  }, [editor]);

  return (
    <Modal
      id='modal'
      size='large'
      revealed={visible}
      onCloseClick={closeModal}
      title='Equation'
      content={<EquationEditor element={element} equation={equation} />}
    />
  );
}
