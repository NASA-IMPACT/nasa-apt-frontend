import React from 'react';
import T from 'prop-types';
import { Node } from 'slate';

import { ReadEditor } from './editor';

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
  const { value, whenEmpty, ...rest } = props;

  const strValue = value
    ? value.map((n) => Node.string(n).trim()).join('')
    : '';

  if (whenEmpty && !strValue) {
    return whenEmpty;
  }
  return <ReadEditor value={value} {...rest} />;
};

SafeReadEditorComponent.propTypes = {
  value: T.array,
  whenEmpty: T.node
};
