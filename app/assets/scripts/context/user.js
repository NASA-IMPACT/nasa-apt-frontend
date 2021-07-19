import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import T from 'prop-types';
import Amplify, { Auth } from 'aws-amplify';

import { useContextualAbility, updateAbilityFor } from '../a11n';
import config from '../config';
import { createContextChecker } from '../utils/create-context-checker';
import { CONTRIBUTOR_ROLE, CURATOR_ROLE } from '../a11n/rules';

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

const extractUserDataFromCognito = (user) => {
  const { sub, preferred_username } = user.attributes;
  const idTokenData = user.getSignInUserSession().getIdToken().payload;
  const accessToken = user.getSignInUserSession().getAccessToken();

  return {
    id: sub,
    name: preferred_username,
    accessToken: accessToken.jwtToken,
    accessTokenExpire: accessToken.payload.exp * 1000,
    attributes: user.attributes,
    groups: idTokenData['cognito:groups'] || [],
    rawCognitoUser: user
  };
};

// Context
export const UserContext = createContext(null);

// Context provider
export const UserProvider = (props) => {
  const { children } = props;
  const [userData, setUserData] = useState(emptyUserData);
  const ability = useContextualAbility();

  const loadCognitoUser = useCallback(async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      setUserData(extractUserDataFromCognito(user));
    } catch (error) {
      /* eslint-disable-next-line no-console */
      console.log('Error getting authenticated user', error);
      setUserData(emptyUserData);
    }
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
  const { userData, setUserData } = useSafeContextFn('useUser');

  return useMemo(
    () => ({
      user: userData,
      isLogged: !!userData.id,
      isCurator: userData.groups?.some?.(
        (g) => g.toLowerCase() === CURATOR_ROLE
      ),
      isContributor: userData.groups?.some?.(
        (g) => g.toLowerCase() === CONTRIBUTOR_ROLE
      ),
      loginCognitoUser: (data) => setUserData(extractUserDataFromCognito(data))
    }),
    [userData, setUserData]
  );
};
