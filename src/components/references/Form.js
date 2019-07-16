import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withFormik } from 'formik';
import styled from 'styled-components';

import ValidationSchema from './ValidationSchema';

// General components
import Button from '../../styles/button/button';

// Form components
import FormLabel from '../../styles/form/label';
import FormInput from '../../styles/form/input';
import { FormFieldsetBody } from '../../styles/form/fieldset';
import { FormHelper, FormHelperMessage } from '../../styles/form/helper';
import {
  FormGroup,
  FormGroupHeader,
  FormGroupBody
} from '../../styles/form/group';

// Styled components
const SpanThree = styled.div`
  grid-column-start: span 3;
`;

const FieldsLayout = styled.div`
  display: grid;
  align-items: start;
  grid-gap: 1rem;
  grid-template-columns: repeat(3, 1fr);
  justify-content: space-between;
  width: 100%;
`;

const InnerForm = (props) => {
  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    errors,
    isValid
  } = props;

  const { isNew } = values;

  const renderFormGroup = field => (
    <FormGroup key={field.id}>
      <FormGroupHeader>
        <FormLabel htmlFor={field.id}>{field.label}</FormLabel>
      </FormGroupHeader>
      <FormGroupBody>
        <FormInput
          id={`reference-form-${field.id}`}
          name={field.id}
          type="text"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values[field.id]}
        />
        {errors[field.id] ? (
          <FormHelper>
            <FormHelperMessage>{errors[field.id]}</FormHelperMessage>
          </FormHelper>
        ) : null}
      </FormGroupBody>
    </FormGroup>
  );

  const buttonLabel = isNew ? 'Add new reference' : 'Update reference';

  return (
    <FormFieldsetBody>
      <FieldsLayout>
        <SpanThree>
          {renderFormGroup({ id: 'title', label: 'Title' })}
        </SpanThree>
        {[
          {
            id: 'authors',
            label: 'Authors'
          },
          {
            id: 'series',
            label: 'Series'
          },
          {
            id: 'edition',
            label: 'Edition'
          },
          {
            id: 'volume',
            label: 'Volume'
          },
          {
            id: 'issue',
            label: 'Issue'
          },
          {
            id: 'report_number',
            label: 'Report Number'
          },
          {
            id: 'publication_place',
            label: 'Publication Place'
          },
          {
            id: 'publisher',
            label: 'Publisher'
          },
          {
            id: 'pages',
            label: 'Pages'
          },
          {
            id: 'isbn',
            label: 'ISBN'
          },
          {
            id: 'doi',
            label: 'DOI'
          },
          {
            id: 'online_resource',
            label: 'Online Resource'
          },
          {
            id: 'other_reference_details',
            label: 'Other Reference Details'
          }
        ].map(renderFormGroup)}
      </FieldsLayout>
      <Button
        title={buttonLabel}
        type="submit"
        variation="base-raised-light"
        size="large"
        onClick={handleSubmit}
        disabled={!isValid}
      >
        {buttonLabel}
      </Button>
    </FormFieldsetBody>
  );
};

InnerForm.propTypes = {
  values: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  isValid: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired
};

const ReferenceForm = withFormik({
  validationSchema: ValidationSchema,
  mapPropsToValues: (props) => {
    const initialValues = Object.assign({}, props.initialValues);

    // Replace nulls properties with empty string
    Object.keys(initialValues).forEach((key) => {
      if (!initialValues[key]) initialValues[key] = '';
    });

    return initialValues;
  },
  handleSubmit: (values, { props }) => {
    props.handleSubmit(values);
  }
})(InnerForm);

const mapStateToProps = () => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReferenceForm);
