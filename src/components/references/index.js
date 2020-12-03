import React from 'react';
import { PropTypes as T } from 'prop-types';
import { connect } from 'react-redux';
import cloneDeep from 'lodash.clonedeep';

import { Inpage } from '../common/Inpage';
import EditPage, { getAtbdStep } from '../common/EditPage';
import AddBtn from '../../styles/button/add';

import ReferenceFormWrapper from './FormWrapper';
import UploadBibtexModal from './UploadBibtexModal';

import {
  createReference,
  deleteReference,
  updateReference
} from '../../actions/actions';
import apiSchema from '../../schemas/schema.json';
import { confirmDeleteReference } from '../common/ConfirmationPrompt';

export class References extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newReferences: [],
      showUploadBibtexModal: false
    };

    this.addReference = this.addReference.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDeleteNewReference = this.handleDeleteNewReference.bind(this);
    this.deleteNewReference = this.deleteNewReference.bind(this);
    this.deleteExistingReference = this.deleteExistingReference.bind(this);
  }

  addReference() {
    // Get ATBD id and version.
    const { atbdVersion } = this.props;
    const { atbd_version, atbd_id } = atbdVersion;

    // Push a empty reference to newReferences array.
    this.setState(prevState => ({
      newReferences: prevState.newReferences.concat([
        {
          isNew: true,
          timestamp: Date.now(),
          atbd_version,
          atbd_id
        }
      ])
    }));
  }

  async deleteExistingReference(reference) {
    // Show confirmation dialog
    const { result } = await confirmDeleteReference(reference);

    // Do nothing if cancelled
    if (!result) return false;

    // Perform delete
    const { deleteReferenceAction } = this.props;
    deleteReferenceAction(reference.publication_reference_id);
  }

  async handleDeleteNewReference(reference) {
    // Show confirmation dialog
    const { result } = await confirmDeleteReference(reference);

    // Do nothing if cancelled
    if (!result) return false;

    this.deleteNewReference(reference);
  }

  deleteNewReference(reference) {
    // Remove reference from list of new references
    this.setState(prevState => ({
      newReferences: prevState.newReferences.filter(
        r => r.timestamp !== reference.timestamp
      )
    }));
  }

  handleSubmit(values) {
    const { createReferenceAction, updateReferenceAction } = this.props;
    const { publication_reference_id: id } = values;

    const publicationReferenceFields = apiSchema.definitions.publication_references.properties;
    // Create payload made only allowed properties for references
    const payload = Object.keys(publicationReferenceFields).reduce(
      (acc, key) => {
        const value = values[key];
        if (!value || value === '') {
          // Replace empty string with null
          acc[key] = null;
        } else {
          acc[key] = value;
        }
        return acc;
      },
      {}
    );
    if (values.isNew) {
      createReferenceAction(payload);
      this.deleteNewReference(values);
    } else {
      updateReferenceAction(id, payload);
    }
  }

  render() {
    const { atbdVersion, references } = this.props;
    const { newReferences, showUploadBibtexModal } = this.state;
    if (atbdVersion) {
      const { atbd, atbd_id } = atbdVersion;
      const { title, alias } = atbd;
      const { step, stepNum } = getAtbdStep('references');
      return (
        <Inpage>
          <EditPage
            title={title || ''}
            id={atbd_id}
            alias={alias}
            step={stepNum}
          >
            <h2>{step.display}</h2>
            <AddBtn
              glspLeft={-1}
              onClick={() => {
                this.setState({
                  showUploadBibtexModal: true
                });
              }}
            >
              Upload Bibtex file
            </AddBtn>

            <p>
              Please remove any references that are no longer attached to this
              ATBD.
              <br />
              Do not delete any that are currently referenced in any section
              with a <sup>ref</sup> superscript.
            </p>
            {cloneDeep(references)
              .sort(
                (a, b) => a.publication_reference_id - b.publication_reference_id
              )
              .map(d => (
                <ReferenceFormWrapper
                  key={d.publication_reference_id}
                  data={d}
                  handleDeleteReference={this.deleteExistingReference}
                  handleSubmit={this.handleSubmit}
                  submitButton="Update reference"
                />
              ))}
            {newReferences.map(d => (
              <ReferenceFormWrapper
                key={d.timestamp}
                data={d}
                handleDeleteReference={this.handleDeleteNewReference}
                submitButton="Add reference"
                handleSubmit={this.handleSubmit}
              />
            ))}
            {!references.length && <p>No references attached.</p>}
            <AddBtn glspLeft={-2} onClick={this.addReference}>
              Add a reference
            </AddBtn>
          </EditPage>

          <UploadBibtexModal
            isActive={showUploadBibtexModal}
            onCancel={() => {
              this.setState({
                showUploadBibtexModal: false
              });
            }}
          />
        </Inpage>
      );
    }
    return null;
  }
}

References.propTypes = {
  atbdVersion: T.object,
  references: T.array,
  createReferenceAction: T.func,
  deleteReferenceAction: T.func,
  updateReferenceAction: T.func
};

const mapStateToProps = state => ({
  atbdVersion: state.application.atbdVersion,
  references: state.application.references
});

const mapDispatch = {
  createReferenceAction: createReference,
  updateReferenceAction: updateReference,
  deleteReferenceAction: deleteReference
};

export default connect(
  mapStateToProps,
  mapDispatch
)(References);
