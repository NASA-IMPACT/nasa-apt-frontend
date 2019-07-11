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
import { FormFieldset, FormFieldsetHeader } from '../../styles/form/fieldset';
import FormLegend from '../../styles/form/legend';

// Styled components
export const ReferenceBtn = styled(Button)`
  ::before {
    ${collecticon('circle-question')}
  }
`;

export class ReferenceFormWrapper extends Component {
  render() {
    const { data, index, deleteReferenceAction } = this.props;
    const { publication_reference_id, title } = data;

    return (
      <Form key={index}>
        <FormFieldset>
          <FormFieldsetHeader>
            <FormLegend>
              {index + 1}. {title}
            </FormLegend>
            <RemoveButton
              variation="base-plain"
              size="small"
              hideText
              onClick={() => deleteReferenceAction(publication_reference_id)}
            >
              Remove
            </RemoveButton>
          </FormFieldsetHeader>
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
