import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withFormik } from 'formik';
import styled from 'styled-components';

// Actions
import { updateReference } from '../../actions/actions';

// General components
import Button from '../../styles/button/button';

// Form components
import FormLabel from '../../styles/form/label';
import FormInput from '../../styles/form/input';
import { FormFieldsetBody } from '../../styles/form/fieldset';
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
    values, handleChange, handleBlur, handleSubmit
  } = props;

  return (
    <FormFieldsetBody>
      <FieldsLayout>
        <SpanThree>
          <FormGroup>
            <FormGroupHeader>
              <FormLabel htmlFor="title">Title</FormLabel>
            </FormGroupHeader>
            <FormGroupBody>
              <FormInput
                id="reference-form-title"
                name="title"
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.title}
              />
            </FormGroupBody>
          </FormGroup>
        </SpanThree>
      </FieldsLayout>
      <Button
        type="submit"
        variation="base-raised-light"
        size="large"
        onClick={handleSubmit}
      >
        Update reference
      </Button>
    </FormFieldsetBody>
  );
};

InnerForm.propTypes = {
  values: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired
};

const ReferenceForm = withFormik({
  mapPropsToValues: props => ({ ...props.initialValues }),
  handleSubmit: (values, { props }) => {
    const { publication_reference_id: id } = props.initialValues;
    props.updateReference(id, values);
  }
})(InnerForm);

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  updateReference
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReferenceForm);
