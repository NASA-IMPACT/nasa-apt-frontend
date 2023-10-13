import T from 'prop-types';
import React, { useEffect, useRef, useState, useContext, useMemo } from 'react';
import { useParams } from 'react-router';
import styled from 'styled-components';

import { useSingleAtbd } from '../../../context/atbds-list';
import { useUser } from '../../../context/user';
import { isTruthyString, resolveTitle } from '../../../utils/common';
import { SafeReadEditor } from '../../slate';
import {
  HeadingNumberingContext,
  useHeadingNumberingProviderValue
} from '../../../context/heading-numbering';
import {
  NumberingContext,
  useNumberingProviderValue
} from '../../../context/numbering';
import { IMAGE_BLOCK, TABLE_BLOCK } from '../../slate/plugins/constants';
import serializeToString from '../../slate/serialize-to-string';
import { getContactName } from '../../contacts/contact-utils';
import {
  createDocumentReferenceIndex,
  formatReference,
  sortReferences
} from '../../../utils/references';
import { formatDocumentTableCaptions } from '../../../utils/format-table-captions';
import { VariableItem } from '../single-view/document-body';
import { variableNodeType } from '../../../types';

const ReferencesList = styled.ol`
  && {
    list-style: none;
    margin: 0;
    line-height: 2.5;
  }
`;

const IndentedContainer = styled.div`
  padding-left: 1rem;
`;

const DataListInline = styled.dl`
  dt {
    display: inline;
    text-decoration: underline;

    ::after {
      content: ': ';
    }
  }

  dd {
    display: inline;
    word-break: break-word;
    flex-grow: 1;
  }
`;

const DataList = styled.dl`
  display: flex;
  gap: 0.5rem;

  dt {
    font-weight: bold;

    ::after {
      content: ': ';
    }
  }

  dd {
    word-break: break-word;
    flex-grow: 1;
  }
`;

const DataListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  dt {
    font-weight: bold;
  }
`;

const PreviewContainer = styled.div`
  @media print {
    @page {
      size: A4 portrait;
      margin: 15mm;
    }
  }

  @media screen {
    margin: 0 auto;
    background-color: #fff;
    margin: 1rem auto;
    padding: 15mm;
    border: 1px solid rgba(0, 0, 0, 0.1);
    width: 210mm;
  }

  font-family: serif;
  display: flex;
  flex-direction: column;
  gap: 3rem;
`;

const DocumentHeading = styled.h1`
  text-align: center;
  margin: 0;
`;

const AuthorsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;
const AuthorsSectionHeader = styled.div`
  text-align: center;
`;

const KeyPoint = styled.li`
  list-style: disc;
`;

const SectionContainer = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  break-before: ${(props) => (props.breakBeforePage ? 'page' : undefined)};
`;

const SectionContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

function Section({ id, children, title, skipNumbering, breakBeforePage }) {
  const {
    register,
    getNumbering,
    level = 1,
    numberingFromParent
  } = useContext(HeadingNumberingContext);

  const headingNumberContextValue = useHeadingNumberingProviderValue();
  const numbering = getNumbering(id, numberingFromParent);

  const numberingContextValue = useMemo(
    () => ({
      ...headingNumberContextValue,
      numberingFromParent: numbering,
      level: level + 1
    }),
    [headingNumberContextValue, level, numbering]
  );

  useEffect(() => {
    if (children && !skipNumbering) {
      register(id);
    }
  }, [skipNumbering, children, id, register]);

  if (!children) {
    return null;
  }

  const H = `h${Math.min((level ?? 0) + 1, 6)}`;

  return (
    <HeadingNumberingContext.Provider value={numberingContextValue}>
      <SectionContainer breakBeforePage={breakBeforePage}>
        <H>
          {numbering} {title}
        </H>
        <SectionContent>{children}</SectionContent>
        <div />
      </SectionContainer>
    </HeadingNumberingContext.Provider>
  );
}

Section.propTypes = {
  id: T.string,
  title: T.node,
  children: T.node,
  breakBeforePage: T.bool,
  skipNumbering: T.bool
};

const EMPTY_CONTENT_MESSAGE = 'Content not available';

