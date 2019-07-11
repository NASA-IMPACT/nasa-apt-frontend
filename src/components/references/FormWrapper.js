import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';

import { deleteReference } from '../../actions/actions';

// General components
import RemoveButton from '../../styles/button/remove';

// Form related components
import ReferenceForm from './Form';
import Form from '../../styles/form/form';
import FormLegend from '../../styles/form/legend';
import { FormFieldset, FormFieldsetHeader } from '../../styles/form/fieldset';

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
            <FormLegend>ID {publication_reference_id}</FormLegend>
            <RemoveButton
              variation="base-plain"
              size="small"
              hideText
              onClick={() => deleteReferenceAction(publication_reference_id)}
            >
              Remove
            </RemoveButton>
          </FormFieldsetHeader>
          <ReferenceForm initialValues={data} />
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
