import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { glsp } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';
import collecticon from '@devseed-ui/collecticons';

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

function SearchResults(props) {
  const { results, searchValue } = props;

  const { hits } = results.hits;

  return (
    <SearchResultsWrapper>
      <ResultsHeading as='h2'>
        Showing {hits.length} result
        {hits.length > 1 ? 's' : ''} for <em>{searchValue}</em>
      </ResultsHeading>
      <ResultsList resultItems={hits} />
    </SearchResultsWrapper>
  );
}

SearchResults.propTypes = {
  results: T.object,
  searchValue: T.string
};

export default SearchResults;

function ResultsList(props) {
  const { resultItems } = props;

  if (!resultItems.length) {
    return (
      <NoResultsMessage>
        <p>There are no results for the current search/filters criteria.</p>
      </NoResultsMessage>
    );
  }

  const sortedResults = [...resultItems].sort((a, b) => a._score - b._score);

  return (
    <SearchResultsList>
      {sortedResults.map((result) => {
        return <li key={result._id}>{result._id}</li>;
      })}
    </SearchResultsList>
  );
}

ResultsList.propTypes = {
  resultItems: T.array
};
