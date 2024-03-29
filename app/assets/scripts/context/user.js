import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import T from 'prop-types';
import Amplify, { Auth } from 'aws-amplify';
import qs from 'qs';

import { useContextualAbility, updateAbilityFor } from '../a11n';
import config from '../config';
import { createContextChecker } from '../utils/create-context-checker';
import { CONTRIBUTOR_ROLE, CURATOR_ROLE } from '../a11n/rules';

// If the user logs in through the cognito hosted UI, the user is then
// redirected to the apt homepage with the token appended in the url.
// Unfortunately Amplify is not able to pick it up, nor there's a way to
// initialize Amplify Auth with a preexisting token. The solution is a hacky
// approach where we set the token directly in the localstorage so that Amplify
// will pick it up when booting.
// The following issue explains the problem and the "solution": https://github.com/aws-amplify/amplify-js/issues/825#issuecomment-496977827
// Note that this doesn't work with localstack because it redirects the user
// back to the homepage with the wrong values in the url - instead of being:
// https://example.com/#id_token=123&access_token=abc&expires_in=3600&token_type=Bearer
// localstack does:
// https://example.com/?id_token=123#id_token=123
export function initAuthFromUrlParams() {
  const decodePayload = (jwtToken) => {
    const payload = jwtToken.split('.')[1];
    return JSON.parse(atob(payload));
  };

  const calculateClockDrift = (iatAccessToken, iatIdToken) => {
    const now = Math.floor(new Date() / 1000);
    const iat = Math.min(iatAccessToken, iatIdToken);
    return now - iat;
  };

  const locHash = location.hash.substring(1);
  const { id_token, access_token } = qs.parse(locHash);
  if (id_token && access_token) {
    try {
      const clientId = config.auth.userPoolWebClientId;
      const idTokenData = decodePayload(id_token);
      const accessTokenData = decodePayload(access_token);
      const username = idTokenData['cognito:username'];

      localStorage.setItem(
        `CognitoIdentityServiceProvider.${clientId}.LastAuthUser`,
        username
      );
      localStorage.setItem(
        `CognitoIdentityServiceProvider.${clientId}.${username}.idToken`,
        id_token
      );
      localStorage.setItem(
        `CognitoIdentityServiceProvider.${clientId}.${username}.accessToken`,
        access_token
      );
      localStorage.setItem(
        `CognitoIdentityServiceProvider.${clientId}.${username}.clockDrift`,
        calculateClockDrift(accessTokenData.iat, idTokenData.iat).toString()
      );
    } catch (error) {
      // Something went wrong. User will not be authenticated.
    }
  }
}

Amplify.configure(config.auth);

const emptyUserData = {
  id: null,
  name: null,
  accessToken: null,
  accessTokenExpire: 0,
  attributes: null,
  groups: [],
  rawCognitoUser: null
};

const extractUserDataFromCognito = (user, userInfo) => {
  const { sub, preferred_username } = userInfo.attributes;
  const idToken = user.getSignInUserSession().getIdToken();

  return {
    id: sub,
    name: preferred_username,
    accessToken: idToken.jwtToken,
    accessTokenExpire: idToken.payload.exp * 1000,
    attributes: user.attributes,
    groups: idToken.payload['cognito:groups'] || [],
    rawCognitoUser: user
  };
};

// Context
export const UserContext = createContext(null);

// Context provider
export const UserProvider = (props) => {
  const { children } = props;
  // isAuthReady tracks whether or not the authentication was initialized,
  // regardless of the user being logged in or not.
  const [isAuthReady, setAuthReady] = useState(false);
  const [userData, setUserData] = useState(emptyUserData);
  const ability = useContextualAbility();

  const loadCognitoUser = useCallback(async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      const userInfo = await Auth.currentUserInfo(user);
      setUserData(extractUserDataFromCognito(user, userInfo));
    } catch (error) {
      /* eslint-disable-next-line no-console */
      console.log('Error getting authenticated user', error);
      setUserData(emptyUserData);
    }
    setAuthReady(true);
  }, []);

  useEffect(() => {
    loadCognitoUser();
  }, [loadCognitoUser]);

  // Control token expiration. Amplify refreshes the session automatically, but
  // we have to request the session using the library's methods. We need the
  // token to be accessible without having to request it and await every time,
  // so every so often we need to check credentials to refresh.
  useEffect(() => {
    let timer;
    if (userData.accessTokenExpire) {
      // There's a limit to setTimeout's delay. 2 days is more than enough.
      // https://stackoverflow.com/questions/3468607/why-does-settimeout-break-for-large-millisecond-delay-values
      const millis = Math.min(
        // Add 1s to ensure the token is really expired
        userData.accessTokenExpire + 1000 - Date.now(),
        86400 * 2 * 1000
      );

      // Timer to expire the token
      timer = setTimeout(() => {
        loadCognitoUser();
      }, millis);
    }

    // Clear timeout if one exists
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [userData.accessTokenExpire, loadCognitoUser]);

  // Update CASL ability when the user logs in.
  useEffect(() => {
    updateAbilityFor(ability, userData);
  }, [userData, ability]);

  const contextValue = {
    isAuthReady,
    userData,
    setUserData
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: T.node
};

// Context consumers.
// Used to access different parts of the ATBD list context
const useSafeContextFn = createContextChecker(UserContext, 'UserContext');

export const useAuthToken = () => {
  const { userData, setUserData } = useSafeContextFn('useAuthToken');

  return useMemo(
    () => ({
      token: userData.accessToken,
      // token:
      //   '',
      expireToken: () => {
        setUserData(emptyUserData);
      }
    }),
    [userData, setUserData]
  );
};

export const useUser = () => {
  const { isAuthReady, userData, setUserData } = useSafeContextFn('useUser');

  return useMemo(
    () => ({
      isAuthReady,
      user: userData,
      isLogged: !!userData.id,
      isCurator: userData.groups?.some?.(
        (g) => g.toLowerCase() === CURATOR_ROLE
      ),
      isContributor: userData.groups?.some?.(
        (g) => g.toLowerCase() === CONTRIBUTOR_ROLE
      ),
      loginCognitoUser: (user, userInfo) =>
        setUserData(extractUserDataFromCognito(user, userInfo))
    }),
    [userData, isAuthReady, setUserData]
  );
};
