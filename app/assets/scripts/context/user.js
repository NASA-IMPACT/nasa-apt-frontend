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

const initialTokenState = { token: null, expireAt: null };

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
      const millis = tokenData.expireAt - Date.now();

      // Timer to expire the token
      timer = setTimeout(() => {
        setTokenData(initialTokenState);
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
        setTokenData(initialTokenState);
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
