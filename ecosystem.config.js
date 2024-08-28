module.exports = {
  apps: [
    {
      name: 'backend',
      script: './dist/apps/quick-learn-backend/main.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      node_args: "--env-file apps/quick-learn-backend/.env.dev",
    },
    {
      name: 'frontend',
      script: 'npm',
      args: 'run start:frontend:production',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
    },
  ],
};
