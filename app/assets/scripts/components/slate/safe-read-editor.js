import React from 'react';
import T from 'prop-types';
import { Node } from 'slate';

import { ReadEditor } from './editor';
import { RichContextProvider } from './plugins/common/rich-context';

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

  if (whenEmpty && !strValue) {
    return whenEmpty;
  }
  return (
    <RichContextProvider context={context} contextDeps={contextDeps}>
      <ReadEditor value={value} {...rest} />
    </RichContextProvider>
  );
};

SafeReadEditorComponent.propTypes = {
  value: T.object,
  context: T.object,
  contextDeps: T.array,
  whenEmpty: T.node
};
