import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';
import styled from 'styled-components';

import {
  createReference,
  setLastCreatedReference
} from '../../actions/actions';

import Select from '../common/Select';
import { showGlobalLoading, hideGlobalLoading } from '../common/OverlayLoader';
import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalTitle,
  ModalFooter,
  ModalSaveButton,
  ModalCancelButton
} from '../common/Modal';

import Button from '../../styles/button/button';
import collecticon from '../../styles/collecticons';
import Form from '../../styles/form/form';
import { FormFieldset, FormFieldsetBody } from '../../styles/form/fieldset';
import {
  FormGroup,
  FormGroupHeader,
  FormGroupBody
} from '../../styles/form/group';
import FormLabel from '../../styles/form/label';
import FormInput from '../../styles/form/input';
import { FormHelper, FormHelperMessage } from '../../styles/form/helper';

export const ReferenceBtn = styled(Button)`
  ::before {
    ${collecticon('circle-question')}
  }
`;

const defaultFieldValues = {
  authors: '',
  series: '',
  edition: '',
  volume: '',
  issue: '',
  report_number: '',
  publication_place: '',
  publisher: '',
  pages: '',
  isbn: '',
  doi: '',
  online_resource: '',
  other_reference_details: ''
};

// 'report_number' => 'Report number'
function formatFieldLabel(field) {
  const result = field.split('_');
  result[0] = result[0].charAt(0).toUpperCase() + result[0].slice(1, result[0].length);
  return result.join(' ');
}

export class ReferenceModalEditor extends Component {
  constructor(props) {
    super(props);

    // Those we're calling these 'fields', they are really
    // the optional fields.
    const fields = { ...defaultFieldValues };

    this.state = {
      activeModal: false,
      referenceName: '',
      referenceEmpty: false,
      selectedReference: null,
      selectEmpty: false,
      fields
    };
    this.setModalState = this.setModalState.bind(this);
    this.onReferenceNameChange = this.onReferenceNameChange.bind(this);
    this.onOptionalFieldChange = this.onOptionalFieldChange.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.validate = this.validate.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { lastCreatedReference, onSaveSuccess } = nextProps;
    const { lastCreatedReference: prev } = this.props;
    if (lastCreatedReference !== prev) {
      onSaveSuccess();
      this.resetForm();
      hideGlobalLoading();
    }
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

  onSubmit(e) {
    e.preventDefault();
    const { referenceName, fields, selectedReference } = this.state;

    if (
      !selectedReference
      || (selectedReference === 'NEW' && !referenceName.length)
    ) {
      return this.validate();
    }

    const { references, setLastCreatedReference: setReference } = this.props;

    if (selectedReference !== 'NEW') {
      const reference = references.find(
        d => d.publication_reference_id === selectedReference
      );
      setReference(reference);
    } else {
      const { createReference: create, atbdVersion } = this.props;
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
      showGlobalLoading();
      create(payload);
    }
  }

  resetForm() {
    this.setState({
      activeModal: false,
      referenceName: '',
      referenceEmpty: false,
      fields: { ...defaultFieldValues }
    });
  }

  // For convenience, reset the form value whenever
  // we toggle the modal open, as this is more in line
  // with expected behavior.
  setModalState(nextState) {
    this.setState({
      activeModal: !!nextState,
      referenceName: '',
      referenceEmpty: false,
      fields: { ...defaultFieldValues }
    });
  }

  validate() {
    this.setState(state => ({
      referenceEmpty: !state.referenceName,
      selectEmpty: !state.selectedReference
    }));
  }

  render() {
    const {
      activeModal,
      referenceName,
      referenceEmpty,
      selectedReference,
      selectEmpty,
      fields
    } = this.state;

    const {
      setModalState,
      onReferenceNameChange,
      onOptionalFieldChange,
      onSelectChange,
      validate,
      onSubmit
    } = this;

    const { active, references } = this.props;

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
                  {selectEmpty && (
                  <FormHelper>
                    <FormHelperMessage>
                        Please select a new or existing reference.
                    </FormHelperMessage>
                  </FormHelper>
                  )}
                </FormGroup>

                {selectedReference === 'NEW' && (
                <FormFieldset>
                  <FormFieldsetBody>
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
                          value={referenceName}
                          onChange={onReferenceNameChange}
                          onBlur={validate}
                        />
                        {referenceEmpty && (
                        <FormHelper>
                          <FormHelperMessage>
                                Please enter a reference.
                          </FormHelperMessage>
                        </FormHelper>
                        )}
                      </FormGroupBody>
                    </FormGroup>

                    {Object.keys(fields).map(field => (
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
                            value={fields[field]}
                            onChange={e => onOptionalFieldChange(e, field)}
                            optional
                          />
                        </FormGroupBody>
                      </FormGroup>
                    ))}
                  </FormFieldsetBody>
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
                onClick={() => setModalState(false)}
              >
                Cancel
              </ModalCancelButton>
              <ModalSaveButton
                variation="base-raised-light"
                title="Insert reference"
                onClick={onSubmit}
              >
                Done
              </ModalSaveButton>
            </ModalFooter>
)}
        />

        <ReferenceBtn
          onClick={() => setModalState(true)}
          variation="base-plain"
          size="large"
          active={active}
        >
          Reference
        </ReferenceBtn>
      </Fragment>
    );
  }
}

ReferenceModalEditor.propTypes = {
  onSaveSuccess: T.func,
  createReference: T.func,
  setLastCreatedReference: T.func,
  lastCreatedReference: T.object,
  atbdVersion: T.object,
  references: T.array,
  active: T.bool
};

const mapStateToProps = state => ({
  lastCreatedReference: state.application.lastCreatedReference,
  atbdVersion: state.application.atbdVersion,
  references: state.application.references
});

const mapDispatch = {
  createReference,
  setLastCreatedReference
};

export default connect(
  mapStateToProps,
  mapDispatch
)(ReferenceModalEditor);
