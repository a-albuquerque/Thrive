"""A set of serializers for chat models"""

from rest_framework import serializers

from users.serializers import UserMetaSerializer
from users.models import User
from inbox.models import Chat, Message


class ChatMemberSerializer(serializers.ModelSerializer):
    """A serializer of user instances for chat information."""
    usermeta = UserMetaSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['username', 'usermeta']


class MessageSerializer(serializers.ModelSerializer):
    """A serializer of message instances."""
    sender = ChatMemberSerializer(read_only=True)

    class Meta:
        model = Message
        fields = ['m_id', 'sender', 'chat_id', 'time_sent', 'content']


class ChatSerializer(serializers.ModelSerializer):
    """A serializer of chat instances, containing member information."""
    members = ChatMemberSerializer(many=True, read_only=True)

    class Meta:
        model = Chat
        fields = ['chat_id', 'name', 'members']
