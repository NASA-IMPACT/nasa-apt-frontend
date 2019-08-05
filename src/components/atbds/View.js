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
  serializeDocument
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
import Dl from '../../styles/type/definition-list';
import { themeVal } from '../../styles/utils/general';
import { multiply } from '../../styles/utils/math';


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

const AtbdSectionHeader = styled.header``;
const AtbdSectionTitle = styled.h1``;
const AtbdSectionBody = styled.div`
  h2, h3 {
    margin-top: ${multiply(themeVal('layout.space'), 2)};
    margin-bottom: ${themeVal('layout.space')};
  }

  table {
    margin-bottom: ${themeVal('layout.space')};
  }
`;

function AtbdSectionBase({
  id, title, children, ...props
}) {
  return (
    <section {...props}>
      <AtbdSectionHeader>
        <AtbdSectionTitle id={id}>{title}</AtbdSectionTitle>
      </AtbdSectionHeader>
      <AtbdSectionBody>
        {children}
      </AtbdSectionBody>
    </section>
  );
}

AtbdSectionBase.propTypes = {
  title: T.string,
  id: T.string,
  children: T.node
};
const AtbdSection = styled(AtbdSectionBase)``;

const AtbdMeta = styled.div`
  margin-bottom: ${multiply(themeVal('layout.space'), 3)};
`;

const AtbdMetaTitle = styled.h2`
  margin-bottom: ${themeVal('layout.space')};
`;

const AtbdMetaDetails = styled(Dl)``;

const AtbdIndex = styled.nav``;

const AtbdIndexTitle = styled.h2`
  margin-bottom: ${themeVal('layout.space')};
`;

const AtbdIndexMenu = styled.ol`
  margin-left: 1rem;
`;

