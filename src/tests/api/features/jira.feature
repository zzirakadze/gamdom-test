@api @jira
Feature: Jira Issue CRUD Workflow with Positive and Negative Cases

  Background:
    Given Jira service is available

  Scenario Outline: Create, read, update, and delete Jira issues successfully
    When I create a Jira issue with:
      | summary     | <summary> |
      | description | <description> |
      | issueType   | <issueType> |
    Then the issue should be created successfully with summary "<summary>"
    When I update the Jira issue summary to "<updatedSummary>"
    Then the issue should have updated summary "<updatedSummary>"
    When I delete the created Jira issue
    Then the deleted issue should not be retrievable anymore

    Examples:
      | summary                   | description                       | issueType | updatedSummary                    |
      | Automation Bug            | Bug created via automation        | Bug       | Updated Automation Bug Summary    |
      | Automation Task           | Task created via automation       | Task      | Updated Automation Task Summary   |
      | Automation Story          | Story created via automation      | Story     | Updated Automation Story Summary  |
      | Automation Epic           | Epic created via automation       | Epic      | Updated Automation Epic Summary   |

  Scenario Outline: Negative test cases for Jira API (invalid creation)
    When I try to create a Jira issue with:
      | summary     | <summary> |
      | description | <description> |
      | issueType   | <issueType> |
    Then the API should respond with status <statusCode> and error message "<errorMessage>"

    Examples:
      | summary | description             | issueType  | statusCode | errorMessage                             |
      |         | Missing summary          | Bug        | 400        | You must specify a summary of the issue.              |
      | Invalid | Missing issueType         |            | 400        | Specify a valid issue type            |
      | Test    | Invalid issue type given  | InvalidXYZ | 400        | Specify a valid issue type                    |

  Scenario Outline: Negative test cases for Jira API (invalid fetch)
    When I try to fetch Jira issue with key "<issueKey>"
    Then the API should respond with status <statusCode> and error message "<errorMessage>"

    Examples:
      | issueKey        | statusCode | errorMessage               |
      | NONEXISTENT-123  | 404        | Issue does not exist        |
      | INVALID-KEY-XYZ  | 404        | Issue does not exist        |

  Scenario Outline: Negative test cases for Jira API (invalid delete)
    When I try to delete Jira issue with key "<issueKey>"
    Then the API should respond with status <statusCode> and error message "<errorMessage>"

    Examples:
      | issueKey        | statusCode | errorMessage               |
      | NONEXISTENT-456  | 404        | Issue does not exist        |
