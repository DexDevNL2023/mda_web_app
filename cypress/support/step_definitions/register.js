import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given("Je suis sur la page d'enregistrement", () => {
  cy.visit("/register");
  cy.intercept("POST", "/api/register").as("registerRequest");
});

When(
  "Je renseigne un nouvel utilisateur {string} avec email {string} et mot de passe {string}",
  (username, email, password) => {
    cy.get("input[name=username]").type(username);
    cy.get("input[name=email]").type(email);
    cy.get("input[name=password]").type(password);
  }
);

Then("Je devrais voir un message de succès {string}", (msg) => {
  cy.get("button[type=submit]").click();
  cy.wait("@registerRequest").its("response.statusCode").should("eq", 201);
  cy.get(".success-message", { timeout: 5000 })
    .should("be.visible")
    .and("contain", msg);
});

Then("Je devrais voir un message d'erreur {string}", (msg) => {
  cy.get("button[type=submit]").click();
  cy.wait("@registerRequest").its("response.statusCode").should("eq", 409);
  cy.get(".error-message", { timeout: 5000 })
    .should("be.visible")
    .and("contain", msg);
});
