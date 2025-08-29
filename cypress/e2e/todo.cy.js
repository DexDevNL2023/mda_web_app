/// <reference types="cypress" />

// Bienvenue dans Cypress !
//
// Ce fichier de test contient une variété d’exemples
// pour une application de gestion de tâches (todo app).
// Ces tests montrent la puissance de Cypress pour écrire des tests.
//
// Pour en savoir plus sur le fonctionnement de Cypress
// et pourquoi c’est un outil de test formidable,
// consultez le guide de démarrage :
// https://on.cypress.io/introduction-to-cypress

// Fonctions mathématiques simples pour illustrer les hooks
function add(a, b) {
  return a + b;
}
function subtract(a, b) {
  return a - b;
}
function divide(a, b) {
  return a / b;
}
function multiply(a, b) {
  return a * b;
}

describe("exemple d’application todo", () => {
  // Un hook est une fonction spéciale qui s’exécute avant ou après les tests.
  // C’est utile pour préparer ou nettoyer l’environnement de test.
  // Les hooks principaux sont :
  // before() → s’exécute une seule fois avant tous les tests du bloc.
  // after() → s’exécute une seule fois après tous les tests du bloc.
  // beforeEach() → s’exécute avant chaque test.
  // afterEach() → s’exécute après chaque test.

  beforeEach(() => {
    // Cypress démarre chaque test avec un état vierge.
    // On doit donc indiquer à Cypress de visiter notre site avec la commande `cy.visit()`.
    // Comme on veut visiter la même URL au début de chaque test,
    // on met ce `cy.visit()` dans un beforeEach : ainsi il s’exécute avant chaque test.
    cy.visit("https://example.cypress.io/todo");
  });

  afterEach(() => {
    // Capture automatique d’un screenshot après CHAQUE test
    cy.screenshot();
  });

  context("Tests sur les fonctions mathématiques", () => {
    let a, b;

    before(() => {
      // Préparer des variables une seule fois
      cy.log("Démarrage des tests de math");
    });

    beforeEach(() => {
      // Avant chaque test, je réinitialise mes nombres
      a = 10;
      b = 5;
    });

    it("additionne correctement", () => {
      expect(add(a, b)).to.eq(15);
    });

    it("soustrait correctement", () => {
      expect(subtract(a, b)).to.eq(5);
    });

    afterEach(() => {
      cy.log("Test terminé ✅");
    });

    after(() => {
      cy.log("Tous les tests sont finis 🚀");
    });
  });

  it("affiche deux tâches par défaut", () => {
    // On utilise `cy.get()` pour récupérer tous les éléments qui correspondent au sélecteur.
    // Puis, avec `should`, on vérifie qu’il y a bien deux éléments correspondants,
    // ce qui correspond aux deux tâches présentes par défaut.
    cy.get(".todo-list li").should("have.length", 2);

    // On peut aller plus loin et vérifier que les tâches par défaut
    // contiennent bien le texte attendu. On utilise `first` et `last`
    // pour cibler uniquement le premier et le dernier élément,
    // puis on vérifie avec `should` que leur texte est correct.
    cy.get(".todo-list li").first().should("have.text", "Pay electric bill");
    cy.get(".todo-list li").last().should("have.text", "Walk the dog");
  });

  it("peut ajouter une nouvelle tâche", () => {
    // On stocke le texte de la nouvelle tâche dans une variable
    // afin de pouvoir le réutiliser facilement.
    const newItem = "Feed the cat";

    // On sélectionne l’élément input grâce à son attribut `data-test`
    // et on utilise la commande `type` pour taper le texte de la tâche.
    // Après avoir tapé le texte, on simule aussi la touche "Entrée" pour soumettre.
    cy.get("[data-test=new-todo]").type(`${newItem}{enter}`);

    // On vérifie ensuite que la tâche a bien été ajoutée à la liste.
    // Comme c’est la plus récente, elle doit apparaître en dernier.
    // Avec les deux tâches par défaut, il doit donc y avoir 3 éléments au total.
    // Comme les assertions renvoient l’élément testé,
    // on peut enchaîner plusieurs vérifications dans une seule instruction.
    cy.get(".todo-list li")
      .should("have.length", 3)
      .last()
      .should("have.text", newItem);
  });

  it("peut cocher une tâche comme terminée", () => {
    // En plus de `get`, on peut utiliser `contains` pour récupérer un élément par son texte.
    // Cela renvoie ici le <label> qui contient le texte.
    // Pour cocher la case correspondante, on remonte au parent (<li>)
    // puis on cherche l’élément enfant <input type=checkbox> et on le coche avec `check()`.
    cy.contains("Pay electric bill")
      .parent()
      .find("input[type=checkbox]")
      .check();

    // Une fois la case cochée, on vérifie que l’élément <li> correspondant
    // possède bien la classe CSS `completed`.
    // On repart du texte avec `contains`, on remonte avec `parents('li')`
    // et on fait l’assertion sur la classe.
    cy.contains("Pay electric bill")
      .parents("li")
      .should("have.class", "completed");
  });

  context("avec une tâche déjà cochée", () => {
    beforeEach(() => {
      // On reprend la commande utilisée ci-dessus pour cocher une tâche.
      // Comme plusieurs tests de ce bloc commencent par cet état,
      // on met cette action dans un `beforeEach`.
      // Ainsi, elle est exécutée avant chaque test de ce `context`.
      cy.contains("Pay electric bill")
        .parent()
        .find("input[type=checkbox]")
        .check();
    });

    it("peut filtrer les tâches non terminées", () => {
      // On clique sur le bouton "Active"
      // pour n’afficher que les tâches non terminées.
      cy.contains("Active").click();

      // Après le filtrage, il ne doit rester qu’une seule tâche : "Walk the dog".
      cy.get(".todo-list li")
        .should("have.length", 1)
        .first()
        .should("have.text", "Walk the dog");

      // Et on s’assure aussi que la tâche cochée ("Pay electric bill")
      // n’apparaît plus dans la liste.
      cy.contains("Pay electric bill").should("not.exist");
    });

    it("peut filtrer les tâches terminées", () => {
      // Même principe, mais avec le filtre "Completed"
      // pour n’afficher que les tâches terminées.
      cy.contains("Completed").click();

      cy.get(".todo-list li")
        .should("have.length", 1)
        .first()
        .should("have.text", "Pay electric bill");

      // Vérification inverse : "Walk the dog" ne doit pas apparaître.
      cy.contains("Walk the dog").should("not.exist");
    });

    it("peut supprimer toutes les tâches terminées", () => {
      // On clique sur le bouton "Clear completed".
      // La commande `contains` sert à deux choses ici :
      // - vérifier que le bouton existe (il n’apparaît que si une tâche est cochée),
      // - sélectionner ce bouton pour pouvoir cliquer dessus.
      cy.contains("Clear completed").click();

      // On vérifie ensuite qu’il ne reste plus qu’une tâche dans la liste,
      // et que "Pay electric bill" a bien disparu.
      cy.get(".todo-list li")
        .should("have.length", 1)
        .should("not.have.text", "Pay electric bill");

      // Enfin, on vérifie que le bouton "Clear completed"
      // n’existe plus dans la page.
      cy.contains("Clear completed").should("not.exist");
    });
  });

  it("récupère un champ, saisit une valeur et vérifie", () => {
    // On visite directement la page d’accueil de l’exemple Cypress.
    cy.visit("https://example.cypress.io");

    // On recherche dans la page un élément contenant le texte "type"
    // et on clique dessus. Cela redirige vers une autre page de démonstration.
    cy.contains("type").click();

    // On vérifie que l’URL actuelle contient bien "/commands/actions".
    // Cela prouve que le clic nous a bien redirigé vers la bonne page.
    cy.url().should("include", "/commands/actions");

    // On récupère l’input qui a la classe CSS ".action-email"
    // et on saisit l’adresse email factice dans ce champ.
    cy.get(".action-email").type("fake@email.com");

    // Enfin, on vérifie que la valeur contenue dans l’input
    // est bien exactement l’email que l’on vient de taper.
    cy.get(".action-email").should("have.value", "fake@email.com");
  });
});

