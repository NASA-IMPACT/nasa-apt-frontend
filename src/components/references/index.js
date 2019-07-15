import React from 'react';
import { PropTypes as T } from 'prop-types';
import { connect } from 'react-redux';

import { Inpage } from '../common/Inpage';
import EditPage from '../common/EditPage';
import AddButton from '../../styles/button/add';

import ReferenceFormWrapper from './FormWrapper';

import { deleteReference } from '../../actions/actions';

export class References extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newReferences: []
    };

    this.addReference = this.addReference.bind(this);
    this.handleDeleteReference = this.handleDeleteReference.bind(this);
  }

  addReference() {
    // Push a empty reference to newReferences array.
    // Set a timestamp as .
    this.setState(prevState => ({
      newReferences: prevState.newReferences.concat([
        {
          isNew: true,
          timestamp: +new Date()
        }
      ])
    }));
  }

  handleDeleteReference(reference) {
    if (typeof reference.publication_reference_id !== 'undefined') {
      // Is a existing reference
      const { deleteReferenceAction } = this.props;
      deleteReferenceAction(reference.publication_reference_id);
    } else {
      // Is a new reference
      this.setState(prevState => ({
        newReferences: prevState.newReferences.filter(
          r => r.timestamp !== reference.timestamp
        )
      }));
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
            {references
              .sort(
                (a, b) => a.publication_reference_id - b.publication_reference_id
              )
              .map(d => (
                <ReferenceFormWrapper
                  key={d.publication_reference_id}
                  data={d}
                  handleDeleteReference={this.handleDeleteReference}
                />
              ))}
            {newReferences.map(d => (
              <ReferenceFormWrapper
                key={d.timestamp}
                data={d}
                handleDeleteReference={this.handleDeleteReference}
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
  deleteReferenceAction: T.func
};

const mapStateToProps = state => ({
  atbdVersion: state.application.atbdVersion,
  references: state.application.references
});

const mapDispatch = {
  deleteReferenceAction: deleteReference
};

export default connect(
  mapStateToProps,
  mapDispatch
)(References);
