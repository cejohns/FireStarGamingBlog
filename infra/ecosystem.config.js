module.exports = {
  apps: [{
    name: "firestar-api",
    script: "server/index.js",
    env: {
      NODE_ENV: "production",
      PORT: 5000
    }
  }]
}
