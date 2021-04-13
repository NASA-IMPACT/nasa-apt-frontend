import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import T from 'prop-types';
import jwt_decode from 'jwt-decode';

import { useContextualAbility, updateAbilityFor } from '../a11n';

const LOCALSTORAGE_TOKEN_KEY = 'tokenData';

const emptyTokenState = { token: null, expireAt: null };

const initialTokenState = (() => {
  const storedToken = localStorage.getItem(LOCALSTORAGE_TOKEN_KEY);
  if (!storedToken) return emptyTokenState;
  try {
    return JSON.parse(storedToken);
  } catch (error) {
    return emptyTokenState;
  }
})();

// Context
export const UserContext = createContext(null);

// Context provider
export const UserProvider = (props) => {
  const { children } = props;
  const [tokenData, setTokenData] = useState(initialTokenState);
  const ability = useContextualAbility();

  // Control token expiration.
  useEffect(() => {
    let timer;
    if (tokenData.expireAt) {
      // There's a limit to setTimeout's delay. 2 days is more than enough.
      // https://stackoverflow.com/questions/3468607/why-does-settimeout-break-for-large-millisecond-delay-values
      const millis = Math.min(
        tokenData.expireAt - Date.now(),
        86400 * 2 * 1000
      );

      // Timer to expire the token
      timer = setTimeout(() => {
        setTokenData(emptyTokenState);
        updateAbilityFor(ability, null);
      }, millis);
    }

    // Clear timeout if one exists
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [tokenData.expireAt, ability]);

  // Update CASL ability when the user logs in.
  useEffect(() => {
    updateAbilityFor(ability, tokenData);
  }, [tokenData, ability]);

  // Store token in localstorage.
  useEffect(() => {
    if (tokenData.token) {
      localStorage.setItem(LOCALSTORAGE_TOKEN_KEY, JSON.stringify(tokenData));
    } else {
      localStorage.removeItem(LOCALSTORAGE_TOKEN_KEY);
    }
  }, [tokenData]);

  const contextValue = {
    tokenData,
    setTokenData
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
const useCheckContext = (fnName) => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error(
      `The \`${fnName}\` hook must be used inside the <UserContext> component's context.`
    );
  }

  return context;
};

export const useAuthToken = () => {
  const { tokenData, setTokenData } = useCheckContext('useAuthToken');

  return useMemo(
    () => ({
      token: tokenData.token,
      setToken: (token) => {
        const decoded = jwt_decode(token);
        setTokenData({ token, expireAt: decoded.exp * 1000 });
      },
      expireToken: () => {
        setTokenData(emptyTokenState);
      }
    }),
    [tokenData, setTokenData]
  );
};

export const useUser = () => {
  const { tokenData } = useCheckContext('useUser');

  return useMemo(
    () => ({
      isLogged: !!tokenData.token
    }),
    [tokenData]
  );
};
