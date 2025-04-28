Feature: Gamdom Login

@positive @smoke @LoginValidation
Scenario: Successful login with valid credentials
    Given I open the login page
    When I login with valid username and password
    Then I should see the welcome message

@negative @smoke @LoginValidation
Scenario Outline: Validate login error messages
  Given I open the login page
  Then All login page elements should be loaded
  When I attempt to login with username "<username>" and password "<password>"
  Then I should see tooltip "<expectedTooltip>" on the "<field>"

Examples:
  | username | password | expectedTooltip                                    | field    |
  |          | anypass   | Username cannot be empty                           | username |
  | 1        | .         | Username must be longer than 5 characters!          | username |
  |          |           | Username cannot be empty , Password cannot be empty | both     |


