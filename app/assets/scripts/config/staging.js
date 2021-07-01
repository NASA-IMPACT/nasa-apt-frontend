// module exports is required to be able to load from gulpfile.
module.exports = {
  apiUrl: 'https://95623q3plb.execute-api.us-east-1.amazonaws.com/v2',
  auth: {
    // DOCS: https://docs.amplify.aws/lib/auth/start/q/platform/js#re-use-existing-authentication-resource
    // Amazon Cognito Region
    region: 'us-east-1',
    // Amazon Cognito User Pool ID
    userPoolId: 'us-east-1_myPaDY9o1',
    // Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: '3v15rnvglc8p9nkja4behaoijk',
    // Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
    authenticationFlowType: 'USER_PASSWORD_AUTH'
  },
  hostedAuthUi:
    'https://nasa-apt-api-lambda-dev-auth-test.auth.us-east-1.amazoncognito.com'
};
