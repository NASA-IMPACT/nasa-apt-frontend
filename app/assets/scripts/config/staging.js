// module exports is required to be able to load from gulpfile.
module.exports = {
  gaTrackingCode: 'G-K4DQR9HTZH',
  apiUrl: 'https://af7f32q2kh.execute-api.us-east-1.amazonaws.com/v2',
  auth: {
    // DOCS: https://docs.amplify.aws/lib/auth/start/q/platform/js#re-use-existing-authentication-resource
    // Amazon Cognito Region
    region: 'us-east-1',
    // Amazon Cognito User Pool ID
    userPoolId: 'us-east-1_tcpUTdH4h',
    // Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: '61286541mqtm9t680nnskdd3ii',
    // Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
    authenticationFlowType: 'USER_PASSWORD_AUTH'
  },
  hostedAuthUi: 'https://nasa-apt-api-staging.auth.us-east-1.amazoncognito.com'
};
