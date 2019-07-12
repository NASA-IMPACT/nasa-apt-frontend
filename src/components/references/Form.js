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
        <FormGroup>
          <FormGroupHeader>
            <FormLabel htmlFor="authors">Authors</FormLabel>
          </FormGroupHeader>
          <FormGroupBody>
            <FormInput
              id="reference-form-authors"
              name="authors"
              type="text"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.authors}
            />
          </FormGroupBody>
        </FormGroup>
        <FormGroup>
          <FormGroupHeader>
            <FormLabel htmlFor="series">Series</FormLabel>
          </FormGroupHeader>
          <FormGroupBody>
            <FormInput
              id="reference-form-series"
              name="series"
              type="text"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.series}
            />
          </FormGroupBody>
        </FormGroup>
        <FormGroup>
          <FormGroupHeader>
            <FormLabel htmlFor="edition">Edition</FormLabel>
          </FormGroupHeader>
          <FormGroupBody>
            <FormInput
              id="reference-form-edition"
              name="edition"
              type="text"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.edition}
            />
          </FormGroupBody>
        </FormGroup>
        <FormGroup>
          <FormGroupHeader>
            <FormLabel htmlFor="volume">Volume</FormLabel>
          </FormGroupHeader>
          <FormGroupBody>
            <FormInput
              id="reference-form-volume"
              name="volume"
              type="text"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.volume}
            />
          </FormGroupBody>
        </FormGroup>
        <FormGroup>
          <FormGroupHeader>
            <FormLabel htmlFor="issues">Issue</FormLabel>
          </FormGroupHeader>
          <FormGroupBody>
            <FormInput
              id="reference-form-issues"
              name="issues"
              type="text"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.issues}
            />
          </FormGroupBody>
        </FormGroup>
        <FormGroup>
          <FormGroupHeader>
            <FormLabel htmlFor="report_number">Report Number</FormLabel>
          </FormGroupHeader>
          <FormGroupBody>
            <FormInput
              id="reference-form-report_number"
              name="report_number"
              type="text"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.report_number}
            />
          </FormGroupBody>
        </FormGroup>
        <FormGroup>
          <FormGroupHeader>
            <FormLabel htmlFor="publication_place">Publication Place</FormLabel>
          </FormGroupHeader>
          <FormGroupBody>
            <FormInput
              id="reference-form-publication_place"
              name="publication_place"
              type="text"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.publication_place}
            />
          </FormGroupBody>
        </FormGroup>
        <FormGroup>
          <FormGroupHeader>
            <FormLabel htmlFor="publisher">Publisher</FormLabel>
          </FormGroupHeader>
          <FormGroupBody>
            <FormInput
              id="reference-form-publisher"
              name="publisher"
              type="text"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.publisher}
            />
          </FormGroupBody>
        </FormGroup>
        <FormGroup>
          <FormGroupHeader>
            <FormLabel htmlFor="pages">Pages</FormLabel>
          </FormGroupHeader>
          <FormGroupBody>
            <FormInput
              id="reference-form-pages"
              name="pages"
              type="text"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.pages}
            />
          </FormGroupBody>
        </FormGroup>
        <FormGroup>
          <FormGroupHeader>
            <FormLabel htmlFor="isbn">ISBN</FormLabel>
          </FormGroupHeader>
          <FormGroupBody>
            <FormInput
              id="reference-form-isbn"
              name="isbn"
              type="text"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.isbn}
            />
          </FormGroupBody>
        </FormGroup>
        <FormGroup>
          <FormGroupHeader>
            <FormLabel htmlFor="doi">DOI</FormLabel>
          </FormGroupHeader>
          <FormGroupBody>
            <FormInput
              id="reference-form-doi"
              name="doi"
              type="text"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.doi}
            />
          </FormGroupBody>
        </FormGroup>
        <FormGroup>
          <FormGroupHeader>
            <FormLabel htmlFor="online_resource">Online Resource</FormLabel>
          </FormGroupHeader>
          <FormGroupBody>
            <FormInput
              id="reference-form-online_resource"
              name="online_resource"
              type="text"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.online_resource}
            />
          </FormGroupBody>
        </FormGroup>
        <FormGroup>
          <FormGroupHeader>
            <FormLabel htmlFor="other_reference_details">
              Other Reference Details
            </FormLabel>
          </FormGroupHeader>
          <FormGroupBody>
            <FormInput
              id="reference-form-other_reference_details"
              name="other_reference_details"
              type="text"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.other_reference_details}
            />
          </FormGroupBody>
        </FormGroup>
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
  mapPropsToValues: (props) => {
    const initialValues = Object.assign({}, props.initialValues);

    // Replace nulls properties with empty string
    Object.keys(initialValues).forEach((key) => {
      if (!initialValues[key]) initialValues[key] = '';
    });

    return initialValues;
  },
  handleSubmit: (values, { props }) => {
    const { publication_reference_id: id } = props.initialValues;

    // Set properties as null if empty string
    const document = Object.assign({}, values);
    Object.keys(document).forEach((key) => {
      if (document[key] === '') document[key] = null;
    });

    props.updateReference(id, document);
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
