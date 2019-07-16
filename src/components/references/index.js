import React from 'react';
import { PropTypes as T } from 'prop-types';
import { connect } from 'react-redux';
import cloneDeep from 'lodash.clonedeep';

import { Inpage } from '../common/Inpage';
import EditPage from '../common/EditPage';
import AddButton from '../../styles/button/add';

import ReferenceFormWrapper from './FormWrapper';

import {
  createReference,
  deleteReference,
  updateReference
} from '../../actions/actions';

export class References extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newReferences: []
    };

    this.addReference = this.addReference.bind(this);
    this.deleteExistingReference = this.deleteExistingReference.bind(this);
    this.deleteNewReference = this.deleteNewReference.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
          timestamp: +new Date(),
          atbd_version,
          atbd_id
        }
      ])
    }));
  }

  deleteExistingReference(reference) {
    const { deleteReferenceAction } = this.props;
    deleteReferenceAction(reference.publication_reference_id);
  }

  deleteNewReference(reference) {
    this.setState(prevState => ({
      newReferences: prevState.newReferences.filter(
        r => r.timestamp !== reference.timestamp
      )
    }));
  }

  handleSubmit(values) {
    const { createReferenceAction, updateReferenceAction } = this.props;
    const { publication_reference_id: id } = values;

    const payload = {};

    // Create payload with allowed properties for references
    [
      'atbd_id',
      'atbd_version',
      'authors',
      'doi',
      'edition',
      'isbn',
      'issue',
      'online_resource',
      'other_reference_details',
      'pages',
      'publication_place',
      'publisher',
      'report_number',
      'series',
      'title',
      'volume',
    ].forEach((key) => {
      const value = values[key];
      if (value) {
        // Replace empty string with null
        payload[key] = value !== '' ? value : null;
      }
    });

    if (values.isNew) {
      createReferenceAction(payload);
      this.deleteNewReference(values);
    } else {
      updateReferenceAction(id, payload);
    }
  }

  render() {
    const { atbdVersion, references } = this.props;
    const { newReferences } = this.state;
    if (atbdVersion) {
      const { atbd, atbd_id } = atbdVersion;
      const { title } = atbd;
      return (
        <Inpage>
          <EditPage title={title || ''} id={atbd_id} step={4}>
            <h2>References</h2>
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
                  deleteExistingReference={this.deleteExistingReference}
                  handleSubmit={this.handleSubmit}
                />
              ))}
            {newReferences.map(d => (
              <ReferenceFormWrapper
                key={d.timestamp}
                data={d}
                handleDeleteReference={this.handleDeleteReference}
                handleSubmit={this.handleSubmit}
              />
            ))}
            {!references.length && <p>No references attached.</p>}
            <AddButton variation="base-plain" onClick={this.addReference}>
              Add a reference
            </AddButton>
          </EditPage>
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