function ImplementationDataList({ list }) {
  if (!list || list.length === 0) {
    return EMPTY_CONTENT_MESSAGE;
  }

  return (
    <DataListContainer>
      {list?.map(({ url, description }) => (
        <dl key={url}>
          <dt>{url}</dt>
          <dd>{description}</dd>
        </dl>
      ))}
    </DataListContainer>
  );
}

ImplementationDataList.propTypes = {
  list: T.arrayOf(
    T.shape({
      url: T.string,
      description: T.string
    })
  )
};

function VariablesList({ list }) {
  if (!list || list.length === 0) {
    return EMPTY_CONTENT_MESSAGE;
  }

  return (
    <DataListContainer>
      {list?.map((variable, i) => (
        <VariableItem
          key={`variable-${i + 1}`}
          variable={variable}
          element={{ id: `variable-${i}`, label: `Variable #${i + 1}` }}
        />
      ))}
    </DataListContainer>
  );
}

VariablesList.propTypes = {
  list: T.arrayOf(variableNodeType)
};

function ContactOutput(props) {
  const { data } = props;
  const { affiliations, contact, roles } = data;

  const name = [contact.first_name, contact.last_name]
    .filter(Boolean)
    .join(', ');

  return (
    <div>
      <div>{name}</div>
      <IndentedContainer>
        {isTruthyString(contact.uuid) && (
          <DataListInline>
            <dt>UUID</dt>
            <dd>{contact.uuid}</dd>
          </DataListInline>
        )}
        {isTruthyString(contact.url) && (
          <DataListInline>
            <dt>URL</dt>
            <dd>{contact.url}</dd>
          </DataListInline>
        )}
        <DataListInline>
          <dt>Contact mechanism</dt>
          <dd>
            {contact.mechanisms
              ?.map(
                ({ mechanism_type, mechanism_value }) =>
                  `${mechanism_type}: ${mechanism_value}`
              )
              .join(', ')}
          </dd>
        </DataListInline>
        <DataListInline>
          <dt>Role(s) related to this ATBD</dt>
          <dd>{roles?.join(', ')}</dd>
        </DataListInline>
        {affiliations && (
          <DataListInline>
            <dt>Affiliation</dt>
            <dd>{affiliations.join(', ')}</dd>
          </DataListInline>
        )}
      </IndentedContainer>
    </div>
  );
}

ContactOutput.propTypes = {
  data: T.object
};

function hasContent(content) {
  return isTruthyString(serializeToString(content));
}

const emptyAtbd = { document: {} };

