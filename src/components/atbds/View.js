/* eslint default-case: 0 */
import React, { Component } from 'react';
import { push } from 'connected-react-router';
import T from 'prop-types';
import styled from 'styled-components/macro';
import { StickyContainer, Sticky } from 'react-sticky';
import { connect } from 'react-redux';
import { Value } from 'slate';
import { Editor } from 'slate-react';
import { BlockMath } from 'react-katex';

import {
  deleteAtbd,
  copyAtbd,
  updateAtbdVersion
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
  InpageBodyInner,
  InpageTitleWrapper
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
import Table from '../../styles/table';
import Dl from '../../styles/type/definition-list';
import { themeVal } from '../../styles/utils/general';
import { multiply } from '../../styles/utils/math';
import StatusPill from '../common/StatusPill';
import { confirmDeleteDoc } from '../common/ConfirmationPrompt';
import CitationModal from './CitationModal';

import { getDownloadPDFURL } from '../../utils/utils';

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

const DocumentActionDuplicate = styled(DropMenuItem)`
  &::before {
    ${collecticon('pages')}
  }
`;

const DocumentActionPublish = styled(DropMenuItem)`
  &::before {
    ${collecticon('arrow-up-right')}
  }
`;

const DocumentActionCitation = styled(DropMenuItem)`
  &::before {
    ${collecticon('quote-left')}
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

const AtbdContent = styled(Prose)`
  max-width: 48rem;
  margin: 0 auto;
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
const AtbdSection = styled(AtbdSectionBase)`
  &:not(:last-child) {
    padding-bottom: ${multiply(themeVal('layout.space'), 3)};
    margin-bottom: ${multiply(themeVal('layout.space'), 3)};
    border-bottom: 1px solid ${themeVal('color.shadow')};
  }
`;

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

  &, ol {
    counter-reset: section;
    list-style-type: none !important;
  }

  li {
    margin-bottom: 0.25rem;
  }

  li::before {
    counter-increment: section;
    content: counters(section, ".");
    margin-right: 1rem;
  }
`;

const AtbdContactList = styled.ul`
  && {
    list-style: none;
    margin-left: 0;
  }
`;

class AtbdView extends Component {
  static propTypes = {
    atbd: T.object,
    atbdVersion: T.object,
    atbdCitation: T.object,
    serializingAtbdVersion: T.object,
    deleteAtbdAction: T.func,
    fetchAtbdAction: T.func,
    copyAtbdAction: T.func,
    updateAtbdVersionAction: T.func,
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
    this.onDeleteClick = this.onDeleteClick.bind(this);

    this.state = {
      citationModalAtbd: {
        id: null,
        version: null
      }
    };
  }

  async onDeleteClick({ title, atbd_id }, e) {
    e.preventDefault();
    const { visitLink, deleteAtbdAction } = this.props;
    const res = await confirmDeleteDoc(title);
    /* eslint-disable-next-line react/destructuring-assignment */
    if (res.result) {
      deleteAtbdAction(atbd_id);
      visitLink('/atbds');
    }
  }

  async onDuplicateClick({ atbd_id }, e) {
    e.preventDefault();
    const { visitLink, copyAtbdAction } = this.props;
    const res = await copyAtbdAction(atbd_id);
    if (!res.error) {
      visitLink(`/atbds/${res.payload.created_atbd.alias}`);
    }
  }

  async onPublishClick(atbd, e) {
    e.preventDefault();
    const { visitLink, updateAtbdVersionAction } = this.props;
    const { atbd_version } = atbd.atbd_versions[0];
    /* eslint-disable-next-line react/destructuring-assignment */
    const res = await updateAtbdVersionAction(atbd.atbd_id, atbd_version, { status: 'Published' });
    if (!res.error) {
      visitLink(`/atbds/${atbd.alias}`);
    }
  }

  onCitationClick(atbd, e) {
    e.preventDefault();
    const { atbd_version } = atbd.atbd_versions[0];
    this.setState({
      citationModalAtbd: {
        id: atbd.atbd_id,
        version: atbd_version
      }
    });
  }

  renderCitationModal() {
    const { id, version } = this.state.citationModalAtbd;
    return (
      <CitationModal
        id={id}
        version={version}
        onClose={() => this.setState({
          citationModalAtbd: { id: null, version: null }
        })}
      />
    );
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
        let src = node.data.get('src');
        if (process.env.NODE_ENV || process.env.NODE_ENV === "development") {
          src = src.replace("localstack", "localhost")
        }
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
      case 'unordered-list':
        return <ul {...attributes}>{children}</ul>;
      case 'ordered-list':
        return <ol {...attributes}>{children}</ol>;
      case 'list-item':
        return <li {...attributes}>{children}</li>;
      default:
        return next();
    }
  }

  renderReadOnlyEditor(document) {
    if (!document) return 'Not Available';

    return (
      <Editor
        readOnly
        className="prose-editor"
        value={Value.fromJSON(document)}
        renderNode={this.renderNode}
        renderMark={this.renderMark}
      />
    );
  }

  getAlgorithmVarValue(val) {
    // If it's already a valid json doc render.
    if (val && val.document) {
      return this.renderReadOnlyEditor(val);
    }
    // Check if it can be parsed as JSON.
    try {
      const jsonVal = JSON.parse(val);
      if (jsonVal.document) {
        return this.renderReadOnlyEditor(jsonVal);
      }
    } catch (error) {
      // Not a json value.
    }
    return val;
  }

  renderAlgorithmVars(vars = [], idKey) {
    return vars.length ? vars.map(v => (
      <Dl type="horizontal" key={v[idKey]}>
        <dt>Name</dt>
        <dd>{this.getAlgorithmVarValue(v.name)}</dd>
        <dt>Long name</dt>
        <dd>{this.getAlgorithmVarValue(v.long_name)}</dd>
        <dt>Unit</dt>
        <dd>{this.getAlgorithmVarValue(v.unit)}</dd>
      </Dl>
    )) : 'Not Available';
  }

  renderUrlDescriptionField(data) {
    return (
      <React.Fragment key={data.id}>
        <h4>Url</h4>
        <p itemProp="distribution" itemScope itemType="https://schema.org/DataDownload">
          <a href={data.url} target="_blank" rel="noopener noreferrer" title="Open url in new tab" itemProp="contentUrl">{data.url}</a>
        </p>
        <h4>Description</h4>
        <Prose itemProp="description">
          {this.renderReadOnlyEditor(data.description)}
        </Prose>
      </React.Fragment>
    );
  }

  renderTOCList(data) {
    return (
      <AtbdIndexMenu>
        {data.map(entry => (
          <li key={entry.id}>
            <a href={`#${entry.id}`} title={`Go to ${entry.label} section`}>{entry.label}</a>
            {entry.children && this.renderTOCList(entry.children)}
          </li>
        ))}
      </AtbdIndexMenu>
    );
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
        {el.children && el.children.length
          ? el.children.map(child => child.renderer(child))
          : 'Not Available'
        }
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
            <Prose>
              {this.renderReadOnlyEditor(introduction)}
            </Prose>
          </AtbdSection>
        )
      },
      {
        label: 'Historical Perspective',
        id: 'historic-prespective',
        renderer: el => (
          <AtbdSection key={el.id} id={el.id} title={el.label}>
            <Prose>
              {this.renderReadOnlyEditor(historical_perspective)}
            </Prose>
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
        renderer: childrenPassThroughRenderer,
        children: (algorithm_implementations || []).map((o, idx) => ({
          label: `Entry #${idx + 1}`,
          id: `algo-implementations-${idx + 1}`,
          renderer: el => (
            <div key={el.id} itemProp="hasPart" itemScope itemType="https://schema.org/CreativeWork">
              <h2 id={el.id} itemProp="name">{el.label}</h2>
              <h4>Url</h4>
              <p>
                <a href={o.access_url} target="_blank" rel="noopener noreferrer" title="Open url in new tab" itemProp="url">{o.access_url}</a>
              </p>
              <h4>Description</h4>
              <Prose itemProp="description">
                {this.renderReadOnlyEditor(o.execution_description)}
              </Prose>
            </div>
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
                <div key={el.id} itemScope itemType="https://schema.org/Dataset">
                  <h2 id={el.id} itemProp="name">{el.label}</h2>
                  {this.renderUrlDescriptionField({
                    id: o.data_access_input_data_id,
                    url: o.access_url,
                    description: o.description
                  })}
                </div>
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
                <div key={el.id} itemScope itemType="https://schema.org/Dataset">
                  <h2 id={el.id} itemProp="name">{el.label}</h2>
                  {this.renderUrlDescriptionField({
                    id: o.data_access_output_data_id,
                    url: o.access_url,
                    description: o.description
                  })}
                </div>
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
                <div key={el.id} itemScope itemType="https://schema.org/Dataset">
                  <h2 id={el.id} itemProp="name">{el.label}</h2>
                  {this.renderUrlDescriptionField({
                    id: o.data_access_related_url_id,
                    url: o.url,
                    description: o.description
                  })}
                </div>
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

          return (
            <AtbdSection key={el.id} id={el.id} title={el.label}>
              {contacts.length
                ? (
                  <AtbdContactList>
                    {contacts.map(contact => (
                      <li
                        key={contact.contact_id || contact.contact_group_id}
                        itemScope
                        itemType={contact.contact_group_id ? 'https://schema.org/Organization' : 'https://schema.org/ContactPoint'}
                      >
                        <link itemProp="additionalType" href="http://schema.org/ContactPoint" />
                        <h2>{contact.contact_group_id ? 'Group: ' : ''}<span itemProp="name">{contact.displayName}</span></h2>
                        <Dl type="horizontal">
                          {!!contact.roles.length && (
                            <React.Fragment>
                              <dt>Roles</dt>
                              <dd itemProp="contactType">{contact.roles.join(', ')}</dd>
                            </React.Fragment>
                          )}
                          {contact.url && (
                            <React.Fragment>
                              <dt>Url</dt>
                              <dd><a href={contact.url} target="_blank" rel="noopener noreferrer" title="Open url in new tab" itemProp="url">{contact.url}</a></dd>
                            </React.Fragment>
                          )}
                          {contact.uuid && (
                            <React.Fragment>
                              <dt>UUID</dt>
                              <dd itemProp="identifier">{contact.uuid}</dd>
                            </React.Fragment>
                          )}
                        </Dl>

                        <h4>Mechanisms</h4>
                        <Dl type="horizontal">
                          {contact.mechanisms.map(m => (
                            <React.Fragment key={`${m.mechanism_type}-${m.mechanism_value}`}>
                              <dt itemProp="contactOption">{m.mechanism_type}</dt>
                              <dd>{m.mechanism_value}</dd>
                            </React.Fragment>
                          ))}
                        </Dl>
                      </li>
                    ))}
                  </AtbdContactList>
                )
                : 'Not Available'
              }
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
      visitLink,
      atbdCitation: storedAtbdCitation
    } = this.props;

    if (!atbd) return null;
    const pdfURL = getDownloadPDFURL(atbd);
    const atbdStatus = atbd.atbd_versions[0].status;

    // If we're navigation from another ATBD and there's no citation, the state
    // will contain the previous one. If that's the case, set as null.
    const atbdCitation = storedAtbdCitation
      && storedAtbdCitation.atbd_id === atbd.atbd_id
      ? storedAtbdCitation
      : null;

    return (
      <Inpage>
        <StickyContainer>
          <Sticky>
            {stickyProps => (
              <InpageHeader
                style={stickyProps.style}
                isSticky={stickyProps.isSticky}
              >
                <InpageHeaderInner>
                  <InpageHeadline>
                    <InpageTitleWrapper>
                      <InpageTitle>{atbd.title}</InpageTitle>
                      <StatusPill>{atbdStatus}</StatusPill>
                    </InpageTitleWrapper>
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
                        {atbdStatus === 'Draft' && (
                          <li>
                            <DocumentActionPublish
                              title="Publish document"
                              data-hook="dropdown:close"
                              onClick={this.onPublishClick.bind(this, atbd)}
                            >
                              Publish
                            </DocumentActionPublish>
                          </li>
                        )}
                        <li>
                          <DocumentActionDuplicate
                            title="Duplicate document"
                            data-hook="dropdown:close"
                            onClick={this.onDuplicateClick.bind(this, atbd)}
                          >
                            Duplicate
                          </DocumentActionDuplicate>
                        </li>
                        <li>
                          <DocumentActionCitation
                            title="Get document citation"
                            data-hook="dropdown:close"
                            onClick={this.onCitationClick.bind(this, atbd)}
                          >
                            Citation
                          </DocumentActionCitation>
                        </li>
                      </DropMenu>
                      <DropMenu role="menu" iconified>
                        <li>
                          <DocumentActionDelete
                            title="Delete document"
                            data-hook="dropdown:close"
                            onClick={this.onDeleteClick.bind(this, atbd)}
                          >
                            Delete
                          </DocumentActionDelete>
                        </li>
                      </DropMenu>
                    </Dropdown>
                    <DownloadButton
                      variation="achromic-plain"
                      title="Download document as PDF"
                      as="a"
                      target="_blank"
                      href={pdfURL}
                    >
                      Download PDF
                    </DownloadButton>
                    {atbdStatus === 'Draft' && (
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
                    )}
                  </InpageToolbar>
                </InpageHeaderInner>
              </InpageHeader>
            )}
          </Sticky>
          <InpageBody>
            <InpageBodyInner>
              {this.renderCitationModal()}
              <AtbdContent itemScope itemType="https://schema.org/CreativeWork">
                <AtbdMeta>
                  <AtbdMetaTitle itemProp="name">{atbd.title}</AtbdMetaTitle>
                  <AtbdMetaDetails type="horizontal">
                    <dt>Version</dt>
                    <dd itemProp="version">{atbd.atbd_versions[0].atbd_version}</dd>
                    {atbdCitation && atbdCitation.creators && (
                      <>
                        <dt>Creators</dt>
                        <dd>
                          <span itemProp="creator" itemScope itemType="http://schema.org/Person">{atbdCitation.creators}</span>
                        </dd>
                      </>
                    )}
                    {atbdCitation && atbdCitation.editors && (
                      <>
                        <dt>Editors</dt>
                        <dd>
                          <span itemProp="editor" itemScope itemType="http://schema.org/Person">{atbdCitation.editors}</span>
                        </dd>
                      </>
                    )}
                    {atbdCitation && atbdCitation.release_date && (
                      <>
                        <dt>Release Date</dt>
                        <dd>
                          <span itemProp="datePublished">{atbdCitation.release_date}</span>
                        </dd>
                      </>
                    )}
                    {atbdCitation && atbdCitation.publisher && (
                      <>
                        <dt>Publisher</dt>
                        <dd>
                          <span itemProp="publisher">{atbdCitation.publisher}</span>
                        </dd>
                      </>
                    )}
                    {atbdCitation && atbdCitation.online_resource && (
                      <>
                        <dt>Url</dt>
                        <dd>
                          <span itemProp="url">{atbdCitation.online_resource}</span>
                        </dd>
                      </>
                    )}
                  </AtbdMetaDetails>
                </AtbdMeta>

                {this.renderContent()}
              </AtbdContent>
            </InpageBodyInner>
          </InpageBody>
        </StickyContainer>
      </Inpage>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    selectedAtbd,
    atbdVersion,
    atbdCitation
  } = state.application;

  return {
    atbdVersion,
    atbd: selectedAtbd,
    atbdCitation,
  };
};

const mapDispatch = {
  updateAtbdVersionAction: updateAtbdVersion,
  deleteAtbdAction: deleteAtbd,
  copyAtbdAction: copyAtbd,
  visitLink: push
};

export default connect(
  mapStateToProps,
  mapDispatch
)(AtbdView);
