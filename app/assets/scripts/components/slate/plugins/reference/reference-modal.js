import React from 'react';
import { useSlate } from 'slate-react';
import { Modal } from '@devseed-ui/modal';
import { Button } from '@devseed-ui/button';

import { insertReference } from '.';

export function ReferencesModal() {
  const editor = useSlate();

  const { visible } = editor.referenceModal.getData();

  const onInsertClick = () => {
    insertReference(editor, 1);
    editor.referenceModal.reset();
  };

  return (
    <Modal
      id='modal'
      size='medium'
      revealed={visible}
      onCloseClick={() => editor.referenceModal.reset()}
      title='References'
      content={
        <div>
          <p>Reference modal under development.</p>
          <Button onClick={onInsertClick}>Confirm dummy reference</Button>
          <Button onClick={() => editor.referenceModal.reset()}>Cancel</Button>
        </div>
      }
    />
  );
}

ReferencesModal.propTypes = {};
