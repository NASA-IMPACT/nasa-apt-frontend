import React from 'react';
import styled from 'styled-components';
import T from 'prop-types';
import { glsp } from '@devseed-ui/theme-provider';

import FormGroupStructure from '../../../common/forms/form-group-structure';
import { FormikInputCheckable } from '../../../common/forms/input-checkable';
import { DeletableFieldset } from '../../../common/forms/deletable-fieldset';
import { ContactFormFields } from '../../../contacts/edit/contact-form-fields';
import SelectCombo, {
  SELECT_COMBO_NEW
} from '../../../common/forms/select-combo';

import { formString } from '../../../../utils/strings';

const RolesGroup = styled.div`
  display: grid;
  grid-gap: ${glsp()};
  grid-template-columns: repeat(3, 1fr);
`;

const roleTypes = [
  'Data center contact',
  'Technical contact',
  'Science contact',
  'Investigator',
  'Metadata author',
  'User services',
  'Science software development'
];

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
            description={formString(`contacts.roles`)}
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
