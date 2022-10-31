module.exports = {
  appTitle: 'Algorithm Publication Tool',
  appDescription: 'Algorithm Publication Tool - ATBD management.',
  apiUrl: 'https://dvahc78aid.execute-api.us-west-2.amazonaws.com',
  // snwgApiUrl: 'https://api.snwg-impact.net/api/v1/',
  // mimsApiUrl: 'https://mims.nasa-impact.net/',
  auth: {
    // DOCS: https://docs.amplify.aws/lib/auth/start/q/platform/js#re-use-existing-authentication-resource
    // Amazon Cognito Region
    region: 'us-west-2',
    // Amazon Cognito User Pool ID
    userPoolId: 'us-west-2_j8tQvg3R7',
    // Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: '4noo2ri9gqjbmpm5qqp3r8qjuj',
    // Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
    authenticationFlowType: 'USER_PASSWORD_AUTH',
    // endpoint: 'https://dvahc78aid.execute-api.us-west-2.amazonaws.com'
  },
  hostedAuthUi: 'https://nasa-apt-api-test-v1.auth.us-west-2.amazoncognito.com'
};


// most recent deployment

// nasa-apt-api-test-v1.nasaaptapitestv1appclientid = 4noo2ri9gqjbmpm5qqp3r8qjuj
// nasa-apt-api-test-v1.nasaaptapitestv1databasesecretarn = arn:aws:secretsmanager:us-west-2:237694371684:secret:nasa-apt-api-test-v1-database-secrets-FWoiuk
// nasa-apt-api-test-v1.nasaaptapitestv1domain = nasa-apt-api-test-v1
// nasa-apt-api-test-v1.nasaaptapitestv1endpointurl = https://dvahc78aid.execute-api.us-west-2.amazonaws.com
// nasa-apt-api-test-v1.nasaaptapitestv1userpoolid = us-west-2_j8tQvg3R7