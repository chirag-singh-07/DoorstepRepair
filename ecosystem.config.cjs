module.exports = {
  apps: [
    {
      name: "doorstep-repair",
      script: "dist/index.cjs",
      node_args: "--env-file=.env",
      env: {
        NODE_ENV: "production",
      }
    }
  ]
};
