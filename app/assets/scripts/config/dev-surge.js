// module exports is required to be able to load from gulpfile.
module.exports = {
    appTitle: 'Algorithm Publication Tool',
    appDescription: 'Algorithm Publication Tool - ATBD management.',
    apiUrl: 'https://lracwfou03.execute-api.us-east-1.amazonaws.com',
    auth: {
      // DOCS: https://docs.amplify.aws/lib/auth/start/q/platform/js#re-use-existing-authentication-resource
      // Amazon Cognito Region
      region: 'us-west-2',
      // Amazon Cognito User Pool ID
      userPoolId: 'us-east-1_ye6Da18Fh',
      // Amazon Cognito Web Client ID (26-char alphanumeric string)
      userPoolWebClientId: '6ah48c1ski5mhfbfqmta2hhrjc',
      // Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
      authenticationFlowType: 'USER_PASSWORD_AUTH'
    },
    hostedAuthUi:
      'https://nasa-apt-api-dev.auth.us-east-1.amazoncognito.com'
  };
  