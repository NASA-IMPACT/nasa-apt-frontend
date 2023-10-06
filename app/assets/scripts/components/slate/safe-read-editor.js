import React, { useMemo } from 'react';
import T from 'prop-types';

import { ReadEditor } from './editor';
import { RichContextProvider } from './plugins/common/rich-context';
import { IMAGE } from './plugins/image';
import { removeNodeFromSlateDocument } from './nodes-from-slate';
import serializeToString from './serialize-to-string';
import { isTruthyString } from '../../utils/common';
import { IMAGE_BLOCK } from './plugins/constants';

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
        <p className={this.props.className}>
          There was an error rendering this content. Structure is likely to be
          invalid.
        </p>
      );
    }

    return <SafeReadEditorComponent {...this.props} />;
  }
}

SafeReadEditor.propTypes = {
  className: T.string
};

const SafeReadEditorComponent = (props) => {
  const { value, whenEmpty = null, context, contextDeps, ...rest } = props;

  const strValue = value?.children
    ? value.children.map((n) => serializeToString(n).trim()).join('')
    : '';

  // Remove images that were saved mid-upload resulting in them not being saved
  // correctly. When this happens the image will be left with a "uploading"
  // value, and won't have a objectKey.
  const cleanValue = useMemo(
    () =>
      isTruthyString(strValue)
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

  if (!isTruthyString(strValue)) {
    return whenEmpty;
  }

  return (
    <RichContextProvider context={context} contextDeps={contextDeps}>
      <ReadEditor value={cleanValue} {...rest} />
    </RichContextProvider>
  );
};

SafeReadEditorComponent.propTypes = {
  className: T.string,
  value: T.object,
  context: T.object,
  contextDeps: T.array,
  whenEmpty: T.node
};
