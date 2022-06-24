// module exports is required to be able to load from gulpfile.
module.exports = {
  appTitle: 'Algorithm Publication Tool',
  appDescription: 'Algorithm Publication Tool - ATBD management.',
  apiUrl: 'https://8864dn8eqh.execute-api.us-west-2.amazonaws.com/v2',
  auth: {
    // DOCS: https://docs.amplify.aws/lib/auth/start/q/platform/js#re-use-existing-authentication-resource
    // Amazon Cognito Region
    region: 'us-west-2',
    // Amazon Cognito User Pool ID
    userPoolId: 'us-west-2_LZIPH6Yf4',
    // Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: '4keo4k9837b6pa3f3e7knu8tut',
    // Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
    authenticationFlowType: 'USER_PASSWORD_AUTH'
  },
  hostedAuthUi:
    'https://nasa-apt-api-lambda-prod-v2.auth.us-west-2.amazoncognito.com'
};
