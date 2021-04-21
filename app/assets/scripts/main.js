import '@babel/polyfill';
import React, { useEffect } from 'react';
import { render } from 'react-dom';
import T from 'prop-types';
import { Router, Route, Switch } from 'react-router-dom';
import { DevseedUiThemeProvider } from '@devseed-ui/theme-provider';
import { CollecticonsGlobalStyle } from '@devseed-ui/collecticons';
import GlobalLoadingProvider from '@devseed-ui/global-loading';

import history from './utils/history.js';
import { themeOverridesAPT } from './styles/theme.js';
import GlobalStyle from './styles/global';
import ErrorBoundary from './components/uhoh/fatal-error';
import { ToastsContainer } from './components/common/toasts';
import AccessRoute from './a11n/access-route';
import ConfirmationPrompt from './components/common/confirmation-prompt';

// Views
import Home from './components/home';
import Documents from './components/documents/hub';
import DocumentsView from './components/documents/single-view';
import DocumentsEdit from './components/documents/single-edit';
import Contacts from './components/contacts/hub';
import About from './components/about';
import Sandbox from './components/sandbox';
import UhOh from './components/uhoh/index';
import SignIn from './a11n/signin';
import Authorize from './a11n/authorize';

// Contexts
import { AtbdsProvider } from './context/atbds-list';
import { ContactsProvider } from './context/contacts-list';
import { UserProvider } from './context/user';
import { AbilityProvider } from './a11n/index';

const composingComponents = [
  ErrorBoundary,
  AbilityProvider,
  UserProvider,
  AtbdsProvider,
  ContactsProvider
];

// Root component.
function Root() {
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--scrollbar-width',
      window.innerWidth - document.documentElement.clientWidth + 'px'
    );
  }, []);

  useEffect(() => {
    // Hide the welcome banner.
    const banner = document.querySelector('#welcome-banner');
    banner.classList.add('dismissed');
    setTimeout(() => banner.remove(), 500);
  }, []);

  return (
    <Router history={history}>
      <DevseedUiThemeProvider theme={themeOverridesAPT}>
        <CollecticonsGlobalStyle />
        <GlobalStyle />
        <GlobalLoadingProvider />
        <ConfirmationPrompt />
        <Composer components={composingComponents}>
          <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='/documents' component={Documents} />
            <Route
              exact
              path='/documents/:id/:version'
              component={DocumentsView}
            />
            <AccessRoute
              permission={['edit', 'atbd']}
              exact
              path='/documents/:id/:version/edit/:step?'
              component={DocumentsEdit}
            />
            <AccessRoute
              permission={['read', 'contact']}
              exact
              path='/contacts'
              component={Contacts}
            />
            <Route exact path='/about' component={About} />
            <Route exact path='/signin' component={SignIn} />
            <Route exact path='/authorize' component={Authorize} />
            {process.env.NODE_ENV !== 'production' && (
              <Route path='/sandbox' component={Sandbox} />
            )}
            <Route path='*' component={UhOh} />
          </Switch>
        </Composer>
        <ToastsContainer />
      </DevseedUiThemeProvider>
    </Router>
  );
}

render(<Root />, document.querySelector('#app-container'));

/**
 * Composes components to to avoid deep nesting trees. Useful for contexts.
 *
 * @param {node} children Component children
 * @param {array} components The components to compose.
 */
function Composer(props) {
  const { children, components } = props;
  const itemToCompose = [...components].reverse();

  return itemToCompose.reduce(
    (acc, Component) => <Component>{acc}</Component>,
    children
  );
}

Composer.propTypes = {
  components: T.array,
  children: T.node
};
