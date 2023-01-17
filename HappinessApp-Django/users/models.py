from datetime import time

from django.db import models
from django.contrib.auth.models import AbstractUser
from journeys.models import Journey

# Create your models here.


class User(AbstractUser):
    username = models.CharField(max_length=100, unique=True)
    email = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=100)
    buddy = models.ManyToManyField("User", blank=True, null=True)
    active_journeys = models.ManyToManyField(Journey, related_name="journey", blank=True, null=True)
    expo_token = models.TextField(blank=True, null=True)


class UserMeta(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    firstname = models.TextField()
    lastname = models.TextField()
    age = models.IntegerField()
    sex = models.CharField(max_length=1)
    pref_alert_time = models.TimeField(auto_now=False, auto_now_add=False,
                                       default=time(hour=9, minute=0, second=0))

class Buddy_Request(models.Model):
    from_user = models.ForeignKey(
        User, related_name = 'from_user', on_delete=models.CASCADE)
    to_user = models.ForeignKey(
        User, related_name='to_user', on_delete=models.CASCADE)

    