// Un autre bloc `describe` pour illustrer qu’on peut avoir
// plusieurs groupes de tests dans un même fichier.
// Un fichier de test Cypress peut contenir autant de describe que tu veux.
// Chaque describe définit une "suite de tests", donc tu peux regrouper tes tests par thèmes, modules ou fonctionnalités.
describe("Fonctions mathématiques", () => {
  it("additionne correctement", () => {
    expect(add(2, 3)).to.eq(5);
  });
});

describe("Application Todo", () => {
  it("affiche deux tâches par défaut", () => {
    cy.visit("https://example.cypress.io/todo");
    cy.get(".todo-list li").should("have.length", 2);
  });
});

// Un autre exemple avec des hooks pour préparer des variables
// context est identique à describe, mais il sert souvent à préciser dans quel état ou situation les tests s’exécutent.
// Donc tu peux avoir plusieurs context imbriqués dans un même describe.
describe("Fonctions mathématiques", () => {
  context("Quand a=10 et b=5", () => {
    let a, b;
    beforeEach(() => {
      a = 10;
      b = 5;
    });

    it("additionne correctement", () => {
      expect(add(a, b)).to.eq(15);
    });

    it("soustrait correctement", () => {
      expect(subtract(a, b)).to.eq(5);
    });
  });

  context("Quand a=20 et b=4", () => {
    let a, b;
    beforeEach(() => {
      a = 20;
      b = 4;
    });

    it("divise correctement", () => {
      expect(divide(a, b)).to.eq(5);
    });

    it("multiplie correctement", () => {
      expect(multiply(a, b)).to.eq(80);
    });
  });
});

