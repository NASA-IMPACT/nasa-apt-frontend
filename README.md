
## Algorithm Publication Tool (nasa-apt)
Front end application for nasa-apt.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

`yarn`

Installs necessary dependencies.

## Available Scripts

In the project directory, you can run:

`yarn start`

Runs the app in the development mode.  
Open [http://localhost:3006](http://localhost:3006) to view it in the browser.

The page will reload if you make edits.  

`yarn test`

Runs the tap based unit tests.

`yarn run build`

Builds the app for production to the `build` folder.  
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.  
Your app is ready to be deployed!

The following environment variables are required.  You can copy and rename `.env.sample` to `.env` for use as a template.  
`PORT=3006`  
`SKIP_PREFLIGHT_CHECK=true`  
`REACT_APP_API_URL` The URL with port of the stac compliant api.  

### Building with custom base path
If the webapp is not going to be hosted at the root, the base path needs to be set through `PUBLIC_URL` before building.
Example:
```
PUBLIC_URL='https://example.com/apt' yarn build
```

### Design Approach

The application uses [Redux](https://redux.js.org/) for state management.

The application design uses both Presentational and Container components but makes liberal use of [react-redux](https://react-redux.js.org/docs/introduction/basic-tutorial) `connect` as outlined [here](https://redux.js.org/faq/react-redux#should-i-only-connect-my-top-component-or-can-i-connect-multiple-components-in-my-tree).

State that is transient or does not affect other components in the application can be maintained directly in components where appropriate as described [here](https://redux.js.org/faq/organizing-state#do-i-have-to-put-all-my-state-into-redux-should-i-ever-use-reacts-setstate).

Pure stateless React [components](https://reactjs.org/docs/state-and-lifecycle.html) are preferred but Class components are used where local state is required.

Any impure actions which may have side effects (asynchronous API requests, interaction with browser local storage) are isolated in Redux [middleware](https://redux.js.org/advanced/middleware).

Cross-cutting actions are also managed through the use of middleware.

Because the application makes extensive use of [HOCs](https://reactjs.org/docs/higher-order-components.html), wrapped components are exposed as the default export while raw components are available as a named component.  This allows for unit testing without invoking HOC behavior.

The application uses [tape-await](https://github.com/mbostock/tape-await) to simplify asynchronous test flow for middleware.

### Icons

The application uses [Collecticons](https://collecticons.io/). To reduce bundle size, we only store the icons we use. Place icons in `src/assets/icons/collecticons/`.

To compile new icons, run:

`yarn collecticons`

You can then reference icons in your code:

```
import collecticon from 'src/styles/collecticons';
const icon = styled.div`
   &::after {
      ${collecticon('chevron-down--small')};
   }
`
```

## Environments
There are currently 2 environments defined for NASA-APT, which follow specific branches
- Staging (`develop`): http://nasa-apt-staging-application.s3-website-us-east-1.amazonaws.com
- Production (`master`): http://nasa-apt-application.s3-website-us-east-1.amazonaws.com/

**The deployment process is automated and handled by Circle CI.**

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
