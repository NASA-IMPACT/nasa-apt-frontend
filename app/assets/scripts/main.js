import 'katex/dist/katex.min.css';
import 'react-tippy/dist/tippy.css';
import 'react-toastify/dist/ReactToastify.min.css';

import '@babel/polyfill';
import React, { useEffect } from 'react';
import { render } from 'react-dom';
import T from 'prop-types';
import {
  Router,
  Route,
  Switch,
  useLocation,
  useHistory
} from 'react-router-dom';
import ReactGA from 'react-ga';
import qs from 'qs';
import { DevseedUiThemeProvider } from '@devseed-ui/theme-provider';
import { CollecticonsGlobalStyle } from '@devseed-ui/collecticons';
import GlobalLoadingProvider from '@devseed-ui/global-loading';

import config from './config';
import history from './utils/history.js';
import { themeOverridesAPT } from './styles/theme.js';
import GlobalStyle from './styles/global';
import ErrorBoundary from './components/uhoh/fatal-error';
import { ToastsContainer } from './components/common/toasts';
import AccessRoute from './a11n/access-route';
import ConfirmationPrompt from './components/common/confirmation-prompt';
import CommentCenter from './components/comment-center';
import AptDevtools from './components/apt-devtools';

// Views
import Home from './components/home';
import Documents from './components/documents/hub';
import DocumentsView from './components/documents/single-view';
import DocumentsEdit from './components/documents/single-edit';
import PdfPreview from './components/documents/pdf-preview';
import Contacts from './components/contacts/hub';
import ContactsView from './components/contacts/view';
import ContactsEdit from './components/contacts/edit';
import UserView from './components/users/view';
import UserEdit from './components/users/edit';
import UserDashboard from './components/dashboard';
import About from './components/about';
import Search from './components/search';
import UserGuide from './components/user-guide';
import Sandbox from './components/sandbox';
import UhOh from './components/uhoh/index';
import SignIn from './a11n/signin';
import Authorize from './a11n/authorize';

// Contexts
import { AtbdsProvider } from './context/atbds-list';
import { ContactsProvider } from './context/contacts-list';
import { initAuthFromUrlParams, UserProvider } from './context/user';
import { JsonPagesProvider } from './context/json-pages';
import { SearchProvider } from './context/search';
import { AbilityProvider } from './a11n/index';
import { CommentCenterProvider } from './context/comment-center';
import { CollaboratorsProvider } from './context/collaborators-list';
import { ThreadsProvider } from './context/threads-list';

// See note on context/user.js
initAuthFromUrlParams();

const composingComponents = [
  ErrorBoundary,
  AbilityProvider,
  CommentCenterProvider,
  UserProvider,
  AtbdsProvider,
  ContactsProvider,
  CollaboratorsProvider,
  ThreadsProvider,
  JsonPagesProvider,
  SearchProvider
];

const { gaTrackingCode } = config;

// Google analytics
if (gaTrackingCode) {
  ReactGA.initialize(gaTrackingCode);
  ReactGA.pageview(window.location.pathname + window.location.search);
  history.listen((location) =>
    ReactGA.pageview(location.pathname + location.search)
  );
}

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);
  return null;
}

function FeedbackPopupOpener() {
  const { replace } = useHistory();
  const { search } = useLocation();

  useEffect(() => {
    const { feedback } = qs.parse(search, { ignoreQueryPrefix: true });
    if (feedback !== undefined) {
      window.feedback?.showForm();
      replace({ search: '' });
    }
  }, [search, replace]);

  return null;
}

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
        <ScrollTop />
        <FeedbackPopupOpener />
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
              permission={['edit', 'document']}
              exact
              path='/documents/:id/:version/edit/:step?'
              component={DocumentsEdit}
            />
            <Route
              exact
              path='/documents/:id/:version/pdf-preview'
              component={PdfPreview}
            />
            <AccessRoute
              permission={['view', 'contacts']}
              exact
              path='/contacts'
              component={Contacts}
            />
            <AccessRoute
              permission={['edit', 'contact']}
              exact
              path='/contacts/:id/edit'
              component={ContactsEdit}
            />
            <AccessRoute
              permission={['view', 'contacts']}
              exact
              path='/contacts/:id'
              component={ContactsView}
            />
            <AccessRoute
              permission={['view', 'profile']}
              exact
              path='/account'
              component={UserView}
            />
            <AccessRoute
              permission={['edit', 'profile']}
              exact
              path='/account/edit/:section?'
              component={UserEdit}
            />
            <AccessRoute
              permission={['access', 'dashboard']}
              exact
              path='/dashboard'
              component={UserDashboard}
            />
            <Route exact path='/about' component={About} />
            <Route exact path='/documents/search' component={Search} />
            <Route exact path='/user-guide/:pageId?' component={UserGuide} />
            <Route exact path='/signin' component={SignIn} />
            <Route exact path='/authorize' component={Authorize} />
            {process.env.NODE_ENV !== 'production' && (
              <Route path='/sandbox' component={Sandbox} />
            )}
            <Route path='*' component={UhOh} />
          </Switch>
          <Route path='/documents/:id/:version'>
            <CommentCenter />
          </Route>
          {process.env.NODE_ENV === 'development' && <AptDevtools />}
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

Object.defineProperty(Array.prototype, 'last', {
  enumerable: false,
  configurable: true,
  get: function () {
    return this[this.length - 1];
  },
  set: undefined
});