// Test vide pour illustrer qu’on peut définir un test sans contenu
it("Bonjour", () => {});

// -------------------------
// Hooks au niveau global
// -------------------------
before(() => {
  // 🔹 S'exécute UNE SEULE FOIS avant TOUS les tests du fichier.
  // Exemple d’usage : se connecter à une base de données,
  // initialiser une configuration globale, préparer des données communes.
  // Exemple de fonctions utilisables :
  // visiter la page de login globale
  cy.visit("/login");
  // nettoyer les cookies
  cy.clearCookies();
  // nettoyer le localStorage
  cy.clearLocalStorage();
  // Les fixtures sont des fichiers JSON (ou CSV, etc.) qui contiennent tes jeux de données pour tests.
  // Un jeu de données est un ensemble de données utilisées pour tester votre application.
  // Ici on charge le fichier users.json et on crée des alias pour les utilisateurs.
  cy.fixture("users.json").then((users) => {
    cy.wrap(users.admin).as("adminUser");
    cy.wrap(users.guest).as("guestUser");
  });
});

beforeEach(() => {
  // 🔹 S'exécute AVANT CHAQUE test (it) du fichier.
  // Exemple d’usage : visiter une page, réinitialiser des variables,
  // se reconnecter à l’application pour partir d’un état propre.
  // Exemple de fonctions E2E :
  // repartir de la page d'accueil avant chaque test
  cy.visit("/");
  cy.get("@adminUser").then((user) => {
    // fonction custom Cypress pour login
    cy.login(user.username, user.password);
  });
});

afterEach(() => {
  // 🔹 S'exécute APRÈS CHAQUE test du fichier.
  // Exemple d’usage : nettoyer les données de test,
  // prendre un screenshot, réinitialiser l’environnement.
  // Fonctions E2E utiles :
  // capture d’écran pour reporting
  cy.screenshot();
});

after(() => {
  // 🔹 S'exécute UNE SEULE FOIS après TOUS les tests du fichier.
  // Exemple d’usage : fermer une connexion à la base,
  // supprimer les données créées, envoyer un rapport final.
  // Fonctions E2E utiles :
  // nettoyage final
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.log("Tous les tests terminés ✅");
});

// -------------------------
// Hooks à l'intérieur d’un bloc de tests (describe)
// -------------------------
describe("Hooks", () => {
  before(() => {
    // 🔹 S'exécute UNE SEULE FOIS avant TOUS les tests de CE BLOC "describe".
    // Exemple d’usage : préparer un utilisateur spécifique,
    // lancer une configuration propre à ce groupe de tests.
  });

  beforeEach(() => {
    // 🔹 S'exécute AVANT CHAQUE test de CE BLOC "describe".
    // Exemple d’usage : visiter une page particulière,
    // réinitialiser l’état de l’appli avant chaque test de ce groupe.
  });

  afterEach(() => {
    // 🔹 S'exécute APRÈS CHAQUE test de CE BLOC "describe".
    // Exemple d’usage : nettoyage, déconnexion d’un utilisateur,
    // ou log pour indiquer que le test est terminé.
  });

  after(() => {
    // 🔹 S'exécute UNE SEULE FOIS après TOUS les tests de CE BLOC "describe".
    // Exemple d’usage : supprimer les données créées par ce groupe de tests,
    // fermer une connexion locale ou faire un rapport final.
  });
});

