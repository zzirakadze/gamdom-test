@smoke  @positive  @dice
Feature: Dice Game Betting

  @positive
  Scenario: Place a bet and verify balance update
    Given I am logged in and navigated to Dice page
    When I record initial balance
    And I place a bet of "1"
    And I record profit on win
    And I record result and final balance
    Then the balance should be correctly updated

  @negative
  Scenario: invalid bet amount
    Given I am logged in and navigated to Dice page
    When I record initial balance
    And I place a bet of "0.00"
    Then I should see an error message "Bet too small"
    And The balance should remain unchanged