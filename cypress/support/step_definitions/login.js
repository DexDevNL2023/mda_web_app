import {
  Given,
  When,
  Then,
  Before,
  After,
} from "@badeball/cypress-cucumber-preprocessor";

Before(() => {
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.fixture("users.json").then((users) => {
    cy.wrap(users.admin).as("adminUser");
    cy.wrap(users.guest).as("guestUser");
    cy.wrap(users.apiUser).as("apiUser");
  });
});

After(() => {
  cy.screenshot();
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.log("Tous les tests terminés ✅");
});

Given("Je nettoie les cookies et le localStorage", () => {
  cy.clearCookies();
  cy.clearLocalStorage();
});

Given("Je charge les utilisateurs de test", () => {
  cy.fixture("users.json").then((users) => {
    cy.wrap(users.admin).as("adminUser");
    cy.wrap(users.guest).as("guestUser");
    cy.wrap(users.apiUser).as("apiUser");
  });
});

Given("Je suis sur la page de login", () => {
  cy.visit("/login");
  cy.intercept("POST", "/api/login").as("loginRequest");
});

When(
  "Je saisis {string} avec le mot de passe {string}",
  (username, password) => {
    cy.get("input[name=username]").type(username);
    cy.get("input[name=password]").type(password);
  }
);

When("Je clique sur {string}", (button) => {
  cy.contains("button", button).click();
  cy.wait("@loginRequest");
});

Then("Je devrais voir le dashboard", () => {
  cy.url().should("include", "/dashboard");
  cy.get(".dashboard", { timeout: 5000 }).should("be.visible");
});

Then("Je devrais voir un message d'erreur {string}", (msg) => {
  cy.get(".error-message", { timeout: 3000 })
    .should("be.visible")
    .and("contain", msg);
});
