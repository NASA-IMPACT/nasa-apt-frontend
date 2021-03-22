import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import T from 'prop-types';
import jwt_decode from 'jwt-decode';

// Context
export const UserContext = createContext(null);

// Context provider
export const UserProvider = (props) => {
  const { children } = props;
  const [tokenData, setTokenData] = useState({ token: null, expireAt: null });

  useEffect(() => {
    let timer;
    if (tokenData.expireAt) {
      const millis = tokenData.expireAt - Date.now();

      // Timer to expire the token
      timer = setTimeout(() => {
        setTokenData({ token: null, expireAt: null });
      }, millis);
    }

    // Clear timeout if one exists
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [tokenData.expireAt]);

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
      }
    }),
    [tokenData, setTokenData]
  );
};
