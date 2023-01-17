"""Database models for Message API."""

from uuid import uuid4

from django.db import models
from users.models import User
from django.utils.translation import ugettext_lazy as _

from taggit.managers import TaggableManager
from taggit.models import GenericUUIDTaggedItemBase, TaggedItemBase


class UUIDTaggedItem(GenericUUIDTaggedItemBase, TaggedItemBase):
    """A tag class for UUIDs.

    As shown from this URL https://github.com/jazzband/django-taggit/issues/679,
    the only way to manage the overflow created by UUIDs on SQLite is by using a
    TaggableManager for the models that need UUID managers. That's the purpose
    of this UUIDTaggedItem class.
    """
    class Meta:
        verbose_name = _("Tag")
        verbose_name_plural = _("Tags")


class Chat(models.Model):
    """A group chat between users to communicate between each other.

    The relation represented by this model is as follows:

        relation Chat (
            chat_id: primary key - uuid,
            name: text size(72)
        )

    The name of a group chat can be anything (group chats may share their name).
    However, the names are constrianed as they must be a non-empty text string,
    their size is at most 72 characters, and the attribute cannot be NULL.

    Moreover, each Chat has a <members> field, which represents the relation:

         relation ChatMember (
            chat_id: references Chat
            user_id: references User
            primary key (chat_id, user_id)
        )

    which represents a many-to-many membership relationship between users and
    chats.
    """
    chat_id = models.UUIDField(primary_key=True, default=uuid4)
    name = models.TextField(null=False, max_length=72)

    members = models.ManyToManyField(User)

    # Add support for UUID primary key for SQLite
    tags = TaggableManager(through=UUIDTaggedItem)


class Message(models.Model):
    """A message between users of a chat.

    The relation represented by this model is as follows:

        relation Message (
            m_id: primary key - uuid,
            sender: references foreign key User,
            chat_id: references foreign key Chat
            time_sent: datetime,
            content: text
        )

    Each of the attributes of a message are non-null. For each message, the
    sender must be a member of the group chat where this message was sent.
    """
    m_id = models.UUIDField(primary_key=True, default=uuid4)
    time_sent = models.DateTimeField(auto_now_add=True, null=False)
    content = models.TextField(null=False)

    # Foreign key relationships with user
    sender = models.ForeignKey(User, on_delete=models.CASCADE, null=False,
                                related_name="message_sender")

    chat_id = models.ForeignKey(Chat, on_delete=models.CASCADE, null=False,
                                related_name="message_chat_id")

    # Add support for UUID primary key for SQLite
    tags = TaggableManager(through=UUIDTaggedItem)
