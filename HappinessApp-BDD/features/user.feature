Feature: Login/Register
  Background:
    Given a random user Register1

  Scenario: Login
    When Login with user Register1
    When Receive a response
    Then Login should be successful