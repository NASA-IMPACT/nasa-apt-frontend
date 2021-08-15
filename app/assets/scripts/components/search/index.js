import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import styled from 'styled-components';
import { Formik, Form as FormikForm, useFormikContext } from 'formik';
import { useHistory, useLocation } from 'react-router';
import useQsStateCreator from 'qs-state-hook';
import { Form } from '@devseed-ui/form';
import { Button } from '@devseed-ui/button';
import { GlobalLoading } from '@devseed-ui/global-loading';

import App from '../common/app';
import {
  Inpage,
  InpageHeaderSticky,
  InpageHeadline,
  InpageTitle,
  InpageBody,
  InpageSubtitle,
  InpageHeadHgroup
} from '../../styles/inpage';
import { FormBlock, FormBlockHeading } from '../../styles/form-block';
import { FormikInputText } from '../common/forms/input-text';
import { FormikInputSelect } from '../common/forms/input-select';
import SearchResults from './search-results';
import { Link } from '../../styles/clean/link';

import { useSearch } from '../../context/search';
import { useUser } from '../../context/user';

const SearchForm = styled(Form)`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
`;

const SearchBox = styled.div`
  grid-column: 1 / span 2;
`;

const SearchFilter = styled.div`
  grid-column-end: span 1;
`;

const SearchActions = styled.div`
  grid-row: 2;
  grid-column: 1 / span 4;

  ${Button} {
    min-width: 12rem;
  }
`;

const atbdStatusOptions = [
  {
    value: 'all',
    label: 'All'
  },
  {
    value: 'Draft',
    label: 'Draft'
  },
  {
    value: 'Published',
    label: 'Published'
  }
];

const currentYear = new Date().getFullYear();
const atbdYearOptions = [
  {
    value: 'all',
    label: 'All'
  },
  ...new Array(20).fill(0).map((e, i) => ({
    value: `${currentYear - i}`,
    label: `${currentYear - i}`
  }))
];

function Search() {
  // react-router function to get the history for navigation.
  const history = useHistory();
  // react-router function to ensure the component re-renders when there is a
  // location change.
  useLocation();
  const { isLogged } = useUser();
  const searchFieldRef = useRef(null);

  const useQsState = useQsStateCreator({
    commit: history.push
  });

  const [status, setStatus] = useQsState({
    key: 'status',
    default: 'all',
    validator: atbdStatusOptions.map((o) => o.value)
  });

  const [year, setYear] = useQsState({
    key: 'year',
    default: 'all',
    validator: atbdYearOptions.map((o) => o.value)
  });

  const [searchValue, setSearchValue] = useQsState({
    key: 'searchValue',
    default: ''
  });

  const initialValues = useMemo(
    () => ({
      term: searchValue,
      year,
      status
    }),
    [searchValue, year, status]
  );

  const { results, fetchSearchResults, invalidate } = useSearch();

  useEffect(() => {
    if (searchValue.trim()) {
      fetchSearchResults(initialValues);
    }

    const id = setTimeout(() => {
      if (searchFieldRef.current) {
        searchFieldRef.current.focus();
      }
    }, 150);

    return () => {
      // Clear results when the user leaves the page.
      invalidate();
      id && clearTimeout(id);
    };

    // First fetch is done on mount only.
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  const onSearchSubmit = useCallback(
    (values, { setSubmitting, resetForm }) => {
      setSubmitting(false);
      if (!values.term.trim()) return;

      resetForm({ values });
      fetchSearchResults(values);

      setSearchValue(values.term);
      setStatus(values.status);
      setYear(values.year);
    },
    [fetchSearchResults, setStatus, setYear, setSearchValue]
  );

  return (
    <App pageTitle='Document search'>
      {results.status === 'loading' && <GlobalLoading />}
      <Inpage>
        <InpageHeaderSticky>
          <InpageHeadline>
            <InpageHeadHgroup>
              <InpageTitle>Search</InpageTitle>
            </InpageHeadHgroup>
            <InpageSubtitle>
              <span>Under</span>
              <Link to='/documents' title='View all Documents'>
                Documents
              </Link>
            </InpageSubtitle>
          </InpageHeadline>
        </InpageHeaderSticky>
        <InpageBody>
          <FormBlock>
            <FormBlockHeading>Search criteria</FormBlockHeading>
            <Formik initialValues={initialValues} onSubmit={onSearchSubmit}>
              <SearchForm as={FormikForm}>
                <SearchBox>
                  <FormikInputText
                    inputRef={searchFieldRef}
                    id='search-term'
                    name='term'
                    label='Term'
                    placeholder='Search term'
                  />
                </SearchBox>
                <SearchFilter>
                  <FormikInputSelect
                    id='search-year'
                    name='year'
                    options={atbdYearOptions}
                    label='Year'
                  />
                </SearchFilter>
                {isLogged && (
                  <SearchFilter>
                    <FormikInputSelect
                      id='search-status'
                      name='status'
                      options={atbdStatusOptions}
                      label='Status'
                    />
                  </SearchFilter>
                )}
                <SearchActions>
                  <SearchButton />
                </SearchActions>
              </SearchForm>
            </Formik>
          </FormBlock>
          <FormBlock>
            {results.status === 'succeeded' && (
              <SearchResults results={results.data} searchValue={searchValue} />
            )}
          </FormBlock>
        </InpageBody>
      </Inpage>
    </App>
  );
}

export default Search;

// Moving the search button to a component of its own to use Formik context.
const SearchButton = () => {
  const { isSubmitting, submitForm, values } = useFormikContext();

  return (
    <Button
      title='Search documents'
      disabled={isSubmitting || !values.term.trim()}
      onClick={submitForm}
      useIcon='magnifier-right'
      variation='primary-raised-dark'
    >
      Search
    </Button>
  );
};
