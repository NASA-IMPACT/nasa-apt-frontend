import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import get from 'lodash.get';
import { FieldArray } from 'formik';
import { glsp } from '@devseed-ui/theme-provider';
import { FormFieldsetBody } from '@devseed-ui/form';

import { FormikInputText } from '../../common/forms/input-text';
import { FieldMultiItem } from '../../common/forms/field-multi-item';
import { FormikInputSelect } from '../../common/forms/input-select';
import { DeletableFieldset } from '../../common/forms/deletable-fieldset';

import { formString } from '../../../utils/strings';

const ContactDetails = styled.div`
  display: grid;
  grid-gap: ${glsp()};
  grid-template-columns: repeat(3, 1fr);

  & > * {
    height: min-content;

    &:last-child {
      grid-column: auto / span 2;
    }
  }
`;

const DeletableFieldsetMechanisms = styled(DeletableFieldset)`
  ${FormFieldsetBody} {
    grid-template-columns: repeat(2, 1fr);

    & > * {
      height: min-content;
    }
  }
`;

const contactMechanismTypes = [
  'Direct line',
  'Email',
  'Facebook',
  'Fax',
  'Mobile',
  'Modem',
  'Primary',
  'TDD/TTY phone',
  'Telephone',
  'Twitter',
  'U.S.',
  'Other'
].map((m) => ({ value: m, label: m }));

export const emptyContactMechanismValue = {
  mechanism_type: contactMechanismTypes[0].value,
  mechanism_value: ''
};

export const defaultContactValues = {
  first_name: '',
  middle_name: '',
  last_name: '',
  uuid: '',
  url: '',
  mechanisms: [emptyContactMechanismValue]
};

const detailsFields = [
  {
    id: 'first_name',
    label: 'First name',
    required: true
  },
  {
    id: 'middle_name',
    label: 'Middle name'
  },
  {
    id: 'last_name',
    label: 'Last name',
    required: true
  },
  {
    id: 'uuid',
    label: 'UUID'
  },
  {
    id: 'url',
    label: 'URL'
  }
];

export function ContactFormFields(props) {
  const { id: bId, name: bName } = props;

  const baseId = bId ? `${bId}-` : '';
  const baseName = bName ? `${bName}.` : '';

  return (
    <React.Fragment>
      <ContactDetails>
        {detailsFields.map(({ id, label, required }) => (
          <FormikInputText
            key={id}
            id={`${baseId}${id}`}
            name={`${baseName}${id}`}
            label={label}
            labelHint={required ? '(required)' : null}
            description={formString(`contact_information.${id}`)}
          />
        ))}
      </ContactDetails>
      <FieldArray
        name={`${baseName}mechanisms`}
        render={({ remove, push, form, name }) => {
          const fieldValues = get(form.values, name) || [];
          const hasSingleValue = fieldValues.length === 1;
          return (
            <FieldMultiItem
              id={name}
              label='Contact mechanisms'
              description={formString(
                `contact_information.mechanisms.fieldset`
              )}
              onAddClick={() => push(emptyContactMechanismValue)}
            >
              {fieldValues.map((field, index) => (
                <DeletableFieldsetMechanisms
                  /* eslint-disable-next-line react/no-array-index-key */
                  key={index}
                  id={`${name}-${index}`}
                  disableDelete={hasSingleValue}
                  deleteDescription={
                    hasSingleValue ? 'At least one mechanism is required' : null
                  }
                  label={`Entry #${index + 1}`}
                  onDeleteClick={() => remove(index)}
                >
                  <FormikInputSelect
                    id={`${name}-${index}-mechanism_type`}
                    name={`${name}.${index}.mechanism_type`}
                    options={contactMechanismTypes}
                    label='Type'
                    labelHint='(required)'
                    description={formString(
                      `contact_information.mechanisms.mechanism_type`
                    )}
                  />
                  <FormikInputText
                    id={`${name}-${index}-mechanism_value`}
                    name={`${name}.${index}.mechanism_value`}
                    label='Value'
                    labelHint='(required)'
                    description={formString(
                      `contact_information.mechanisms.mechanism_value`
                    )}
                  />
                </DeletableFieldsetMechanisms>
              ))}
            </FieldMultiItem>
          );
        }}
      />
    </React.Fragment>
  );
}

ContactFormFields.propTypes = {
  id: T.string,
  name: T.string
};
