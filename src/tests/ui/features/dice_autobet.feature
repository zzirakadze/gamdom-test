@smoke @autobet @positive @dice_autobet
Feature: Autobet functionality

  @positive
  Scenario: Complete specified number of bets
    Given I am logged in and navigated to Dice page for Autobet
    When I record my initial balance
    And I configure Autobet with bet "1" number of bets "5"
    And I set Stop on Profit "0" and Stop on Loss "0"
    And I set action on win to "reset" with value "0"
    And I set action on loss to "reset" with value "0"
    And I start Autobet
    Then Autobet should complete "5" bets




