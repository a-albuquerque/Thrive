# The Progress API

> Note: To get an overview of the backend structure, have a look at the README
> file under the `docs` folder.

Under the `progress` folder, you will find the models, views, and URL routes for the
handling of chats and messages between users.

## Routes

Here is a list of all the URL routes for this API:

- ***`<server url>`/api/progress/getJourneyProgress/`<int:jid>`/*** - points to
the GET view that returns a users progress through a journey. On one side, one
can see the set of quests that have been completed and those that have been
skipped. The response for this view looks as follows:

    ```json
    {
        "completed": [
            {<serialized quest 1>},
            ...,
            {<serialized quest n + i>}
        ], 
        "skipped": [
            {<serialized quest n + i - 1>},
            ...,
            {<serialized quest n>}
        ]
    }
    ```

- ***`<server url>`/api/progress/completeQuest/`<int:qid>`/*** - points to the
POST view that changes the status of a quest to completed. On success, it
returns the following view:

    ```json
    {
        "success": "Success"
    }
    ```

- ***`<server url>`/api/progress/skipQuest/`<int:qid>`/*** - points to the POST
view that skips a given quest so that it can be completed later. On success it
responds with

    ```json
    {
        "success": "Success"
    }
    ```

    but does not do any error handling.

- ***`<server url>`/api/progress/checkCompleteJourney/`<int:jid>`/*** - points to
the GET view that checks whether a journey has been completed or not. Responds
with

    ```json
    {
        "response": "true"
    }
    ```

    if the journey has been completed and

    ```json
    {
        "response": "false"
    }
    ```

    otherwise.

- ***`<server url>`/api/progress/incompleteJourney/*** - ***TODO*** I have no
idea what this is supposed to do.

- ***`<server url>`/api/progress/dropJourney/`<int:jid>`/*** - points to the
DELETE view that erases all users progress on the specified journey. If it
succeeds, it responds with

    ```json
    {
        "success": "Success"
    }
    ```

    and if it fails it responds with

    ```json
    {
        "success": "Failure"
    }
    ```

- ***`<server url>`/api/progress/get-quest-history*** - points to the GET view
that returns all a user's completed quests. This view requires token
authentication to access the information. It returns the data in the following
format:

    ```json
    {
        "completed": [
            {
                "quest": <name of quest 1>, 
                "journey": <name of journey the quest is in>,
                "timestamp": <time that quest was completed>
            },
            ...,
            {
                "quest": <name of quest n>, 
                "journey": <name of journey the quest is in>,
                "timestamp": <time that quest was completed>
            }
        ]
    }
    ```

## Models

Under the Progress API there is only one implemented Model, the `Progress`
model. However, there is also a `ProgressManager` to handle queries for this
model.

### Progress model

The `Progress` model stores a user's progress for a journey's quests. Any
instance of the `Progress` model contains the following fields:

- `user`: the instance of the `User` model to which this progress data belongs.

- `journey`: the instance of the `Journey` model for which this progress data
takes track off.

- `quest`: the instance of the `Quest` model for which this progress data tracks
whether is completed or not.

- `complete_time`: the `DateTimeField` for the time this quest was completed or
skipped. It is automatically added on creation. (As you may notice, this is not
good as when we skip a quest and recomplete it, we must also be able to update
the time.)

- `progress`: an `IntegerField` representing whether the quest has been
completed (1) or not (0).

- `manager`: a custom manager to handle queries for the model. Much similar to
the `objects` model in most Django objects.

In short, this model can be represented the following relations,

```txt
relation Progress (
    user: references User
    journey: references Journey
    quest: references Quest
    complete_time: datetime
    progress: integer
    primary key (user, journey, quest)
)
```

Do note however that the model itself does not have the User, Journey, Quest
triple as a primary key, but rather enforces a uniqueness relationship between
them.

### ProgressManager

A custom model manager to manage queries for the `Progress` model. It implements
the following methods:

- `find_progress` - which given a `User` instance (`owner`), a `Quest` instance
(`desired_quest`), and a `Journey` instance (`parent_journey`) returns the
corresponding Progress, instance provided it exists, and `None` otherwise.

- `get_completed` - which given a `User` instance, returns all of their
completed quests.

- `get_skipped` - which given a `User` instance, returns all of their
skipped quests.

## Problems To Be Fixed

There are many issues with this API, which we (the third team), did not have
time to fully refactor. However, for your benefit, we list them here, as well as
some ideas  as to how to fix these issues:

- The lack of proper docstrings and comments thorughout the Progress API views.

- The long, often repetitive, code inside of the Progress API views. To simplify
these views, idea would be to refactor most of the accesses on the `Progress`
model into the `ProgressManager` class, which performs all needed queries on the
model. Extend the manager with *fundamental* functions to query the `Progress`
model. So far, we have added methods to query all complete and incomplete
quests for a user. These methods can be used to simplify the `progress`,
`check_complete_journey`, and `incomplete_journey` views.

- The way that `Progress` instances are created, and how we keep track of whether
a quest has been completed fully in a journey or not had been badly designed.

    Each `Progress` instance represents a `User`, `Journey`, `Quest` triple, and
    its marked with either 0 or 1, depending on wheter the quest has been
    completed or it has been skipped. However, this representation has some
    problems. It only allows for a quest to be completed once per journey.
    Moreover, a `Progress` instance is created only when it is either skipped or
    completed, requiring many queries onto the `Journey` model to check whether
    a journey has been completed or not. An idea to simplify this would be to
    add all the project instances when the user begins a quest.

    Then, to check whether a journey is complete, we just query all incomplete
    quests for a user, filter for the journey, and then check whether the
    `QuerySet` is empty. Moreover, to allow for multiple repeats of a `Quest`,
    then, we just do away with the maximum value constraint for the `progress`
    field in the `Progress` model (yes, it is a bad field name, I know, that's
    something else to fix). The, only thing left to do is handle the order
    quests are completed.

- None of the views under this API have any error handling in them, and their
response messages for errors is either `"Success"` or `"Failure"`. As you know,
this is NOT descriptive at all, so updating these would definetely be quite
helpful.

- Most views do not require user authentication to be accessed, which is
insecure.
