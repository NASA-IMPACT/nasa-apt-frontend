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
  max-height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr auto;
  grid-template-rows: auto 1fr ${({ hideFooter }) => (hideFooter ? 0 : 'auto')};
`;

const PageBody = styled.main`
  min-height: 0;
  padding: 0;
  margin: 0;
`;

function App(props) {
  const { pageTitle, hideFooter, children } = props;
  const title = pageTitle ? `${pageTitle} — ` : '';

  return (
    <Page hideFooter={hideFooter}>
      <MetaTags title={`${title}${appTitle}`} description={appDescription} />
      <PageHeader />
      <PageBody role='main'>{children}</PageBody>
      <PageFooter />
    </Page>
  );
}

App.propTypes = {
  pageTitle: T.string,
  hideFooter: T.bool,
  children: T.node
};

export default App;
