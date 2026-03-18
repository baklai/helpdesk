module.exports = {
  apps: [
    {
      name: 'helpdesk-api',
      script: 'dist/main.js',
      cwd: '/app',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOST: '0.0.0.0'
      }
    },
    {
      name: 'helpdesk-app',
      script: 'nginx',
      args: '-g "daemon off;"',
      interpreter: 'none'
    }
  ]
};
