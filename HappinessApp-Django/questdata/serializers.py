from rest_framework import serializers
from .models import QuestFeedback


class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestFeedback
        fields = ['id', 'answer', 'quest_rating', 'feeling_rating', "survey_answer", "submit_time"]
