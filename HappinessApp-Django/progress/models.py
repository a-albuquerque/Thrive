from django.db import models
from django.db.models import Q
from django.core.validators import MaxValueValidator, MinValueValidator

from journeys.models import Quest, Journey
from users.models import User


class ProgressManager(models.Manager):
    """A query manager for the a quest's progress."""

    def get_queryset(self):
        return super().get_queryset()

    def find_progress(self, desired_quest, parent_journey, owner):
        """Returns the progress instance for <user> on quest <desired_quest>
        under the journey <parent_journey>."""
        progress_queryset = self.get_queryset()
        unique_key = Q(quest=desired_quest) & Q(parent_journey) & Q(user=owner)

        try:
            return progress_queryset.get(unique_key)
        except Progress.DoesNotExist:
            return None

    def get_completed(self, user):
        """Returns the set of completed quests for a given user."""
        return Progress.objects.filter(user=user, progress=1)

    def get_skipped(self, user):
        """Returns the set of incomplete quests for a given user."""
        return Progress.objects.filter(user=user, progress=0)


class Progress(models.Model):
    """The progress on a journey's quest for a user.

    The relation represented by this quest is the following:

        relation Progress (
            user: references User
            journey: references Journey
            quest: references Quest
            complete_time: datetime
            progress: integer
            primary key (user, journey, quest)
        )

    The progress on a journey's quest is represented by the time when that
    quest was completed, and whether the quest was completed or not through the
    <progress> field, which can be either 1 or 0.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    journey = models.ForeignKey(Journey, on_delete=models.CASCADE)
    quest = models.ForeignKey(Quest, on_delete=models.CASCADE)
    complete_time = models.DateTimeField(auto_now=True)
    progress = models.IntegerField(validators=[MaxValueValidator(1),
                                               MinValueValidator(0)])
    objects = models.Manager()
    manager = ProgressManager()

    class Meta:
        unique_together = (('user', 'quest', 'journey'),)


