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
      size: portrait;
      margin: 15mm;
    }
  }

  font-family: serif;
  width: 210mm;
  margin: 15mm;
  display: flex;
  flex-direction: column;
  gap: 3rem;
`;

const DocumentHeading = styled.h1`
  margin: 0;
`;

const AuthorsSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
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
  } = document;

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
    return contacts_link?.reduce(
      (acc, contact_link, i) => {
        const { contact, affiliations } = contact_link;

        const hasAffiliation = affiliations && affiliations.length > 0;
        if (hasAffiliation) {
          acc.affiliations_list.push(affiliations);
        }

        const item = (
          <span key={contact.id}>
            <strong>{getContactName(contact, { full: true })}</strong>
            {hasAffiliation && <sup>{acc.affiliations_list.length}</sup>}
            {i < acc.maxIndex && <span>, </span>}
            {i === acc.maxIndex - 1 && <span>and </span>}
          </span>
        );

        acc.items.push(item);

        return acc;
      },
      {
        affiliations_list: [],
        items: [],
        maxIndex: (contacts_link.length ?? 0) - 1
      }
    );
  }, [contacts_link]);

  return (
    <NumberingContext.Provider value={equationNumberingContextValue}>
      <HeadingNumberingContext.Provider value={headingNumberingContextValue}>
        <PreviewContainer ref={contentRef}>
          <DocumentHeading> {resolveTitle(atbd.title)} </DocumentHeading>
          <AuthorsSection>
            <div>{contacts?.items}</div>
            <div>
              {contacts?.affiliations_list.map((affiliations, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <div key={i}>
                  <sup>{i + 1}</sup> {affiliations.join(', ')}
                </div>
              ))}
            </div>
          </AuthorsSection>
          <Section id='key_points' title='Key Points:' skipNumbering>
            <ul>
              {threeKeyPoints?.map((keyPoint) => (
                <li key={keyPoint}>{keyPoint}</li>
              ))}
            </ul>
          </Section>
          <div>
            <DataList>
              <dt>Version</dt>
              <dd>{version}</dd>
            </DataList>
            <DataList>
              <dt>Release Date</dt>
              <dd>TBD</dd>
            </DataList>
            <DataList>
              <dt>DOI</dt>
              <dd>TBD</dd>
            </DataList>
          </div>
          <Section id='abstract' title='Abstract' skipNumbering>
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
                <dt>Keywords:</dt>
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
          <Section id='context_background' title='Context/Background'>
            <Section id='historical_perspective' title='Historical Perspective'>
              <ContentView value={historical_perspective} />
            </Section>
            <Section id='additional_information' title='Additional Information'>
              <ContentView value={additional_information} />
            </Section>
          </Section>
          <Section id='algorithm_description' title='Algorithm Description'>
            <Section id='scientific_theory' title='Scientific Theory'>
              <ContentView value={scientific_theory} />
              <Section
                id='scientific_theory_assumptions'
                title='Scientific Theory Assumptions'
              >
                <ContentView value={scientific_theory_assumptions} />
              </Section>
            </Section>
            <Section id='mathematical_theory' title='Mathematical Theory'>
              <ContentView value={mathematical_theory} />
              <Section
                id='mathematical_theory_assumptions'
                title='Mathematical Theory Assumptions'
              >
                <ContentView value={mathematical_theory_assumptions} />
              </Section>
            </Section>
            <Section
              id='algorithm_input_variables'
              title='Algorithm Input Variables'
            >
              <ContentView value={algorithm_input_variables} />
            </Section>
            <Section
              id='algorithm_output_variables'
              title='Algorithm Output Variables'
            >
              <ContentView value={algorithm_output_variables} />
            </Section>
          </Section>
          {hasContent(algorithm_usage_constraints) && (
            <Section
              id='algorithm_usage_constraints'
              title='Algorithm Usage Constraints'
            >
              <ContentView value={algorithm_usage_constraints} />
            </Section>
          )}
          <Section id='performance_assessment' title='Performance Assessment'>
            <Section
              id='performance_assessment_validation_methods'
              title='Validation Methods'
            >
              <ContentView value={performance_assessment_validation_methods} />
            </Section>
            <Section
              id='performance_assessment_validation_uncertainties'
              title='Uncertainties'
            >
              <ContentView
                value={performance_assessment_validation_uncertainties}
              />
            </Section>
            <Section
              id='performance_assessment_validation_errors'
              title='Validation Errors'
            >
              <ContentView value={performance_assessment_validation_errors} />
            </Section>
          </Section>
          <Section
            id='algorithm_implementation'
            title='Algorithm Implementation'
          >
            <Section id='algorithm_availability' title='Algorithm Availability'>
              <ImplementationDataList list={algorithm_implementations} />
            </Section>
            <Section id='data_access_input_data' title='Input Data Access'>
              <ImplementationDataList list={data_access_input_data} />
            </Section>
            <Section id='data_access_output_data' title='Output Data Access'>
              <ImplementationDataList list={data_access_output_data} />
            </Section>
            <Section
              id='data_access_related_urls'
              title='Important Related URLs'
            >
              <ImplementationDataList list={data_access_related_urls} />
            </Section>
          </Section>
          <Section id='journal_discussion' title='Significance Discussion'>
            <ContentView value={journal_discussion} />
          </Section>
          <Section id='data_availability' title='Open Research'>
            <ContentView value={data_availability} />
          </Section>
          <Section id='journal_acknowledgements' title='Acknowledgements'>
            <ContentView value={journal_acknowledgements} />
          </Section>
          {/* TODO: Contact Details, References */}
          {previewReady && <div id='pdf-preview-ready' />}
        </PreviewContainer>
      </HeadingNumberingContext.Provider>
    </NumberingContext.Provider>
  );
}

export default JournalPdfPreview;