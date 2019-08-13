import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';
import styled from 'styled-components';

import { createReference, setActiveReference } from '../../actions/actions';

import Select from '../common/Select';
import { showGlobalLoading, hideGlobalLoading } from '../common/OverlayLoader';
import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalTitle,
  ModalFooter,
  ModalCancelButton
} from '../common/Modal';

import Button from '../../styles/button/button';
import collecticon from '../../styles/collecticons';
import Form from '../../styles/form/form';

import { FormFieldset } from '../../styles/form/fieldset';
import { FormGroup } from '../../styles/form/group';
import { FormHelper, FormHelperMessage } from '../../styles/form/helper';

import ReferenceForm from './Form';

export const ReferenceBtn = styled(Button)`
  ::before {
    ${collecticon('circle-question')}
  }
`;

export const PlaceButton = styled(Button)`
  ::before {
    ${collecticon('tick--small')}
  }
`;

export class ReferenceModalEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeModal: false,
      referenceName: '',
      selectedReference: null
    };
    this.setModalState = this.setModalState.bind(this);
    this.onReferenceNameChange = this.onReferenceNameChange.bind(this);
    this.onOptionalFieldChange = this.onOptionalFieldChange.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onInsertReference = this.onInsertReference.bind(this);
    this.createAndInsertReference = this.createAndInsertReference.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { activeReference } = nextProps;
    const { publication_reference_id: id } = activeReference || {};
    this.resetForm(id);
  }

  onReferenceNameChange(e) {
    this.setState({
      referenceName: e.currentTarget.value
    });
  }

  onOptionalFieldChange(e, fieldName) {
    const { fields } = this.state;
    this.setState({
      fields: {
        ...fields,
        [fieldName]: e.currentTarget.value
      }
    });
  }

  onSelectChange({ value }) {
    this.setState({
      selectedReference: value
    });
  }

  onInsertReference() {
    const {
      insertReference,
      references,
      setActiveReferenceAction
    } = this.props;
    const { selectedReference } = this.state;
    const reference = references.find(
      d => d.publication_reference_id === selectedReference
    );
    setActiveReferenceAction(null);
    this.resetForm(null);
    insertReference(reference);
    this.setModalState(false);
  }

  onSubmit(e) {
    e.preventDefault();
    const { referenceName, fields, selectedReference } = this.state;

    if (
      !selectedReference
      || (selectedReference === 'NEW' && !referenceName.length)
    ) {
      return this.validate();
    }

    const { createReferenceAction: create, atbdVersion } = this.props;
    const { atbd_id, atbd_version } = atbdVersion;
    const payload = {
      atbd_id,
      atbd_version,
      title: referenceName
    };
    Object.keys(fields).forEach((field) => {
      if (fields[field]) {
        payload[field] = fields[field];
      }
    });
    create(payload);
  }

  resetForm(selectedReference) {
    this.setState({
      selectedReference
    });
  }

  // For convenience, reset the form value whenever
  // we toggle the modal open, as this is more in line
  // with expected behavior.
  setModalState(nextState) {
    this.setState({
      activeModal: !!nextState,
      referenceName: ''
    });
  }

  async createAndInsertReference(formValues) {
    const { createReferenceAction, atbdVersion, insertReference } = this.props;

    const { atbd_version, atbd_id } = atbdVersion;
    showGlobalLoading();
    const { error, payload } = await createReferenceAction({
      ...formValues,
      atbd_version,
      atbd_id
    });
    hideGlobalLoading();
    if (!error) {
      insertReference(payload);
      this.setModalState(false);
      this.resetForm(null);
    }
  }

  render() {
    const { activeModal, selectedReference } = this.state;

    const {
      setModalState,
      onSelectChange,
      onInsertReference
    } = this;

    const { references, disabled } = this.props;

    const selectOptions = references.map(d => ({
      value: d.publication_reference_id,
      label: d.title
    }));

    selectOptions.unshift({
      value: 'NEW',
      label: 'New reference'
    });

    return (
      <Fragment>
        <Modal
          id="reference-editor"
          size="large"
          revealed={activeModal}
          onCloseClick={() => setModalState(false)}
          onOverlayClick={() => setModalState(false)}
          headerComponent={(
            <ModalHeader>
              <ModalTitle>Insert a reference</ModalTitle>
            </ModalHeader>
)}
          bodyComponent={(
            <ModalBody>
              <Form>
                <FormGroup>
                  <Select
                    name="reference-new-existing-select"
                    id="reference-new-existing-select"
                    label="Select existing or create new:"
                    options={selectOptions}
                    value={selectedReference}
                    onChange={onSelectChange}
                  />
                  {!selectedReference && (
                  <FormHelper>
                    <FormHelperMessage>
                        Please select a new or existing reference.
                    </FormHelperMessage>
                  </FormHelper>
                  )}
                </FormGroup>
                {selectedReference === 'NEW' && (
                <FormFieldset>
                  <ReferenceForm
                    data={{
                      isNew: true,
                      timestamp: Date.now()
                    }}
                    submitButton="Create and insert reference"
                    handleSubmit={this.createAndInsertReference}
                  />
                </FormFieldset>
                )}
              </Form>
            </ModalBody>
)}
          footerComponent={(
            <ModalFooter>
              <ModalCancelButton
                variation="base-raised-light"
                title="Cancel action"
                onClick={() => {
                  setModalState(false);
                  // resetForm(null);
                }}
              >
                Cancel
              </ModalCancelButton>
              {selectedReference && selectedReference !== 'NEW' && (
              <PlaceButton
                variation="primary-raised-dark"
                onClick={onInsertReference}
                disabled={!selectedReference || selectedReference === 'NEW'}
              >
                  Insert at position
              </PlaceButton>
              )}
            </ModalFooter>
)}
        />

        <ReferenceBtn
          onClick={() => setModalState(true)}
          variation="base-plain"
          size="large"
          disabled={disabled}
        >
          Reference
        </ReferenceBtn>
      </Fragment>
    );
  }
}

ReferenceModalEditor.propTypes = {
  createReferenceAction: T.func,
  setActiveReferenceAction: T.func,
  insertReference: T.func,
  activeReference: T.object,
  atbdVersion: T.object,
  references: T.array,
  disabled: T.bool
};

const mapStateToProps = state => ({
  activeReference: state.application.activeReference,
  atbdVersion: state.application.atbdVersion,
  references: state.application.references
});

const mapDispatch = {
  createReferenceAction: createReference,
  setActiveReferenceAction: setActiveReference
};

export default connect(
  mapStateToProps,
  mapDispatch
)(ReferenceModalEditor);
