from rest_framework import serializers
from .models import *


class QuestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quest
        fields = ['id', 'name', 'description', 'media', 'survey_question', 'video', 'estimated_time', 'difficulty']


class JourneySerializer(serializers.ModelSerializer):

    class Meta:
        model = Journey
        fields = ['id', 'name', 'description', 'quests', 'media', 'video']


class SubmittedQuestSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubmittedQuest
        fields = ['id', 'name', 'description', 'media', 'survey_question', 'approved', 'user_name', 'email', "order", "journey"]


class SubmittedJourneySerializer(serializers.ModelSerializer):
    submitted_quests = SubmittedQuestSerializer(many=True, read_only=True)

    class Meta:
        model = SubmittedJourney
        fields = ['id', 'name', 'description', 'submitted_quests', 'media', 'approved', "user_name", "email"]

