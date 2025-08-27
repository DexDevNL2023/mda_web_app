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

describe('exemple d’application todo', () => {
  beforeEach(() => {
    // Cypress démarre chaque test avec un état vierge.
    // On doit donc indiquer à Cypress de visiter notre site avec la commande `cy.visit()`.
    // Comme on veut visiter la même URL au début de chaque test,
    // on met ce `cy.visit()` dans un beforeEach : ainsi il s’exécute avant chaque test.
    cy.visit('https://example.cypress.io/todo')
  })

  it('affiche deux tâches par défaut', () => {
    // On utilise `cy.get()` pour récupérer tous les éléments qui correspondent au sélecteur.
    // Puis, avec `should`, on vérifie qu’il y a bien deux éléments correspondants,
    // ce qui correspond aux deux tâches présentes par défaut.
    cy.get('.todo-list li').should('have.length', 2)

    // On peut aller plus loin et vérifier que les tâches par défaut
    // contiennent bien le texte attendu. On utilise `first` et `last`
    // pour cibler uniquement le premier et le dernier élément,
    // puis on vérifie avec `should` que leur texte est correct.
    cy.get('.todo-list li').first().should('have.text', 'Pay electric bill')
    cy.get('.todo-list li').last().should('have.text', 'Walk the dog')
  })

  it('peut ajouter une nouvelle tâche', () => {
    // On stocke le texte de la nouvelle tâche dans une variable
    // afin de pouvoir le réutiliser facilement.
    const newItem = 'Feed the cat'

    // On sélectionne l’élément input grâce à son attribut `data-test`
    // et on utilise la commande `type` pour taper le texte de la tâche.
    // Après avoir tapé le texte, on simule aussi la touche "Entrée" pour soumettre.
    cy.get('[data-test=new-todo]').type(`${newItem}{enter}`)

    // On vérifie ensuite que la tâche a bien été ajoutée à la liste.
    // Comme c’est la plus récente, elle doit apparaître en dernier.
    // Avec les deux tâches par défaut, il doit donc y avoir 3 éléments au total.
    // Comme les assertions renvoient l’élément testé,
    // on peut enchaîner plusieurs vérifications dans une seule instruction.
    cy.get('.todo-list li')
      .should('have.length', 3)
      .last()
      .should('have.text', newItem)
  })

  it('peut cocher une tâche comme terminée', () => {
    // En plus de `get`, on peut utiliser `contains` pour récupérer un élément par son texte.
    // Cela renvoie ici le <label> qui contient le texte.
    // Pour cocher la case correspondante, on remonte au parent (<li>)
    // puis on cherche l’élément enfant <input type=checkbox> et on le coche avec `check()`.
    cy.contains('Pay electric bill')
      .parent()
      .find('input[type=checkbox]')
      .check()

    // Une fois la case cochée, on vérifie que l’élément <li> correspondant
    // possède bien la classe CSS `completed`.
    // On repart du texte avec `contains`, on remonte avec `parents('li')`
    // et on fait l’assertion sur la classe.
    cy.contains('Pay electric bill')
      .parents('li')
      .should('have.class', 'completed')
  })

  context('avec une tâche déjà cochée', () => {
    beforeEach(() => {
      // On reprend la commande utilisée ci-dessus pour cocher une tâche.
      // Comme plusieurs tests de ce bloc commencent par cet état,
      // on met cette action dans un `beforeEach`.
      // Ainsi, elle est exécutée avant chaque test de ce `context`.
      cy.contains('Pay electric bill')
        .parent()
        .find('input[type=checkbox]')
        .check()
    })

    it('peut filtrer les tâches non terminées', () => {
      // On clique sur le bouton "Active"
      // pour n’afficher que les tâches non terminées.
      cy.contains('Active').click()

      // Après le filtrage, il ne doit rester qu’une seule tâche : "Walk the dog".
      cy.get('.todo-list li')
        .should('have.length', 1)
        .first()
        .should('have.text', 'Walk the dog')

      // Et on s’assure aussi que la tâche cochée ("Pay electric bill")
      // n’apparaît plus dans la liste.
      cy.contains('Pay electric bill').should('not.exist')
    })

    it('peut filtrer les tâches terminées', () => {
      // Même principe, mais avec le filtre "Completed"
      // pour n’afficher que les tâches terminées.
      cy.contains('Completed').click()

      cy.get('.todo-list li')
        .should('have.length', 1)
        .first()
        .should('have.text', 'Pay electric bill')

      // Vérification inverse : "Walk the dog" ne doit pas apparaître.
      cy.contains('Walk the dog').should('not.exist')
    })

    it('peut supprimer toutes les tâches terminées', () => {
      // On clique sur le bouton "Clear completed".
      // La commande `contains` sert à deux choses ici :
      // - vérifier que le bouton existe (il n’apparaît que si une tâche est cochée),
      // - sélectionner ce bouton pour pouvoir cliquer dessus.
      cy.contains('Clear completed').click()

      // On vérifie ensuite qu’il ne reste plus qu’une tâche dans la liste,
      // et que "Pay electric bill" a bien disparu.
      cy.get('.todo-list li')
        .should('have.length', 1)
        .should('not.have.text', 'Pay electric bill')

      // Enfin, on vérifie que le bouton "Clear completed"
      // n’existe plus dans la page.
      cy.contains('Clear completed').should('not.exist')
    })
  })
});

// Test vide pour illustrer qu’on peut définir un test sans contenu
it('Bonjour', function() {});
