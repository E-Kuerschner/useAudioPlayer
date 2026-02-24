const { defineConfig } = require("cypress")

module.exports = defineConfig({
    e2e: {
        specPattern: "test/cypress/integration/**/*.spec.js",
        supportFile: "test/cypress/support/index.js",
        fixturesFolder: "test/cypress/fixtures",
        screenshotsFolder: "test/cypress/screenshots",
        videosFolder: "test/cypress/videos"
    }
})