// -------------------------
// Hooks au niveau global
// -------------------------
before(() => {
  // 🔹 S'exécute UNE SEULE FOIS avant TOUS les tests du fichier.
  // 1. Nettoyage initial
  cy.clearCookies();
  cy.clearLocalStorage();

  // 2. Charger les fixtures (jeux de données)
  // users.json contient tous les profils : admin, guest, apiUser...
  cy.fixture("users.json").then((users) => {
    cy.wrap(users.admin).as("adminUser");
    cy.wrap(users.guest).as("guestUser");
    cy.wrap(users.apiUser).as("apiUser");
  });
});

beforeEach(() => {
  // 🔹 S'exécute AVANT CHAQUE test
  // Repartir d'un état propre : page d'accueil ou login
  cy.visit("/");
});

afterEach(() => {
  // 🔹 S'exécute APRÈS CHAQUE test
  // Capturer une capture d’écran pour reporting
  cy.screenshot();
});

after(() => {
  // 🔹 S'exécute UNE SEULE FOIS après tous les tests
  // Nettoyage final
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.log("Tous les tests terminés ✅");
});

// -------------------------
// Tests Scénarios Login
// -------------------------
describe("Scénarios Login", () => {
  beforeEach(() => {
    // On inspecte la reguete de login
    cy.cy // Avant chaque test login, repartir de la page login
      .visit("/login");
  });

  it("Login avec admin valide", () => {
    cy.get("@adminUser").then((user) => {
      cy.login(user.username, user.password);
      cy.url().should("include", "/dashboard");
      cy.get(".dashboard").should("be.visible");
    });
  });

  it("Login avec guest valide", () => {
    cy.get("@guestUser").then((user) => {
      cy.login(user.username, user.password);
      cy.url().should("include", "/dashboard");
    });
  });

  it("Login avec mauvais mot de passe", () => {
    cy.get("@adminUser").then((user) => {
      cy.login(user.username, "wrongPassword");
      cy.get(".error-message").should("contain", "Invalid credentials");
    });
  });
});

// -------------------------
// Tests Scénarios Register
// -------------------------
describe("Scénarios Register", () => {
  beforeEach(() => {
    cy.visit("/register");
  });

  it("Register utilisateur valide", () => {
    const newUser = {
      username: "newUser",
      password: "password123",
      email: "newuser@test.com",
    };
    cy.get("input[name=username]").type(newUser.username);
    cy.get("input[name=email]").type(newUser.email);
    cy.get("input[name=password]").type(newUser.password);
    cy.get("button[type=submit]").click();
    cy.get(".success-message").should("contain", "Registration successful");
  });

  it("Register avec email déjà existant", () => {
    cy.get("input[name=username]").type("admin");
    cy.get("input[name=email]").type("admin@test.com");
    cy.get("input[name=password]").type("1234");
    cy.get("button[type=submit]").click();
    cy.get(".error-message").should("contain", "Email already exists");
  });
});

// -------------------------
// Tests fonctionnalités critiques (paiement, transfert, etc.)
// -------------------------
describe("Fonctionnalités critiques", () => {
  beforeEach(() => {
    // Se connecter automatiquement avant chaque test critique
    cy.get("@adminUser").then((user) => {
      cy.login(user.username, user.password);
    });
  });

  it("Paiement utilisateur", () => {
    cy.visit("/payment");
    cy.get("input[name=amount]").type("100");
    cy.get("button[type=submit]").click();
    cy.get(".success-message").should("contain", "Payment successful");
  });

  it("Transfert d'argent", () => {
    cy.visit("/transfer");
    cy.get("input[name=recipient]").type("guest");
    cy.get("input[name=amount]").type("50");
    cy.get("button[type=submit]").click();
    cy.get(".success-message").should("contain", "Transfer completed");
  });
});

// -------------------------
// Hooks au niveau global
// -------------------------
before(() => {
  // 🔹 S'exécute UNE SEULE FOIS avant TOUS les tests du fichier.
  cy.clearCookies();
  cy.clearLocalStorage();

  // Charger les fixtures (jeux de données)
  cy.fixture("users.json").then((users) => {
    cy.wrap(users.admin).as("adminUser");
    cy.wrap(users.guest).as("guestUser");
    cy.wrap(users.apiUser).as("apiUser");
  });
});

