import React from 'react';
import T from 'prop-types';
import { ReactEditor } from 'slate-react';
import { Transforms } from 'slate';
import { errorToast } from '../../../common/toasts';
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

function readFileAsDataURL(data) {
  const fileReader = new FileReader();
  const promise = new Promise((resolve, reject) => {
    fileReader.onload = () => resolve(fileReader.result);
    fileReader.onerror = reject;
  });

  fileReader.readAsDataURL(data);
  return promise;
}

function readImage(data) {
  const img = document.createElement('img');
  const promise = new Promise((resolve, reject) => {
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
  img.src = data;
  return promise;
}

async function reduceImageSize(imageFile) {
  const dataAsUrl = await readFileAsDataURL(imageFile);
  const img = await readImage(dataAsUrl);

  const targetWidth = 2480;
  const aspectRatio = img.width / img.height;

  const canvas = document.createElement('canvas');
  canvas.width = Math.min(targetWidth, img.width);
  canvas.height = canvas.width / aspectRatio;

  const context = canvas.getContext('2d');
  if (!context) {
    return imageFile;
  }
  context.drawImage(img, 0, 0, canvas.width, canvas.height);

  const blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, 'image/jpeg', 0.7)
  );

  const reducedFile = blob ? new File([blob], imageFile.name) : undefined;

  // jpeg is not always the best to represent the image
  // So, it might be larger than original image
  if (reducedFile && reducedFile.size < imageFile.size) {
    return reducedFile;
  }

  return imageFile;
}

export default function ToolbarImageButton(props) {
  const { editor, item } = props;
  const { atbd } = useRichContext();
  const { token } = useAuthToken();

  // NOTE: This element is not implementing the mouse enter and leave events,
  // meaning that editor.toolbarEvent won't be usable for this item.

  const onFileSelect = async (originalFile) => {
    const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
    if (!validImageTypes.includes(originalFile.type)) {
      errorToast(`Invalid image format. Please use GIF, PNG or JPEG`);
      return;
    }

    const file = await reduceImageSize(originalFile);

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
      errorToast(`Image upload failed: ${msg}`);
      // Upload failed, remove the image node completely, if it exists.
      removeNodeIfExists(editor, imageBlockNode);
    }
  };

  return (
    <Tip title={item.tip(item.hotkey)}>
      <FauxFileDialog name='image-file' onFileSelect={onFileSelect}>
        {(fieProps) => (
          <ToolbarIconButton
            useIcon={item.icon}
            disabled={
              !ReactEditor.isFocused(editor) || item.isDisabled?.(editor)
            }
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
