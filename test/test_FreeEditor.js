import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import test from 'tape';
import sinon from 'sinon';
import { Value } from 'slate';
import ButtonGroup from '../src/styles/button/group';
import { Toolbar } from '../src/components/Toolbars';

configure({ adapter: new Adapter() });

const proxyquire = require('proxyquire').noCallThru();

test('FreeEditor initial value', (t) => {
  const save = () => true;
  const initialValue = null;
  const { FreeEditor } = proxyquire(
    '../src/components/FreeEditor',
    {
      './EquationEditor': () => (<div />)
    }
  );
  const wrapper = shallow(
    <FreeEditor
      save={save}
      initialValue={initialValue}
    />
  );
  t.equal(wrapper.state().value.getIn(['document', 'nodes']).size, 1,
    'Initializes the editor with a blank document without an initialValue');

  wrapper.setProps({
    initialValue: {
      document: {
        nodes: [{
          object: 'block',
          type: 'paragraph',
          nodes: []
        }, {
          object: 'block',
          type: 'paragraph',
          nodes: []
        }]
      }
    }
  });
  t.equal(wrapper.state().value.getIn(['document', 'nodes']).size, 2,
    'Updates the internal state value when a new inittialValue prop is detected');

  t.end();
});

test('FreeEditor insert buttons enabled', (t) => {
  t.plan(10);
  const save = sinon.spy();
  const initialValue = Value.fromJSON({});
  const { FreeEditor } = proxyquire(
    '../src/components/FreeEditor',
    {
      './EquationEditor': () => (<div />)
    }
  );
  const wrapper = shallow(
    <FreeEditor
      save={save}
      initialValue={initialValue}
      className=""
    />
  );
  const instance = wrapper.instance();
  wrapper.find(Toolbar).shallow()
    .find(ButtonGroup)
    .children()
    .forEach((node) => {
      const { disabled } = node.props();
      t.ok(disabled, 'Tool button disabled');
    });
  instance.onFocus();
  wrapper.update();

  setTimeout(() => {
    wrapper.find(Toolbar).shallow()
      .find(ButtonGroup)
      .children()
      .forEach((node) => {
        const { disabled } = node.props();
        t.notOk(disabled, 'Tool button enabled');
      });
  }, 2);
});
