// We will need to access history from outside components.
// The only way to do this is create our own history and pass it to the router.
// eslint-disable-next-line inclusive-language/use-inclusive-words
// https://github.com/ReactTraining/react-router/blob/master/FAQ.md#how-do-i-access-the-history-object-outside-of-components
import { createBrowserHistory } from 'history';
import config from '../config';

export const getAppURL = () => {
  const { protocol, host } = window.location;
  const publicUrl = config.baseUrl;
  const baseUrl = publicUrl.match(/https?:\/\//)
    ? publicUrl
    : `${protocol}//${host}/${publicUrl}`;

  // Remove trailing url if exists.
  const url = new URL(baseUrl.replace(/\/$/, ''));
  url.cleanHref = url.href.replace(/\/$/, '');
  return url;
};

export default createBrowserHistory({ basename: getAppURL().pathname });
