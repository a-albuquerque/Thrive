"""The Message API for group chat communication between users.

    - <server url>/api/messages/chats - points to the GET view that returns all
    the chats of the user that requests it. It requires token authentication to
    identify the user

    - <server url>/api/messages/leave/<int:chat_id> - points to the DELETE view
    that removes a user from the chat with id <chat_id>. Again, this view
    requires token authentication to identify the user. No request body is
    needed for this API call.

    - <server url>/api/messages/create-chat - points to the PUT view that
    creates a chat with the authenticated user as member. It requires token
    authentication to identify the user. The request body should be formatted as
    follows:

        {
            "members": [
                {"username": <username of 1st member>},
                {"username": <username of 2nd member>},
                ...,
                {"username": <username of nth member>}
            ]
        }

    - <server url>/api/messages/all/<int:chat_id>  - points to the GET view that
    returns all the messages on the chat with id <chat_id>. This view requires
    token authentication to identify the user. No request body is needed for
    this API call.

    - <server url>/api/messages/between - points to the GET view that returns
    messages between the specified interval. It requires token authentication
    to identify the user. No request body is needed for this API call (So far,
    this view is not usable, as we still need a way to specify the time
    interval, so just use the <all> view for now).

    - <server url>/api/messages/send - points to the POST view that adds a new
    message to a group chat. It requires token authentication to identify the
    user. It will not send messages if the user is not part of the chat it
    specifies. The request should be formatted as follows

        {
            "chat_id": <the chat id of the chat to send the message>,
            "content": <the text content of the message>
        }

    Note that <chat_id> and <content> do not have to be expressed in that order.
"""

from django.urls import path
from . import views


urlpatterns = [
    path('chats', views.get_chats, name='api-get-user-chats'),
    path('leave/<uuid:chat_id>', views.leave_chat, name='api-leave-chat'),
    path('add-member/<uuid:chat_id>', views.add_member, name='api-add-member'),
    path('create-chat/', views.create_chat, name='api-create-chat'),
    path('delete-chat/<uuid:chat_id>', views.delete_chat,
         name='api-delte-chat'),
    path('all/<uuid:chat_id>', views.get_all_messages, name='api-get-messages'),
    path('between', views.get_messages_by_time_interval,
         name='api-get-interval-messages'),
    path('send', views.send_message, name='api-send-messages')
]
