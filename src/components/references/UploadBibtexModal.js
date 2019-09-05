import React, { Fragment } from 'react';
import { PropTypes as T } from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { parseBibtexFile, bibtexItemsToRefs } from '../../utils/references';
import { showGlobalLoading, hideGlobalLoading } from '../common/OverlayLoader';
import collecticon from '../../styles/collecticons';

import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalTitle,
  ModalFooter,
  ModalCancelButton
} from '../common/Modal';

import Button from '../../styles/button/button';
import Form from '../../styles/form/form';
import FormLabel from '../../styles/form/label';
import { FormFieldsetBody, FormFieldset } from '../../styles/form/fieldset';
import { FormHelper, FormHelperMessage } from '../../styles/form/helper';

import { createReference } from '../../actions/actions';

const ImportButton = styled(Button)`
  ::before {
    ${collecticon('tick--small')}
  }
`;

class UploadBibtexModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      helperMessage: '',
      references: [],
      canProceedImport: false
    };

    this.closeModal = this.closeModal.bind(this);
    this.handleFileSelect = this.handleFileSelect.bind(this);
    this.proceedImport = this.proceedImport.bind(this);
  }

  closeModal() {
    const { onCancel } = this.props;

    // Clear modal before exiting
    this.setState({
      helperMessage: '',
      references: [],
      canProceedImport: false
    });

    // Close it
    onCancel();
  }

  async handleFileSelect(e) {
    const { files } = e.currentTarget;
    if (files.length) {
      const [file] = files;

      this.setState({
        helperMessage: ''
      });

      try {
        const data = await parseBibtexFile(file);
        const { valid: references } = await bibtexItemsToRefs(data);
        this.setState({
          helperMessage: `Found ${references.length} valid references.`,
          references,
          canProceedImport: references.length > 0
        });
      } catch (error) {
        this.setState({
          helperMessage: `Parsing error, please provide a valid Bibtex file.`,
          canProceedImport: false
        });
      }
    }
  }

  async proceedImport() {
    const { references } = this.state;
    const {
      atbdVersion: { atbd_version, atbd_id },
      createReferenceAction
    } = this.props;

    showGlobalLoading();

    // Make create reference calls
    for (let i = 0; i < references.length; i++) {
      const ref = references[i];
      // eslint-disable-next-line no-await-in-loop
      await createReferenceAction({ atbd_version, atbd_id, ...ref });
    }

    hideGlobalLoading();

    this.closeModal();
  }

  render() {
    const { helperMessage, canProceedImport } = this.state;
    const { isActive } = this.props;
    return (
      <Fragment>
        <Modal
          id="bibtex-upload"
          size="large"
          revealed={isActive}
          onCloseClick={this.closeModal}
          headerComponent={(
            <ModalHeader>
              <ModalTitle>Import references</ModalTitle>
            </ModalHeader>
)}
          bodyComponent={(
            <ModalBody>
              <Form>
                <FormFieldset>
                  <FormFieldsetBody>
                    <FormLabel htmlFor="file-upload">
                      Select a bibtex file
                    </FormLabel>
                    <input
                      id="file-upload"
                      type="file"
                      onChange={this.handleFileSelect}
                    />
                    {helperMessage && helperMessage.length > 0 && (
                    <FormHelper>
                      <FormHelperMessage isError={!canProceedImport}>
                        {helperMessage}
                      </FormHelperMessage>
                    </FormHelper>
                    )}
                  </FormFieldsetBody>
                </FormFieldset>
              </Form>
            </ModalBody>
)}
          footerComponent={(
            <ModalFooter>
              <ModalCancelButton
                variation="base-raised-light"
                title="Cancel action"
                onClick={this.closeModal}
              >
                Cancel
              </ModalCancelButton>
              <ImportButton
                variation="primary-raised-dark"
                disabled={!canProceedImport}
                onClick={this.proceedImport}
              >
                Proceed
              </ImportButton>
            </ModalFooter>
)}
        />
      </Fragment>
    );
  }
}

UploadBibtexModal.propTypes = {
  atbdVersion: T.object,
  createReferenceAction: T.func,
  onCancel: T.func,
  isActive: T.bool
};

const mapStateToProps = state => ({
  atbdVersion: state.application.atbdVersion
});

const mapDispatch = {
  createReferenceAction: createReference
};

export default connect(
  mapStateToProps,
  mapDispatch
)(UploadBibtexModal);
