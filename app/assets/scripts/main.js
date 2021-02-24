import React, { useEffect } from 'react';
import { render } from 'react-dom';
import { Router, Route, Switch } from 'react-router-dom';
import { DevseedUiThemeProvider } from '@devseed-ui/theme-provider';
import { CollecticonsGlobalStyle } from '@devseed-ui/collecticons';

import history from './utils/history.js';
import { themeOverridesAPT } from './styles/theme.js';

// Views
import Home from './components/home';
import About from './components/about';
import SandboxEditor from './components/sandbox/editor';

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
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/about' component={About} />
          <Route exact path='/sandbox/editor' component={SandboxEditor} />
        </Switch>
      </DevseedUiThemeProvider>
    </Router>
  );
}

render(<Root />, document.querySelector('#app-container'));
