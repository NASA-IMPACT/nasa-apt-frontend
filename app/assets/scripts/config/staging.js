// module exports is required to be able to load from gulpfile.
module.exports = {
  gaTrackingCode: 'UA-163103126-1',
  apiUrl: 'https://95623q3plb.execute-api.us-east-1.amazonaws.com/v2',
  auth: {
    // DOCS: https://docs.amplify.aws/lib/auth/start/q/platform/js#re-use-existing-authentication-resource
    // Amazon Cognito Region
    region: 'us-east-1',
    // Amazon Cognito User Pool ID
    userPoolId: 'us-east-1_cqYWVI5KW',
    // Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: '4p83612hk9dit8orsc35dfq753',
    // Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
    authenticationFlowType: 'USER_PASSWORD_AUTH'
  },
  hostedAuthUi:
    'https://nasa-apt-api-lambda-dev.auth.us-east-1.amazoncognito.com'
};
