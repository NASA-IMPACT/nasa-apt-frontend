/* eslint-disable react/display-name, react/prop-types */
import React, { useCallback, useMemo } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import nl2br from 'react-nl2br';
import { glsp } from '@devseed-ui/theme-provider';
import { Button } from '@devseed-ui/button';

import { SafeReadEditor, subsectionsFromSlateDocument } from '../../slate';
import DetailsList from '../../../styles/typography/details-list';
import HeadingWActions from '../../../styles/heading-with-actions';

import {
  createDocumentReferenceIndex,
  formatReference,
  sortReferences
} from '../../../utils/references';
import { journalStatusValueToLabel } from '../single-edit/step-closeout/journal-details';
import { useScrollListener, useScrollToHashOnMount } from './scroll-manager';
import { proseInnerSpacing } from '../../../styles/typography/prose';
import {
  renderMultipleStringValues,
  getContactName
} from '../../contacts/contact-utils';
import { DOCUMENT_SECTIONS } from '../single-edit/sections';
import { useCommentCenter } from '../../../context/comment-center';
import { isJournalPublicationIntended } from '../status';
import serializeSlateToString from '../../slate/serialize-to-string';
import { useContextualAbility } from '../../../a11n';

const PDFPreview = styled.iframe`
  width: 100%;
  height: 60vh;
  border: 0;
  margin-bottom: ${glsp(3)};
`;

const HeadingContextualActions = ({ id, atbd }) => {
  const { openPanelOn } = useCommentCenter();

  const openCommentsOnSection = useCallback(
    (e) => {
      e.preventDefault();
      openPanelOn({ section: id });
    },
    [openPanelOn, id]
  );

  const ability = useContextualAbility();
  const hasCommentButton =
    ability.can('access-comments', atbd) &&
    DOCUMENT_SECTIONS.find((section) => section.id === id);

  if (!hasCommentButton) return null;
  return (
    <span>
      <Button
        forwardedAs='a'
        href='#'
        size='small'
        useIcon='speech-balloon'
        title='Show comments for this section'
        hideText
        onClick={openCommentsOnSection}
      >
        Show comments
      </Button>
    </span>
  );
};

// Wrapper for each of the main sections.
const AtbdSectionBase = ({
  printMode,
  id,
  title,
  children,
  atbd,
  ...props
}) => (
  <section {...props}>
    <HeadingWActions as='h2' id={id} data-scroll='target'>
      <span>{title}</span>
      {!printMode && <HeadingContextualActions id={id} atbd={atbd} />}
    </HeadingWActions>
    {children}
  </section>
);

const AtbdSection = styled(AtbdSectionBase)`
  ${proseInnerSpacing()}

  &:not(:last-child) {
    &::after {
      width: ${glsp(8)};
    }
  }
`;

const AtbdSubSection = styled.div`
  ${proseInnerSpacing()}
`;

const ReferencesList = styled.ol`
  && {
    list-style: none;
    margin: 0;
    line-height: 2.5;
  }
`;

// When the section that's being rendered is a list of items we only need
// to print the title and then the data from the children.
// This method is a utility to just render the children.
const AtbdSectionPassThrough = ({ element, children, atbd, printMode }) => {
  return (
    <AtbdSection
      key={element.id}
      id={element.id}
      title={element.label}
      atbd={atbd}
      printMode={printMode}
    >
      {React.Children.count(children) ? children : <EmptySection />}
    </AtbdSection>
  );
};

const MultilineString = ({ value, whenEmpty, ...rest }) => {
  if (!value || typeof value !== 'string') {
    return whenEmpty;
  }

  return <p {...rest}>{nl2br(value)}</p>;
};

const FragmentWithOptionalEditor = ({
  element,
  document,
  children,
  value,
  withEditor,
  HLevel,
  subsectionLevel,
  referencesUseIndex,
  atbd,
  withoutHeading = false,
  className,
  printMode
}) => {
  return (
    <React.Fragment>
      {!withoutHeading && (
        <HeadingWActions
          className={className}
          as={HLevel}
          id={element.id}
          data-scroll='target'
        >
          <span>{element.label}</span>
          {!printMode && (
            <HeadingContextualActions id={element.id} atbd={atbd} />
          )}
        </HeadingWActions>
      )}
      {withEditor && (
        <SafeReadEditor
          className={className}
          context={{
            subsectionLevel,
            sectionId: element.id,
            references: document.publication_references,
            referencesUseIndex,
            atbd
          }}
          value={value}
          whenEmpty={<EmptySection className={className} />}
        />
      )}
      {children}
    </React.Fragment>
  );
};