beforeEach(() => {
  // 🔹 État propre avant chaque test
  cy.visit("/");
});

afterEach(() => {
  // 🔹 Capture screenshot après chaque test
  cy.screenshot();
});

after(() => {
  // 🔹 Nettoyage final
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.log("Tous les tests terminés ✅");
});

// -------------------------
// Tests Scénarios Login
// -------------------------
describe("Scénarios Login", () => {
  beforeEach(() => {
    // Intercepter la requête de login
    cy.intercept("POST", "/api/login").as("loginRequest");
    cy.visit("/login");
  });

  it("Login avec admin valide", () => {
    cy.get("@adminUser").then((user) => {
      cy.login(user.username, user.password);

      // Attendre que la requête de login soit terminée
      cy.wait("@loginRequest").its("response.statusCode").should("eq", 200);

      // Vérifier la redirection + dashboard
      cy.url().should("include", "/dashboard");
      cy.get(".dashboard", { timeout: 5000 }).should("be.visible");
    });
  });

  it("Login avec guest valide", () => {
    cy.get("@guestUser").then((user) => {
      cy.login(user.username, user.password);
      cy.wait("@loginRequest").its("response.statusCode").should("eq", 200);
      cy.url().should("include", "/dashboard");
    });
  });

  it("Login avec mauvais mot de passe", () => {
    cy.get("@adminUser").then((user) => {
      cy.login(user.username, "wrongPassword");

      // Attendre la réponse serveur
      cy.wait("@loginRequest").its("response.statusCode").should("eq", 401);

      cy.get(".error-message", { timeout: 3000 })
        .should("be.visible")
        .and("contain", "Invalid credentials");
    });
  });
});

// -------------------------
// Tests Scénarios Register
// -------------------------
describe("Scénarios Register", () => {
  beforeEach(() => {
    cy.intercept("POST", "/api/register").as("registerRequest");
    cy.visit("/register");
  });

  it("Register utilisateur valide", () => {
    const newUser = {
      username: "newUser",
      password: "password123",
      email: "newuser@test.com",
    };

    cy.get("input[name=username]").type(newUser.username);
    cy.get("input[name=email]").type(newUser.email);
    cy.get("input[name=password]").type(newUser.password);
    cy.get("button[type=submit]").click();

    cy.wait("@registerRequest").its("response.statusCode").should("eq", 201);

    cy.get(".success-message", { timeout: 5000 })
      .should("be.visible")
      .and("contain", "Registration successful");
  });

  it("Register avec email déjà existant", () => {
    cy.get("input[name=username]").type("admin");
    cy.get("input[name=email]").type("admin@test.com");
    cy.get("input[name=password]").type("1234");
    cy.get("button[type=submit]").click();

    cy.wait("@registerRequest").its("response.statusCode").should("eq", 409);

    cy.get(".error-message", { timeout: 5000 })
      .should("be.visible")
      .and("contain", "Email already exists");
  });
});

// -------------------------
// Tests fonctionnalités critiques (paiement, transfert, etc.)
// -------------------------
describe("Fonctionnalités critiques", () => {
  beforeEach(() => {
    cy.intercept("POST", "/api/login").as("loginRequest");
    cy.intercept("POST", "/api/payment").as("paymentRequest");
    cy.intercept("POST", "/api/transfer").as("transferRequest");

    // Se connecter avant chaque test critique
    cy.get("@adminUser").then((user) => {
      cy.login(user.username, user.password);
      cy.wait("@loginRequest").its("response.statusCode").should("eq", 200);
    });
  });

  it("Paiement utilisateur", () => {
    cy.visit("/payment");
    cy.get("input[name=amount]").type("100");
    cy.get("button[type=submit]").click();

    cy.wait("@paymentRequest").its("response.statusCode").should("eq", 200);

    cy.get(".success-message", { timeout: 5000 })
      .should("be.visible")
      .and("contain", "Payment successful");
  });

  it("Transfert d'argent", () => {
    cy.visit("/transfer");
    cy.get("input[name=recipient]").type("guest");
    cy.get("input[name=amount]").type("50");
    cy.get("button[type=submit]").click();

    cy.wait("@transferRequest").its("response.statusCode").should("eq", 200);

    cy.get(".success-message", { timeout: 5000 })
      .should("be.visible")
      .and("contain", "Transfer completed");
  });
});

