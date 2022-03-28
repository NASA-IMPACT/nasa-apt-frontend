// module exports is required to be able to load from gulpfile.
module.exports = {
  sentryDSN:
    'https://ccb5ad14ce344c209ee7cd69a9dcda7c@o1180400.ingest.sentry.io/6293167',
  appTitle: 'Algorithm Publication Tool',
  appDescription: 'Algorithm Publication Tool - ATBD management.',
  apiUrl: 'https://xryfsg9blc.execute-api.us-west-2.amazonaws.com/v2',
  auth: {
    // DOCS: https://docs.amplify.aws/lib/auth/start/q/platform/js#re-use-existing-authentication-resource
    // Amazon Cognito Region
    region: 'us-west-2',
    // Amazon Cognito User Pool ID
    userPoolId: 'us-west-2_O7TtOyxYl',
    // Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: '4rki4nf19n8e5ej5m1518g59ts',
    // Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
    authenticationFlowType: 'USER_PASSWORD_AUTH'
  },
  hostedAuthUi:
    'https://nasa-apt-api-lambda-prod.auth.us-west-2.amazoncognito.com'
};