const DataAccessItem = ({ id, label, url, description }) => (
  <AtbdSubSection key={id} itemScope itemType='https://schema.org/Dataset'>
    <h4 id={id} itemProp='name' data-scroll='target'>
      {label}
    </h4>
    <DetailsList>
      <dt>Url</dt>
      <dd>
        <div
          itemProp='distribution'
          itemScope
          itemType='https://schema.org/DataDownload'
        >
          <a
            href={url}
            target='_blank'
            rel='noopener noreferrer'
            title='Open url in new tab'
            itemProp='contentUrl'
          >
            {url}
          </a>
        </div>
      </dd>
      <dt>Description</dt>
      <dd>
        <MultilineString value={description} whenEmpty={<EmptySection />} />
      </dd>
    </DetailsList>
  </AtbdSubSection>
);

export const VariableItem = ({ element, variable }) => (
  <React.Fragment>
    <h4 id={element.id} data-scroll='target'>
      {element.label}
    </h4>
    <DetailsList>
      <dt>Name</dt>
      <dd>
        <SafeReadEditor value={variable.name} whenEmpty={<EmptySection />} />
      </dd>
      <dt>Long name</dt>
      <dd>
        <SafeReadEditor
          value={variable.long_name}
          whenEmpty={<EmptySection />}
        />
      </dd>
      <dt>Unit</dt>
      <dd>
        <SafeReadEditor value={variable.unit} whenEmpty={<EmptySection />} />
      </dd>
    </DetailsList>
  </React.Fragment>
);

const ContactItem = ({ id, label, contact, roles, affiliations }) => (
  <AtbdSubSection itemScope itemType='https://schema.org/ContactPoint'>
    <h3
      id={id}
      className='pdf-preview-no-toc'
      data-scroll='target'
      itemProp='name'
    >
      {label}
    </h3>
    <DetailsList type='horizontal'>
      <dt>Roles</dt>
      {roles.length ? (
        <dd itemProp='contactType'>{renderMultipleStringValues(roles)}</dd>
      ) : (
        <dd itemProp='contactType'>No roles in this document</dd>
      )}
      <dt>Affiliations</dt>
      {affiliations.length ? (
        <dd>{renderMultipleStringValues(affiliations)}</dd>
      ) : (
        <dd>No affiliations in this document</dd>
      )}
      {contact.mechanisms?.map?.((mechanism, i) => (
        // Nothing will cause the order to change on this
        // page. Array keys are safe.
        <React.Fragment
          /* eslint-disable-next-line react/no-array-index-key */
          key={`${mechanism.mechanism_type}-${i}`}
        >
          <dt itemProp='contactOption'>{mechanism.mechanism_type}</dt>
          <dd>{mechanism.mechanism_value}</dd>
        </React.Fragment>
      ))}
      {contact.url && (
        <React.Fragment>
          <dt>Url</dt>
          <dd>
            <a
              href={contact.url}
              target='_blank'
              rel='noopener noreferrer'
              title='Open url in new tab'
              itemProp='url'
            >
              {contact.url}
            </a>
          </dd>
        </React.Fragment>
      )}
      {contact.uuid && (
        <React.Fragment>
          <dt>UUID</dt>
          <dd itemProp='identifier'>{contact.uuid}</dd>
        </React.Fragment>
      )}
    </DetailsList>
  </AtbdSubSection>
);

export const EmptySection = ({ className }) => (
  <p className={className}>No content available.</p>
);

/**
 * Renders each element of the given array (by calling their `render` function)
 * and its children.
 * @param {array} elements Elements to render.
 * @param {object} props Additional props to pass the element render function,
 */
const renderElements = (elements, props) =>
  elements
    ? elements.map((el) => {
        if (
          typeof el.shouldRender === 'function' &&
          !el.shouldRender({ element: el, ...props })
        ) {
          return null;
        }
        // If children is a function means it needs props to dynamically render
        // them, like the case of array fields.
        const resultingChildren =
          typeof el.children === 'function' ? el.children(props) : el.children;
        const children = renderElements(resultingChildren, props);
        return el.render({ element: el, children, ...props });
      })
    : null;