// -------------------------
// Hooks au niveau global
// -------------------------
before(() => {
  cy.clearCookies();
  cy.clearLocalStorage();

  cy.fixture("users.json").then((users) => {
    cy.wrap(users.admin).as("adminUser");
    cy.wrap(users.guest).as("guestUser");
    cy.wrap(users.apiUser).as("apiUser");
  });
});

beforeEach(() => {
  cy.visit("/");
});

afterEach(() => {
  cy.screenshot();
});

after(() => {
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.log("Tous les tests terminés ✅");
});

// -------------------------
// Tests Scénarios Login
// -------------------------
describe("Scénarios Login", () => {
  beforeEach(() => {
    cy.intercept("POST", "/api/login").as("loginRequest");
    cy.visit("/login");
  });

  it("Login avec admin valide", () => {
    cy.get("@adminUser").then((user) => {
      cy.login(user.username, user.password);
      cy.wait("@loginRequest").its("response.statusCode").should("eq", 200);

      cy.url().should("include", "/dashboard");
      cy.getBySel("dashboard", { timeout: 5000 }).should("be.visible");
    });
  });

  it("Login avec guest valide", () => {
    cy.get("@guestUser").then((user) => {
      cy.login(user.username, user.password);
      cy.wait("@loginRequest").its("response.statusCode").should("eq", 200);

      cy.url().should("include", "/dashboard");
    });
  });

  it("Login avec mauvais mot de passe", () => {
    cy.get("@adminUser").then((user) => {
      cy.login(user.username, "wrongPassword");
      cy.wait("@loginRequest").its("response.statusCode").should("eq", 401);

      cy.getBySel("error-message", { timeout: 3000 })
        .should("be.visible")
        .and("contain", "Invalid credentials");
    });
  });
});

// -------------------------
// Tests Scénarios Register
// -------------------------
describe("Scénarios Register", () => {
  beforeEach(() => {
    cy.intercept("POST", "/api/register").as("registerRequest");
    cy.visit("/register");
  });

  it("Register utilisateur valide", () => {
    const newUser = {
      username: "newUser",
      password: "password123",
      email: "newuser@test.com",
    };

    cy.getBySel("username-input").type(newUser.username);
    cy.getBySel("email-input").type(newUser.email);
    cy.getBySel("password-input").type(newUser.password);
    cy.getBySel("submit-register").click();

    cy.wait("@registerRequest").its("response.statusCode").should("eq", 201);

    cy.getBySel("success-message", { timeout: 5000 })
      .should("be.visible")
      .and("contain", "Registration successful");
  });

  it("Register avec email déjà existant", () => {
    cy.getBySel("username-input").type("admin");
    cy.getBySel("email-input").type("admin@test.com");
    cy.getBySel("password-input").type("1234");
    cy.getBySel("submit-register").click();

    cy.wait("@registerRequest").its("response.statusCode").should("eq", 409);

    cy.getBySel("error-message", { timeout: 5000 })
      .should("be.visible")
      .and("contain", "Email already exists");
  });
});

// -------------------------
// Tests fonctionnalités critiques
// -------------------------
describe("Fonctionnalités critiques", () => {
  beforeEach(() => {
    cy.intercept("POST", "/api/login").as("loginRequest");
    cy.intercept("POST", "/api/payment").as("paymentRequest");
    cy.intercept("POST", "/api/transfer").as("transferRequest");

    cy.get("@adminUser").then((user) => {
      cy.login(user.username, user.password);
      cy.wait("@loginRequest").its("response.statusCode").should("eq", 200);
    });
  });

  it("Paiement utilisateur", () => {
    cy.visit("/payment");
    cy.getBySel("payment-amount").type("100");
    cy.getBySel("payment-submit").click();

    cy.wait("@paymentRequest").its("response.statusCode").should("eq", 200);

    cy.getBySel("success-message", { timeout: 5000 })
      .should("be.visible")
      .and("contain", "Payment successful");
  });

  it("Transfert d'argent", () => {
    cy.visit("/transfer");
    cy.getBySel("transfer-recipient").type("guest");
    cy.getBySel("transfer-amount").type("50");
    cy.getBySel("transfer-submit").click();

    cy.wait("@transferRequest").its("response.statusCode").should("eq", 200);

    cy.getBySel("success-message", { timeout: 5000 })
      .should("be.visible")
      .and("contain", "Transfer completed");
  });
});
