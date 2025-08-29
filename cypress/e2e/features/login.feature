Feature: Authentification

  Background:
    Given Je nettoie les cookies et le localStorage
    And Je charge les utilisateurs de test

  Scenario: Connexion réussie avec admin
    Given Je suis sur la page de login
    When Je saisis "admin" avec le mot de passe "1234"
    And Je clique sur "Se connecter"
    Then Je devrais voir le dashboard

  Scenario: Connexion réussie avec guest
    Given Je suis sur la page de login
    When Je saisis "guest" avec le mot de passe "abcd"
    And Je clique sur "Se connecter"
    Then Je devrais voir le dashboard

  Scenario: Connexion échouée mauvais mot de passe
    Given Je suis sur la page de login
    When Je saisis "admin" avec le mot de passe "wrongPassword"
    And Je clique sur "Se connecter"
    Then Je devrais voir un message d'erreur "Invalid credentials"
