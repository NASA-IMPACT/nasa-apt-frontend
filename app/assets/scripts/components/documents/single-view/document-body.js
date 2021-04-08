/* eslint-disable react/display-name, react/prop-types */
import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { glsp, themeVal } from '@devseed-ui/theme-provider';

import SafeReadEditor from '../../slate/safe-read-editor';

import { subsectionsFromSlateDocument } from '../../slate/subsections-from-slate';
import { useScrollListener, useScrollToHashOnMount } from './scroll-manager';

// Wrapper for each of the main sections.
const AtbdSectionBase = ({ id, title, children }) => (
  <section>
    <header>
      <h1 id={id} data-scroll='target'>
        {title}
      </h1>
    </header>
    <div>{children}</div>
  </section>
);

const AtbdSection = styled(AtbdSectionBase)`
  h1 {
    font-size: 2rem !important;
  }
  h2 {
    font-size: 1.5rem !important;
  }
  h3 {
    font-size: 1rem !important;
  }
  &:not(:last-child) {
    padding-bottom: ${glsp(3)};
    margin-bottom: ${glsp(3)};
    border-bottom: 1px solid ${themeVal('color.baseAlphaD')};
  }
`;

// When the section that's being rendered is a list of items we only need
// to print the title and then the data from the children.
// This method is a utility to just render the children.
const childrenPassThrough = ({ element, children }) => (
  <AtbdSection key={element.id} id={element.id} title={element.label}>
    {children || 'Not Available'}
  </AtbdSection>
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
        const children = renderElements(el.children, props);
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
    editorSubsections: (document) =>
      subsectionsFromSlateDocument(document.introduction),
    render: ({ element, document }) => (
      <AtbdSection key={element.id} id={element.id} title={element.label}>
        <SafeReadEditor
          value={document.introduction}
          whenEmpty='No content available'
        />
      </AtbdSection>
    )
  },
  {
    label: 'Historical Perspective',
    id: 'historic-prespective',
    render: ({ element, document }) => (
      <AtbdSection key={element.id} id={element.id} title={element.label}>
        <SafeReadEditor
          value={document.historical_perspective}
          whenEmpty='No content available'
        />
      </AtbdSection>
    )
  },
  {
    label: 'Algorithm Description',
    id: 'algo-description',
    render: childrenPassThrough,
    children: [
      {
        label: 'Scientific Theory',
        id: 'sci-theory',
        render: ({ element, document, children }) => (
          <React.Fragment key={element.id}>
            <h2 id={element.id} data-scroll='target'>
              {element.label}
            </h2>
            <SafeReadEditor
              value={document.scientific_theory}
              whenEmpty='No content available'
            />
            {children}
          </React.Fragment>
        ),
        children: [
          {
            label: 'Assumptions',
            id: 'sci-theory-assumptions',
            render: ({ element, document }) => (
              <React.Fragment key={element.id}>
                <h3 id={element.id} data-scroll='target'>
                  {element.label}
                </h3>
                <SafeReadEditor
                  value={document.scientific_theory_assumptions}
                  whenEmpty='No content available'
                />
              </React.Fragment>
            )
          }
        ]
      },
      {
        label: 'Mathematical Theory',
        id: 'math-theory',
        render: ({ element, document, children }) => (
          <React.Fragment key={element.id}>
            <h2 id={element.id} data-scroll='target'>
              {element.label}
            </h2>
            <SafeReadEditor
              value={document.mathematical_theory}
              whenEmpty='No content available'
            />
            {children}
          </React.Fragment>
        ),
        children: [
          {
            label: 'Assumptions',
            id: 'math-theory-assumptions',
            render: ({ element, document }) => (
              <React.Fragment key={element.id}>
                <h3 id={element.id} data-scroll='target'>
                  {element.label}
                </h3>
                <SafeReadEditor
                  value={document.mathematical_theory_assumptions}
                  whenEmpty='No content available'
                />
              </React.Fragment>
            )
          }
        ]
      },
      {
        label: 'Algorithm Input Variables',
        id: 'algo-input-var',
        render: ({ element }) => (
          <React.Fragment key={element.id}>
            <h2 id={element.id} data-scroll='target'>
              {element.label}
            </h2>
            List of variables will be coming soon.
          </React.Fragment>
        )
      },
      {
        label: 'Algorithm Output Variables',
        id: 'algo-output-var',
        render: ({ element }) => (
          <React.Fragment key={element.id}>
            <h2 id={element.id} data-scroll='target'>
              {element.label}
            </h2>
            List of variables will be coming soon.
          </React.Fragment>
        )
      }
    ]
  },
  // {
  //   label: 'Algorithm Implementations',
  //   id: 'algo-implementations',
  //   render: childrenPassThroughRenderer,
  //   children: (algorithm_implementations || []).map((o, idx) => ({
  //     label: `Entry #${idx + 1}`,
  //     id: `algo-implementations-${idx + 1}`,
  //     render: (el) => (
  //       <div
  //         key={el.id}
  //         itemProp='hasPart'
  //         itemScope
  //         itemType='https://schema.org/CreativeWork'
  //       >
  //         <h2 id={el.id} itemProp='name'>
  //           {el.label}
  //         </h2>
  //         <h4>Url</h4>
  //         <p>
  //           <a
  //             href={o.access_url}
  //             target='_blank'
  //             rel='noopener noreferrer'
  //             title='Open url in new tab'
  //             itemProp='url'
  //           >
  //             {o.access_url}
  //           </a>
  //         </p>
  //         <h4>Description</h4>
  //         <Prose itemProp='description'>
  //           {this.renderReadOnlyEditor(o.execution_description)}
  //         </Prose>
  //       </div>
  //     )
  //   }))
  // },
  {
    label: 'Algorithm Usage Constraints',
    id: 'algo-usage-constraints',
    render: ({ element, document }) => (
      <AtbdSection key={element.id} id={element.id} title={element.label}>
        <SafeReadEditor
          value={document.algorithm_usage_constraints}
          whenEmpty='No content available'
        />
      </AtbdSection>
    )
  },
  {
    label: 'Performance Assessment Validation',
    id: 'perf-assesment-validation',
    render: childrenPassThrough,
    children: [
      {
        label: 'Performance Assessment Validation Methods',
        id: 'perf-assesment-validation-method',
        render: ({ element, document }) => (
          <React.Fragment key={element.id}>
            <h2 id={element.id} data-scroll='target'>
              {element.label}
            </h2>
            <SafeReadEditor
              value={document.performance_assessment_validation_methods}
              whenEmpty='No content available'
            />
          </React.Fragment>
        )
      },
      {
        label: 'Performance Assessment Validation Uncertainties',
        id: 'perf-assesment-validation-uncert',
        render: ({ element, document }) => (
          <React.Fragment key={element.id}>
            <h2 id={element.id} data-scroll='target'>
              {element.label}
            </h2>
            <SafeReadEditor
              value={document.performance_assessment_validation_uncertainties}
              whenEmpty='No content available'
            />
          </React.Fragment>
        )
      },
      {
        label: 'Performance Assessment Validation Errors',
        id: 'perf-assesment-validation-err',
        render: ({ element, document }) => (
          <React.Fragment key={element.id}>
            <h2 id={element.id} data-scroll='target'>
              {element.label}
            </h2>
            <SafeReadEditor
              value={document.performance_assessment_validation_errors}
              whenEmpty='No content available'
            />
          </React.Fragment>
        )
      }
    ]
  },
  // {
  //   label: 'Data Access',
  //   id: 'data-access',
  //   render: childrenPassThroughRenderer,
  //   children: [
  //     {
  //       label: 'Data Access Input Data',
  //       id: 'data-access-input',
  //       render: childrenPassThroughRenderer,
  //       children: (data_access_input_data || []).map((o, idx) => ({
  //         label: `Entry #${idx + 1}`,
  //         id: `data-access-input-${idx + 1}`,
  //         render: (el) => (
  //           <div key={el.id} itemScope itemType='https://schema.org/Dataset'>
  //             <h2 id={el.id} itemProp='name'>
  //               {el.label}
  //             </h2>
  //             {this.renderUrlDescriptionField({
  //               id: o.data_access_input_data_id,
  //               url: o.access_url,
  //               description: o.description
  //             })}
  //           </div>
  //         )
  //       }))
  //     },
  //     {
  //       label: 'Data Access Output Data',
  //       id: 'data-access-output',
  //       render: childrenPassThroughRenderer,
  //       children: (data_access_output_data || []).map((o, idx) => ({
  //         label: `Entry #${idx + 1}`,
  //         id: `data-access-output-${idx + 1}`,
  //         render: (el) => (
  //           <div key={el.id} itemScope itemType='https://schema.org/Dataset'>
  //             <h2 id={el.id} itemProp='name'>
  //               {el.label}
  //             </h2>
  //             {this.renderUrlDescriptionField({
  //               id: o.data_access_output_data_id,
  //               url: o.access_url,
  //               description: o.description
  //             })}
  //           </div>
  //         )
  //       }))
  //     },
  //     {
  //       label: 'Data Access Related URLs',
  //       id: 'data-access-related-urls',
  //       render: childrenPassThroughRenderer,
  //       children: (data_access_related_urls || []).map((o, idx) => ({
  //         label: `Entry #${idx + 1}`,
  //         id: `data-access-related-urls-${idx + 1}`,
  //         render: (el) => (
  //           <div key={el.id} itemScope itemType='https://schema.org/Dataset'>
  //             <h2 id={el.id} itemProp='name'>
  //               {el.label}
  //             </h2>
  //             {this.renderUrlDescriptionField({
  //               id: o.data_access_related_url_id,
  //               url: o.url,
  //               description: o.description
  //             })}
  //           </div>
  //         )
  //       }))
  //     }
  //   ]
  // },
  {
    label: 'Contacts',
    id: 'contacts',
    render: ({ element }) => (
      <AtbdSection key={element.id} id={element.id} title={element.label}>
        Content for {element.label} will arrive soon.
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
    render: ({ element }) => (
      <AtbdSection key={element.id} id={element.id} title={element.label}>
        Content for {element.label} will arrive soon.
      </AtbdSection>
    )
    // this.referenceIndex.length ? (
    //   <AtbdSection key={el.id} id={el.id} title={el.label}>
    //     <ol>
    //       {this.referenceIndex.map((o, idx) => {
    //         const ref = (publication_references || []).find(
    //           (r) => r.publication_reference_id === o.id
    //         );
    //         return ref ? (
    //           <li key={o.id} id={`reference-${o.id}`}>
    //             [{idx + 1}] <em>{ref.authors}</em> {ref.title}
    //           </li>
    //         ) : (
    //           <li key={o.id} id={`reference-${o.id}`}>
    //             [{idx + 1}] Reference not found
    //           </li>
    //         );
    //       })}
    //     </ol>
    //   </AtbdSection>
    // ) : null
  },
  {
    label: 'Journal Details',
    id: 'journal-details',
    render: ({ element, children }) => (
      <AtbdSection key={element.id} id={element.id} title={element.label}>
        <em>
          If provided, the journal details are included only in the Journal PDF.
        </em>
        {children}
      </AtbdSection>
    ),
    children: [
      {
        label: 'Acknowledgements',
        id: 'acknowledgements',
        render: ({ element, document }) => (
          <React.Fragment key={element.id}>
            <h3 id={element.id} data-scroll='target'>
              {element.label}
            </h3>
            <SafeReadEditor
              value={document.journal_discussion}
              whenEmpty='No content available'
            />
          </React.Fragment>
        )
      },
      {
        label: 'Discussion',
        id: 'discussion',
        render: ({ element, document }) => (
          <React.Fragment key={element.id}>
            <h3 id={element.id} data-scroll='target'>
              {element.label}
            </h3>
            <SafeReadEditor
              value={document.journal_acknowledgements}
              whenEmpty='No content available'
            />
          </React.Fragment>
        )
      }
    ]
  }
];

export default function DocumentBody(props) {
  const { atbd } = props;
  const document = atbd.document;

  useScrollToHashOnMount();
  useScrollListener();

  return renderElements(atbdContentSections, { document });
}

DocumentBody.propTypes = {
  atbd: T.object
};
