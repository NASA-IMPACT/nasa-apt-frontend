import React, { useCallback, useEffect, useState } from 'react';
import { useSlate } from 'slate-react';
import { Node } from 'slate';

import { Modal } from '@devseed-ui/modal';
import { Button } from '@devseed-ui/button';
import EquationEditor from './equation-editor';
import {
  deleteEquation,
  insertEquation,
  isInlineEquation,
  updateEquation
} from '.';

export function EquationModal() {
  const editor = useSlate();
  const { visible, element } = editor.equationModal.getData();

  const initEquation = element ? Node.string(element) : 'latex~empty~equation';
  const initInline = element ? isInlineEquation(element) : false;

  const [latexEquation, setLatexEquation] = useState(initEquation);
  const [isInline, setIsInline] = useState(initInline);

  // Reset on model open.
  useEffect(
    () => visible && setLatexEquation(initEquation),
    [visible, initEquation]
  );
  useEffect(() => visible && setIsInline(initInline), [visible, initInline]);

  const closeModal = useCallback(() => {
    editor.equationModal.reset();
  }, [editor]);

  const onEquationEditorChange = useCallback(({ equation, isInline }) => {
    setLatexEquation(equation);
    setIsInline(isInline);
  }, []);

  const handleSave = () => {
    if (element) {
      updateEquation(editor, latexEquation, isInline, element);
    } else {
      insertEquation(editor, latexEquation, isInline);
    }
    closeModal();
  };

  const handleDelete = () => {
    deleteEquation(editor);
    closeModal();
  };

  const title = `${element ? 'Edit' : 'Insert'} equation`;

  return (
    <Modal
      id='modal'
      size='large'
      revealed={visible}
      onCloseClick={closeModal}
      title={title}
      content={
        <EquationEditor
          hasEquation={!!element}
          isInline={isInline}
          latexEquation={latexEquation}
          onChange={onEquationEditorChange}
        />
      }
      footerContent={
        <React.Fragment>
          {element && (
            <Button type='button' useIcon='trash-bin' onClick={handleDelete}>
              Delete
            </Button>
          )}
          <Button
            type='button'
            variation='base-raised-light'
            useIcon='xmark--small'
            onClick={closeModal}
          >
            Cancel
          </Button>
          <Button
            type='button'
            variation='primary-raised-dark'
            useIcon='tick--small'
            onClick={handleSave}
          >
            {element ? 'Update' : 'Insert'}
          </Button>
        </React.Fragment>
      }
    />
  );
}
