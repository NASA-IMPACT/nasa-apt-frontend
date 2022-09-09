// module exports is required to be able to load from gulpfile.
module.exports = {
    appTitle: 'Algorithm Publishing Tool',
    appDescription: 'Algorithm Publishing Tool - Publish algorithms.',
    apiUrl: 'https://abglctw3j2.execute-api.us-east-1.amazonaws.com',
    auth: {
      // DOCS: https://docs.amplify.aws/lib/auth/start/q/platform/js#re-use-existing-authentication-resource
      // Amazon Cognito Region
      region: 'us-east-1',
      // Amazon Cognito User Pool ID
      userPoolId: 'us-east-1_H2fR1djlP',
      // Amazon Cognito Web Client ID (26-char alphanumeric string)
      userPoolWebClientId: '21vc31gl0g9lf1ljvvfc70g25a',
      // Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
      authenticationFlowType: 'USER_PASSWORD_AUTH'
    },
    hostedAuthUi: 'https://nasa-apt-api-dev.auth.us-east-1.amazoncognito.com' // COGNITO HOSTED APP URL
  };
  