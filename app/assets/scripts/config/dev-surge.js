// module exports is required to be able to load from gulpfile.
module.exports = {
    appTitle: 'Algorithm Publishing Tool',
    appDescription: 'Algorithm Publishing Tool - Publish algorithms.',
    apiUrl: '',
    auth: {
      // DOCS: https://docs.amplify.aws/lib/auth/start/q/platform/js#re-use-existing-authentication-resource
      // Amazon Cognito Region
      region: 'us-east-1',
      // Amazon Cognito User Pool ID
      userPoolId: '',
      // Amazon Cognito Web Client ID (26-char alphanumeric string)
      userPoolWebClientId: '',
      // Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
      authenticationFlowType: 'USER_PASSWORD_AUTH'
    },
    hostedAuthUi: '' // COGNITO HOSTED APP URL
  };
  