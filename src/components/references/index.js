import React from 'react';
import { PropTypes as T } from 'prop-types';
import { connect } from 'react-redux';

import { Inpage } from '../common/Inpage';
import EditPage from '../common/EditPage';
import AddButton from '../../styles/button/add';

import ReferenceFormWrapper from './FormWrapper';

export class References extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newReferences: []
    };

    this.addNewReference = this.addNewReference.bind(this);
  }

  addNewReference() {
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
                />
              ))}
            {newReferences.map(d => (
              <ReferenceFormWrapper key={d.timestamp} data={d} />
            ))}
            {!references.length && <p>No references attached.</p>}
            <AddButton variation="base-plain" onClick={this.addNewReference}>
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
  references: T.array
};

const mapStateToProps = state => ({
  atbdVersion: state.application.atbdVersion,
  references: state.application.references
});

const mapDispatch = {};

export default connect(
  mapStateToProps,
  mapDispatch
)(References);
