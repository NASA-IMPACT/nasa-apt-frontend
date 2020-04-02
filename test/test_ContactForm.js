import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import test from 'tape';
import sinon from 'sinon';
import { InnerContactForm } from '../src/components/contacts/ContactForm';
import SaveFormButton from '../src/styles/button/save-form';

const proxyquire = require('proxyquire').noCallThru();

configure({ adapter: new Adapter() });

test('InnerContactForm submit disabled', (t) => {
  const props = {
    values: {},
    touched: {
      first_name: true
    },
    errors: {
      last_name: 'error'
    },
    handleChange: () => {},
    handleBlur: () => {},
    handleSubmit: () => {},
    setValues: () => {},
    id: 'x',
    t: {},
    contact: {}
  };
  let wrapper = shallow((<InnerContactForm {...props} />));
  let submit = wrapper.find(SaveFormButton);
  t.ok(submit.props().disabled, 'Submit disabled when there are errors');

  props.errors = {};
  wrapper = shallow((<InnerContactForm {...props} />));
  submit = wrapper.find(SaveFormButton);
  t.notOk(submit.props().disabled, 'Submit enabled when there are no errors');
  t.end();
});

test('ContactForm validation', (t) => {
  const transformErrors = sinon.stub().returns({});
  const validateEmail = sinon.stub().returns(false);
  const email = 'Email';
  const { ContactForm } = proxyquire('../src/components/contacts/ContactForm', {
    '../schemas/utils': { transformErrors, validateEmail },
    '../actions/actions': {
      createContact: () => {}
    }
  });

  const wrapper = shallow((<ContactForm />));
  const instance = wrapper.instance();
  const errors = instance.validate({ mechanisms: [{ mechanism_type: email }] });
  t.ok(errors.mechanisms[0].mechanism_value, 'Adds error when email is invalid');
  t.end();
});
