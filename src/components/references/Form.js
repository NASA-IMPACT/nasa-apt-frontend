import React from 'react';
import { PropTypes as T } from 'prop-types';
import { withFormik } from 'formik';
import styled from 'styled-components';
import isEqual from 'lodash.isequal';

import ValidationSchema from './ValidationSchema';

// General components
import Button from '../../styles/button/button';

// Form components
import { FormFieldsetBody } from '../../styles/form/fieldset';
import FormGroup from './FormGroup';

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
class InnerForm extends React.Component {
  componentDidUpdate(prevProps) {
    // Do nothing if "handleFormUpdate" is undefined. This function is intended
    // to handle form submit from the parent component.
    const { handleFormUpdate } = this.props;
    if (typeof handleFormUpdate === 'undefined') return;

    // Do not perform changes when validating
    const { isValidating } = this.props;
    if (isValidating) return;

    // Identify changes and apply then with "handleFormUpdate"
    const { isValid: prevIsValid, values: prevValues } = prevProps;
    const { isValid, values } = this.props;
    if (prevIsValid !== isValid || !isEqual(prevValues, values)) {
      handleFormUpdate(isValid, values);
    }
  }

  render() {
    const {
      errors,
      handleBlur,
      handleChange,
      handleSubmit,
      submitButton,
      isValid,
      values
    } = this.props;

    const renderFormGroup = field => (
      <FormGroup
        key={field.id}
        field={field}
        onChange={handleChange}
        onBlur={handleBlur}
        values={values}
        errors={errors}
      />
    );

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
              id: 'year',
              label: 'Year'
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
        {submitButton && (
          <Button
            title={submitButton}
            type="submit"
            variation="base-raised-light"
            size="large"
            onClick={handleSubmit}
            disabled={!isValid}
          >
            {submitButton}
          </Button>
        )}
      </FormFieldsetBody>
    );
  }
}

InnerForm.propTypes = {
  errors: T.object.isRequired,
  handleBlur: T.func.isRequired,
  handleChange: T.func.isRequired,
  handleFormUpdate: T.func,
  handleSubmit: T.func.isRequired,
  isValid: T.bool.isRequired,
  isValidating: T.bool,
  submitButton: T.string,
  values: T.object.isRequired
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

export default ReferenceForm;
