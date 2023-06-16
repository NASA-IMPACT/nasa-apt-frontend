import config from '../config';
import { getAppURL } from './history';

export const getHostedAuthUiUrl = (page) => {
  const clientId = config.auth.userPoolWebClientId;
  const returnTo = getAppURL().cleanHref;
  return `${config.hostedAuthUi}/${page}?client_id=${clientId}&response_type=token&redirect_uri=${returnTo}`;
};
