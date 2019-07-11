import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';
import styled from 'styled-components';

import { deleteReference } from '../../actions/actions';

// General components
import collecticon from '../../styles/collecticons';
import Button from '../../styles/button/button';
import RemoveButton from '../../styles/button/remove';

// Form related components
import Form from '../../styles/form/form';
import FormLegend from '../../styles/form/legend';
import FormLabel from '../../styles/form/label';
import FormInput from '../../styles/form/input';
import {
  FormGroup,
  FormGroupHeader,
  FormGroupBody
} from '../../styles/form/group';
import {
  FormFieldset,
  FormFieldsetHeader,
  FormFieldsetBody
} from '../../styles/form/fieldset';

// Styled components
export const ReferenceBtn = styled(Button)`
  ::before {
    ${collecticon('circle-question')}
  }
`;
const ReferencesFormFieldsLayout = styled.div`
  display: grid;
  align-items: start;
  grid-gap: 1rem;
  grid-template-columns: repeat(3, 1fr);
  justify-content: space-between;
  width: 100%;
`;

// Helper function
function formatFieldLabel(field) {
  if (field === 'isbn' || field === 'doi') return field.toUpperCase();

  const result = field.split('_');
  result[0] = result[0].charAt(0).toUpperCase() + result[0].slice(1, result[0].length);
  return result.join(' ');
}

export class ReferenceFormWrapper extends Component {
  constructor(props) {
    super(props);
    this.onReferenceUpdate = this.onReferenceUpdate.bind(this);
  }

  // eslint-disable-next-line
  onReferenceUpdate(e) {
    e.preventDefault();
  }

  render() {
    const { data, deleteReferenceAction } = this.props;
    const { publication_reference_id } = data;

    return (
      <Form>
        <FormFieldset>
          <FormFieldsetHeader>
            <FormLegend>Ref. {publication_reference_id}</FormLegend>
            <RemoveButton
              variation="base-plain"
              size="small"
              hideText
              onClick={() => deleteReferenceAction(publication_reference_id)}
            >
              Remove
            </RemoveButton>
          </FormFieldsetHeader>
          <FormFieldsetBody>
            <ReferencesFormFieldsLayout>
              {Object.keys(data).map(field => (
                <FormGroup key={field}>
                  <FormGroupHeader>
                    <FormLabel htmlFor={`reference-form-${field}`}>
                      {formatFieldLabel(field)}
                    </FormLabel>
                  </FormGroupHeader>
                  <FormGroupBody>
                    <FormInput
                      id={`reference-form-${field}`}
                      name={`reference-form-${field}`}
                      key={`reference-form-${field}`}
                      type="text"
                      value={data[field]}
                      readOnly
                    />
                  </FormGroupBody>
                </FormGroup>
              ))}
            </ReferencesFormFieldsLayout>
            <Button
              type="submit"
              variation="base-raised-light"
              size="large"
              disabled
              onClick={this.onReferenceUpdate}
            >
              Update reference
            </Button>
          </FormFieldsetBody>
        </FormFieldset>
      </Form>
    );
  }
}

ReferenceFormWrapper.propTypes = {
  data: T.object,
  deleteReferenceAction: T.func
};

const mapStateToProps = () => ({});

const mapDispatch = {
  deleteReferenceAction: deleteReference
};

export default connect(
  mapStateToProps,
  mapDispatch
)(ReferenceFormWrapper);
