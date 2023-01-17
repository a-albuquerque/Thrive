# The Messages API

> Note: To get an overview of the backend structure, have a look at the README
> file under the `docs` folder.

Under the `inbox` folder, you will find the models, views, and URL routes for
the handling of chats and messages between users.

## Routes

Here is a list of all the URL routes for this backend

- ***`<server url>`/api/messages/chats*** - points to the GET view that return
all the chats of the user that requests it. It requires token authentication to
identify the user.

- ***`<server url>`/api/messages/leave/`<int:chat_id>`*** - points to the DELETE
view that removes a user from the chat with id `chat_id`. Again, this view
requires token authentication to identify the user. No request body is needed
for this API call.

- ***`<server url>`/api/messages/create-chat/*** - points to the POST view that
creates a chat with the authenticated user as member. It requires token
authentication to identify the user. The request body should be formatted as
follows:

    ```json
    {
        "name": <name of chat>,
        "members": [
            {"username": <username of 1st member>},
            {"username": <username of 2nd member>},
            ...,
            {"username": <username of nth member>}
        ]
    }
    ```

- ***`<server url>`/api/messages/all/`<int:chat_id>`***  - points to the GET
view that returns all the messages on the chat with id `chat_id`.
This view requires token authentication to identify the user. No request body is
needed for this API call.

- ***`<server url>`/api/messages/between*** - points to the GET view that
returns messages between the specified interval. It requires token
authentication to identify the user. No request body is needed for this API call
(So far, this view is not usable, as we still need a way to specify the time
interval, so just use the `all` view for now).

- ***`<server url>`/api/messages/send*** - points to the POST view that adds a
new message to a group chat. It requires token authentication to identify the
user. It will not send messages if the user is not part of the chat it
specifies. The request should be formatted as follows:

    ```json
    {
        "chat_id": <the chat id of the chat to send the message>,
        "content": <the text content of the message>
    }
    ```

- ***`<server url>`/api/messages/delete-chat/`<uuid:chat_id>`*** - points to the
DELETE view that deletes a chat specified by the given chat id. It is an
authenticated route, so an authentication token is required. If the user is not
a member of the chat, it will not be deleted. Mostly meant for testing purposes.

- ***`<server url>`/api/messages/add-member/`<uuid:chat_id>`*** - points to the
POST view that adds a new user to a chat. It requires as input the following:

    ```json
    {
        "username": <username of new member>
    }
    ```

    If the specified user does not exist or if the specified chat does not exist
    or if the requesting user is not in the chat, then the view will respond
    with a failure status and one of the following messages:

    ```json
    {
        "details": "No user specified."
    }
    ```

    If no new user is specified.

    ```json
    {
        "details": "No such chat exists with that id."
    }
    ```

    If the specified chat id is invalid.

    ```json
    {
        "details": "No such user exists with that username."
    }
    ```

    If the specified user has not been registered.

    ```json
    {
        "details": "You are not a member of this chat, so you cannot modify
        anything about this chat."
    }
    ```

## Models

So far, `inbox` Django app implements two related models: `Message` and `Chat`.
The purpose of these two is store information between user communications.

### Chat model

The `Chat` model contains information on group chats and personal chats between
accountability buddies. Any `Chat` instance contains one of the following
fields:

- `chat_id`: The unique UUID identifier for the chat, when a new chat instance
is created, this field is autopopulated with a unique UUID number.

- `name`: The text field of at most 72 characters representing the name of the
chat. For example, a chat can be named "CSC301 Project Group". Every chat MUST
have a name, as this field is non-nullable.

- `members`: The instances of the User model that represent the members of this
chat. It is of type `ManyToManyField`.

As tables, the model can be represented by the following relation:

```txt
relation Chat (
    chat_id: primary key - uuid,
    name: text size(72)
)
```

and its relations to the User model can be represented with the following
many-to-many relationship.

```txt
relation ChatMember (
    chat_id: references Chat
    user_id: references User
    primary key (chat_id, user_id)
)
```

### Message model

The `Message` model contains the data stored in chat messages. Any instance of
the `Message` model contains the following fields;

- `m_id`: The unique UUID identifier for the message, when a new message
instance is created, this field is autopopulated with a unique UUID number.

- `time_sent`: A `DateTimeField` representing the date and time a message was
sent. It is added automatically on creation, there is no need to populate it.
Moreover, each `Message` model must contain a timestamp.

- `content`: The text content of a message. It can be of any length. A message
must contain this field, it cannot be null.

- `sender`: The instance of the `User` model that sent this message.

- `chat_id`: The instance of the `Chat` model on which this message was sent.
Do disregard the misnaming of this field. Even though its `chat_id`, its not
a UUID field. During initialization, a chat model should be passed to the
constructor for the Message model.

In short, the `Message` model represents the following relation:

```txt
relation Message (
    m_id: primary key - uuid,
    sender: references foreign key User,
    chat_id: references foreign key Chat
    time_sent: datetime,
    content: text
)
```

### UUIDTaggedItem

You might have noticed the addition of a class called `UUIDTaggedItem`. This was
meant as a fix to store UUIDs in an SQLite database, as in this database
integers must be of a certain size. This caused insertions to fail. This problem
is not present in PosgresSQL databases.

To add support for UUID fields in SQLite, we use this class by adding the
following field to our models

```py
tags = TaggableManager(through=UUIDTaggedItem)
```
