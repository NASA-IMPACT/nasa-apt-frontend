import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';
import collecticon from '@devseed-ui/collecticons';

import {
  HubList,
  HubListItem,
  HubEntry,
  HubEntryHeader,
  HubEntryHeadline,
  HubEntryTitle,
  HubEntryHeadNav,
  HubEntryBreadcrumbMenu
} from '../../styles/hub';
import { Link } from '../../styles/clean/link';
import TextHighlight from '../common/text-highlight';

import { documentView } from '../../utils/url-creator';

const SearchResultsWrapper = styled.div`
  grid-column: content-start / content-end;
`;

const ResultsHeading = styled(Heading)`
  margin-bottom: ${glsp(2)};
`;

export const NoResultsMessage = styled.div`
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
        {resultItems.length !== 1 ? 's' : ''} for <em>{searchValue}</em>
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
    <HubList>
      {resultItems.map(({ _id, _source: result, highlight }) => {
        return (
          <HubListItem key={_id}>
            <HubEntry>
              <ResultLink
                to={documentView(result, result.version.version)}
                title='View document'
              >
                <HubEntryHeader>
                  <HubEntryHeadline>
                    <HubEntryTitle>
                      <TextHighlight value={searchValue}>
                        {result.title}
                      </TextHighlight>
                    </HubEntryTitle>
                    <HubEntryHeadNav role='navigation'>
                      <HubEntryBreadcrumbMenu>
                        <li>
                          <strong>{result.version.version}</strong>
                        </li>
                      </HubEntryBreadcrumbMenu>
                    </HubEntryHeadNav>
                  </HubEntryHeadline>
                </HubEntryHeader>
                <ResultHighlights highlight={highlight} />
              </ResultLink>
            </HubEntry>
          </HubListItem>
        );
      })}
    </HubList>
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
            {otherHighlightsCount.length !== 1 ? 's' : ''}
          </em>
        </div>
      )}
    </React.Fragment>
  );
};

ResultHighlights.propTypes = {
  highlight: T.object
};
