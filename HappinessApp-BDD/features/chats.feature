Feature: Chats

  Background:
    Given a random user Jeff
    And a random user Eric
    And a random user Eula

  Scenario: Get chats user logged in
    When Login as Jeff with token
    When Get all user chats
    Then Expect successful chat array

  Scenario: Create chat
    When Login as Jeff with token
    And Create chat with Eula
    Then Expect chat created
    When Start new request
    And Get all user chats
    Then Expect exactly 1 chat


#    Given Login with user normalUser0
#    When Receive a response
#    And Receive a token
