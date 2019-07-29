/* eslint default-case: 0 */
import React, { Component } from 'react';
import { push } from 'connected-react-router';
import T from 'prop-types';
import styled from 'styled-components/macro';
import { StickyContainer, Sticky } from 'react-sticky';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { Value } from 'slate';
import { Editor } from 'slate-react';
import { BlockMath } from 'react-katex';

import {
  fetchAtbd,
  serializeDocument,
  fetchEntireAtbdVersion
} from '../../actions/actions';

// Components
import {
  Inpage,
  InpageHeader,
  InpageHeaderInner,
  InpageHeadline,
  InpageTitle,
  InpageTagline,
  InpageToolbar,
  InpageBody,
  InpageBodyInner
} from '../common/Inpage';
import Prose from '../../styles/type/prose';
import Dropdown, {
  DropTitle,
  DropMenu,
  DropMenuItem
} from '../common/Dropdown';

// Styled components
import Button from '../../styles/button/button';
import collecticon from '../../styles/collecticons';
import toasts from '../common/toasts';
import Table from '../../styles/table';


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

const AtbdSection = styled.section``;
const AtbdSectionHeader = styled.header``;
const AtbdSectionTitle = styled.h1``;
const AtbdSectionBody = styled.div``;
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

  constructor(props) {
    super(props);

    // References need to be rendered in line with a number, but they also
    // need to be rendered at the end in a list. Keep track of usage order so
    // they can be printed.
    this.referenceIndex = [];

    this.renderNode = this.renderNode.bind(this);
  }

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
      this.pdfCreationToast = toasts.info('PDF document is being created', {
        autoClose: false
      });
      fetchEntireAtbdVersion({
        atbd_id: atbd.atbd_id,
        atbd_version: atbd.atbd_versions[0].atbd_version
      });
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

  /* eslint-disable-next-line */
  renderMark(props, editor, next) {
    const {
      mark: { type },
      children
    } = props;
    switch (type) {
      case 'bold': {
        return <strong {...props}>{children}</strong>;
      }
      case 'italic': {
        return <em {...props}>{children}</em>;
      }
      case 'underline': {
        return <u {...props}>{children}</u>;
      }
      case 'superscript': {
        return <sup {...props}>{children}</sup>;
      }
      case 'subscript': {
        return <sub {...props}>{children}</sub>;
      }
      default: {
        return next();
      }
    }
  }

  /* eslint-disable-next-line */
  renderNode(props, editor, next) {
    const {
      attributes, children, node
    } = props;

    switch (node.type) {
      case 'code':
        return (
          <pre>
            <code>{children}</code>
          </pre>
        );
      case 'paragraph':
        return <p className={node.data.get('className')}>{children}</p>;
      case 'quote':
        return <blockquote>{children}</blockquote>;
      case 'equation':
        return <BlockMath math={node.text} />;
      case 'image': {
        const src = node.data.get('src');
        const caption = node.data.get('caption');
        return (
          <figure>
            <img src={src} alt={caption} />
            <figcaption>{caption}</figcaption>
          </figure>
        );
      }
      case 'table': {
        const headers = !node.data.get('headless');
        const rows = children;
        const split = (!headers || !rows || !rows.length || rows.length === 1)
          ? { header: null, rows }
          : {
            header: rows[0],
            rows: rows.slice(1),
          };

        return (
          <Table {...attributes}>
            {headers && <thead>{split.header}</thead>}
            <tbody>{split.rows}</tbody>
          </Table>
        );
      }
      case 'table_row':
        return <tr {...attributes}>{children}</tr>;
      case 'table_cell':
        return <td {...attributes}>{children}</td>;

      case 'link': {
        const url = node.data.get('url');
        return (
          <a
            href={url}
            rel="noopener noreferrer"
            target="_blank"
            {...attributes}
          >
            {children}
          </a>
        );
      }
      case 'reference': {
        const refId = node.get('data').get('id');
        let refIdx = this.referenceIndex.findIndex(o => o.id === refId);
        if (refIdx === -1) {
          this.referenceIndex.push({ id: refId });
          refIdx = this.referenceIndex.length;
        }
        return <sup><a href={`#reference-${refId}`} title="Link to reference">{refIdx + 1}</a></sup>;
      }
      default:
        return next();
    }
  }

  renderContent() {
    const { atbdVersion } = this.props;
    if (!atbdVersion) return null;


    console.log(atbdVersion)

    const {
      introduction,
      publication_references,
      historical_perspective,
      scientific_theory,
      scientific_theory_assumptions,
      mathematical_theory,
      mathematical_theory_assumptions,
      algorithm_usage_constraints,
      performance_assessment_validation_methods,
      performance_assessment_validation_uncertainties,
      performance_assessment_validation_errors
    } = atbdVersion;

    const ReadOnlyEditor = ({ document }) => (
      <Editor
        readOnly
        value={Value.fromJSON(document)}
        renderNode={this.renderNode}
        renderMark={this.renderMark}
      />
    );

    return (
      <React.Fragment>
        <ReadOnlyEditorSection
          title="Introduction"
          document={introduction}
          renderNode={this.renderNode}
          renderMark={this.renderMark}
        />
        <ReadOnlyEditorSection
          title="Historical Perspective"
          document={historical_perspective}
          renderNode={this.renderNode}
          renderMark={this.renderMark}
        />

        <AtbdSection>
          <AtbdSectionHeader>
            <AtbdSectionTitle>Algorithm Description</AtbdSectionTitle>
          </AtbdSectionHeader>
          <AtbdSectionBody>
            <h2>Scientific Theory</h2>
            <Prose>
              <ReadOnlyEditor document={scientific_theory} />
            </Prose>
            <h3>Assumptions</h3>
            <Prose>
              <ReadOnlyEditor document={scientific_theory_assumptions} />
            </Prose>
            <h2>Mathematical Theory</h2>
            <Prose>
              <ReadOnlyEditor document={mathematical_theory} />
            </Prose>
            <h3>Assumptions</h3>
            <Prose>
              <ReadOnlyEditor document={mathematical_theory_assumptions} />
            </Prose>
          </AtbdSectionBody>
        </AtbdSection>

        <ReadOnlyEditorSection
          title="Algorithm Usage Constraints"
          document={algorithm_usage_constraints}
          renderNode={this.renderNode}
          renderMark={this.renderMark}
        />

        <AtbdSection>
          <AtbdSectionHeader>
            <AtbdSectionTitle>Performance Assessment Validation</AtbdSectionTitle>
          </AtbdSectionHeader>
          <AtbdSectionBody>
            <h2>Methods</h2>
            <Prose>
              <ReadOnlyEditor document={performance_assessment_validation_methods} />
            </Prose>
            <h3>Uncertainties</h3>
            <Prose>
              <ReadOnlyEditor document={performance_assessment_validation_uncertainties} />
            </Prose>
            <h2>Errors</h2>
            <Prose>
              <ReadOnlyEditor document={performance_assessment_validation_errors} />
            </Prose>
          </AtbdSectionBody>
        </AtbdSection>

        {this.referenceIndex.length && (
          <AtbdSection>
            <AtbdSectionHeader>
              <AtbdSectionTitle>References</AtbdSectionTitle>
            </AtbdSectionHeader>
            <AtbdSectionBody>
              <ol>
                {this.referenceIndex.map((o, idx) => {
                  const ref = publication_references.find(r => r.publication_reference_id === o.id);
                  return (
                    <li key={o.id} id={`#reference-${o.id}`}>[{idx + 1}] <em>{ref.authors}</em> {ref.title}</li>
                  );
                })}
              </ol>
            </AtbdSectionBody>
          </AtbdSection>
        )}
      </React.Fragment>
    );
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
            <InpageBody>
              <InpageBodyInner>
                {this.renderContent()}
              </InpageBodyInner>
            </InpageBody>
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
    serializeHtmlFail,
    atbdVersion
  } = state.application;
  return {
    atbdVersion,
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
  visitLink: push,
  fetchEntireAtbdVersion
};

export default connect(
  mapStateToProps,
  mapDispatch
)(AtbdView);


function ReadOnlyEditorSection({
  title, document, renderNode, renderMark
}) {
  return (
    <AtbdSection>
      <AtbdSectionHeader>
        <AtbdSectionTitle>{title}</AtbdSectionTitle>
      </AtbdSectionHeader>
      <AtbdSectionBody>
        <Prose>
          <Editor
            readOnly
            value={Value.fromJSON(document)}
            renderNode={renderNode}
            renderMark={renderMark}
          />
        </Prose>
      </AtbdSectionBody>
    </AtbdSection>
  );
}

ReadOnlyEditorSection.propTypes = {
  title: T.string,
  document: T.object,
  renderNode: T.func,
  renderMark: T.func
};
