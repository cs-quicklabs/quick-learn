const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
      // implement node event listeners here
      baseUrl: 'http://dev-learn.quicklabs.in/'
  },
  viewportWidth: 1440,
  viewportHeight: 720,
});
