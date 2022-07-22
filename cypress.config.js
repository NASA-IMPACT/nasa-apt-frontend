const { defineConfig } = require('cypress')

module.exports = defineConfig({
  experimentalFetchPolyfill: true,
  chromeWebSecurity: false,
  defaultCommandTimeout: 2000,
  viewportWidth: 1400,
  viewportHeight: 960,
  projectId: 'vm6t6f',
  video: false,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    baseUrl: 'http://localhost:9000/',
    excludeSpecPattern: '*.util.js',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
})
