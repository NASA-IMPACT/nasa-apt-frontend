// module exports is required to be able to load from gulpfile.
module.exports = {
  appTitle: 'Algorithm Publication Tool',
  appDescription: 'Algorithm Publication Tool - ATBD management.',
  apiUrl: '',
  auth: {
    // DOCS: https://docs.amplify.aws/lib/auth/start/q/platform/js#re-use-existing-authentication-resource
    // Amazon Cognito Region
    region: '',
    // Amazon Cognito User Pool ID
    userPoolId: '',
    // Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: '',
    // Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
    authenticationFlowType: 'USER_PASSWORD_AUTH'
  },
  hostedAuthUi: ''
};
