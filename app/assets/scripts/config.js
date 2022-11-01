// require is required to be able to load from gulpfile.
const defaultsDeep = require('lodash.defaultsdeep');
const set = require('lodash.set');

/*
 * App configuration.
 *
 * Uses settings in config/production.js, with any properties set by
 * config/staging.js or config/local.js overriding them depending upon the
 * environment.
 *
 * This file should not be modified.  Instead, modify one of:
 *
 *  - config/production.js
 *      Production settings (base).
 *  - config/staging.js
 *      Overrides to production if ENV is staging.
 *  - config/local.js
 *      Overrides if local.js exists.
 *      This last file is gitignored, so you can safely change it without
 *      polluting the repo.
 */

// The production config works as base.
let config = require('./config/production');

if (process.env.NODE_ENV === 'test') {
  config = defaultsDeep(require('./config/test'), config);
}

if (process.env.NODE_ENV === 'staging') {
  config = defaultsDeep(require('./config/staging'), config);
}

if (process.env.NODE_ENV === 'development') {
  config = defaultsDeep(require('./config/local'), config);
}

// ENV variables overrides.
// Set <VAR> on <config path> with <optional default>
[
  [process.env.PUBLIC_URL, 'baseUrl', ''],
  [process.env.AUTH_REGION, 'auth.region'],
  [process.env.AUTH_POOL_ID, 'auth.userPoolId'],
  [process.env.AUTH_CLIENT_ID, 'auth.userPoolWebClientId'],
  [process.env.AUTH_UI, 'hostedAuthUi']
].forEach(([envVar, path, def]) => {
  const v = envVar || def;
  if (typeof v !== 'undefined') set(config, path, v);
});

module.exports = config;
