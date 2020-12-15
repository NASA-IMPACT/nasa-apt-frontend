import React from 'react';
import { PropTypes as T } from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Clipboard from 'clipboard';
import { Link } from 'react-router-dom';

import {
  Modal, ModalBody, ModalHeader, ModalTitle
} from '../common/Modal';
import Button from '../../styles/button/button';
import Form from '../../styles/form/form';
import FormTextarea from '../../styles/form/textarea';
import { FormCheckable, FormCheckableGroup } from '../../styles/form/checkable';

import * as actions from '../../actions/actions';
import { themeVal } from '../../styles/utils/general';
import { downloadTextFile } from '../../utils/utils';

const TypeLabel = styled.span`
  margin-right: 1rem;
  font-size: 0.875rem;
  margin-top: 6px;
  text-transform: uppercase;
`;

const CitationTextWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-flow: row nowrap;

  > *:not(:last-child) {
    margin-right: 1rem;
  }
`;

const BibtexSection = styled.div`
  > *:not(:last-child) {
    margin-bottom: 1rem;
  }
`;

const CitationModalBody = styled(ModalBody)`
  > *:not(:last-child) {
    margin-bottom: 1rem;
  }
`;

const MissingFieldsInfo = styled.div`
  ul {
    margin-bottom: 1rem;
  }

  li {
    list-style: disc;
    list-style-position: inside;
  }

  a,
  a:visited {
    color: ${themeVal('color.primary')};
  }
