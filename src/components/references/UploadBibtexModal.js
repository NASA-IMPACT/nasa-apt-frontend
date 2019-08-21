import React, { Fragment } from 'react';
import { PropTypes as T } from 'prop-types';

import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalTitle,
  ModalFooter,
  ModalCancelButton
} from '../common/Modal';

export default class BibtexUploadModal extends React.Component {
  constructor(props) {
    super(props);
    this.closeModal = this.closeModal.bind(this);
  }

  closeModal() {
    const { onCancel } = this.props;
    onCancel();
  }

  render() {
    const { isActive } = this.props;
    return (
      <Fragment>
        <Modal
          id="bibtex-upload"
          size="large"
          revealed={isActive}
          headerComponent={(
            <ModalHeader>
              <ModalTitle>Please select a Bibtext file</ModalTitle>
            </ModalHeader>
)}
          bodyComponent={(
            <ModalBody>
              <p>body</p>
            </ModalBody>
)}
          footerComponent={(
            <ModalFooter>
              <ModalCancelButton
                variation="base-raised-light"
                title="Cancel action"
                onClick={() => this.closeModal()}
              >
                Cancel
              </ModalCancelButton>
            </ModalFooter>
)}
        />
      </Fragment>
    );
  }
}

BibtexUploadModal.propTypes = {
  onCancel: T.func,
  isActive: T.bool
};
