// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("getBySel", (selector, ...args) => {
  return cy.get(`[data-test=${selector}]`, ...args);
});

Cypress.Commands.add("getBySelLike", (selector, ...args) => {
  return cy.get(`[data-test*=${selector}]`, ...args);
});

// Créer une fonction custom Cypress (cy.login) pour se connecter via formulaire
Cypress.Commands.add("login", (username, password) => {
  // Visite la page login si nécessaire
  cy.visit("/login");

  // Remplir les champs login
  cy.get("input[name=username]").type(username);
  cy.get("input[name=password]").type(password);

  // Cliquer sur le bouton submit
  cy.get("button[type=submit]").click();

  // Vérifier que la connexion a réussi (ex: url ou élément visible)
  cy.url().should("not.include", "/login");
  cy.get(".dashboard").should("be.visible");
});

// Créer une fonction custom Cypress (cy.loginByApi) pour se connecter via API avec cy.request()
// si ton application utilise une API pour se connecter, tu peux directement faire un cy.request()
// et sauvegarder le token dans le localStorage, ce qui accélère les tests E2E.
Cypress.Commands.add("loginByApi", (username, password) => {
  cy.request("POST", "/api/login", { username, password }).then((resp) => {
    window.localStorage.setItem("token", resp.body.token);
  });
});
