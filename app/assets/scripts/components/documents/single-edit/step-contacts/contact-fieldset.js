import React from 'react';
import styled from 'styled-components';
import T from 'prop-types';
import get from 'lodash.get';
import { glsp } from '@devseed-ui/theme-provider';

import FormGroupStructure from '../../../common/forms/form-group-structure';
import { FormikInputCheckable } from '../../../common/forms/input-checkable';
import { DeletableFieldset } from '../../../common/forms/deletable-fieldset';
import { ContactFormFields } from '../../../contacts/edit/contact-form-fields';
import SelectCombo, {
  SELECT_COMBO_NEW
} from '../../../common/forms/select-combo';

import { formString } from '../../../../utils/strings';
import { FieldArray } from 'formik';
import { FieldMultiItem } from '../../../common/forms/field-multi-item';
import { FormikInputText } from '../../../common/forms/input-text';

const RolesGroup = styled.div`
  display: grid;
  grid-gap: ${glsp()};
  grid-template-columns: repeat(3, 1fr);
`;

const roleTypes = [
  'Writing – original draft',
  'Writing – review & editing',
  'Validation',
  'Data curation',
  'Conceptualization',
  'Methodology',
  'Visualization',
  'Formal analysis',
  'Software',
  'Resources',
  'Project administration',
  'Supervision',
  'Investigation',
  'Funding acquisition',
  'Corresponding Author',
  'Document Reviewer'
];

const emptyAffiliation = '';

export default function ContactsFieldset(props) {
  const {
    id,
    name,
    index,
    isCreating,
    contactOptions,
    onDeleteClick,
    onContactSelect
  } = props;

  const selectVal = isCreating
    ? SELECT_COMBO_NEW
    : contactOptions.find((o) => o.value === id);

  return (
    <DeletableFieldset
      key={id}
      id={`${name}.${index}`}
      label={`Contact #${index + 1}`}
      onDeleteClick={onDeleteClick}
    >
      <SelectCombo
        value={selectVal}
        options={contactOptions}
        onChange={onContactSelect}
      />
      {selectVal && (
        <React.Fragment>
          <ContactFormFields
            id={`${name}-${index}-contact`}
            name={`${name}.${index}.contact`}
          />
          <FormGroupStructure
            id={`${name}-${index}-roles`}
            name={`${name}.${index}.roles`}
            label='Roles related to this document'
            description={formString(`contact_information.roles`)}
          >
            <RolesGroup>
              {roleTypes.map((role, roleIdx) => (
                <FormikInputCheckable
                  key={role}
                  type='checkbox'
                  id={`${name}-${index}-roles-${roleIdx}`}
                  name={`${name}.${index}.roles`}
                  value={role}
                >
                  {role}
                </FormikInputCheckable>
              ))}
            </RolesGroup>
          </FormGroupStructure>
          <FieldArray
            name={`${name}.${index}.affiliations`} // will be affFieldName
            render={({ remove, push, form, name: affFieldName }) => {
              const fieldValues = get(form.values, affFieldName) || [];
              return (
                <FieldMultiItem
                  id={affFieldName}
                  label='Affiliations relevant to this document'
                  description={formString(
                    `contact_information.affiliations.fieldset`
                  )}
                  emptyMessage='There are no affiliations. You can start by adding one.'
                  onAddClick={() => push(emptyAffiliation)}
                >
                  {fieldValues.map((field, index) => (
                    <DeletableFieldset
                      /* eslint-disable-next-line react/no-array-index-key */
                      key={index}
                      id={`${affFieldName}-${index}`}
                      label={`Entry #${index + 1}`}
                      onDeleteClick={() => remove(index)}
                    >
                      <FormikInputText
                        id={`${affFieldName}-${index}`}
                        name={`${affFieldName}.${index}`}
                        label='Name'
                        labelHint='(required)'
                        description={formString(
                          `contact_information.affiliations.name`
                        )}
                      />
                    </DeletableFieldset>
                  ))}
                </FieldMultiItem>
              );
            }}
          />
        </React.Fragment>
      )}
    </DeletableFieldset>
  );
}

ContactsFieldset.propTypes = {
  id: T.oneOfType([T.string, T.number]),
  name: T.string,
  index: T.number,
  isCreating: T.bool,
  contactOptions: T.array,
  onDeleteClick: T.func,
  onContactSelect: T.func
};
