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

export class ReferenceFormWrapper extends Component {
  constructor(props) {
    super(props);

    const { data } = props;

    this.state = {
      title: data.title
    };

    this.onReferenceNameChange = this.onReferenceNameChange.bind(this);
    this.onReferenceUpdate = this.onReferenceUpdate.bind(this);
  }

  onReferenceNameChange(e) {
    this.setState({
      title: e.currentTarget.value
    });
  }

  // eslint-disable-next-line
  onReferenceUpdate(e) {
    e.preventDefault();
  }

  render() {
    const { data, index, deleteReferenceAction } = this.props;
    const { publication_reference_id } = data;

    const { title } = this.state;

    return (
      <Form>
        <FormFieldset>
          <FormFieldsetHeader>
            <FormLegend>Ref. {index + 1}</FormLegend>
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
              <FormGroup>
                <FormGroupHeader>
                  <FormLabel htmlFor="reference-title">
                    Reference Name
                  </FormLabel>
                </FormGroupHeader>
                <FormGroupBody>
                  <FormInput
                    type="text"
                    size="large"
                    id="reference-title"
                    placeholder="Enter a title"
                    value={title}
                    readOnly
                  />
                </FormGroupBody>
              </FormGroup>
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
  index: T.number,
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