class AtbdView extends Component {
  static propTypes = {
    atbd: T.object,
    atbdVersion: T.object,
    serializingAtbdVersion: T.object,
    serializeDocumentAction: T.func,
    fetchAtbdAction: T.func,
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

  componentWillReceiveProps(nextProps) {
    const {
      serializeDocumentAction,
      serializingAtbdVersion: {
        isSerializingPdf: wasSerializingPdf
      }
    } = this.props;

    const {
      atbd,
      serializingAtbdVersion: {
        isSerializingPdf,
        pdf,
        serializePdfFail
      }
    } = nextProps;

    // Start serialization, if is not already started
    if (atbd && !isSerializingPdf && !pdf && !serializePdfFail) {
      this.pdfCreationToast = toasts.info('PDF document is being created', {
        autoClose: false
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

  componentWillUnmount() {
    toast.dismiss(this.pdfCreationToast);
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

  renderReadOnlyEditor(document) {
    if (!document) return 'Not Available';

    return (
      <Editor
        readOnly
        value={Value.fromJSON(document)}
        renderNode={this.renderNode}
        renderMark={this.renderMark}
      />
    );
  }

  renderAlgorithmVars(vars = [], idKey) {
    return vars.map(v => (
      <Dl type="horizontal" key={v[idKey]}>
        <dt>Name</dt>
        <dd>{v.name.document
          ? this.renderReadOnlyEditor(v.name)
          : v.name}
        </dd>
        <dt>Long name</dt>
        <dd>{v.long_name.document
          ? this.renderReadOnlyEditor(v.long_name)
          : v.long_name}
        </dd>
        <dt>Unit</dt>
        <dd>{v.unit.document
          ? this.renderReadOnlyEditor(v.unit)
          : v.unit}
        </dd>
      </Dl>
    ));
  }

  renderUrlDescriptionField(data) {
    return (
      <React.Fragment key={data.id}>
        <h4>Url</h4>
        <p><a href={data.url} target="_blank" rel="noopener noreferrer" title="Open url in new tab">{data.url}</a></p>
        <h4>Description</h4>
        <Prose>
          {this.renderReadOnlyEditor(data.description)}
        </Prose>
      </React.Fragment>
    );
  }

  renderTOCList(data) {
    return data.map(entry => (
      <AtbdIndexMenu key={entry.id}>
        <li>
          <a href={`#${entry.id}`} title={`Go to ${entry.label} section`}>{entry.label}</a>
          {entry.children && this.renderTOCList(entry.children)}
        </li>
      </AtbdIndexMenu>
    ));
  }

  renderContent() {
    const { atbdVersion, atbd } = this.props;
    // Avoid a race condition when there's an atbdVersion loaded for
    // another atbd.
    if (!atbdVersion || atbdVersion.atbd_id !== atbd.atbd_id) return null;

    // It is never certain that these variables will be set.
    // Always check for undefined.
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
      performance_assessment_validation_errors,
      algorithm_input_variables,
      algorithm_output_variables,
      algorithm_implementations,
      data_access_input_data,
      data_access_output_data,
      data_access_related_urls
    } = atbdVersion;

    // When the section that's being rendered is a list of items we only need
    // to print the title and then the data from the children.
    // This method is a utility to just render the children.
    const childrenPassThroughRenderer = el => (
      <AtbdSection key={el.id} id={el.id} title={el.label}>
        {el.children.map(child => child.renderer(child))}
      </AtbdSection>
    );

    // The index contains all the sections to be rendered.
    // Each node has the following properties:
    // label: Human readable title to print
    // id: Unique id in the whole page to be used as anchor
    // rendered: Function to render this element. It is called with the current
    //           element being rendered. The first level of the index is
    //           rendered with the <AtbdSection> wrapper.
    // children: Any children this node should have. They must follow this
    //           same structure.
    const index = [
      {
        label: 'Introduction',
        id: 'introduction',
        renderer: el => (
          <AtbdSection key={el.id} id={el.id} title={el.label}>
            {this.renderReadOnlyEditor(introduction)}
          </AtbdSection>
        )
      },
      {
        label: 'Historical Perspective',
        id: 'historic-prespective',
        renderer: el => (
          <AtbdSection key={el.id} id={el.id} title={el.label}>
            {this.renderReadOnlyEditor(historical_perspective)}
          </AtbdSection>
        )
      },
      {
        label: 'Algorithm Description',
        id: 'algo-description',
        renderer: childrenPassThroughRenderer,
        children: [
          {
            label: 'Scientific Theory',
            id: 'sci-theory',
            renderer: el => (
              <React.Fragment key={el.id}>
                <h2 id={el.id}>{el.label}</h2>
                <Prose>
                  {this.renderReadOnlyEditor(scientific_theory)}
                </Prose>
                {el.children.map(child => child.renderer(child))}
              </React.Fragment>
            ),
            children: [
              {
                label: 'Assumptions',
                id: 'sci-theory-assumptions',
                renderer: el => (
                  <React.Fragment key={el.id}>
                    <h3 id={el.id}>{el.label}</h3>
                    <Prose>
                      {this.renderReadOnlyEditor(scientific_theory_assumptions)}
                    </Prose>
                  </React.Fragment>
                )
              }
            ]
          },
          {
            label: 'Mathematical Theory',
            id: 'math-theory',
            renderer: el => (
              <React.Fragment key={el.id}>
                <h2 id={el.id}>{el.label}</h2>
                <Prose>
                  {this.renderReadOnlyEditor(mathematical_theory)}
                </Prose>
                {el.children.map(child => child.renderer(child))}
              </React.Fragment>
            ),
            children: [
              {
                label: 'Assumptions',
                id: 'math-theory-assumptions',
                renderer: el => (
                  <React.Fragment key={el.id}>
                    <h3 id={el.id}>{el.label}</h3>
                    <Prose>
                      {this.renderReadOnlyEditor(mathematical_theory_assumptions)}
                    </Prose>
                  </React.Fragment>
                )
              }
            ]
          },
          {
            label: 'Algorithm Input Variables',
            id: 'algo-input-var',
            renderer: el => (
              <React.Fragment key={el.id}>
                <h2 id={el.id}>{el.label}</h2>
                <Prose>
                  {this.renderAlgorithmVars(algorithm_input_variables, 'algorithm_input_variable_id')}
                </Prose>
              </React.Fragment>
            )
          },
          {
            label: 'Algorithm Output Variables',
            id: 'algo-output-var',
            renderer: el => (
              <React.Fragment key={el.id}>
                <h2 id={el.id}>{el.label}</h2>
                <Prose>
                  {this.renderAlgorithmVars(algorithm_output_variables, 'algorithm_output_variable_id')}
                </Prose>
              </React.Fragment>
            )
          }
        ]
      },
      {
        label: 'Algorithm Implementations',
        id: 'algo-implementations',
        renderer: el => (
          <AtbdSection key={el.id} id={el.id} title={el.label}>
            {el.children.map(child => child.renderer(child))}
          </AtbdSection>
        ),
        children: (algorithm_implementations || []).map((o, idx) => ({
          label: `Entry #${idx + 1}`,
          id: `algo-implementations-${idx + 1}`,
          renderer: el => (
            <React.Fragment key={el.id}>
              <h2 id={el.id}>{el.label}</h2>
              {this.renderUrlDescriptionField({
                id: o.algorithm_implementation_id,
                url: o.access_url,
                description: o.execution_description
              })}
            </React.Fragment>
          )
        }))
      },
      {
        label: 'Algorithm Usage Constraints',
        id: 'algo-usage-constraints',
        renderer: el => (
          <AtbdSection key={el.id} id={el.id} title={el.label}>
            {this.renderReadOnlyEditor(algorithm_usage_constraints)}
          </AtbdSection>
        )
      },
      {
        label: 'Performance Assessment Validation',
        id: 'perf-assesment-validation',
        renderer: el => (
          <AtbdSection key={el.id} id={el.id} title={el.label}>
            {el.children.map(child => child.renderer(child))}
          </AtbdSection>
        ),
        children: [
          {
            label: 'Performance Assessment Validation Methods',
            id: 'perf-assesment-validation-method',
            renderer: el => (
              <React.Fragment key={el.id}>
                <h2 id={el.id}>{el.label}</h2>
                <Prose>
                  {this.renderReadOnlyEditor(performance_assessment_validation_methods)}
                </Prose>
              </React.Fragment>
            )
          },
          {
            label: 'Performance Assessment Validation Uncertainties',
            id: 'perf-assesment-validation-uncert',
            renderer: el => (
              <React.Fragment key={el.id}>
                <h2 id={el.id}>{el.label}</h2>
                <Prose>
                  {this.renderReadOnlyEditor(performance_assessment_validation_uncertainties)}
                </Prose>
              </React.Fragment>
            )
          },
          {
            label: 'Performance Assessment Validation Errors',
            id: 'perf-assesment-validation-err',
            renderer: el => (
              <React.Fragment key={el.id}>
                <h2 id={el.id}>{el.label}</h2>
                <Prose>
                  {this.renderReadOnlyEditor(performance_assessment_validation_errors)}
                </Prose>
              </React.Fragment>
            )
          }
        ]
      },
      {
        label: 'Data Access',
        id: 'data-access',
        renderer: childrenPassThroughRenderer,
        children: [
          {
            label: 'Data Access Input Data',
            id: 'data-access-input',
            renderer: childrenPassThroughRenderer,
            children: (data_access_input_data || []).map((o, idx) => ({
              label: `Entry #${idx + 1}`,
              id: `data-access-input-${idx + 1}`,
              renderer: el => (
                <React.Fragment key={el.id}>
                  <h2 id={el.id}>{el.label}</h2>
                  {this.renderUrlDescriptionField({
                    id: o.data_access_input_data_id,
                    url: o.access_url,
                    description: o.description
                  })}
                </React.Fragment>
              )
            }))
          },
          {
            label: 'Data Access Output Data',
            id: 'data-access-output',
            renderer: childrenPassThroughRenderer,
            children: (data_access_output_data || []).map((o, idx) => ({
              label: `Entry #${idx + 1}`,
              id: `data-access-output-${idx + 1}`,
              renderer: el => (
                <React.Fragment key={el.id}>
                  <h2 id={el.id}>{el.label}</h2>
                  {this.renderUrlDescriptionField({
                    id: o.data_access_output_data_id,
                    url: o.access_url,
                    description: o.description
                  })}
                </React.Fragment>
              )
            }))
          },
          {
            label: 'Data Access Related URLs',
            id: 'data-access-related-urls',
            renderer: childrenPassThroughRenderer,
            children: (data_access_related_urls || []).map((o, idx) => ({
              label: `Entry #${idx + 1}`,
              id: `data-access-related-urls-${idx + 1}`,
              renderer: el => (
                <React.Fragment key={el.id}>
                  <h2 id={el.id}>{el.label}</h2>
                  {this.renderUrlDescriptionField({
                    id: o.data_access_related_url_id,
                    url: o.url,
                    description: o.description
                  })}
                </React.Fragment>
              )
            }))
          }
        ]
      },
      {
        label: 'Contacts',
        id: 'contacts',
        renderer: (el) => {
          const contactsSingle = atbd.contacts || [];
          const contactsGroups = atbd.contact_groups || [];
          const contacts = contactsSingle.concat(contactsGroups);

          if (!contacts.length) return null;

          return (
            <AtbdSection key={el.id} id={el.id} title={el.label}>
              <ul>
                {contacts.map(contact => (
                  <li key={contact.contact_id || contact.contact_group_id}>
                    <h2>{contact.contact_group_id ? 'Group: ' : ''}{contact.displayName}</h2>
                    <Dl type="horizontal">
                      {!!contact.roles.length && (
                        <React.Fragment>
                          <dt>Roles</dt>
                          <dd>{contact.roles.join(', ')}</dd>
                        </React.Fragment>
                      )}
                      {contact.url && (
                        <React.Fragment>
                          <dt>Url</dt>
                          <dd><a href={contact.url} target="_blank" rel="noopener noreferrer" title="Open url in new tab">{contact.url}</a></dd>
                        </React.Fragment>
                      )}
                      {contact.uuid && (
                        <React.Fragment>
                          <dt>UUID</dt>
                          <dd>{contact.uuid}</dd>
                        </React.Fragment>
                      )}
                    </Dl>

                    <h4>Mechanisms</h4>
                    <Dl type="horizontal">
                      {contact.mechanisms.map(m => (
                        <React.Fragment key={`${m.mechanism_type}-${m.mechanism_value}`}>
                          <dt>{m.mechanism_type}</dt>
                          <dd>{m.mechanism_value}</dd>
                        </React.Fragment>
                      ))}
                    </Dl>
                  </li>
                ))}
              </ul>
            </AtbdSection>
          );
        }
      },
      {
        label: 'References',
        id: 'references',
        renderer: el => this.referenceIndex.length ? (
          <AtbdSection key={el.id} id={el.id} title={el.label}>
            <ol>
              {this.referenceIndex.map((o, idx) => {
                const ref = (publication_references || []).find(r => r.publication_reference_id === o.id);
                return ref ? (
                  <li key={o.id} id={`reference-${o.id}`}>[{idx + 1}] <em>{ref.authors}</em> {ref.title}</li>
                ) : (
                  <li key={o.id} id={`reference-${o.id}`}>[{idx + 1}] Reference not found</li>
                );
              })}
            </ol>
          </AtbdSection>
        ) : null
      }
    ];

    return (
      <React.Fragment>
        <AtbdIndex>
          <AtbdIndexTitle>Contents</AtbdIndexTitle>
          {this.renderTOCList(index)}
        </AtbdIndex>

        {index.map(entry => entry.renderer(entry))}
      </React.Fragment>
    );
  }

  render() {
    const {
      atbd,
      serializingAtbdVersion: {
        isSerializingPdf,
        serializePdfFail,
        pdf
      },
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
                        href={pdf}
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

                <AtbdMeta>
                  <AtbdMetaTitle>{atbd.title}</AtbdMetaTitle>
                  <AtbdMetaDetails type="horizontal">
                    <dt>Version</dt>
                    <dd>{atbd.atbd_versions[0].atbd_version}</dd>
                    <dt>Date</dt>
                    <dd>10 Feb, 2019</dd>
                    <dt>Authors</dt>
                    <dd>Name</dd>
                  </AtbdMetaDetails>
                </AtbdMeta>

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
    atbdVersion
  } = state.application;

  const { atbd_id } = selectedAtbd || {};
  return {
    atbdVersion,
    atbd: selectedAtbd,
    serializingAtbdVersion: serializingAtbdVersion && atbd_id && serializingAtbdVersion[atbd_id]
      ? serializingAtbdVersion[atbd_id]
      : {}
  };
};

const mapDispatch = {
  serializeDocumentAction: serializeDocument,
  visitLink: push
};

export default connect(
  mapStateToProps,
  mapDispatch
)(AtbdView);
