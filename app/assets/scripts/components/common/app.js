import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';

import MetaTags from './meta-tags';
import PageHeader from './page-header';
import PageFooter from './page-footer';

import config from '../../config';

const { appTitle, appDescription } = config;

const Page = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr auto;
`;

const PageBody = styled.main`
  padding: 0;
  margin: 0;
`;

function App(props) {
  const { pageTitle, children } = props;
  const title = pageTitle ? `${pageTitle} — ` : '';

  return (
    <Page>
      <MetaTags title={`${title}${appTitle}`} description={appDescription} />
      <PageHeader />
      <PageBody role='main'>{children}</PageBody>
      <PageFooter />
    </Page>
  );
}

App.propTypes = {
  pageTitle: T.string,
  children: T.node
};

export default App;
