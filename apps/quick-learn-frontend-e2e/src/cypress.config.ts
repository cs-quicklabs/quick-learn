import { defineConfig } from 'cypress';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3005', // Accessing the environment variable
  },
  viewportWidth: 1440,
  viewportHeight: 720,
});
