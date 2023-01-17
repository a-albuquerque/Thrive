URL routes
**"api/"**, Home API page

**"api/journeys/"**, GET: Get all existing journeys, POST: create new journey

**"api/journeys/<int:jid>/"**, GET: get specific journey, PUT: update attributes, DELETE: remove the journey

**"api/journeys/<int:jid>/quests/"**, GET: get quests for the journey, POST: add quest to the journey

**"api/journeys/<int:jid>/quests/<int:qid>/"**, GET: Get the specific quest, PUT: update the quest, DELETE: delete the quest

**"api/journeys/<int:jid>/reorder-quests"**, reorder the quests in the journey by the specified list of quest IDs.

**"api/auth/login/"**, Authenticate the user

**"api/auth/register/"**, Register a new user

**"api/auth/is_admin/"**, Check if user is staff

**"api/auth/get_notification_time/"**, Get the user preferred notification time

**"api/auth/set_notification_time/"**, Set the user preferred notification time

**"api/auth/get_user_meta/"**, get user profile data

**"api/progress/getJourneyProgress/<int:jid>/"**, get quest IDs for the completed and skipped quests in the journey by the user

**"api/progress/completeQuest/<int:qid>/"**, mark quest as completed and submit additional information

**"api/progress/skipQuest/<int:qid>/"**, mark quest as skipped

**"api/progress/getCompletedJourneys/"**, get journeys which are completed by the user

**"api/questdata/download/"**: Download the user quest submitted data (requires admin authentications

