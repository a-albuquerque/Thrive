from django.db import models

# Create your models here.


class Quest(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    media = models.ImageField(upload_to='assets', blank=True)
    video = models.URLField(max_length=200, blank=True)
    survey_question = models.TextField(null=True, blank=True)
    estimated_time = models.IntegerField(null=True, blank=True)
    difficulty = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return self.name


class Journey(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    media = models.ImageField(upload_to='assets', blank=True)
    video = models.URLField(max_length=200, blank=True)
    quests = models.ManyToManyField(
        Quest, related_name="quests", through="JourneyQuests")

    def __str__(self):
        return self.name


class JourneyQuests(models.Model):
    journey = models.ForeignKey(Journey, on_delete=models.CASCADE)
    quest = models.ForeignKey(Quest, on_delete=models.CASCADE)
    order = models.IntegerField(default=1)

    class Meta:
        ordering = ['order',]
        db_table = "journeys_journey_quests"
        unique_together = ['journey', 'quest', 'order']

    def __unicode__(self):
        return self.quest.name + " is a member of " + self.journey.name + (" in position %d" % self.order)


class SubmittedJourney(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    approved = models.BooleanField(default=False)
    media = models.ImageField(upload_to='assets', blank=True)
    email = models.CharField(max_length=100)
    user_name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class SubmittedQuest(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    journey = models.ForeignKey(SubmittedJourney, related_name="submitted_quests",
                                on_delete=models.CASCADE, blank=True, null=True)
    order = models.IntegerField(blank=True, null=True)
    media = models.ImageField(upload_to='assets', blank=True, null=True)
    survey_question = models.TextField(null=True, blank=True)
    approved = models.BooleanField(default=False)
    email = models.CharField(max_length=100)
    user_name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

