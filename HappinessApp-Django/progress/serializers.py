from rest_framework.serializers import ModelSerializer, DateTimeField
from .models import Progress
from journeys.models import Quest, Journey


class QuestNameSerializer(ModelSerializer):
    class Meta:
        model = Quest
        fields = ['name']


class JourneyNameSerializer(ModelSerializer):
    class Meta:
        model = Journey
        fields = ['name']


class CompletedProgressSerializer(ModelSerializer):
    quest = QuestNameSerializer()
    journey = JourneyNameSerializer()
    timestamp = DateTimeField(source="complete_time")

    class Meta:
        model = Progress
        fields = ['quest', 'journey', 'timestamp']