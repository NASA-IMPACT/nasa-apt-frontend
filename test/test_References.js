import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import test from 'tape';
import sinon from 'sinon';
import { References } from '../src/components/references';
import apiSchema from '../src/schemas/schema.json';

// const proxyquire = require('proxyquire').noCallThru();
configure({ adapter: new Adapter() });

test('References', (t) => {
  const createReferenceAction = sinon.spy();
  const props = { createReferenceAction };
  const wrapper = shallow((<References {...props} />));
  const instance = wrapper.instance();
  const values = {
    isNew: true,
    publisher: 'test'
  };
  instance.handleSubmit(values);
  const publicationReferenceFields = apiSchema
    .definitions.publication_references.properties;

  const payload = createReferenceAction.firstCall.args[0];
  Object.keys(publicationReferenceFields).forEach((field) => {
    if (field === 'publisher') {
      t.equal(payload[field], 'test', 'Updated value is included in payload');
    } else {
      t.notOk(payload[field], 'All empty fields are converted to null in payload');
    }
  });
  t.end();
});
