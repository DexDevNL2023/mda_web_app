import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given("Je suis connecté avec admin", () => {
  cy.fixture("users.json").then((users) => {
    cy.intercept("POST", "/api/login").as("loginRequest");
    cy.login(users.admin.username, users.admin.password);
    cy.wait("@loginRequest").its("response.statusCode").should("eq", 200);
  });
});

When("Je réalise un paiement de {string}", (amount) => {
  cy.visit("/payment");
  cy.intercept("POST", "/api/payment").as("paymentRequest");
  cy.get("input[name=amount]").type(amount);
  cy.get("button[type=submit]").click();
  cy.wait("@paymentRequest").its("response.statusCode").should("eq", 200);
});

When("Je réalise un transfert de {string} à {string}", (amount, recipient) => {
  cy.visit("/transfer");
  cy.intercept("POST", "/api/transfer").as("transferRequest");
  cy.get("input[name=recipient]").type(recipient);
  cy.get("input[name=amount]").type(amount);
  cy.get("button[type=submit]").click();
  cy.wait("@transferRequest").its("response.statusCode").should("eq", 200);
});

Then("Je devrais voir un message de succès {string}", (msg) => {
  cy.get(".success-message", { timeout: 5000 })
    .should("be.visible")
    .and("contain", msg);
});
