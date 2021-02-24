# Algorithm Publication Tool (APT)
_version 2_

Front end application for APT.

Backend available at https://github.com/developmentseed/nasa-apt

## Installation and Usage
The steps below will walk you through setting up your own instance of the project.

### Install Project Dependencies
To set up the development environment for this website, you'll need to install the following on your system:

- [Node](http://nodejs.org/) (see [.nvmrc](./.nvmrc)) (To manage multiple node versions we recommend [nvm](https://github.com/creationix/nvm))
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
  - `staging.js` will be loaded whenever the env variable `NODE_ENV` is set to staging.
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

#### Starting the app

```
yarn serve
```
Compiles the javascript and launches the server making the site available at `http://localhost:9000/`
The system will watch files and execute tasks whenever one of them changes.
The site will automatically refresh since it is bundled with livereload.

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
The release description should have a [changelog](https://gist.github.com/vgeorge/e6fd828987b2f7d62a447df2bd132c4a) with "Features", "Improvements" and "Fixes".

**The release description should also include the require version of the [backend](https://github.com/developmentseed/nasa-apt).**

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


# License

This project is licensed under **The MIT License (MIT)**, see the [LICENSE](LICENSE) file for more details.
