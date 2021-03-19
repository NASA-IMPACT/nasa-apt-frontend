import '@babel/polyfill';
import React, { useEffect } from 'react';
import { render } from 'react-dom';
import { Router, Route, Switch } from 'react-router-dom';
import { DevseedUiThemeProvider } from '@devseed-ui/theme-provider';
import { CollecticonsGlobalStyle } from '@devseed-ui/collecticons';

import history from './utils/history.js';
import { themeOverridesAPT } from './styles/theme.js';
import GlobalStyle from './styles/global';

// Views
import Home from './components/home';
import Documents from './components/documents';
import About from './components/about';
import Sandbox from './components/sandbox';
import SandboxEditor from './components/sandbox/editor';
import SandboxStructure from './components/sandbox/structure';
import UhOh from './components/uhoh/index.js';

// Contexts
import { AtbdsProvider } from './context/atbds-list';

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
        <AtbdsProvider>
          <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='/documents' component={Documents} />
            <Route exact path='/about' component={About} />
            <Route exact path='/sandbox' component={Sandbox} />
            <Route exact path='/sandbox/editor' component={SandboxEditor} />
            <Route
              exact
              path='/sandbox/structure'
              component={SandboxStructure}
            />
            <Route path='*' component={UhOh} />
          </Switch>
        </AtbdsProvider>
      </DevseedUiThemeProvider>
    </Router>
  );
}

render(<Root />, document.querySelector('#app-container'));
