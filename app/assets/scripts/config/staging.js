// module exports is required to be able to load from gulpfile.
module.exports = {
  gaTrackingCode: 'UA-163103126-1',
  apiUrl: 'https://0mrzuyq2e3.execute-api.us-east-1.amazonaws.com/v2',
  auth: {
    // DOCS: https://docs.amplify.aws/lib/auth/start/q/platform/js#re-use-existing-authentication-resource
    // Amazon Cognito Region
    region: 'us-east-1',
    // Amazon Cognito User Pool ID
    userPoolId: 'us-east-1_SQNr8XWOl',
    // Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: '5lbh4h6aooego0rkffi36hakhg',
    // Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
    authenticationFlowType: 'USER_PASSWORD_AUTH'
  },
  hostedAuthUi:
    'https://nasa-apt-api-lambda-staging.auth.us-east-1.amazoncognito.com'
};
