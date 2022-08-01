import { sign } from 'jsonwebtoken';
import config from '../../app/assets/scripts/config';

const EXPIRY = 10000;
function authTime() {
  return Math.floor(Date.now() / 1000);
}

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

Cypress.Commands.add('login', (access = 'contributor') => {
  const userId = '8c05f074-5c79-49cb-8a38-36a89023b787';
  const username = 'user@example.com';
  const userData = `{"Username":"${userId}","UserAttributes":[{"Name":"email_verified","Value":"true"},{"Name":"preferred_username","Value":"Carlos Curator"},{"Name":"email","Value":"${username}"},{"Name":"sub","Value":"${userId}"}],"UserCreateDate":"2022-03-07T11:43:13.000Z","UserLastModifiedDate":"2022-03-07T11:43:13.000Z","Enabled":true,"UserStatus":"CONFIRMED","MFAOptions":[],"UserMFASettingList":[],"ResponseMetadata":{"HTTPStatusCode":200,"HTTPHeaders":{"content-type":"text/html; charset=utf-8","content-length":"748","access-control-allow-origin":"*","access-control-allow-methods":"HEAD,GET,PUT,POST,DELETE,OPTIONS,PATCH","access-control-allow-headers":"authorization,content-type,content-length,content-md5,cache-control,x-amz-content-sha256,x-amz-date,x-amz-security-token,x-amz-user-agent,x-amz-target,x-amz-acl,x-amz-version-id,x-localstack-target,x-amz-tagging","access-control-expose-headers":"x-amz-version-id","connection":"close","date":"Mon, 07 Mar 2022 12:15:28 GMT","server":"hypercorn-h11"},"RetryAttempts":0}}`;
  const refreshToken = '3ff73baa';

  // const user = userConfig[access];
  cy.intercept('POST', '/', userData);
  const keyPrefix = 'CognitoIdentityServiceProvider.abc123';
  const keyPrefixWithUsername = `${keyPrefix}.${username}`;

  window.localStorage.setItem(
    `${keyPrefixWithUsername}.idToken`,
    signIdToken(userId, username, access)
  );
  window.localStorage.setItem(
    `${keyPrefixWithUsername}.accessToken`,
    signAccessToken(userId, username, access)
  );
  window.localStorage.setItem(
    `${keyPrefixWithUsername}.refreshToken`,
    refreshToken
  );
  window.localStorage.setItem(keyPrefixWithUsername, userData);
  window.localStorage.setItem(`${keyPrefixWithUsername}.clockDrift`, '11');
  window.localStorage.setItem(`${keyPrefix}.LastAuthUser`, username);
  window.localStorage.setItem('amplify-authenticator-authState', 'signedIn');
});
