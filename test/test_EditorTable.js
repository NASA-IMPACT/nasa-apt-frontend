import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import test from 'tape';
import EditorTable from '../src/components/EditorTable';

configure({ adapter: new Adapter() });

test('EditorTable table header option', (t) => {
  const props = {
    remove: () => true,
    insertRow: () => true,
    removeRow: () => true,
    insertColumn: () => true,
    removeColumn: () => true,
    children: ['a', 'b', 'c'],
    attributes: {}
  };
  const wrapper = shallow(<EditorTable {...props} />);
  t.equal(wrapper.find('thead').length, 0,
    'Table is rendered without header');

  t.end();
});
