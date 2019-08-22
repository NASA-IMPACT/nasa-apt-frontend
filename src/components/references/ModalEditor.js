import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';
import styled from 'styled-components';

import { createReference, setActiveReference } from '../../actions/actions';

import collecticon from '../../styles/collecticons';
import Button from '../../styles/button/button';
import Form from '../../styles/form/form';
import ReferenceForm from './Form';
import { FormFieldset } from '../../styles/form/fieldset';
import { FormGroup } from '../../styles/form/group';
import { FormHelper, FormHelperMessage } from '../../styles/form/helper';
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
      selectedReference: null,
      newReferenceForm: {
        isValid: false
      }
    };
    this.setModalState = this.setModalState.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
    this.onInsertReference = this.onInsertReference.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { activeReference } = nextProps;
    const { publication_reference_id: id } = activeReference || {};
    this.resetForm(id);
  }

  onSelectChange({ value }) {
    this.setState({
      selectedReference: value
    });
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
      activeModal: !!nextState
    });
  }

  async onInsertReference() {
    // Do nothing when no reference is selected
    const { selectedReference } = this.state;
    if (!selectedReference) return;

    // Get a action methods
    const {
      createReferenceAction,
      setActiveReferenceAction,
      insertReference
    } = this.props;

    // If reference is new
    if (selectedReference === 'NEW') {
      // Get ATBD info
      const { atbdVersion } = this.props;
      const { atbd_version, atbd_id } = atbdVersion;

      // Get form values
      const {
        newReferenceForm: { values }
      } = this.state;

      // Try to create it
      showGlobalLoading();
      const { error, payload } = await createReferenceAction({
        ...values,
        atbd_version,
        atbd_id
      });
      hideGlobalLoading();

      // Insert if successful, otherwise do nothing (error toast should appear)
      if (!error) {
        insertReference(payload);
        this.setModalState(false);
        this.resetForm(null);
      }
    } else {
      // Get existing reference by id
      const { references } = this.props;
      const reference = references.find(
        d => d.publication_reference_id === selectedReference
      );

      // Insert it
      setActiveReferenceAction(null);
      this.resetForm(null);
      insertReference(reference);
      this.setModalState(false);
    }
  }

  render() {
    const { activeModal, selectedReference } = this.state;

    const { setModalState, onSelectChange, onInsertReference } = this;

    const { references, disabled } = this.props;

    const selectOptions = references.map(d => ({
      value: d.publication_reference_id,
      label: d.title
    }));

    selectOptions.unshift({
      value: 'NEW',
      label: 'New reference'
    });

    // Identify "Place" button status
    let insertIsDisabled = true;
    if (selectedReference) {
      // An existing reference is selected
      if (selectedReference !== 'NEW') {
        insertIsDisabled = false;
      } else {
        // A new reference is being created, get validation status
        const { newReferenceForm } = this.state;
        insertIsDisabled = !newReferenceForm.isValid;
      }
    }

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
                    handleFormUpdate={(isValid, values) => {
                      this.setState({
                        newReferenceForm: { isValid, values }
                      });
                    }}
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
                }}
              >
                Cancel
              </ModalCancelButton>
              <PlaceButton
                variation="primary-raised-dark"
                onClick={onInsertReference}
                disabled={insertIsDisabled}
              >
                {selectedReference && selectedReference === 'NEW'
                  ? 'Create and insert at position'
                  : 'Insert at position'}
              </PlaceButton>
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
