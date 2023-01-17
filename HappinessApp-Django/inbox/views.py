"""Routes for the Message API."""

from django.contrib.auth import get_user_model

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from notifications.expo import send_push_message

from .serializers import ChatSerializer, MessageSerializer
from .models import Chat, Message

# Set the user model to the one specified in settings
User = get_user_model()


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def leave_chat(request, chat_id):
    """Removes a user from the given chat with id <chat_id>. Responds with the
    chat from which the member was removed.
    
    The input for the request is sent implicitly in the URI for the view. If the
    chat contains only one member when the group chat is removed, then it is
    erased entirely.
    """
    uid = request.user.id
    user = User.objects.get(pk=uid)
    chat = Chat.objects.get(id=chat_id)

    deleted = ChatSerializer(instance=chat).data
    chat.members.remove(user)

    # Delete chat if there is only 1 member left
    if chat.members.all().count() < 2:
        chat.delete()

    return Response(deleted)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_member(request, chat_id):
    """Adds a member to the specified chat and responds with the status of the
    request.

    If the specified user or chat does not exist, or if the requesting user is
    not part of the chat, then this method responds with failure status.
    """
    user = request.user
    new_member_username = request.data.get("username", None)

    if new_member_username is None:
        return Response({"details": "No user specified."},
                        status=400)

    try:
        chat = Chat.objects.get(chat_id=chat_id)
    except Chat.DoesNotExist:
        return Response({"details": "No such chat exists with that id."},
                        status=400)

    try:
        new_member = User.objects.get(username=new_member_username)
    except User.DoesNotExist:
        return Response({"details": "No such user exists with that username."},
                        status=400)

    if user not in chat.members.all():
        return Response({"details": "You are not a member of this chat, so you"
                                  + " cannot modify anything about this chat."},
                        status=400)

    chat.members.add(new_member)
    chat.save()

    return Response({"details": f"{new_member_username} has been added "
                              + f"successfully to {chat.name}."})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_chat(request):
    """Creates a new group chat with the user as member.

    The request should include the following:
        - A list <members> of the users that are to be added to the
        chat simultaneously. Each entry must contain the username of the member
        to be added.

    The view responds with the created chat instance.
    """
    # Need to take care of the race condition were a person creates a group chat
    # with only themselves. Then, there is only one member on the chat and the
    # two member contraint is violated. Maybe this constraint is really not
    # necessary, or should be enforced more strongly.
    members = request.data.get("members")
    chat_name = request.data.get("name")
    user = request.user

    # Create chat and add the requesting user to it
    new_chat = Chat.objects.create(name=chat_name)
    new_chat.members.add(user)

    for member in members:
        new_chat.members.add(User.objects.get(username=member["username"]))

    new_chat.save()

    result = ChatSerializer(instance=new_chat).data
    return Response(result)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_chat(request, chat_id):
    """Deletes a given chat."""
    chat = Chat.objects.get(chat_id=chat_id)
    chat_name = chat.name

    if request.user not in chat.members.all():
        return Response({"details": "You are not a member of this chat."},
                       status=400)

    chat.delete()

    return Response({"details": f"Chat {chat_name} successfully deleted."})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_messages(request, chat_id):
    """Responds to the user with the all the messages of the chat they specify.

    The request should contain the following:
        - A parameter <chat_id> that is the id of the chat from which we want
        to get the messages from
    """
    # From the Messages model, chose all messages that have the given Chat ID
    chat_messages = Message.objects.filter(chat_id=chat_id)

    # Serialize all the given messages as needed
    response = {
        "messages": MessageSerializer(chat_messages, many=True).data
    }

    # Wrap array into response and return it
    return Response(response)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_messages_by_time_interval(request):
    """Responds to the user with the the messages of the chat they specify from
    a specific timestamp to the to another.

    The request should contain the following:
        - A parameter <chat_id> that is the id of the chat from which we want
        to get the messages from
        - A parameter <from> that is the earliest timestamp from which to get
        the message
        - A parameter <to> that is the latest timestamp from which to get the
        message
    """
    cid = request.query_params.get("chat_id")
    from_time = request.query_params.get("from")
    to_time = request.query_params.get("to")

    # From the Messages model, chose all messages that have the given Chat ID
    # and whose timestamp is between the requested times
    chat_messages = Message.objects.filter(chat_id=cid)

    # From these messages, choose those whose creation timestamps are within
    # the interval
    within_interval = chat_messages.filter(
        timestamp__lte=from_time,
        timestamp__gte=to_time
    )

    # Serialize all the given messages as needed
    response = {
        "messages": MessageSerializer(chat_messages, many=True).data
    }

    # Wrap array into response and return it
    return Response(response)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_chats(request):
    """Responds to the user with all the chats that they are a member of."""
    # get chats from user using the related objects reference
    all_chats = request.user.chat_set.all()

    result = ChatSerializer(all_chats, many=True)
    return Response(result.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_message(request):
    """Sends a message to the specified group chat, responds whether the message
    has been sent succesfully.

    The request should contain the folllowing:
        - A <content> text parameter that contains the content for the messsage
        - A <chat_id> parameter containing the id of the chat we are posting the
        message toward

    The user must be authorized to send this message. They must be a member of
    the chat where they are sending this message.
    """
    response = {"details": "Message sent successfully."}
    status = 201

    try:
        message_content = request.data["content"]
        chat_id = request.data["chat_id"]

        sender = request.user
        chat = Chat.objects.get(chat_id=chat_id)

        if sender not in chat.members.all() and sender.username != "thriveapp":
            # User is not authorized to send a message to this chat
            response = {
                "details": "Sender is not a member of this chat."
            }

            status = 401
        else:
            # Add new message record to the database
            Message.objects.create(
                chat_id=chat,
                sender=sender,
                content=message_content
            )

            for user in chat.members.all().exclude(username=sender.username):
                if user.expo_token != "" and user.expo_token is not None:
                    send_push_message(user.expo_token, 
                                        sender.username 
                                        + ":\n\n" 
                                        + message_content)

    except Exception as exception:
        # Bad request received
        response = {
            "details": "Could not send this message. Make sure you provide the"
                        + " id of the chat you are messaging and the content"
                        + " of the message. Also, make sure that you are a"
                        + " member of this chat. ",
            "error_message": f"{exception}"
        }

        status = 400

    return Response(response, status=status)
