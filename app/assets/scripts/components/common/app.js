import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';

import { reveal } from '@devseed-ui/animation';

import MetaTags from './meta-tags';
import PageHeader from './page-header';
import PageFooter from './page-footer';

import config from '../../config';

const { appTitle, appDescription } = config;

const Page = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: min-content auto min-content;
  grid-auto-rows: min-content;
  min-height: 100vh;
`;

const PageBody = styled.main`
  animation: ${reveal} 0.48s ease 0s 1;
`;

function App(props) {
  const { pageTitle, hideFooter, children } = props;

  const truncatedTitle =
    pageTitle?.length > 32 ? `${pageTitle.slice(0, 32)}...` : pageTitle;

  const title = truncatedTitle ? `${truncatedTitle} — ` : '';

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
