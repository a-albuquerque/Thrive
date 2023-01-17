Feature: Authorization endpoints not logged in

  Scenario: Get chats user not logged in
    When Get all user chats
    Then Expect unauthorized