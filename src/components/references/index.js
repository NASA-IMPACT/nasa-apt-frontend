import React from 'react';
import { PropTypes as T } from 'prop-types';
import { connect } from 'react-redux';

import { Inpage } from '../common/Inpage';
import EditPage from '../common/EditPage';

import ReferenceFormWrapper from './FormWrapper';

export function References(props) {
  const { atbdVersion, references } = props;
  let returnValue;
  if (atbdVersion) {
    const { atbd, atbd_id } = atbdVersion;
    const { title } = atbd;
    returnValue = (
      <Inpage>
        <EditPage title={title || ''} id={atbd_id} step={7}>
          <h2>References</h2>
          <p>
            Please remove any references that are no longer attached to this
            ATBD.
            <br />
            Do not delete any that are currently referenced in any section with
            a <sup>ref</sup> superscript.
          </p>
          <ul>
            {references.map((d, i) => (
              <ReferenceFormWrapper key={i} data={d} index={i} />
            ))}
            {!references.length && <p>No references attached.</p>}
          </ul>
        </EditPage>
      </Inpage>
    );
  } else {
    returnValue = null;
  }
  return returnValue;
}

References.propTypes = {
  atbdVersion: T.object,
  references: T.array,
  deleteReference: T.func
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
