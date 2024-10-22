const { defineConfig } = require('cypress');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.NEXT_PUBLIC_APP_BASE_URL, // Accessing the environment variable
  },
  viewportWidth: 1440,
  viewportHeight: 720,
});

