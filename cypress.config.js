const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "td1fct",
  e2e: {
    baseUrl: "http://localhost:4200",
    specPattern: "cypress/e2e/**/*.feature",
    experimentalStudio: true,
    setupNodeEvents(on, config) {
      // ajout du plugin cucumber
      on(
        "file:preprocessor",
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      );
      preprocessor.addCucumberPreprocessorPlugin(on, config);
      return config;
    },
    reporter: "mochawesome",
    reporterOptions: {
      reportDir: "cypress/reports", // Dossier des rapports
      overwrite: true, // Ecrase les anciens rapports
      html: true, // Génère un rapport HTML lisible
      json: true, // Génère aussi un JSON
      embeddedScreenshots: true, // Intègre les screenshots dans le rapport
      inlineAssets: true, // évite des fichiers séparés
      reportFilename: "current-report", // Nom fixe pour le rapport
      timestamp: false, // Pas de timestamp dans les fichiers
    },
    trashAssetsBeforeRuns: true, // Nettoie les dossiers avant chaque exécution
    video: true, // Enregistrement vidéo activé
    videosFolder: "cypress/videos", // Dossier des vidéos
    screenshotsFolder: "cypress/screenshots", // Dossier pour les screenshots
    screenshotOnRunFailure: true, // Screenshot auto en cas d’échec
    viewportWidth: 1920,
    viewportHeight: 1080,
  },
});
