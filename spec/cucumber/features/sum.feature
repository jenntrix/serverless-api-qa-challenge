@sum
Feature: Sum API

Scenario: Sum two valid numbers
  When I sum two valid numbers
  Then the sum response status should be 200
  And the sum result should be correct

Scenario: Sum with invalid token
  When I try to sum numbers with an invalid token
  Then the sum response status should be 401

Scenario: Sum with no token
  When I try to sum numbers with no token
  Then the sum response status should be 401

Scenario: Sum with non-numeric first value
  When I sum with a non-numeric first value
  Then the sum response status should be 200
  And the sum response status should be null

Scenario: Sum with non-numeric second value
  When I sum with a non-numeric second value
  Then the sum response status should be 200
  And the sum response status should be null

@bug-found
Scenario: Sum numeric values provided as strings
  When I sum two numeric values provided as strings
  Then the sum response status should be 200
  And the sum response status should be null

@bug-found
Scenario: Sum with one numeric value provided as a string
  When I sum a numeric value and a numeric value provided as a string
  Then the sum response status should be 200
  And the sum response status should be null