Feature: Enregistrement utilisateur

  Scenario: Register utilisateur valide
    Given Je suis sur la page d'enregistrement
    When Je renseigne un nouvel utilisateur "newUser" avec email "newuser@test.com" et mot de passe "password123"
    And Je clique sur "S'inscrire"
    Then Je devrais voir un message de succès "Registration successful"

  Scenario: Register avec email déjà existant
    Given Je suis sur la page d'enregistrement
    When Je renseigne un nouvel utilisateur "admin" avec email "admin@test.com" et mot de passe "1234"
    And Je clique sur "S'inscrire"
    Then Je devrais voir un message d'erreur "Email already exists"
