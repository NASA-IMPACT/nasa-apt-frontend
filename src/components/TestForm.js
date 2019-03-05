import React from 'react';
import { connect } from 'react-redux';
import { Editor } from 'slate-react';
import SectionEditor from './SectionEditor';

class TestForm extends React.Component {
  constructor(props) {
    super(props);
    const { test } = props;
    this.state = {
      value: test
    };
    this.onChange = this.onChange.bind(this);
    this.renderNode = this.renderNode.bind(this);
  }

  onChange({ value }) {
    this.setState({ value });
  }

  renderNode(props, editor, next) {
    switch (props.node.type) {
      case 'equation':
        return <SectionEditor {...props} />;
      default:
        return next();
    }
  }

  render() {
    return (
      <Editor
        value={this.state.value}
        onChange={this.onChange}
        renderNode={this.renderNode}
      />
    );
  }
}

const mapStateToProps = (state) => {
  const { test } = state;
  return { test };
};

export default connect(mapStateToProps)(TestForm);
