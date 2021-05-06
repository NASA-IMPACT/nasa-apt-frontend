import React, { useCallback } from 'react';
import T from 'prop-types';
import get from 'lodash.get';
import { FieldArray } from 'formik';
import { Button } from '@devseed-ui/button';

import { MultiItemEmpty } from '../../../common/forms/field-multi-item';
import ContactsFieldset from './contact-fieldset';

import { defaultContactValues } from '../../../contacts/edit/contact-form-fields';

// Create a temporary id to use as key in the form.
const getTempId = () => `new-${Math.random().toString(16).slice(2, 6)}`;

const getEmptyContact = (extra = {}) => ({
  ...extra,
  contact: { id: getTempId(), ...defaultContactValues },
  roles: []
});

export default function ContactsList(props) {
  const { contactsList } = props;

  return (
    <FieldArray
      name='contacts_link'
      render={(helpers) => (
        <ContactsLinkRender contactsList={contactsList} {...helpers} />
      )}
    />
  );
}

ContactsList.propTypes = {
  contactsList: T.array
};

const ContactsLinkRender = (props) => {
  const { remove, push, form, name, contactsList } = props;
  const fieldValues = get(form.values, name);

  const onAdd = () => {
    // isSelecting means there's a contact fieldset but no option was selected.
    push(getEmptyContact({ isSelecting: true }));
  };

  const onContactSelect = useCallback(
    (index, option) => {
      const fieldName = `${name}.${index}`;

      // Create and empty contact with default values.
      if (option.value === 'new') {
        const contactLink = getEmptyContact({ isCreating: true });
        form.setFieldValue(fieldName, contactLink);

        // Find the correct contact and copy the values over.
      } else {
        const contact = contactsList.find((o) => o.id === option.value);
        const contactLink = {
          contact: { ...contact },
          roles: []
        };
        form.setFieldValue(fieldName, contactLink);
      }
    },
    [name, contactsList, form]
  );

  // Get the contact select options for a given select combo. The options should
  // be all the contacts available in the system except the ones already
  // selected on other fields. However we have to include the option selected in
  // the field for which we're getting the values, otherwise the field shows
  // blank.
  const getSelectContactOptions = useCallback(
    (contactId) => {
      const selectedOnOtherFields = (fieldValues || [])
        .map((f) => f.contact.id)
        .filter((id) => id !== contactId);

      return contactsList
        .filter((c) => !selectedOnOtherFields.includes(c.id))
        .map((c) => ({
          value: c.id,
          label: `${c.first_name} ${c.last_name}`
        }));
    },
    [fieldValues, contactsList]
  );

  if (!fieldValues?.length) {
    return <ContactsEmpty onClick={onAdd} />;
  }

  return (
    <React.Fragment>
      {fieldValues.map((field, index) => {
        const id = field.contact.id;

        return (
          <ContactsFieldset
            key={id}
            id={id}
            name={name}
            index={index}
            isCreating={field.isCreating}
            contactOptions={getSelectContactOptions(id)}
            onDeleteClick={() => remove(index)}
            onContactSelect={(...args) => onContactSelect(index, ...args)}
          />
        );
      })}
      <div>
        <AddContactButton onClick={onAdd} />
      </div>
    </React.Fragment>
  );
};

ContactsLinkRender.propTypes = {
  remove: T.func,
  push: T.func,
  form: T.object,
  name: T.string,
  contactsList: T.array
};

const AddContactButton = (props) => (
  <Button useIcon='plus--small' onClick={props.onClick}>
    Add new
  </Button>
);

AddContactButton.propTypes = {
  onClick: T.func
};

const ContactsEmpty = (props) => (
  <MultiItemEmpty>
    <p>
      There are no contacts connected to this document. You can start by adding
      one.
    </p>
    <AddContactButton {...props} />
  </MultiItemEmpty>
);