`;

const citationFields = [
  { id: 'creators', label: 'Creators' },
  { id: 'release_date', label: 'Release Date' },
  { id: 'title', label: 'Title' },
  { id: 'version', label: 'Version' },
  { id: 'series_name', label: 'Series Name' },
  { id: 'editors', label: 'Editor' },
  { id: 'release_place', label: 'Release Place' },
  { id: 'publisher', label: 'Publisher' },
  { id: 'issue', label: 'Issue' },
  { id: 'additional_details', label: 'Additional Details' },
  { id: 'online_resource', label: 'URL' },
];

class CitationModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      format: 'text',
    };

    this.closeModal = this.closeModal.bind(this);
    this.downloadBibtex = this.downloadBibtex.bind(this);
  }

  async componentDidUpdate(prevProps) {
    const { id, version, fetchCitation } = this.props;

    if (
      id
      && version
      && (prevProps.id !== id || prevProps.version !== version)
    ) {
      fetchCitation({
        atbd_id: id,
        atbd_version: version,
      });
    }
  }

  closeModal() {
    const { onClose } = this.props;

    // Close it
    onClose();
  }

  downloadBibtex() {
    const { id, version, citation } = this.props;
    const date = new Date(citation.release_date);
    /* eslint-disable-next-line no-restricted-globals */
    const validDate = !isNaN(date.getTime());
    const year = validDate ? date.getUTCFullYear() : 'n/a';
    const month = validDate
      ? [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ][date.getUTCMonth()]
      : 'n/a';
    const url = citation.online_resource && citation.online_resource.startsWith('http')
      ? `\\url{${citation.online_resource}}`
      : 'n/a';

    const bibtexCitation = `@MANUAL {atbd${id}-v${version},
  title = "${citation.title || 'n/a'}",
  type = "Algorithm Theoretical Basis Document",
  author = "${citation.creators || 'n/a'}",
  editor = "${citation.editors || 'n/a'}",
  month = "${month}",
  year = "${year}",
  number = "${citation.issue || 'n/a'}",
  series = "${citation.series_name || 'n/a'}",
  volume = "${citation.version || 'n/a'}",    
  address = "${citation.release_place || 'n/a'}",
  publisher = "${citation.publisher || 'n/a'}",
  howpublished = "${url}",
  note = "${citation.additional_details || 'n/a'}"
}`;

    downloadTextFile(`atbd${id}-v${version}.bibtex`, bibtexCitation);
  }

  render() {
    const { id, version, citation } = this.props;
    const { format } = this.state;

    const citationText = citation
      ? citationFields
        .filter(f => !!citation[f.id])
        .map(f => citation[f.id])
        .join(', ')
      : '';

    const missingFields = citation
      ? citationFields.filter(f => !citation[f.id])
      : '';

    return (
      <Modal
        id="citation-modal"
        size="medium"
        revealed={!!id && !!version}
        onCloseClick={this.closeModal}
        headerComponent={(
          <ModalHeader>
            <ModalTitle>ATBD Citation</ModalTitle>
          </ModalHeader>
        )}
        bodyComponent={(
          <CitationModalBody>
            {citation ? (
              <Form>
                <FormCheckableGroup>
                  <TypeLabel>Format:</TypeLabel>
                  <FormCheckable
                    type="radio"
                    id="citation-type-text"
                    name="citation-type"
                    checked={format === 'text'}
                    onChange={() => this.setState({ format: 'text' })}
                  >
                    Text
                  </FormCheckable>
                  <FormCheckable
                    type="radio"
                    id="citation-type-bibtex"
                    name="citation-type"
                    checked={format === 'bibtex'}
                    onChange={() => this.setState({ format: 'bibtex' })}
                  >
                    Bibtex
                  </FormCheckable>
                </FormCheckableGroup>
                {format === 'text' && <CopyField value={citationText} />}
                {format === 'bibtex' && (
                  <BibtexSection>
                    <Button
                      title="Download Bibtex file"
                      useIcon="download-2"
                      variation="primary-raised-light"
                      onClick={this.downloadBibtex}
                    >
                      Download Bibtex
                    </Button>
                  </BibtexSection>
                )}
              </Form>
            ) : (
              <MissingFieldsInfo>
                <p>There is no citation data available.</p>
                <p>
                  For a Draft ATBD, the citation information can be edited
                  through the{' '}
                  <Link
                    to={`/atbdsedit/${id}/drafts/${version}/identifying_information`}
                    title="Edit ATBD identifying information"
                  >
                    identifying information
                  </Link>{' '}
                  form.
                </p>
              </MissingFieldsInfo>
            )}
            {!!missingFields.length && (
              <MissingFieldsInfo>
                <p>
                  The following fields did not have data and were not included:
                </p>
                <ul>
                  {missingFields.map(f => (
                    <li key={f.id}>{f.label}</li>
                  ))}
                </ul>
                <p>
                  For a Draft ATBD, the citation information can be edited
                  through the{' '}
                  <Link
                    to={`/atbdsedit/${id}/drafts/${version}/identifying_information`}
                    title="Edit ATBD identifying information"
                  >
                    identifying information
                  </Link>{' '}
                  form.
                </p>
              </MissingFieldsInfo>
            )}
          </CitationModalBody>
        )}
      />
    );
  }
}

CitationModal.propTypes = {
  onClose: T.func,
  fetchCitation: T.func,
  id: T.number,
  version: T.number,
  citation: T.object,
};

const mapStateToProps = (state, props) => {
  const { id, version } = props;
  const { atbdCitation } = state.application;
  const citation = atbdCitation
    && atbdCitation.atbd_id === id
    && atbdCitation.atbd_version === version
    ? atbdCitation
    : null;

  return {
    citation,
  };
};

const mapDispatch = {
  fetchCitation: actions.fetchCitation,
};

export default connect(mapStateToProps, mapDispatch)(CitationModal);

class CopyField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      copiedMsg: false,
    };
    this.triggerEl = null;
    this.copiedMsgTimeout = null;
  }

  componentDidMount() {
    this.clipboard = new Clipboard(this.triggerEl, {
      text: () => this.props.value,
    });

    this.clipboard.on('success', () => {
      this.setState({ copiedMsg: true });
      this.copiedMsgTimeout = setTimeout(() => {
        this.setState({ copiedMsg: false });
      }, 2000);
    });
  }

  componentWillUnmount() {
    this.clipboard.destroy();
    if (this.copiedMsgTimeout) clearTimeout(this.copiedMsgTimeout);
  }

  render() {
    const val = this.state.copiedMsg ? 'Copied!' : this.props.value;
    return (
      <CitationTextWrapper>
        <FormTextarea readOnly value={val} />
        <Button
          hideText
          useIcon="clipboard"
          size="large"
          variation="primary-raised-light"
          title="Copy to clipboard"
          ref={(el) => {
            this.triggerEl = el;
          }}
        >
          Copy to clipboard
        </Button>
      </CitationTextWrapper>
    );
  }
}

CopyField.propTypes = {
  value: T.string,
};
