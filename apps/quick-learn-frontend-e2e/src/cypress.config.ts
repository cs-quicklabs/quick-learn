/* eslint-disable @nx/enforce-module-boundaries */
import { defineConfig } from 'cypress';
import dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://dev.learn.build-release.com/', // Accessing the environment variable
  },
  viewportWidth: 1920,
  viewportHeight: 1080,
  defaultCommandTimeout: 10000,
});
