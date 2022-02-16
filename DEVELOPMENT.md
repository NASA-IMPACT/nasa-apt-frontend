# Algorithm Publication Tool (APT)
_version 2_

Front end application for APT.

**Backend**  
The [backend repository](https://github.com/NASA-IMPACT/nasa-apt) contains the necessary instructions to setup the API server. Version 2.2.3-beta is required.

## Install Project Dependencies
To set up the development environment for this website, you'll need to install the following on your system:

- [Node](http://nodejs.org/) (see [.nvmrc](./.nvmrc) for version) (To manage multiple node versions we recommend [nvm](https://github.com/creationix/nvm))
- [Yarn](https://yarnpkg.com/) Package manager

### Install Application Dependencies

If you use [`nvm`](https://github.com/creationix/nvm), activate the desired Node version:

```
nvm install
```

Install Node modules:

```
yarn install
```

### Usage

#### Config files
All the config files can be found in `app/assets/scripts/config`.
After installing the projects there will be 3 main files:
  - `local.js` - Used only for local development. On production this file should not exist or be empty.
  - `staging.js`
  - `production.js`

The `production.js` file serves as base and the other 2 will override it as needed:
  - `staging.js` will be loaded whenever the env variable `NODE_ENV` is set to `staging`.
  - `local.js` will be loaded if it exists.

The following options must be set: (The used file will depend on the context):
  - `appTitle` - Title of the application
  - `appDescription` - Description of the application

Example:
```
module.exports = {
  appTitle: 'Algorithm Publication Tool',
  appDescription: 'Tool for managing ATBDS'
};
```

**If you're running the [nasa-apt backend](https://github.com/NASA-IMPACT/nasa-apt#local-development) locally you'll need to configure localstack.**

To set up the front-end with LocalStack, you should also set:

- `apiUrl` - The host and API version of the backend, set this to `http://localhost:8000/v2`
- `auth` - The configuration for LocalStack's Cognito, with
  - `region` - The AWS region, set this to `us-east-1`
  - `userPoolId` - The Cognito user pool ID
  - `userPoolWebClientId` - The Cognito client ID
  - `authenticationFlowType` - The authenitcation flow type, set this to `USER_PASSWORD_AUTH`
  - `endpoint` - The host for the local Cognito instance, set this to `http://localhost:4566`

The Cognito user pool and client IDs will be printed in the output of the locally running API or can be obtained with the following commands:

```sh
# Grabs user pool id - won't produce any output
pool_id=$(AWS_REGION=us-east-1 aws --endpoint-url http://localhost:4566 cognito-idp list-user-pools --no-sign-request --max-results 100 | jq -rc '.UserPools[0].Id')

# Grab app client id and formats the output
AWS_REGION=us-east-1 aws --endpoint-url http://localhost:4566 cognito-idp list-user-pool-clients --user-pool-id $pool_id  --no-sign-request --max-results 10 | jq -rc '.UserPoolClients[0] | {ClientId: .ClientId, UserPoolId: .UserPoolId}'
```

Example:
```js
module.exports = {
  appTitle: 'Report Generator Tool',
  appDescription: 'Report Generator Tool - Create reports on satellite needs.',
  apiUrl: 'http://localhost:8000/v2',
  auth: {
    // DOCS: https://docs.amplify.aws/lib/auth/start/q/platform/js#re-use-existing-authentication-resource
    // Amazon Cognito Region
    region: 'us-east-1',
    // Amazon Cognito User Pool ID
    userPoolId: 'us-east-1_f7ada9e3ccb943d5a0816daa2e3b88f5',
    // Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: 't33ew3hyhi0y3lj5nh63sdrx84',
    // Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
    authenticationFlowType: 'USER_PASSWORD_AUTH',
    endpoint: 'http://localhost:4566'
  },
  hostedAuthUi: 'http://localhost:4566'
};
```

#### Starting the app

```
yarn serve
```
Compiles the javascript and launches the server making the site available at `http://localhost:9000/`
The system will watch files and execute tasks whenever one of them changes.
The site will automatically refresh since it is bundled with livereload.

### ADRs
> One of the hardest things to track during the life of a project is the motivation behind certain decisions. A new person coming on to a project may be perplexed, baffled, delighted, or infuriated by some past decisions.

This project uses ADRs (Architecture Decision Records) to keep track of the most significant decisions taken.
These documents can be found in `/adr`.

### Application technology
- The application is built using the React framework.
- State management is done leveraging the power of React Contexts with a home grown solution for api requests called Contexeed. See the [ADR on the topic](./adr/0001-data-management.md) and the [source code](./app/assets/scripts/utils/contexeed/README.md).
- Although the project doesn't use typescript, there are some `types.ts` files around that can be helpful to understand certain data structures.
- Styling is done with [Styled Components](https://styled-components.com/) and this project makes use of the [Development Seed UI Library](https://devseed-ui-library.surge.sh) for the base components.
- The authorization management (although simple at the moment) is handled with [CASL](https://casl.js.org/v5/en/). See [Authorization ADR](./adr/0002-a11n.md).
- The rich text editors were build using the framework provided by [Slate Plugins v0.75](https://github.com/udecode/slate-plugins/tree/v0.75.2). See [README.md](./app/assets/scripts/components/slate/README.md)

# Deployment
To prepare the app for deployment run:

```
yarn build
```
or
```
yarn stage
```
This will package the app and place all the contents in the `dist` directory.
The app can then be run by any web server.

### Building with custom base path
If the webapp is not going to be hosted at the root, the base path needs to be set through `PUBLIC_URL` before building.
Example:
```
PUBLIC_URL='https://example.com/apt' yarn build
```

## Releases

**A new release should be created every time there's a merge to master.**

Releases are tied to a version number and created manually using GH's releases page.  
The version in the `package.json` should be increased according to [semver](https://semver.org/) and the release tag should follow the format `v<major>.<minor>.<patch>`, ex: `v2.0.1`.  
The release description should have a changelog with "Features", "Improvements" and "Fixes".

**The release description should also include the require version of the [backend](https://github.com/NASA-IMPACT/nasa-apt).**

Example:
```
# Changelog

Requires backend v0.2.0

## 🎉 Features
- Amazing new feature

## 🚀 Improvements
- Improve existent feature

## 🐛 Fixes
- Fix weird bug
```
