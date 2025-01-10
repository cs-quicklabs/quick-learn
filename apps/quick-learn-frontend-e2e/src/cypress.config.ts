/* eslint-disable @nx/enforce-module-boundaries */
import { defineConfig } from 'cypress';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export default defineConfig({
  e2e: {
    baseUrl: process.env.QLDEV_BASE_URL, // Accessing the environment variable
  },
  viewportWidth: 1920,
  viewportHeight: 1080,
  retries: 3
});
