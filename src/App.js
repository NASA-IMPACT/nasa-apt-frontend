import React from 'react';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';
import { ToastContainer, toast } from 'react-toastify';
import ReactGA from 'react-ga';

import styled, { ThemeProvider } from 'styled-components';
import theme from './styles/theme/theme';
import GlobalStyle from './styles/global';

import store, { history } from './store/store';
import {
  atbds,
  atbdsedit,
  identifying_information,
  introduction,
  contacts,
  drafts,
  algorithm_description,
  algorithm_usage,
  algorithm_implementation,
  references,
  journal_details,
  error,
} from './constants/routes';
import PageHeader from './components/common/PageHeader';
import PageFooter from './components/common/PageFooter';
import ConfirmationPrompt from './components/common/ConfirmationPrompt';
import AtbdIndex from './components/atbds';
import AtbdView from './components/atbds/View';
import IdentifyingInformation from './components/IdentifyingInformation';
import Introduction from './components/Introduction';
import Contacts from './components/contacts';
import AlgorithmDescription from './components/AlgorithmDescription';
import AlgorithmUsage from './components/AlgorithmUsage';
import AlgorithmImplementation from './components/AlgorithmImplementation';
import References from './components/references';
import JournalDetails from './components/JournalDetails';
import Help from './components/help';
import About from './components/about';
import Search from './components/search';
import Sandbox from './components/sandbox';
import UhOh from './components/uhoh';
import { CloseButton } from './components/common/toasts';
import OverlayLoaderConnector from './components/common/OverlayLoaderConnector';
import Home from './components/home';

// Google analytics
if (process.env.REACT_APP_GA_TRACKING) {
  ReactGA.initialize(process.env.REACT_APP_GA_TRACKING);
  ReactGA.pageview(window.location.pathname + window.location.search);
  history.listen(location => ReactGA.pageview(location.pathname + location.search));
}

const Page = styled.div`
  display: grid;
  min-height: 100vh;
  grid-template-rows: auto 1fr auto;
`;

const PageBody = styled.main`
  padding: 0;
  margin: 0;
`;

const App = () => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <ThemeProvider theme={theme.main}>
        <React.Fragment>
          <OverlayLoaderConnector />
          <GlobalStyle />
          <Page>
            <PageHeader />
            <PageBody>
              <Switch>
                <Route path="/" exact component={Home} />
                <Route path={`/${atbds}/:atbd_id`} component={AtbdView} />
                <Route path={`/${atbds}`} component={AtbdIndex} />
                <Route
                  path={`/${atbdsedit}/:atbd_id/${drafts}/:atbd_version/${identifying_information}`}
                  component={IdentifyingInformation}
                />
                <Route
                  path={`/${atbdsedit}/:atbd_id/${drafts}/:atbd_version/${introduction}`}
                  component={Introduction}
                />
                <Route
                  path={`/${atbdsedit}/:atbd_id/${drafts}/:atbd_version/${contacts}`}
                  component={Contacts}
                />
                <Route
                  path={`/${atbdsedit}/:atbd_id/${drafts}/:atbd_version/${algorithm_description}`}
                  component={AlgorithmDescription}
                />
                <Route
                  path={`/${atbdsedit}/:atbd_id/${drafts}/:atbd_version/${algorithm_usage}`}
                  component={AlgorithmUsage}
                />
                <Route
                  path={`/${atbdsedit}/:atbd_id/${drafts}/:atbd_version/${algorithm_implementation}`}
                  component={AlgorithmImplementation}
                />
                <Route
                  path={`/${atbdsedit}/:atbd_id/${drafts}/:atbd_version/${references}`}
                  component={References}
                />
                <Route
                  path={`/${atbdsedit}/:atbd_id/${drafts}/:atbd_version/${journal_details}`}
                  component={JournalDetails}
                />
                <Route path={`/${error}`} component={UhOh} />
                <Route exact path="/help" component={Help} />
                <Route path="/help/:page_id" component={Help} />
                <Route exact path="/about" component={About} />
                <Route exact path="/search" component={Search} />
                <Route path="/sandbox" component={Sandbox} />
                <Route path="*" component={UhOh} />
              </Switch>
            </PageBody>
            <PageFooter />
          </Page>
          <ConfirmationPrompt />
          <ToastContainer
            position={toast.POSITION.BOTTOM_RIGHT}
            closeButton={<CloseButton />}
          />
        </React.Fragment>
      </ThemeProvider>
    </ConnectedRouter>
  </Provider>
);

export default App;
