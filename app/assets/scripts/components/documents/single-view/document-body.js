/* eslint-disable react/display-name, react/prop-types */
import React, { useMemo } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { glsp, themeVal } from '@devseed-ui/theme-provider';

import { SafeReadEditor, subsectionsFromSlateDocument } from '../../slate';

import {
  createDocumentReferenceIndex,
  formatReference
} from '../../../utils/references';
import { useScrollListener, useScrollToHashOnMount } from './scroll-manager';
import { proseInnerSpacing } from '../../../styles/typography/prose';

// Wrapper for each of the main sections.
const AtbdSectionBase = ({ id, title, children, ...props }) => (
  <section {...props}>
    <h2 id={id} data-scroll='target'>
      {title}
    </h2>
    {children}
  </section>
);

const AtbdSection = styled(AtbdSectionBase)`
  ${proseInnerSpacing()}
  position: relative;

  &:not(:last-child) {
    padding-bottom: ${glsp(1.5)};

    &::after {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 1px;
      width: 8rem;
      background: ${themeVal('color.baseAlphaC')};
      content: '';
      pointer-events: none;
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

const FragmentWithOptionalEditor = ({
  element,
  document,
  children,
  value,
  withEditor,
  HLevel,
  subsectionLevel,
  referencesUseIndex
}) => {
  return (
    <React.Fragment>
      <HLevel id={element.id} data-scroll='target'>
        {element.label}
      </HLevel>
      {withEditor && (
        <SafeReadEditor
          context={{
            subsectionLevel,
            sectionId: element.id,
            references: document.publication_references,
            referencesUseIndex
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
    <h3 id={id} itemProp='name' data-scroll='target'>
      {label}
    </h3>
    <h4>Url</h4>
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
    <h4>Description</h4>
    <SafeReadEditor value={description} whenEmpty={<EmptySection />} />
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
// tocFromEditor: For the fields edited through slate, we need to extract the
//    subsections which are user generated. These will be added to the children
//    when rendering.
// render: Function to render this element. It is called with the current
//    element being rendered. The first level of the index is rendered with the
//    <AtbdSection> wrapper.
// children: Any children this node should have. They must follow this
//    same structure.
export const atbdContentSections = [
  {
    label: 'Introduction',
    id: 'introduction',
    editorSubsections: (document, { id }) =>
      subsectionsFromSlateDocument(document.introduction, id),
    render: ({ element, document, referencesUseIndex }) => (
      <AtbdSection key={element.id} id={element.id} title={element.label}>
        <SafeReadEditor
          context={{
            subsectionLevel: 'h3',
            sectionId: element.id,
            references: document.publication_references,
            referencesUseIndex
          }}
          value={document.introduction}
          whenEmpty={<EmptySection />}
        />
      </AtbdSection>
    )
  },
  {
    label: 'Historical Perspective',
    id: 'historic-perspective',
    editorSubsections: (document, { id }) =>
      subsectionsFromSlateDocument(document.historical_perspective, id),
    render: ({ element, document, referencesUseIndex }) => (
      <AtbdSection key={element.id} id={element.id} title={element.label}>
        <SafeReadEditor
          context={{
            subsectionLevel: 'h3',
            sectionId: element.id,
            references: document.publication_references,
            referencesUseIndex
          }}
          value={document.historical_perspective}
          whenEmpty={<EmptySection />}
        />
      </AtbdSection>
    )
  },
  {
    label: 'Algorithm Description',
    id: 'algo-description',
    render: AtbdSectionPassThrough,
    children: [
      {
        label: 'Scientific Theory',
        id: 'sci-theory',
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
            {props.children}
          </FragmentWithOptionalEditor>
        ),
        children: [
          {
            label: 'Assumptions',
            id: 'sci-theory-assumptions',
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
        id: 'math-theory',
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
            {props.children}
          </FragmentWithOptionalEditor>
        ),
        children: [
          {
            label: 'Assumptions',
            id: 'math-theory-assumptions',
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
        id: 'algo-input-var',
        render: ({ element }) => (
          <React.Fragment key={element.id}>
            <h3 id={element.id} data-scroll='target'>
              {element.label}
            </h3>
            <p>List of variables will be coming soon.</p>
          </React.Fragment>
        )
      },
      {
        label: 'Algorithm Output Variables',
        id: 'algo-output-var',
        render: ({ element }) => (
          <React.Fragment key={element.id}>
            <h3 id={element.id} data-scroll='target'>
              {element.label}
            </h3>
            <p>List of variables will be coming soon.</p>
          </React.Fragment>
        )
      }
    ]
  },
  {
    label: 'Algorithm Implementations',
    id: 'algo-implementations',
    render: AtbdSectionPassThrough,
    children: ({ document }) => {
      const items = document.algorithm_implementations || [];

      return items.map((o, idx) => ({
        label: `Entry #${idx + 1}`,
        id: `algo-implementations-${idx + 1}`,
        editorSubsections: (document, { id }) =>
          subsectionsFromSlateDocument(
            document.algorithm_implementations[idx].description,
            id
          ),
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
            <h4>Url</h4>
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
            <h4>Description</h4>
            <SafeReadEditor
              itemProp='description'
              value={document.algorithm_implementations[idx].description}
              whenEmpty={<EmptySection />}
            />
          </AtbdSubSection>
        )
      }));
    }
  },
  {
    label: 'Algorithm Usage Constraints',
    id: 'algo-usage-constraints',
    editorSubsections: (document, { id }) =>
      subsectionsFromSlateDocument(document.algorithm_usage_constraints, id),
    render: ({ element, document, referencesUseIndex }) => (
      <AtbdSection key={element.id} id={element.id} title={element.label}>
        <SafeReadEditor
          value={document.algorithm_usage_constraints}
          context={{
            subsectionLevel: 'h3',
            sectionId: element.id,
            references: document.publication_references,
            referencesUseIndex
          }}
          whenEmpty={<EmptySection />}
        />
      </AtbdSection>
    )
  },
  {
    label: 'Performance Assessment Validation',
    id: 'perf-assesment-validation',
    render: AtbdSectionPassThrough,
    children: [
      {
        label: 'Performance Assessment Validation Methods',
        id: 'perf-assesment-validation-method',
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
        id: 'perf-assesment-validation-uncert',
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
        id: 'perf-assesment-validation-err',
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
    id: 'data-access',
    render: AtbdSectionPassThrough,
    children: [
      {
        label: 'Data Access Input Data',
        id: 'data-access-input',
        render: (props) => (
          <FragmentWithOptionalEditor
            {...props}
            key={props.element.id}
            element={props.element}
            HLevel='h3'
            subsectionLevel='h4'
          >
            {props.children}
          </FragmentWithOptionalEditor>
        ),
        children: ({ document }) => {
          const items = document.data_access_input_data || [];
          return items.map((o, idx) => ({
            label: `Entry #${idx + 1}`,
            id: `data-access-input-${idx + 1}`,
            editorSubsections: (document, { id }) =>
              subsectionsFromSlateDocument(
                document.data_access_input_data[idx].description,
                id
              ),
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
        label: 'Data Access Output Data',
        id: 'data-access-output',
        render: (props) => (
          <FragmentWithOptionalEditor
            {...props}
            key={props.element.id}
            element={props.element}
            HLevel='h3'
            subsectionLevel='h4'
          >
            {props.children}
          </FragmentWithOptionalEditor>
        ),
        children: ({ document }) => {
          const items = document.data_access_output_data || [];
          return items.map((o, idx) => ({
            label: `Entry #${idx + 1}`,
            id: `data-access-output-${idx + 1}`,
            editorSubsections: (document, { id }) =>
              subsectionsFromSlateDocument(
                document.data_access_output_data[idx].description,
                id
              ),
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
        label: 'Data Access Related URLs',
        id: 'data-access-related-urls',
        render: (props) => (
          <FragmentWithOptionalEditor
            {...props}
            key={props.element.id}
            element={props.element}
            HLevel='h3'
            subsectionLevel='h4'
          >
            {props.children}
          </FragmentWithOptionalEditor>
        ),
        children: ({ document }) => {
          const items = document.data_access_related_urls || [];
          return items.map((o, idx) => ({
            label: `Entry #${idx + 1}`,
            id: `data-access-related-urls-${idx + 1}`,
            editorSubsections: (document, { id }) =>
              subsectionsFromSlateDocument(
                document.data_access_related_urls[idx].description,
                id
              ),
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
    render: ({ element }) => (
      <AtbdSection key={element.id} id={element.id} title={element.label}>
        <p>Content for {element.label} will arrive soon.</p>
      </AtbdSection>
    )
    // render: (el) => {
    //   const contactsSingle = atbd.contacts || [];
    //   const contactsGroups = atbd.contact_groups || [];
    //   const contacts = contactsSingle.concat(contactsGroups);

    //   return (
    //     <AtbdSection key={el.id} id={el.id} title={el.label}>
    //       {contacts.length ? (
    //         <AtbdContactList>
    //           {contacts.map((contact) => (
    //             <li
    //               key={contact.contact_id || contact.contact_group_id}
    //               itemScope
    //               itemType={
    //                 contact.contact_group_id
    //                   ? 'https://schema.org/Organization'
    //                   : 'https://schema.org/ContactPoint'
    //               }
    //             >
    //               <link
    //                 itemProp='additionalType'
    //                 href='http://schema.org/ContactPoint'
    //               />
    //               <h2>
    //                 {contact.contact_group_id ? 'Group: ' : ''}
    //                 <span itemProp='name'>{contact.displayName}</span>
    //               </h2>
    //               <Dl type='horizontal'>
    //                 {!!contact.roles.length && (
    //                   <React.Fragment>
    //                     <dt>Roles</dt>
    //                     <dd itemProp='contactType'>
    //                       {contact.roles.join(', ')}
    //                     </dd>
    //                   </React.Fragment>
    //                 )}
    //                 {contact.url && (
    //                   <React.Fragment>
    //                     <dt>Url</dt>
    //                     <dd>
    //                       <a
    //                         href={contact.url}
    //                         target='_blank'
    //                         rel='noopener noreferrer'
    //                         title='Open url in new tab'
    //                         itemProp='url'
    //                       >
    //                         {contact.url}
    //                       </a>
    //                     </dd>
    //                   </React.Fragment>
    //                 )}
    //                 {contact.uuid && (
    //                   <React.Fragment>
    //                     <dt>UUID</dt>
    //                     <dd itemProp='identifier'>{contact.uuid}</dd>
    //                   </React.Fragment>
    //                 )}
    //               </Dl>

    //               <h4>Mechanisms</h4>
    //               <Dl type='horizontal'>
    //                 {contact.mechanisms.map((m) => (
    //                   <React.Fragment
    //                     key={`${m.mechanism_type}-${m.mechanism_value}`}
    //                   >
    //                     <dt itemProp='contactOption'>{m.mechanism_type}</dt>
    //                     <dd>{m.mechanism_value}</dd>
    //                   </React.Fragment>
    //                 ))}
    //               </Dl>
    //             </li>
    //           ))}
    //         </AtbdContactList>
    //       ) : (
    //         'Not Available'
    //       )}
    //     </AtbdSection>
    //   );
    // }
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
    id: 'journal-details',
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
        label: 'Acknowledgements',
        id: 'acknowledgements',
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
        label: 'Discussion',
        id: 'discussion',
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

  document.publication_references = [
    {
      id: 1,
      authors: 'Dickens, Charles and Steinbeck, John',
      title: 'Example Reference',
      series: 'A',
      edition: '3rd',
      volume: '42ml',
      issue: 'ticket',
      publication_place: 'Boston',
      publisher: 'PenguinBooks',
      pages: '189-198',
      isbn: 123456789,
      year: 1995
    }
  ];

  const referencesUseIndex = useMemo(
    () => createDocumentReferenceIndex(document),
    [document]
  );

  return renderElements(atbdContentSections, { document, referencesUseIndex });
}

DocumentBody.propTypes = {
  atbd: T.object
};
