import '@babel/polyfill';
import React, { useEffect } from 'react';
import { render } from 'react-dom';
import { Router, Route, Switch } from 'react-router-dom';
import { DevseedUiThemeProvider } from '@devseed-ui/theme-provider';
import { CollecticonsGlobalStyle } from '@devseed-ui/collecticons';
import GlobalLoadingProvider from '@devseed-ui/global-loading';

import history from './utils/history.js';
import { themeOverridesAPT } from './styles/theme.js';
import GlobalStyle from './styles/global';

// Views
import Home from './components/home';
import Documents from './components/documents/hub';
import DocumentsView from './components/documents/single-view';
import About from './components/about';
import Sandbox from './components/sandbox';
import SandboxEditor from './components/sandbox/editor';
import SandboxForms from './components/sandbox/forms';
import SandboxStructure from './components/sandbox/structure';
import UhOh from './components/uhoh/index';
import SignIn from './a11n/signin';
import Authorize from './a11n/authorize';

// Contexts
import { AtbdsProvider } from './context/atbds-list';
import { UserProvider } from './context/user';
import { AbilityProvider } from './a11n/index';

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
        <AbilityProvider>
          <UserProvider>
            <AtbdsProvider>
              <Switch>
                <Route exact path='/' component={Home} />
                <Route exact path='/documents' component={Documents} />
                <Route exact path='/documents/:id/:version' component={DocumentsView} />
                <Route exact path='/about' component={About} />
                <Route exact path='/signin' component={SignIn} />
                <Route exact path='/authorize' component={Authorize} />
                <Route exact path='/sandbox' component={Sandbox} />
                <Route exact path='/sandbox/editor' component={SandboxEditor} />
                <Route exact path='/sandbox/forms' component={SandboxForms} />
                <Route
                  exact
                  path='/sandbox/structure'
                  component={SandboxStructure}
                />
                <Route path='*' component={UhOh} />
              </Switch>
            </AtbdsProvider>
          </UserProvider>
        </AbilityProvider>
      </DevseedUiThemeProvider>
    </Router>
  );
}

render(<Root />, document.querySelector('#app-container'));
