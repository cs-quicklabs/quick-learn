import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';

import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    // ...nxE2EPreset(__filename, {
    //   cypressDir: 'src',
    //   webServerCommands: { default: 'nx run quick-learn-frontend:start' },
    //   ciWebServerCommand: 'nx run quick-learn-frontend:serve-static',
    // }),
   
  },
  viewportWidth: 1440,
  viewportHeight: 720,
});
