module.exports = {
  apps: [
    {
      name: 'trustline-api',
      script: 'src/server.js',
      cwd: __dirname,
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
      },
    },
  ],
};
