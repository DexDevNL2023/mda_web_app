const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'td1fct',
  e2e: {
    experimentalStudio: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'cypress/reports',
      overwrite: true,
      html: false,
      json: true,
      embeddedScreenshots: true,
      reportFilename: 'current-report', // nom fixe, sans timestamp
      timestamp: false, // désactive le timestamp
    },
    video: true,
    viewportWidth: 1920,
    viewportHeight: 1080,
  },
});
