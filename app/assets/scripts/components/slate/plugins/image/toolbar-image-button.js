import React from 'react';
import T from 'prop-types';
import { ReactEditor } from 'slate-react';
import { Transforms } from 'slate';
import { toast } from 'react-toastify';
import { ToolbarIconButton } from '@devseed-ui/toolbar';

import Tip from '../../../common/tooltip';
import { FauxFileDialog } from '../../../common/faux-file-dialog';

import { useRichContext } from '../common/rich-context';
import { useAuthToken } from '../../../../context/user';
import { axiosAPI } from '../../../../utils/axios';
import { insertImageBlock } from './helpers';
import { round } from '../../../../utils/format';
import { imageApiUrl } from '../../../../utils/url-creator';

// Try to update the image node. If it was deleted just fail silently.
const updateNodeIfExists = (editor, node, data) => {
  try {
    const path = ReactEditor.findPath(editor, node);
    Transforms.setNodes(editor, data, { at: path });
  } catch (error) {
    // Node was not found. Ignore.
    /* eslint-disable-next-line no-console */
    console.warn('Node not found', error);
  }
};

// Try to update the image node. If it was deleted just fail silently.
const removeNodeIfExists = (editor, node) => {
  try {
    const path = ReactEditor.findPath(editor, node);
    Transforms.removeNodes(editor, { at: path });
  } catch (error) {
    // Node was not found. Ignore.
    /* eslint-disable-next-line no-console */
    console.warn('Node not found', error);
  }
};

export default function ToolbarImageButton(props) {
  const { editor, item } = props;
  const { atbd } = useRichContext();
  const { token } = useAuthToken();

  // NOTE: This element is not implementing the mouse enter and leave events,
  // meaning that editor.toolbarEvent won't be usable for this item.

  const onFileSelect = async (file) => {
    const imageBlockNode = insertImageBlock(editor);
    const imageNode = imageBlockNode?.children[0];

    const formData = new FormData();
    formData.append('file', file);

    const randId = Math.random().toString(16).slice(2, 8);
    const cleanFileName = file.name.toLowerCase().replace(/[^a-z0-9-_.]/g, '-');
    const objectKey = `${randId}-${cleanFileName}`;

    try {
      await axiosAPI({
        url: imageApiUrl(atbd, objectKey),
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
        method: 'post',
        data: formData,
        onUploadProgress: function ({ total, loaded }) {
          const percent = round((loaded / total) * 100, 0);
          updateNodeIfExists(editor, imageNode, { uploading: percent });
        }
      });

      // Upload succeeded.
      updateNodeIfExists(editor, imageNode, {
        uploading: null,
        objectKey: objectKey
      });
    } catch (error) {
      const msg = error.response?.data?.detail || error.message;
      toast.error(`Image upload failed: ${msg}`);
      // Upload failed, remove the image node completely, if it exists.
      removeNodeIfExists(editor, imageBlockNode);
    }
  };

  return (
    <Tip title={item.tip(item.hotkey)}>
      <FauxFileDialog name='bibtex-file' onFileSelect={onFileSelect}>
        {(fieProps) => (
          <ToolbarIconButton
            useIcon={item.icon}
            disabled={item.isDisabled?.(editor)}
            {...fieProps}
          >
            {item.label}
          </ToolbarIconButton>
        )}
      </FauxFileDialog>
    </Tip>
  );
}

ToolbarImageButton.propTypes = {
  plugin: T.object,
  editor: T.object,
  item: T.object,
  buttonProps: T.object
};
