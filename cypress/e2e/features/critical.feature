Feature: Fonctionnalités critiques

  Background:
    Given Je suis connecté avec admin

  Scenario: Paiement utilisateur
    When Je réalise un paiement de "100"
    Then Je devrais voir un message de succès "Payment successful"

  Scenario: Transfert d'argent
    When Je réalise un transfert de "50" à "guest"
    Then Je devrais voir un message de succès "Transfer completed"
