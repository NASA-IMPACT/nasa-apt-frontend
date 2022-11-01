module.exports = {
  appTitle: 'Report Generator Tool',
  appDescription: 'Report Generator Tool - Create reports on satellite needs.',
  apiUrl: 'http://localhost:8888/v2',
  snwgApiUrl: 'https://api.snwg-impact.net/api/v1/',
  mimsApiUrl: 'https://mims.nasa-impact.net/',
  auth: {
    // DOCS: https://docs.amplify.aws/lib/auth/start/q/platform/js#re-use-existing-authentication-resource
    // Amazon Cognito Region
    region: 'us-east-1',
    // Amazon Cognito User Pool ID
    userPoolId: 'us-east-1_4b2d7474925540b7a7026890b7713183',
    // Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: 'abc123',
    // Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
    authenticationFlowType: 'USER_PASSWORD_AUTH',
    endpoint: 'http://localhost:4566'
  },
  hostedAuthUi: 'http://localhost:4566'
};
