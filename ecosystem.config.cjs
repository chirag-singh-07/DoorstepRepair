module.exports = {
  apps: [
    {
      name: "doorstep-repair",
      script: "dist/index.cjs",
      env: {
        NODE_ENV: "production",
      }
    }
  ]
};
