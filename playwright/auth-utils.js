import { sign } from 'jsonwebtoken';
import config from '../app/assets/scripts/config';

const EXPIRY = 10000;
function authTime() {
  return Math.floor(Date.now() / 1000);
}

/**
 * Mock user data
 */
const userConfig = {
  contributor: {
    userId: '1fd0998a-4168-4844-8475-de624f9be2cf',
    username: 'author1@apt.com',
    access: 'contributor',
    name: 'Andre Author'
  },
  owner: {
    userId: '33b94622-80c5-4443-8bb2-2e124219afea',
    username: 'owner@apt.com',
    access: 'contributor',
    name: 'Olivia Owner'
  },
  curator: {
    userId: '57a4c1c0-3802-4edc-a141-baeb5b18d50f',
    username: 'curator@apt.com',
    access: 'curator',
    name: 'Carlos Curator'
  }
};

/**
 * Generates a JWT id token for the given user
 *
 * @param {string} userId - user id
 * @param {string} username - user email
 * @param {string} access - user role
 * @returns {string} - JWT token
 */
function signIdToken(userId, username, access) {
  const time = authTime();
  const payload = {
    exp: time + EXPIRY,
    iss: `http://localhost:4566/${config.auth.userPoolId}`,
    sub: userId,
    auth_time: time,
    iat: time,
    event_id: '81ab2e35-3489-4bcd-831b-f1e963b19f88',
    'cognito:groups': [access],
    token_use: 'id',
    email: username,
    aud: config.auth.userPoolWebClientId,
    email_verified: 'true',
    preferred_username: 'Carlos Curator',
    'cognito:username': userId
  };

  return sign(payload, 'sshhhh');
}

/**
 * Generates a JWT access token for the given user
 *
 * @param {string} userId - user id
 * @param {*} username - user email
 * @param {*} access - user role
 * @returns {string} - JWT token
 */
function signAccessToken(userId, username, access) {
  const time = authTime();
  const payload = {
    exp: time + EXPIRY,
    iss: `http://localhost:4566/${config.auth.userPoolId}`,
    sub: userId,
    auth_time: time,
    iat: time,
    event_id: 'a2bf74a6-963a-4b8b-a02a-1385c33dfa60',
    'cognito:groups': [access],
    token_use: 'access',
    username,
    scope: 'aws.cognito.signin.user.admin',
    jti: 'e013cdef-b435-42f2-9ddd-65f6702838f2',
    client_id: config.auth.userPoolWebClientId
  };

  return sign(payload, 'sshhhh');
}

/**
 * Generates a JWT token for the given user and saves it to local
 * storage. Also registers a route to intercept the login request and
 * serve the user data
 *
 * @param {string} role - contributor, owner, curator
 * @param {*} page - playwright page object
 */
export async function login(role, page) {
  const { userId, username, access, name } = userConfig[role];
  const userData = `{"PreferredMfaSetting":"SOFTWARE_TOKEN_MFA", "UserMFASettingList":["SOFTWARE_TOKEN_MFA"], "Username":"${userId}","UserAttributes":[{"Name":"email_verified","Value":"true"},{"Name":"preferred_username","Value":"${name}"},{"Name":"email","Value":"${username}"},{"Name":"sub","Value":"${userId}"}],"UserCreateDate":"2022-03-07T11:43:13.000Z","UserLastModifiedDate":"2022-03-07T11:43:13.000Z","Enabled":true,"UserStatus":"CONFIRMED","MFAOptions":[],"UserMFASettingList":[],"ResponseMetadata":{"HTTPStatusCode":200,"HTTPHeaders":{"content-type":"text/html; charset=utf-8","content-length":"748","access-control-allow-origin":"*","access-control-allow-methods":"HEAD,GET,PUT,POST,DELETE,OPTIONS,PATCH","access-control-allow-headers":"authorization,content-type,content-length,content-md5,cache-control,x-amz-content-sha256,x-amz-date,x-amz-security-token,x-amz-user-agent,x-amz-target,x-amz-acl,x-amz-version-id,x-localstack-target,x-amz-tagging","access-control-expose-headers":"x-amz-version-id","connection":"close","date":"Mon, 07 Mar 2022 12:15:28 GMT","server":"hypercorn-h11"},"RetryAttempts":0}}`;

  const refreshToken = '3ff73baa';
  const keyPrefix = 'CognitoIdentityServiceProvider.abc123';
  const keyPrefixWithUsername = `${keyPrefix}.${username}`;

  const initScriptData = {
    idTokenKey: `${keyPrefixWithUsername}.idToken`,
    idTokenValue: signIdToken(userId, username, access),
    accessTokenKey: `${keyPrefixWithUsername}.accessToken`,
    accessTokenValue: signAccessToken(userId, username, access),
    refreshTokenKey: `${keyPrefixWithUsername}.refreshToken`,
    refreshTokenValue: refreshToken,
    keyPrefixWithUsername: keyPrefixWithUsername,
    userDataKey: keyPrefixWithUsername,
    userDataValue: userData,
    clockDriftKey: `${keyPrefixWithUsername}.clockDrift`,
    clockDriftValue: '11',
    amplifySigninWithUIKey: 'amplify-signin-with-hostedUI',
    amplifySigninWithUIValue: 'false',
    lastAuthUserKey: `${keyPrefix}.LastAuthUser`,
    lastAuthUserValue: username,
    authStateKey: 'amplify-authenticator-authState',
    authStateValue: 'signedIn'
  };

  await page.context().addInitScript((data) => {
    window.localStorage.setItem(data.idTokenKey, data.idTokenValue);
    window.localStorage.setItem(data.accessTokenKey, data.accessTokenValue);
    window.localStorage.setItem(data.refreshTokenKey, data.refreshTokenValue);
    window.localStorage.setItem(data.userDataKey, data.userDataValue);
    window.localStorage.setItem(data.clockDriftKey, data.clockDriftValue);
    window.localStorage.setItem(data.lastAuthUserKey, data.lastAuthUserValue);
    window.localStorage.setItem(
      data.amplifySigninWithUIKey,
      data.amplifySigninWithUIValue
    );
    window.localStorage.setItem(data.authStateKey, data.authStateValue);
  }, initScriptData);

  await page.reload();

  await page.route('http://localhost:4566', (route) => {
    if (route.request().method() === 'POST') {
      route.fulfill({ body: userData });
    }
  });
}
