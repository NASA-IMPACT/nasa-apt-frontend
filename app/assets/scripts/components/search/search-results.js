import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';
import collecticon from '@devseed-ui/collecticons';

import { Link } from '../../styles/clean/link';
import Pill from '../common/pill';
import TextHighlight from '../common/TextHighlight';
import { atbdView } from '../../utils/url-creator';

const SearchResultsWrapper = styled.div`
  grid-column: content-start / content-end;
`;

const ResultsHeading = styled(Heading)`
  margin-bottom: ${glsp(2)};
`;

const NoResultsMessage = styled.div`
  padding: 3rem;
  text-align: center;

  &::before {
    ${collecticon('face-sad')}
    display: block;
    font-size: 4rem;
    line-height: 1;
    opacity: 0.48;
    margin-bottom: 2rem;
  }
`;

const SearchResultsList = styled.ul`
  display: grid;
  grid-gap: ${glsp(2)};
`;

const SearchResult = styled.article`
  > *:not(:last-child) {
    margin-bottom: ${glsp()};
  }
`;

const ResultLink = styled(Link)`
  display: inline-block;

  &,
  &:active,
  &:visited {
    color: inherit;
  }

  & > *:not(:last-child) {
    margin-bottom: ${glsp()};
  }
`;

const ResultHeadline = styled.div`
  display: flex;
  align-items: center;

  ${Pill} {
    margin-right: ${glsp()};
  }

  h1 {
    margin: 0;
    font-size: 1rem;
    line-height: 1.5rem;
  }
`;

const ResultBody = styled.div`
  max-width: 40rem;

  em {
    font-style: italic;
    background-color: ${themeVal('color.warning')};
  }
`;

const ResultKey = styled.h2`
  font-weight: bold;
  text-transform: capitalize;
  font-size: 0.875rem;
`;

function SearchResults(props) {
  const { results, searchValue } = props;

  const { hits } = results.hits;
  const resultItems = [...hits]
    .filter((o) => !!o._source.id)
    .sort((a, b) => a._score - b._score);

  return (
    <SearchResultsWrapper>
      <ResultsHeading as='h2'>
        Showing {resultItems.length} result
        {resultItems.length > 1 ? 's' : ''} for <em>{searchValue}</em>
      </ResultsHeading>
      <ResultsList resultItems={resultItems} searchValue={searchValue} />
    </SearchResultsWrapper>
  );
}

SearchResults.propTypes = {
  results: T.object,
  searchValue: T.string
};

export default SearchResults;

function ResultsList(props) {
  const { resultItems, searchValue } = props;

  if (!resultItems.length) {
    return (
      <NoResultsMessage>
        <p>There are no results for the current search/filters criteria.</p>
      </NoResultsMessage>
    );
  }

  return (
    <SearchResultsList>
      {resultItems.map(({ _id, _source: result, highlight }) => {
        return (
          <li key={_id}>
            <SearchResult>
              <ResultLink
                to={atbdView(result, result.version.version)}
                title='View document'
              >
                <header>
                  <ResultHeadline>
                    <Pill>{result.version.status}</Pill>
                    <h1>
                      <TextHighlight value={searchValue}>
                        {result.title}
                      </TextHighlight>
                    </h1>
                  </ResultHeadline>
                </header>
                <ResultHighlights highlight={highlight} />
              </ResultLink>
            </SearchResult>
          </li>
        );
      })}
    </SearchResultsList>
  );
}

ResultsList.propTypes = {
  resultItems: T.array,
  searchValue: T.string
};

const highlightSkipKeys = ['version.status', 'citations.release_date', 'title'];

const ResultHighlights = (props) => {
  const { highlight } = props;

  const highlightKeys = Object.keys(highlight).filter(
    (key) => !highlightSkipKeys.includes(key)
  );

  const renderableHighlights = highlightKeys.slice(0, 2);
  const otherHighlightsCount = highlightKeys.slice(2).length;

  return (
    <React.Fragment>
      {renderableHighlights.map((key) => (
        <ResultBody key={key}>
          <ResultKey>{key.split('.').last.replace(/_/g, ' ')}</ResultKey>
          <div
            dangerouslySetInnerHTML={{
              __html: highlight[key].join(' ')
            }}
          />
        </ResultBody>
      ))}
      {!!otherHighlightsCount && (
        <div>
          <em>
            matches also found in {otherHighlightsCount} other field
            {otherHighlightsCount.length > 1 ? 's' : ''}
          </em>
        </div>
      )}
    </React.Fragment>
  );
};

ResultHighlights.propTypes = {
  highlight: T.object
};
