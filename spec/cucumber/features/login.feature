Feature: Login API

  Scenario: Login with valid credentials
    When I login with valid credentials
    Then the response status should be 200
    And the response should contain a valid token

  @known-bug
  Scenario: Login with incorrect password
    When I login with an incorrect password
    Then the response status should be 401
    And the response should indicate unauthorized access

  Scenario: Login with incorrect username
    When I login with an incorrect username
    Then the response status should be 401
    And the response should indicate unauthorized access