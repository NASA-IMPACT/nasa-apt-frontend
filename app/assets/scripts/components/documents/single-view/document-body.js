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
  formatReference
} from '../../../utils/references';
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

const HeadingContextualActions = ({ id }) => {
  const { openPanelOn } = useCommentCenter();

  const openCommentsOnSection = useCallback(
    (e) => {
      e.preventDefault();
      openPanelOn({ section: id });
    },
    [openPanelOn, id]
  );

  const hasCommentButton = DOCUMENT_SECTIONS.find(
    (section) => section.id === id
  );

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
const AtbdSectionBase = ({ id, title, children, ...props }) => (
  <section {...props}>
    <HeadingWActions as='h2' id={id} data-scroll='target'>
      <span>{title}</span>
      <HeadingContextualActions id={id} />
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
  }
`;

// When the section that's being rendered is a list of items we only need
// to print the title and then the data from the children.
// This method is a utility to just render the children.
const AtbdSectionPassThrough = ({ element, children }) => {
  return (
    <AtbdSection key={element.id} id={element.id} title={element.label}>
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
  atbd
}) => {
  return (
    <React.Fragment>
      <HeadingWActions as={HLevel} id={element.id} data-scroll='target'>
        <span>{element.label}</span>
        <HeadingContextualActions id={element.id} />
      </HeadingWActions>
      {withEditor && (
        <SafeReadEditor
          context={{
            subsectionLevel,
            sectionId: element.id,
            references: document.publication_references,
            referencesUseIndex,
            atbd
          }}
          value={value}
          whenEmpty={<EmptySection />}
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
        <p
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
        </p>
      </dd>
      <dt>Description</dt>
      <dd>
        <MultilineString value={description} whenEmpty={<EmptySection />} />
      </dd>
    </DetailsList>
  </AtbdSubSection>
);

const VariableItem = ({ element, variable }) => (
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
    <h3 id={id} data-scroll='target' itemProp='name'>
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

const EmptySection = () => <p>No content available.</p>;

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
export const atbdContentSections = [
  {
    label: 'Document header',
    id: 'doc-header',
    // Render nothing. It's just to show up in the outline.
    render: () => null
  },
  {
    label: 'Abstract',
    id: 'abstract',
    render: ({ element, document, referencesUseIndex, atbd }) => (
      <AtbdSection key={element.id} id={element.id} title={element.label}>
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
    render: ({ element, document, referencesUseIndex, atbd }) => (
      <AtbdSection key={element.id} id={element.id} title={element.label}>
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
    render: ({ element, document, referencesUseIndex, atbd }) => (
      <AtbdSection key={element.id} id={element.id} title={element.label}>
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
    render: ({ element, document, referencesUseIndex, atbd }) => (
      <AtbdSection key={element.id} id={element.id} title={element.label}>
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
        render: ({ element, children }) => (
          <React.Fragment key={element.id}>
            <HeadingWActions as='h3' id={element.id} data-scroll='target'>
              <span>{element.label}</span>
              <HeadingContextualActions id={element.id} />
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
        render: ({ element, children }) => (
          <React.Fragment key={element.id}>
            <HeadingWActions as='h3' id={element.id} data-scroll='target'>
              <span>{element.label}</span>
              <HeadingContextualActions id={element.id} />
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
    render: ({ element, document, referencesUseIndex, atbd }) => (
      <AtbdSection key={element.id} id={element.id} title={element.label}>
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
          return items.map((o, idx) => ({
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
          return items.map((o, idx) => ({
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
          return items.map((o, idx) => ({
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
    label: 'Contacts',
    id: 'contacts',
    render: ({ element, children }) => (
      <AtbdSection key={element.id} id={element.id} title={element.label}>
        {React.Children.count(children) ? (
          children
        ) : (
          <p>There are no contacts associated with this document</p>
        )}
      </AtbdSection>
    ),
    children: ({ atbd }) => {
      const contactsLink = atbd?.contacts_link || [];
      return contactsLink.map(({ contact, roles, affiliations }, idx) => ({
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
    render: ({ element, document, referencesUseIndex }) => {
      const referencesInUse = Object.values(referencesUseIndex);
      return (
        <AtbdSection key={element.id} id={element.id} title={element.label}>
          {referencesInUse.length ? (
            <ReferencesList>
              {referencesInUse.map(({ docIndex, refId }) => {
                const ref = (document.publication_references || []).find(
                  (r) => r.id === refId
                );
                return (
                  <li key={refId}>
                    [{docIndex}]{' '}
                    {ref ? formatReference(ref) : 'Reference not found'}
                  </li>
                );
              })}
            </ReferencesList>
          ) : (
            <p>No references were used in this document.</p>
          )}
        </AtbdSection>
      );
    }
  },
  {
    label: 'Journal Details',
    id: 'journal_details',
    shouldRender: ({ atbd }) => isJournalPublicationIntended(atbd),
    render: ({ element, children }) => (
      <AtbdSection key={element.id} id={element.id} title={element.label}>
        <p>
          <em>
            If provided, the journal details are included only in the Journal
            PDF.
          </em>
        </p>
        {children}
      </AtbdSection>
    ),
    children: [
      {
        label: 'Key Points',
        id: 'key_points',
        render: ({ element, document }) => (
          <AtbdSection key={element.id} id={element.id} title={element.label}>
            <MultilineString
              value={document.key_points}
              whenEmpty={<EmptySection />}
            />
          </AtbdSection>
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
            withEditor
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
          />
        )
      }
    ]
  }
];

export default function DocumentBody(props) {
  const { atbd } = props;
  const document = atbd.document;

  // Scroll to an existing hash when the component mounts.
  useScrollToHashOnMount();
  // Setup the listener to change active links.
  useScrollListener();

  const referencesUseIndex = useMemo(
    () => createDocumentReferenceIndex(document),
    [document]
  );

  return renderElements(atbdContentSections, {
    document,
    referencesUseIndex,
    atbd
  });
}

DocumentBody.propTypes = {
  atbd: T.object
};
