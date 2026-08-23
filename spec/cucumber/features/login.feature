@login
Feature: Login API

  Scenario: Login with valid credentials
    When I login with valid credentials
    Then the login response status should be 200
    And the login response should contain a valid token

  @bug-found
  Scenario: Login with incorrect password
    When I login with an incorrect password
    Then the login response status should be 401
    And the login response should indicate unauthorized access

  Scenario: Login with incorrect username
    When I login with an incorrect username
    Then the login response status should be 401
    And the login response should indicate unauthorized access
    
  @bug-found
  Scenario: Login with no password
    When I login with no password
    Then the login response status should be 401
    And the login response should indicate unauthorized access