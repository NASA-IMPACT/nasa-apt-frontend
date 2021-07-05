import React, { useMemo } from 'react';
import T from 'prop-types';
import { Node } from 'slate';

import { ReadEditor } from './editor';
import { RichContextProvider } from './plugins/common/rich-context';
import { IMAGE, IMAGE_BLOCK } from './plugins/image';
import { removeNodeFromSlateDocument } from './nodes-from-slate';

export default class SafeReadEditor extends React.Component {
  static getDerivedStateFromError(error) {
    return { error: error };
  }

  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  render() {
    if (this.state.error) {
      return (
        <p>
          There was an error rendering this content. Structure is likely to be
          invalid.
        </p>
      );
    }

    return <SafeReadEditorComponent {...this.props} />;
  }
}

const SafeReadEditorComponent = (props) => {
  const { value, whenEmpty, context, contextDeps, ...rest } = props;

  const strValue = value?.children
    ? value.children.map((n) => Node.string(n).trim()).join('')
    : '';

  // Remove images that were saved mid-upload resulting in them not being saved
  // correctly. When this happens the image will be left with a "uploading"
  // value, and won't have a objectKey.
  const cleanValue = useMemo(
    () =>
      strValue
        ? removeNodeFromSlateDocument(value, (node) => {
            // Only act on image blocks.
            if (node.type !== IMAGE_BLOCK) return false;
            // That have a image.
            const imgChild = node.children?.[0];

            return (
              imgChild?.type === IMAGE &&
              typeof imgChild?.uploading !== 'undefined'
            );
          })
        : null,
    [strValue, value]
  );

  if (whenEmpty && !strValue) {
    return whenEmpty;
  }
  return (
    <RichContextProvider context={context} contextDeps={contextDeps}>
      <ReadEditor value={cleanValue} {...rest} />
    </RichContextProvider>
  );
};

SafeReadEditorComponent.propTypes = {
  value: T.object,
  context: T.object,
  contextDeps: T.array,
  whenEmpty: T.node
};