function JournalPdfPreview() {
  const { id, version } = useParams();
  const { atbd: atbdResponse, fetchSingleAtbd } = useSingleAtbd({
    id,
    version
  });
  const { isAuthReady } = useUser();
  const [previewReady, setPreviewReady] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    isAuthReady && fetchSingleAtbd();
  }, [isAuthReady, id, version, fetchSingleAtbd]);

  useEffect(() => {
    async function waitForImages() {
      const images = contentRef.current.querySelectorAll('img');

      const promises = Array.from(images).map((image) => {
        return new Promise((accept) => {
          image.addEventListener('load', () => {
            accept();
          });
        });
      });
      await Promise.all(promises);
      setPreviewReady(true);
    }

    if (atbdResponse.status === 'succeeded') {
      waitForImages();
    }
  }, [atbdResponse.status]);

  const headingNumberingContextValue = useHeadingNumberingProviderValue();
  const equationNumberingContextValue = useNumberingProviderValue();

  const atbd = atbdResponse?.data ?? emptyAtbd;

  const { keywords, document, contacts_link } = atbd;

  const {
    key_points,
    abstract,
    plain_summary,
    publication_references,
    version_description,
    introduction,
    historical_perspective,
    additional_information,
    scientific_theory,
    scientific_theory_assumptions,
    mathematical_theory,
    mathematical_theory_assumptions,
    algorithm_input_variables,
    algorithm_output_variables,
    algorithm_usage_constraints,
    performance_assessment_validation_errors,
    performance_assessment_validation_methods,
    performance_assessment_validation_uncertainties,
    algorithm_implementations,
    data_access_input_data,
    data_access_output_data,
    data_access_related_urls,
    journal_discussion,
    data_availability,
    journal_acknowledgements
  } = formatDocumentTableCaptions(document);

  const ContentView = useMemo(() => {
    const safeReadContext = {
      subsectionLevel: 'h3',
      references: publication_references,
      atbd
    };

    function transformValue(value) {
      if (!value || !value.children) {
        return value;
      }

      return {
        ...value,
        children: value.children.map((element) => {
          if (!element.children) {
            return element;
          }

          if (element.type === IMAGE_BLOCK) {
            return {
              ...element,
              children: [
                element.children[0],
                {
                  ...element.children[1],
                  parent: IMAGE_BLOCK
                }
              ]
            };
          }

          if (element.type === TABLE_BLOCK) {
            return {
              ...element,
              children: [
                element.children[0],
                {
                  ...element.children[1],
                  parent: TABLE_BLOCK
                }
              ]
            };
          }
          return transformValue(element);
        })
      };
    }

    // eslint-disable-next-line react/display-name, react/prop-types
    return ({ value }) => (
      <SafeReadEditor
        context={safeReadContext}
        value={transformValue(value)}
        // TODO: verify the default empty behavior
        whenEmpty={EMPTY_CONTENT_MESSAGE}
      />
    );
  }, [atbd, publication_references]);

  const threeKeyPoints = key_points
    ?.split('\n')
    .filter(isTruthyString)
    .slice(0, 3);

  const contacts = useMemo(() => {
    // Get list of unique affiliations
    let affiliations = new Set();
    contacts_link?.forEach(({ affiliations: contactAffiliations }) => {
      contactAffiliations?.forEach((affiliation) => {
        affiliations.add(affiliation);
      });
    });

    // create contacts list component with superscripts
    let contacts = [];
    contacts_link?.forEach(
      ({ contact, affiliations: contactAffiliations }, i) => {
        const hasAffiliation =
          contactAffiliations && contactAffiliations.length > 0;

        const item = (
          <span key={contact.id}>
            <strong>
              {getContactName(contact, { full: true })}
              {hasAffiliation &&
                contactAffiliations.map((affiliation, j) => {
                  return (
                    <>
                      <sup>
                        {Array.from(affiliations).indexOf(affiliation) + 1}
                      </sup>
                      <sup>
                        {j < contactAffiliations.length - 1 && <span>, </span>}
                      </sup>
                    </>
                  );
                })}
              {i < contacts_link.length - 1 && <span>, </span>}
              {i === contacts_link.length - 2 && <span>and </span>}
            </strong>
          </span>
        );
        contacts.push(item);
      }
    );

    // create corresponding authors list component
    const correspondingAuthors =
      contacts_link
        ?.filter((c) =>
          c.roles?.find((r) => r.toLowerCase() === 'corresponding author')
        )
        .map(({ contact }) => {
          let contactEmail = contact.mechanisms.find(
            (mechanism) => mechanism.mechanism_type === 'Email'
          )?.mechanism_value;

          let contactName = getContactName(contact, { full: true });

          return `${contactName} ${contactEmail ? `(${contactEmail})` : ''}`;
        }) || [];

    const correspondingAuthorsString = correspondingAuthors.map((author, i) => (
      <>
        {author}
        {i < correspondingAuthors.length - 1 && <span>, </span>}
        {i === correspondingAuthors.length - 2 && <span>and </span>}
      </>
    ));
    return {
      items: contacts,
      correspondingAuthors: correspondingAuthorsString,
      affiliations_list: Array.from(affiliations),
      maxIndex: (contacts_link?.length ?? 0) - 1
    };
  }, [contacts_link]);

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

  if (!atbdResponse.data) {
    return <div>Loading...</div>;
  }

  const historicalPerspectiveVisible = hasContent(historical_perspective);
  const additionalInformationVisible = hasContent(additional_information);
  const contextBackgroundVisible =
    historicalPerspectiveVisible || additionalInformationVisible;

  const scientificTheoryAssumptionsVisible = hasContent(
    scientific_theory_assumptions
  );
  const scientificTheoryVisible =
    hasContent(scientific_theory) || scientificTheoryAssumptionsVisible;
  const mathematicalTheoryAssumptionsVisible = hasContent(
    mathematical_theory_assumptions
  );
  const mathematicalTheoryVisible =
    hasContent(mathematical_theory) || mathematicalTheoryAssumptionsVisible;
  const algorithmInputVariablesVisible = algorithm_input_variables?.length > 0;
  const algorithmOutputVariablesVisible =
    algorithm_output_variables?.length > 0;
  const algorithmDescriptionVisible =
    scientificTheoryVisible ||
    mathematicalTheoryVisible ||
    algorithmInputVariablesVisible ||
    algorithmOutputVariablesVisible;

  const algorithmUsageConstraintsVisible = hasContent(
    algorithm_usage_constraints
  );

  const validationMethodsVisible = hasContent(
    performance_assessment_validation_methods
  );
  const uncertainitiesVisible = hasContent(
    performance_assessment_validation_uncertainties
  );
  const validationErrorsVisible = hasContent(
    performance_assessment_validation_errors
  );
  const performanceAssessmentVisible =
    validationMethodsVisible ||
    uncertainitiesVisible ||
    validationErrorsVisible;

  const algorithmAvailabilityVisible =
    algorithm_implementations && algorithm_implementations.length > 0;
  const inputDataAccessVisible =
    data_access_input_data && data_access_input_data.length > 0;
  const outputDataAccessVisible =
    data_access_output_data && data_access_output_data.length > 0;
  const importantRelatedUrlsVisible =
    data_access_related_urls && data_access_related_urls.length > 0;
  const algorithmImplementationVisible =
    algorithmAvailabilityVisible ||
    inputDataAccessVisible ||
    outputDataAccessVisible ||
    importantRelatedUrlsVisible;

  const journalDiscussionVisible = hasContent(journal_discussion);

  const openResearchVisible = hasContent(data_availability);

  const journalAcknowledgementsVisible = hasContent(journal_acknowledgements);

  const contactSectionVisible = contacts_link && contacts_link.length > 0;

  const referencesVisible = referenceList && referenceList.length > 0;

  return (
    <NumberingContext.Provider value={equationNumberingContextValue}>
      <HeadingNumberingContext.Provider value={headingNumberingContextValue}>
        <PreviewContainer ref={contentRef}>
          <DocumentHeading> {resolveTitle(atbd.title)} </DocumentHeading>
          <AuthorsSection>
            <AuthorsSectionHeader>{contacts?.items}</AuthorsSectionHeader>
            <div>
              {contacts?.affiliations_list.map((affiliation, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <div key={i}>
                  <sup>{i + 1}</sup> {affiliation}
                </div>
              ))}
            </div>
            <div>
              {contacts?.correspondingAuthors?.length > 0 && (
                <div>
                  <strong>Corresponding Author(s): </strong>
                  {contacts?.correspondingAuthors}
                </div>
              )}
            </div>
          </AuthorsSection>
          <Section id='key_points' title='Key Points:' skipNumbering>
            <ul>
              {threeKeyPoints.map((keyPoint) => (
                <KeyPoint key={keyPoint}>{keyPoint}</KeyPoint>
              ))}
            </ul>
          </Section>
          <Section id='abstract' title='Abstract' skipNumbering breakBeforePage>
            <ContentView value={abstract} />
          </Section>
          <Section
            id='plain_summary'
            title='Plain Language Summary'
            skipNumbering
          >
            <ContentView value={plain_summary} />
            {keywords && keywords.length > 0 && (
              <DataList>
                <dt>Keywords</dt>
                <dd>{keywords.map(({ label }) => label).join(', ')}</dd>
              </DataList>
            )}
          </Section>
          <Section
            id='version_description'
            title='Version Description'
            skipNumbering
          >
            <ContentView value={version_description} />
          </Section>
          <Section breakBeforePage id='introduction' title='Introduction'>
            <ContentView value={introduction} />
          </Section>
          {contextBackgroundVisible && (
            <Section id='context_background' title='Context/Background'>
              {historicalPerspectiveVisible && (
                <Section
                  id='historical_perspective'
                  title='Historical Perspective'
                >
                  <ContentView value={historical_perspective} />
                </Section>
              )}
              {additionalInformationVisible && (
                <Section
                  id='additional_information'
                  title='Additional Information'
                >
                  <ContentView value={additional_information} />
                </Section>
              )}
            </Section>
          )}
          {algorithmDescriptionVisible && (
            <Section id='algorithm_description' title='Algorithm Description'>
              {scientificTheoryVisible && (
                <Section id='scientific_theory' title='Scientific Theory'>
                  <ContentView value={scientific_theory} />
                  {scientificTheoryAssumptionsVisible && (
                    <Section
                      id='scientific_theory_assumptions'
                      title='Scientific Theory Assumptions'
                    >
                      <ContentView value={scientific_theory_assumptions} />
                    </Section>
                  )}
                </Section>
              )}
              {mathematicalTheoryVisible && (
                <Section id='mathematical_theory' title='Mathematical Theory'>
                  <ContentView value={mathematical_theory} />
                  {mathematicalTheoryAssumptionsVisible && (
                    <Section
                      id='mathematical_theory_assumptions'
                      title='Mathematical Theory Assumptions'
                    >
                      <ContentView value={mathematical_theory_assumptions} />
                    </Section>
                  )}
                </Section>
              )}
              {algorithmInputVariablesVisible && (
                <Section
                  id='algorithm_input_variables'
                  title='Algorithm Input Variables'
                >
                  <VariablesList list={algorithm_input_variables} />
                </Section>
              )}
              {algorithmOutputVariablesVisible && (
                <Section
                  id='algorithm_output_variables'
                  title='Algorithm Output Variables'
                >
                  <VariablesList list={algorithm_output_variables} />
                </Section>
              )}
            </Section>
          )}
          {algorithmUsageConstraintsVisible && (
            <Section
              id='algorithm_usage_constraints'
              title='Algorithm Usage Constraints'
            >
              <ContentView value={algorithm_usage_constraints} />
            </Section>
          )}
          {performanceAssessmentVisible && (
            <Section id='performance_assessment' title='Performance Assessment'>
              {validationMethodsVisible && (
                <Section
                  id='performance_assessment_validation_methods'
                  title='Validation Methods'
                >
                  <ContentView
                    value={performance_assessment_validation_methods}
                  />
                </Section>
              )}
              {uncertainitiesVisible && (
                <Section
                  id='performance_assessment_validation_uncertainties'
                  title='Uncertainties'
                >
                  <ContentView
                    value={performance_assessment_validation_uncertainties}
                  />
                </Section>
              )}
              {validationErrorsVisible && (
                <Section
                  id='performance_assessment_validation_errors'
                  title='Validation Errors'
                >
                  <ContentView
                    value={performance_assessment_validation_errors}
                  />
                </Section>
              )}
            </Section>
          )}
          {algorithmImplementationVisible && (
            <Section
              id='algorithm_implementation'
              title='Algorithm Implementation'
            >
              {algorithmAvailabilityVisible && (
                <Section
                  id='algorithm_availability'
                  title='Algorithm Availability'
                >
                  <ImplementationDataList list={algorithm_implementations} />
                </Section>
              )}
              {inputDataAccessVisible && (
                <Section id='data_access_input_data' title='Input Data Access'>
                  <ImplementationDataList list={data_access_input_data} />
                </Section>
              )}
              {outputDataAccessVisible && (
                <Section
                  id='data_access_output_data'
                  title='Output Data Access'
                >
                  <ImplementationDataList list={data_access_output_data} />
                </Section>
              )}
              {importantRelatedUrlsVisible && (
                <Section
                  id='data_access_related_urls'
                  title='Important Related URLs'
                >
                  <ImplementationDataList list={data_access_related_urls} />
                </Section>
              )}
            </Section>
          )}
          {journalDiscussionVisible && (
            <Section id='journal_discussion' title='Significance Discussion'>
              <ContentView value={journal_discussion} />
            </Section>
          )}
          {openResearchVisible && (
            <Section id='data_availability' title='Open Research'>
              <ContentView value={data_availability} />
            </Section>
          )}
          {journalAcknowledgementsVisible && (
            <Section id='journal_acknowledgements' title='Acknowledgements'>
              <ContentView value={journal_acknowledgements} />
            </Section>
          )}
          {contactSectionVisible && (
            <Section id='contact_details' title='Contact Details'>
              {contacts_link.map((contactLink) => (
                <ContactOutput
                  key={contactLink.contact.id}
                  data={contactLink}
                />
              ))}
            </Section>
          )}
          {referencesVisible && (
            <Section id='references' title='References'>
              <ReferencesList>{referenceList}</ReferencesList>
            </Section>
          )}
          {previewReady && <div id='pdf-preview-ready' />}
        </PreviewContainer>
      </HeadingNumberingContext.Provider>
    </NumberingContext.Provider>
  );
}

export default JournalPdfPreview;
