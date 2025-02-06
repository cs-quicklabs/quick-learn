module.exports = {
  apps: [
    {
      name: 'backend',
      script: './start-backend.sh',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      restart_delay: 5000,
    },
    {
      name: 'frontend',
      script: 'npm',
      args: 'run start:frontend:production',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      restart_delay: 5000,
    },
  ],
};
