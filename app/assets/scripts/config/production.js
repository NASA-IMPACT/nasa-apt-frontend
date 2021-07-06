// module exports is required to be able to load from gulpfile.
module.exports = {
  appTitle: 'Algorithm Publication Tool',
  appDescription: 'Algorithm Publication Tool - ATBD management.',
  apiUrl: 'https://fulja173cc.execute-api.us-east-2.amazonaws.com/v2',
  auth: {
    // DOCS: https://docs.amplify.aws/lib/auth/start/q/platform/js#re-use-existing-authentication-resource
    // Amazon Cognito Region
    region: 'us-east-2',
    // Amazon Cognito User Pool ID
    userPoolId: 'us-east-2_dsHdmbBUK',
    // Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: '66kd4hhbm7cb5suifelj34btki',
    // Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
    authenticationFlowType: 'USER_PASSWORD_AUTH'
  },
  hostedAuthUi:
    'https://nasa-apt-api-lambda-prod.auth.us-east-2.amazoncognito.com'
};
