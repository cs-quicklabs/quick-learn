const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
      // implement node event listeners here
      baseUrl: 'http://139.59.18.251'
  },
  viewportWidth: 1440,
  viewportHeight: 720,
});
