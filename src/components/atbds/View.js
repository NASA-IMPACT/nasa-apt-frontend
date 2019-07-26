import React, { Component } from 'react';
import { push } from 'connected-react-router';
import T from 'prop-types';
import styled from 'styled-components/macro';
import { StickyContainer, Sticky } from 'react-sticky';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';

import { fetchAtbd, serializeDocument } from '../../actions/actions';

// Components
import {
  Inpage,
  InpageHeader,
  InpageHeaderInner,
  InpageHeadline,
  InpageTitle,
  InpageTagline,
  InpageToolbar,
  InpageBody
} from '../common/Inpage';
import Dropdown, {
  DropTitle,
  DropMenu,
  DropMenuItem
} from '../common/Dropdown';

// Styled components
import Button from '../../styles/button/button';
import collecticon from '../../styles/collecticons';
import toasts from '../common/toasts';

const OptionsTrigger = styled(Button)`
  &::before {
    ${collecticon('ellipsis-vertical')}
  }
`;

const DocumentActionDelete = styled(DropMenuItem)`
  &::before {
    ${collecticon('trash-bin')}
  }
`;

const DownloadButton = styled(Button)`
  &::before {
    ${collecticon('download-2')};
  }
`;

const EditButton = styled(Button)`
  &::before {
    ${collecticon('pencil')};
  }
`;

class AtbdView extends Component {
  static propTypes = {
    atbd: T.object,
    serializeDocumentAction: T.func,
    fetchAtbdAction: T.func,
    isSerializingPdf: T.bool,
    serializePdfFail: T.bool,
    pdfUrl: T.string,
    match: T.object,
    visitLink: T.func
  };

  componentDidMount() {
    const {
      match: {
        params: { atbd_id }
      },
      fetchAtbdAction
    } = this.props;
    fetchAtbdAction(atbd_id);
  }

  componentWillReceiveProps(nextProps) {
    const {
      atbd: oldAtbd,
      serializeDocumentAction,
      isSerializingPdf: wasSerializingPdf
    } = this.props;
    const { atbd, isSerializingPdf } = nextProps;

    // Start serialization, if is not already started
    if (
      !isSerializingPdf
      && atbd
      && (!oldAtbd || atbd.atbd_id !== oldAtbd.atbd_id)
    ) {
      this.pdfCreationToast = toasts.info('PDF document is being created', { autoClose: false });
      serializeDocumentAction({
        atbd_id: atbd.atbd_id,
        atbd_version: atbd.atbd_versions[0].atbd_version
      });
    }

    // Serialization was finished, hide loading.
    if (wasSerializingPdf && !isSerializingPdf) {
      toast.dismiss(this.pdfCreationToast);
      toasts.success('PDF document ready');
    }
  }

  render() {
    const {
      atbd,
      pdfUrl,
      isSerializingPdf,
      serializePdfFail,
      visitLink
    } = this.props;

    if (!atbd) return null;

    console.log('atbd', atbd);

    return (
      <Inpage>
        {atbd && (
          <StickyContainer>
            <Sticky>
              {stickyProps => (
                <InpageHeader
                  style={stickyProps.style}
                  isSticky={stickyProps.isSticky}
                >
                  <InpageHeaderInner>
                    <InpageHeadline>
                      <InpageTitle>{atbd.title}</InpageTitle>
                      <InpageTagline>Viewing document</InpageTagline>
                    </InpageHeadline>
                    <InpageToolbar>
                      <Dropdown
                        alignment="right"
                        triggerElement={(
                          <OptionsTrigger
                            variation="achromic-plain"
                            title="Toggle menu options"
                            disabled
                          >
                            Options
                          </OptionsTrigger>
                        )}
                      >
                        <DropTitle>Document options</DropTitle>
                        <DropMenu role="menu" iconified>
                          <DocumentActionDelete
                            title="Delete document"
                            disabled
                          >
                            Delete
                          </DocumentActionDelete>
                        </DropMenu>
                      </Dropdown>
                      <DownloadButton
                        variation="achromic-plain"
                        title="Download document as PDF"
                        as="a"
                        target="_blank"
                        href={pdfUrl}
                        disabled={isSerializingPdf || serializePdfFail}
                      >
                        Download PDF
                      </DownloadButton>
                      <EditButton
                        variation="achromic-plain"
                        title="Edit document"
                        onClick={() => visitLink(
                          `/atbdsedit/${
                            atbd.atbd_id
                          }/drafts/1/identifying_information`
                        )}
                      >
                        Edit
                      </EditButton>
                    </InpageToolbar>
                  </InpageHeaderInner>
                </InpageHeader>
              )}
            </Sticky>
            <InpageBody>Hello</InpageBody>
          </StickyContainer>
        )}
      </Inpage>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    selectedAtbd,
    serializingAtbdVersion,
    isSerializingHtml,
    isSerializingPdf,
    serializePdfFail,
    serializeHtmlFail
  } = state.application;
  return {
    atbd: selectedAtbd,
    isSerializingHtml,
    isSerializingPdf,
    serializePdfFail,
    serializeHtmlFail,
    htmlUrl: serializingAtbdVersion && serializingAtbdVersion.html,
    pdfUrl: serializingAtbdVersion && serializingAtbdVersion.pdf
  };
};

const mapDispatch = {
  fetchAtbdAction: fetchAtbd,
  serializeDocumentAction: serializeDocument,
  visitLink: push
};

export default connect(
  mapStateToProps,
  mapDispatch
)(AtbdView);
