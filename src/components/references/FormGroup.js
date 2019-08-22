import React from 'react';
import { PropTypes as T } from 'prop-types';

import FormLabel from '../../styles/form/label';
import FormInput from '../../styles/form/input';
import { FormHelper, FormHelperMessage } from '../../styles/form/helper';
import {
  FormGroup,
  FormGroupHeader,
  FormGroupBody
} from '../../styles/form/group';

export default class ReferenceFormGroup extends React.Component {
  render() {
    const {
      field, values, errors, onChange, onBlur
    } = this.props;
    return (
      <FormGroup>
        <FormGroupHeader>
          <FormLabel htmlFor={field.id}>{field.label}</FormLabel>
        </FormGroupHeader>
        <FormGroupBody>
          <FormInput
            id={`reference-form-${field.id}`}
            name={field.id}
            type="text"
            onChange={onChange}
            onBlur={onBlur}
            value={values[field.id] || ''}
          />
          {errors[field.id] ? (
            <FormHelper>
              <FormHelperMessage>{errors[field.id]}</FormHelperMessage>
            </FormHelper>
          ) : null}
        </FormGroupBody>
      </FormGroup>
    );
  }
}

ReferenceFormGroup.propTypes = {
  field: T.object.isRequired,
  values: T.object.isRequired,
  errors: T.object.isRequired,
  onChange: T.func.isRequired,
  onBlur: T.func.isRequired
};
