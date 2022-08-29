module.exports = {
  appTitle: 'Algorithm Publishing Tool',
  appDescription: 'Algorithm Publishing Tool - Publish algorithms.',
  apiUrl: 'https://9nu4z3wz7b.execute-api.us-east-1.amazonaws.com',
  auth: {
    // DOCS: https://docs.amplify.aws/lib/auth/start/q/platform/js#re-use-existing-authentication-resource
    // Amazon Cognito Region
    region: 'us-east-1',
    // Amazon Cognito User Pool ID
    userPoolId: 'us-east-1_xcnVXHqmU',
    userPoolWebClientId: '733lhtqu1cogc1hgf6077vu60k',
    // Amazon Cognito Web Client ID (26-char alphanumeric string)

    // Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
    authenticationFlowType: 'USER_PASSWORD_AUTH'
    // endpoint: 'http://localhost:4566' // comment this out when testing staging
  },
  // hostedAuthUi: 'http://localhost:4566' // use this for local testing
  hostedAuthUi:
    'https://nasa-apt-api-lambda-dev.auth.us-east-1.amazoncognito.com'
};
