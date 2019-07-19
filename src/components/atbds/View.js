import React, { Fragment, Component } from 'react';
import T from 'prop-types';
import styled from 'styled-components/macro';
import { connect } from 'react-redux';

import { fetchAtbd, serializeDocument } from '../../actions/actions';

// Components
import { showGlobalLoading, hideGlobalLoading } from '../common/OverlayLoader';
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

const IFrameWrapper = styled.div`
  position: relative;
  height: 100%;
`;

const IFrame = styled.iframe`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
`;

class AtbdView extends Component {
  static propTypes = {
    atbd: T.object,
    serializeDocumentAction: T.func,
    fetchAtbdAction: T.func,
    isSerializingHtml: T.bool,
    htmlUrl: T.string,
    match: T.object
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
      isSerializingHtml: wasSerializingHtml
    } = this.props;
    const { atbd, isSerializingHtml } = nextProps;

    // Start serialization, if is not already started
    if (
      !isSerializingHtml
      && atbd
      && (!oldAtbd || atbd.atbd_id !== oldAtbd.atbd_id)
    ) {
      showGlobalLoading();
      serializeDocumentAction({
        atbd_id: atbd.atbd_id,
        atbd_version: atbd.atbd_versions[0].atbd_version
      });
    }

    // Serialization was finished, hide loading.
    if (wasSerializingHtml && !isSerializingHtml) {
      hideGlobalLoading();
    }
  }

  render() {
    const {
      atbd, htmlUrl, pdfUrl, isSerializingHtml
    } = this.props;

    if (!atbd) return <div>ATBD loading or not found.</div>;

    return (
      <Inpage>
        {atbd && (
          <Fragment>
            <InpageHeader>
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
                      >
                        Options
                      </OptionsTrigger>
)}
                  >
                    <DropTitle>Document options</DropTitle>
                    <DropMenu role="menu" iconified>
                      <DocumentActionDelete title="Delete document" disabled>
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
                  >
                    Download PDF
                  </DownloadButton>
                  <EditButton variation="achromic-plain" title="Edit document">
                    Edit
                  </EditButton>
                </InpageToolbar>
              </InpageHeaderInner>
            </InpageHeader>
            <InpageBody>
              {!isSerializingHtml && (
                <IFrameWrapper>
                  <IFrame
                    frameborder="0"
                    allowfullscreen
                    id="inlineFrameExample"
                    title="Inline Frame Example"
                    src={htmlUrl}
                  />
                </IFrameWrapper>
              )}
            </InpageBody>
          </Fragment>
        )}
      </Inpage>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    selectedAtbd,
    serializingAtbdVersion,
    isSerializingHtml
  } = state.application;
  return {
    atbd: selectedAtbd,
    isSerializingHtml,
    htmlUrl: serializingAtbdVersion && serializingAtbdVersion.html,
    pdfUrl: serializingAtbdVersion && serializingAtbdVersion.pdf
  };
};

const mapDispatch = {
  fetchAtbdAction: fetchAtbd,
  serializeDocumentAction: serializeDocument
};

export default connect(
  mapStateToProps,
  mapDispatch
)(AtbdView);