// The index contains all the sections to be rendered.
// Each node has the following properties:
// label: Human readable title to print
// id: Unique id in the whole page to be used as anchor
// shouldRender: Whether or not this section should be rendered. If not
// provided, the default is true.
// editorSubsections: For the fields edited through slate, we need to extract the
//    subsections which are user generated. These will be added to the children
//    when rendering.
// render: Function to render this element. It is called with the current
//    element being rendered. The first level of the index is rendered with the
//    <AtbdSection> wrapper.
// children: Any children this node should have. They must follow this
//    same structure.
const htmlAtbdContentSections = [
  {
    label: 'Document header',
    id: 'doc-header',
    // Render nothing. It's just to show up in the outline.
    render: () => null
  },
  {
    label: 'Abstract',
    id: 'abstract',
    editorSubsections: (document, { id }) =>
      subsectionsFromSlateDocument(document.abstract, id),
    render: ({ printMode, element, document, referencesUseIndex, atbd }) => (
      <AtbdSection
        className='pdf-preview-no-numbering'
        key={element.id}
        id={element.id}
        title={element.label}
        atbd={atbd}
        printMode={printMode}
      >
        <SafeReadEditor
          context={{
            subsectionLevel: 'h3',
            sectionId: element.id,
            references: document.publication_references,
            referencesUseIndex,
            atbd
          }}
          value={document.abstract}
          whenEmpty={<EmptySection />}
        />
      </AtbdSection>
    )
  },
  {
    label: 'Plain Language Summary',
    id: 'plain_summary',
    editorSubsections: (document, { id }) =>
      subsectionsFromSlateDocument(document.plain_summary, id),
    render: ({ element, document, referencesUseIndex, atbd, printMode }) => (
      <AtbdSection
        className='pdf-preview-no-numbering'
        key={element.id}
        id={element.id}
        title={element.label}
        atbd={atbd}
        printMode={printMode}
      >
        <SafeReadEditor
          context={{
            subsectionLevel: 'h3',
            sectionId: element.id,
            references: document.publication_references,
            referencesUseIndex,
            atbd
          }}
          value={document.plain_summary}
          whenEmpty={<EmptySection />}
        />
      </AtbdSection>
    )
  },
  {
    label: 'Version description',
    id: 'version_description',
    shouldRender: ({ document }) =>
      !!serializeSlateToString(document.version_description),
    editorSubsections: (document, { id }) =>
      subsectionsFromSlateDocument(document.version_description, id),
    render: ({ element, document, referencesUseIndex, atbd, printMode }) => (
      <AtbdSection
        className='pdf-preview-no-numbering'
        key={element.id}
        id={element.id}
        title={element.label}
        atbd={atbd}
        printMode={printMode}
      >
        <SafeReadEditor
          context={{
            subsectionLevel: 'h3',
            sectionId: element.id,
            references: document.publication_references,
            referencesUseIndex,
            atbd
          }}
          value={document.version_description}
          whenEmpty={<EmptySection />}
        />
      </AtbdSection>
    )
  },
  {
    label: 'Introduction',
    id: 'introduction',
    editorSubsections: (document, { id }) =>
      subsectionsFromSlateDocument(document.introduction, id),
    render: ({ element, document, referencesUseIndex, atbd, printMode }) => (
      <AtbdSection
        className='pdf-preview-break-before-page'
        key={element.id}
        id={element.id}
        title={element.label}
        atbd={atbd}
        printMode={printMode}
      >
        <SafeReadEditor
          context={{
            subsectionLevel: 'h3',
            sectionId: element.id,
            references: document.publication_references,
            referencesUseIndex,
            atbd
          }}
          value={document.introduction}
          whenEmpty={<EmptySection />}
        />
      </AtbdSection>
    )
  },
  {
    label: 'Context / Background',
    id: 'context_background',
    render: AtbdSectionPassThrough,
    children: [
      {
        label: 'Historical Perspective',
        id: 'historical_perspective',
        editorSubsections: (document, { id }) =>
          subsectionsFromSlateDocument(document.historical_perspective, id),
        render: (props) => (
          <FragmentWithOptionalEditor
            {...props}
            key={props.element.id}
            element={props.element}
            value={props.document.historical_perspective}
            HLevel='h3'
            subsectionLevel='h4'
            withEditor
          />
        )
      },
      {
        label: 'Additional information',
        id: 'additional_information',
        editorSubsections: (document, { id }) =>
          subsectionsFromSlateDocument(document.additional_information, id),
        render: (props) => (
          <FragmentWithOptionalEditor
            {...props}
            key={props.element.id}
            element={props.element}
            value={props.document.additional_information}
            HLevel='h3'
            subsectionLevel='h4'
            withEditor
          />
        )
      }
    ]
  },
  {
    label: 'Algorithm Description',
    id: 'algo_description',
    render: AtbdSectionPassThrough,
    children: [
      {
        label: 'Scientific Theory',
        id: 'scientific_theory',
        editorSubsections: (document, { id }) =>
          subsectionsFromSlateDocument(document.scientific_theory, id),
        render: (props) => (
          <FragmentWithOptionalEditor
            {...props}
            key={props.element.id}
            element={props.element}
            value={props.document.scientific_theory}
            HLevel='h3'
            subsectionLevel='h4'
            withEditor
          >
            {React.Children.count(props.children) ? (
              props.children
            ) : (
              <EmptySection />
            )}
          </FragmentWithOptionalEditor>
        ),
        children: [
          {
            label: 'Assumptions',
            id: 'scientific_theory_assumptions',
            editorSubsections: (document, { id }) =>
              subsectionsFromSlateDocument(
                document.scientific_theory_assumptions,
                id
              ),
            render: (props) => (
              <FragmentWithOptionalEditor
                {...props}
                key={props.element.id}
                element={props.element}
                value={props.document.scientific_theory_assumptions}
                HLevel='h4'
                subsectionLevel='h5'
                withEditor
              />
            )
          }
        ]
      },
      {
        label: 'Mathematical Theory',
        id: 'mathematical_theory',
        editorSubsections: (document, { id }) =>
          subsectionsFromSlateDocument(document.mathematical_theory, id),
        render: (props) => (
          <FragmentWithOptionalEditor
            {...props}
            key={props.element.id}
            element={props.element}
            value={props.document.mathematical_theory}
            HLevel='h3'
            subsectionLevel='h4'
            withEditor
          >
            {React.Children.count(props.children) ? (
              props.children
            ) : (
              <EmptySection />
            )}
          </FragmentWithOptionalEditor>
        ),
        children: [
          {
            label: 'Assumptions',
            id: 'mathematical_theory_assumptions',
            editorSubsections: (document, { id }) =>
              subsectionsFromSlateDocument(
                document.mathematical_theory_assumptions,
                id
              ),
            render: (props) => (
              <FragmentWithOptionalEditor
                {...props}
                key={props.element.id}
                element={props.element}
                value={props.document.mathematical_theory_assumptions}
                HLevel='h4'
                subsectionLevel='h5'
                withEditor
              />
            )
          }
        ]
      },
      {
        label: 'Algorithm Input Variables',
        id: 'input_variables',
        render: ({ printMode, element, children, atbd }) => (
          <React.Fragment key={element.id}>
            <HeadingWActions as='h3' id={element.id} data-scroll='target'>
              <span>{element.label}</span>
              {!printMode && (
                <HeadingContextualActions id={element.id} atbd={atbd} />
              )}
            </HeadingWActions>
            {React.Children.count(children) ? children : <EmptySection />}
          </React.Fragment>
        ),
        children: ({ document }) => {
          const items = document.algorithm_input_variables || [];
          return items.map((o, idx) => ({
            label: `Variable #${idx + 1}`,
            id: `input_variables_${idx + 1}`,
            render: ({ element }) => (
              <VariableItem key={element.id} element={element} variable={o} />
            )
          }));
        }
      },
      {
        label: 'Algorithm Output Variables',
        id: 'output_variables',
        render: ({ printMode, element, children, atbd }) => (
          <React.Fragment key={element.id}>
            <HeadingWActions as='h3' id={element.id} data-scroll='target'>
              <span>{element.label}</span>
              {!printMode && (
                <HeadingContextualActions id={element.id} atbd={atbd} />
              )}
            </HeadingWActions>
            {React.Children.count(children) ? children : <EmptySection />}
          </React.Fragment>
        ),
        children: ({ document }) => {
          const items = document.algorithm_output_variables || [];
          return items.map((o, idx) => ({
            label: `Variable #${idx + 1}`,
            id: `output_variables_${idx + 1}`,
            render: ({ element }) => (
              <VariableItem key={element.id} element={element} variable={o} />
            )
          }));
        }
      }
    ]
  },
  {
    label: 'Algorithm Availability',
    id: 'algorithm_availability',
    render: AtbdSectionPassThrough,
    children: ({ document }) => {
      const items = document.algorithm_implementations || [];

      return items.map((o, idx) => ({
        label: `Location of Implemented Algorithm #${idx + 1}`,
        id: `algorithm_availability_${idx + 1}`,
        render: ({ element, document }) => (
          <AtbdSubSection
            key={element.id}
            itemProp='hasPart'
            itemScope
            itemType='https://schema.org/CreativeWork'
          >
            <h3 id={element.id} itemProp='name' data-scroll='target'>
              {element.label}
            </h3>
            <DetailsList>
              <dt>Url</dt>
              <dd>
                <p>
                  <a
                    href={o.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    title='Open url in new tab'
                    itemProp='url'
                  >
                    {o.url}
                  </a>
                </p>
              </dd>
              <dt>Description</dt>
              <dd>
                <MultilineString
                  itemProp='description'
                  value={document.algorithm_implementations[idx].description}
                  whenEmpty={<EmptySection />}
                />
              </dd>
            </DetailsList>
          </AtbdSubSection>
        )
      }));
    }
  },
  {
    label: 'Algorithm Usage Constraints',
    id: 'constraints',
    editorSubsections: (document, { id }) =>
      subsectionsFromSlateDocument(document.algorithm_usage_constraints, id),
    render: ({ element, document, referencesUseIndex, atbd, printMode }) => (
      <AtbdSection
        key={element.id}
        id={element.id}
        title={element.label}
        atbd={atbd}
        printMode={printMode}
      >
        <SafeReadEditor
          value={document.algorithm_usage_constraints}
          context={{
            subsectionLevel: 'h3',
            sectionId: element.id,
            references: document.publication_references,
            referencesUseIndex,
            atbd
          }}
          whenEmpty={<EmptySection />}
        />
      </AtbdSection>
    )
  },
  {
    label: 'Performance Assessment Validation',
    id: 'validation',
    render: AtbdSectionPassThrough,
    children: [
      {
        label: 'Performance Assessment Validation Methods',
        id: 'validation_method',
        editorSubsections: (document, { id }) =>
          subsectionsFromSlateDocument(
            document.performance_assessment_validation_methods,
            id
          ),
        render: (props) => (
          <FragmentWithOptionalEditor
            {...props}
            key={props.element.id}
            element={props.element}
            value={props.document.performance_assessment_validation_methods}
            HLevel='h3'
            subsectionLevel='h4'
            withEditor
          />
        )
      },
      {
        label: 'Performance Assessment Validation Uncertainties',
        id: 'validation_uncert',
        editorSubsections: (document, { id }) =>
          subsectionsFromSlateDocument(
            document.performance_assessment_validation_uncertainties,
            id
          ),
        render: (props) => (
          <FragmentWithOptionalEditor
            {...props}
            key={props.element.id}
            element={props.element}
            value={
              props.document.performance_assessment_validation_uncertainties
            }
            HLevel='h3'
            subsectionLevel='h4'
            withEditor
          />
        )
      },
      {
        label: 'Performance Assessment Validation Errors',
        id: 'validation_err',
        editorSubsections: (document, { id }) =>
          subsectionsFromSlateDocument(
            document.performance_assessment_validation_errors,
            id
          ),
        render: (props) => (
          <FragmentWithOptionalEditor
            {...props}
            key={props.element.id}
            element={props.element}
            value={props.document.performance_assessment_validation_errors}
            HLevel='h3'
            subsectionLevel='h4'
            withEditor
          />
        )
      }
    ]
  },
  {
    label: 'Data Access',
    id: 'data_access',
    render: AtbdSectionPassThrough,
    children: [
      {
        label: 'Input Data Data Access',
        id: 'data_access_input_data',
        render: (props) => (
          <FragmentWithOptionalEditor
            {...props}
            key={props.element.id}
            element={props.element}
            HLevel='h3'
            subsectionLevel='h4'
          >
            {React.Children.count(props.children) ? (
              props.children
            ) : (
              <EmptySection />
            )}
          </FragmentWithOptionalEditor>
        ),
        children: ({ document }) => {
          const items = document.data_access_input_data || [];
          return items.map((_, idx) => ({
            label: `Entry #${idx + 1}`,
            id: `data_access_input_data_${idx + 1}`,
            render: ({ element, document }) => (
              <DataAccessItem
                key={element.id}
                id={element.id}
                label={element.label}
                url={document.data_access_input_data[idx].url}
                description={document.data_access_input_data[idx].description}
              />
            )
          }));
        }
      },
      {
        label: 'Output Data Data Access',
        id: 'data_access_output_data',
        render: (props) => (
          <FragmentWithOptionalEditor
            {...props}
            key={props.element.id}
            element={props.element}
            HLevel='h3'
            subsectionLevel='h4'
          >
            {React.Children.count(props.children) ? (
              props.children
            ) : (
              <EmptySection />
            )}
          </FragmentWithOptionalEditor>
        ),
        children: ({ document }) => {
          const items = document.data_access_output_data || [];
          return items.map((_, idx) => ({
            label: `Entry #${idx + 1}`,
            id: `data_access_output_data_${idx + 1}`,
            render: ({ element, document }) => (
              <DataAccessItem
                key={element.id}
                id={element.id}
                label={element.label}
                url={document.data_access_output_data[idx].url}
                description={document.data_access_output_data[idx].description}
              />
            )
          }));
        }
      },
      {
        label: 'Important Related URLs',
        id: 'data_access_related_urls',
        render: (props) => (
          <FragmentWithOptionalEditor
            {...props}
            key={props.element.id}
            element={props.element}
            HLevel='h3'
            subsectionLevel='h4'
          >
            {React.Children.count(props.children) ? (
              props.children
            ) : (
              <EmptySection />
            )}
          </FragmentWithOptionalEditor>
        ),
        children: ({ document }) => {
          const items = document.data_access_related_urls || [];
          return items.map((_, idx) => ({
            label: `Entry #${idx + 1}`,
            id: `data_access_related_urls_${idx + 1}`,
            render: ({ element, document }) => (
              <DataAccessItem
                key={element.id}
                id={element.id}
                label={element.label}
                url={document.data_access_related_urls[idx].url}
                description={document.data_access_related_urls[idx].description}
              />
            )
          }));
        }
      }
    ]
  },
  {
    label: 'Journal Details',
    id: 'journal_details',
    shouldRender: ({ atbd }) => isJournalPublicationIntended(atbd),
    render: ({ element, children, atbd, printMode, document }) => {
      function isJournalDiscussionEmpty() {
        if (
          !document.journal_discussion ||
          !document.journal_discussion.children
        ) {
          return true;
        }

        return document.journal_discussion.children.every((node) => {
          if (node.type === 'p' && node.children?.every(({ text }) => !text)) {
            return true;
          }

          return false;
        });
      }

      return (
        <AtbdSection
          key={element.id}
          id={element.id}
          title={printMode ? 'Significance Discussion' : element.label}
          atbd={atbd}
          printMode={printMode}
          className={
            isJournalDiscussionEmpty() ? 'pdf-preview-hidden' : undefined
          }
        >
          <p className='pdf-preview-hidden'>
            <em>
              If provided, the journal details are included only in the Journal
              PDF.
            </em>
          </p>
          {children}
        </AtbdSection>
      );
    },
    children: [
      {
        label: 'Key Points',
        id: 'key_points',
        render: ({ element, document, atbd, printMode }) => (
          <FragmentWithOptionalEditor
            key={element.id}
            element={element}
            atbd={atbd}
            printMode={printMode}
            HLevel='h3'
            subsectionLevel='h4'
            className='pdf-preview-hidden'
          >
            <MultilineString
              className='pdf-preview-hidden'
              value={document.key_points}
              whenEmpty={<EmptySection className='pdf-preview-hidden' />}
            />
          </FragmentWithOptionalEditor>
        )
      },
      {
        label: 'Significance Discussion',
        id: 'discussion',
        editorSubsections: (document, { id }) =>
          subsectionsFromSlateDocument(document.journal_discussion, id),
        render: (props) => (
          <FragmentWithOptionalEditor
            {...props}
            key={props.element.id}
            element={props.element}
            value={props.document.journal_discussion}
            HLevel='h3'
            subsectionLevel='h4'
            className='pdf-preview-no-toc'
            withEditor
            withoutHeading={props.printMode}
          />
        )
      },
      {
        label: 'Acknowledgements',
        id: 'acknowledgements',
        editorSubsections: (document, { id }) =>
          subsectionsFromSlateDocument(document.journal_acknowledgements, id),
        render: (props) => (
          <FragmentWithOptionalEditor
            {...props}
            key={props.element.id}
            element={props.element}
            value={props.document.journal_acknowledgements}
            HLevel='h3'
            subsectionLevel='h4'
            withEditor
            className='pdf-preview-hidden'
          />
        )
      },
      {
        label: 'Open Research',
        id: 'data_availability',
        editorSubsections: (document, { id }) =>
          subsectionsFromSlateDocument(document.data_availability, id),
        render: (props) => (
          <FragmentWithOptionalEditor
            {...props}
            key={props.element.id}
            element={props.element}
            value={props.document.data_availability}
            HLevel='h3'
            subsectionLevel='h4'
            withEditor
            className='pdf-preview-hidden'
          />
        )
      }
    ]
  },
  {
    label: 'Contacts',
    id: 'contacts',
    render: ({ element, children, atbd, printMode }) => (
      <AtbdSection
        key={element.id}
        id={element.id}
        title={element.label}
        atbd={atbd}
        printMode={printMode}
      >
        {React.Children.count(children) ? (
          children
        ) : (
          <p>There are no contacts associated with this document</p>
        )}
      </AtbdSection>
    ),
    children: ({ atbd }) => {
      const contactsLink = atbd?.contacts_link || [];
      return contactsLink
        .filter(
          ({ roles }) =>
            // Remove reviewers that have the role 'Document Reviewer'
            !roles.includes('Document Reviewer')
        )
        .map(({ contact, roles, affiliations }, idx) => ({
          label: getContactName(contact),
          id: `contacts_${idx + 1}`,
          render: ({ element }) => (
            <ContactItem
              key={element.id}
              id={element.id}
              label={element.label}
              contact={contact}
              roles={roles}
              affiliations={affiliations}
            />
          )
        }));
    }
  },
  {
    label: 'Reviewer Information',
    id: 'reviewer_info',
    shouldRender: ({ atbd, printMode }) => {
      if (!atbd) return false;
      if (printMode) return false; // Should not render in the PDF preview

      // Render if there are reviewers with the role 'Document Reviewer'
      const contactsLink = atbd?.contacts_link || [];

      for (const { roles } of contactsLink) {
        if (roles.includes('Document Reviewer')) {
          return true;
        }
      }
      return false;
    },
    render: ({ element, atbd, printMode, children }) => {
      if (!atbd) {
        return null;
      }
      return (
        <AtbdSection
          key={element.id}
          id={element.id}
          title={element.label}
          atbd={atbd}
          printMode={printMode}
        >
          {React.Children.count(children) ? (
            children
          ) : (
            <p>There are no reviewers associated with this document</p>
          )}
        </AtbdSection>
      );
    },
    children: ({ atbd }) => {
      const contactsLink = atbd?.contacts_link || [];
      return contactsLink
        .filter(({ roles }) =>
          // Include reviewers that have the role 'Document Reviewer'
          roles.includes('Document Reviewer')
        )
        .map(({ contact, roles, affiliations }, idx) => ({
          label: getContactName(contact),
          id: `contacts_${idx + 1}`,
          render: ({ element }) => (
            <ContactItem
              key={element.id}
              id={element.id}
              label={element.label}
              contact={contact}
              roles={roles}
              affiliations={affiliations}
            />
          )
        }));
    }
  },
  {
    label: 'References',
    id: 'references',
    render: ({ element, referenceList, atbd, printMode }) => {
      return (
        <AtbdSection
          key={element.id}
          id={element.id}
          title={element.label}
          atbd={atbd}
          printMode={printMode}
          className='pdf-preview-break-before-page pdf-preview-no-numbering'
        >
          {referenceList.length ? (
            <ReferencesList className='reference-list'>
              {referenceList}
            </ReferencesList>
          ) : (
            <p>No references were used in this document.</p>
          )}
        </AtbdSection>
      );
    }
  }
];

const pdfAtbdContentSections = [
  {
    label: 'Document header',
    id: 'doc-header',
    // Render nothing. It's just to show up in the outline.
    render: () => null
  },
  {
    label: 'Abstract',
    id: 'abstract',
    editorSubsections: (document, { id }) =>
      subsectionsFromSlateDocument(document.abstract, id),
    render: ({ printMode, element, document, referencesUseIndex, atbd }) => (
      <AtbdSection
        className='pdf-preview-no-numbering'
        key={element.id}
        id={element.id}
        title={element.label}
        atbd={atbd}
        printMode={printMode}
      >
        <SafeReadEditor
          context={{
            subsectionLevel: 'h3',
            sectionId: element.id,
            references: document.publication_references,
            referencesUseIndex,
            atbd
          }}
          value={document.abstract}
          whenEmpty={<EmptySection />}
        />
      </AtbdSection>
    )
  },
  {
    label: 'Plain Language Summary',
    id: 'plain_summary',
    editorSubsections: (document, { id }) =>
      subsectionsFromSlateDocument(document.plain_summary, id),
    render: ({ element, document, referencesUseIndex, atbd, printMode }) => (
      <AtbdSection
        className='pdf-preview-no-numbering'
        key={element.id}
        id={element.id}
        title={element.label}
        atbd={atbd}
        printMode={printMode}
      >
        <SafeReadEditor
          context={{
            subsectionLevel: 'h3',
            sectionId: element.id,
            references: document.publication_references,
            referencesUseIndex,
            atbd
          }}
          value={document.plain_summary}
          whenEmpty={<EmptySection />}
        />
      </AtbdSection>
    )
  },
  {
    label: 'Version description',
    id: 'version_description',
    shouldRender: ({ document }) =>
      !!serializeSlateToString(document.version_description),
    editorSubsections: (document, { id }) =>
      subsectionsFromSlateDocument(document.version_description, id),
    render: ({ element, document, referencesUseIndex, atbd, printMode }) => (
      <AtbdSection
        className='pdf-preview-no-numbering'
        key={element.id}
        id={element.id}
        title={element.label}
        atbd={atbd}
        printMode={printMode}
      >
        <SafeReadEditor
          context={{
            subsectionLevel: 'h3',
            sectionId: element.id,
            references: document.publication_references,
            referencesUseIndex,
            atbd
          }}
          value={document.version_description}
          whenEmpty={<EmptySection />}
        />
      </AtbdSection>
    )
  },
  {
    label: 'Contacts',
    id: 'contacts',
    render: ({ element, children, atbd, printMode }) => (
      <AtbdSection
        key={element.id}
        id={element.id}
        title={element.label}
        atbd={atbd}
        printMode={printMode}
      >
        {React.Children.count(children) ? (
          children
        ) : (
          <p>There are no contacts associated with this document</p>
        )}
      </AtbdSection>
    ),
    children: ({ atbd }) => {
      const contactsLink = atbd?.contacts_link || [];
      return contactsLink
        .filter(
          ({ roles }) =>
            // Remove reviewers that have the role 'Document Reviewer'
            !roles.includes('Document Reviewer')
        )
        .map(({ contact, roles, affiliations }, idx) => ({
          label: getContactName(contact),
          id: `contacts_${idx + 1}`,
          render: ({ element }) => (
            <ContactItem
              key={element.id}
              id={element.id}
              label={element.label}
              contact={contact}
              roles={roles}
              affiliations={affiliations}
            />
          )
        }));
    }
  },
  {
    label: 'References',
    id: 'references',
    render: ({ element, referenceList, atbd, printMode }) => {
      return (
        <AtbdSection
          key={element.id}
          id={element.id}
          title={element.label}
          atbd={atbd}
          printMode={printMode}
          className='pdf-preview-break-before-page'
        >
          {referenceList.length ? (
            <ReferencesList className='reference-list'>
              {referenceList}
            </ReferencesList>
          ) : (
            <p>No references were used in this document.</p>
          )}
        </AtbdSection>
      );
    }
  },
  {
    label: 'Attachment',
    id: 'attachment',
    render: ({ element, atbd, printMode }) => {
      return (
        <AtbdSection
          key={element.id}
          id={element.id}
          title={element.label}
          atbd={atbd}
          printMode={printMode}
          className='pdf-preview-hidden'
        >
          <PDFPreview src={atbd.pdf?.file_path} />
        </AtbdSection>
      );
    }
  },
  {
    label: 'Journal Details',
    id: 'journal_details',
    shouldRender: ({ atbd }) => isJournalPublicationIntended(atbd),
    render: ({ element, atbd, printMode }) => {
      return (
        <AtbdSection
          key={element.id}
          id={element.id}
          title={element.label}
          atbd={atbd}
          printMode={printMode}
        >
          <p>{journalStatusValueToLabel(atbd.journal_status)}</p>
        </AtbdSection>
      );
    }
  }
];

export function getAtbdContentSections(pdfMode = false) {
  if (pdfMode) {
    return pdfAtbdContentSections;
  }

  return htmlAtbdContentSections;
}

export default function DocumentBody(props) {
  const { atbd, disableScrollManagement } = props;
  const document = atbd.document;
  // Scroll to an existing hash when the component mounts.
  useScrollToHashOnMount(disableScrollManagement);
  // Setup the listener to change active links.
  useScrollListener(disableScrollManagement);

  const referencesUseIndex = useMemo(
    () => createDocumentReferenceIndex(document),
    [document]
  );

  const referenceList = useMemo(
    () =>
      Object.values(referencesUseIndex)
        .sort(function (a, b) {
          const refA = (document.publication_references || []).find(
            (r) => r.id === a.refId
          );
          const refB = (document.publication_references || []).find(
            (r) => r.id === b.refId
          );

          return sortReferences(refA, refB);
        })
        .map(({ refId }) => {
          const ref = (document.publication_references || []).find(
            (r) => r.id === refId
          );
          return (
            <li key={refId}>
              {ref ? formatReference(ref, 'jsx') : 'Reference not found'}
            </li>
          );
        }),
    [referencesUseIndex, document.publication_references]
  );

  return renderElements(getAtbdContentSections(atbd.document_type === 'PDF'), {
    document,
    referencesUseIndex,
    referenceList,
    atbd,
    printMode: disableScrollManagement
  });
}

DocumentBody.propTypes = {
  atbd: T.object,
  disableScrollManagement: T.bool
};
