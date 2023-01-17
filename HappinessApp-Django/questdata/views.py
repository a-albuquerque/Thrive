import csv

from django.http import HttpResponse
from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import permission_classes, api_view
from rest_framework.response import Response

from journeys.models import Quest
from progress.models import Progress
from questdata.models import QuestFeedback
from questdata.serializers import FeedbackSerializer
from users.models import User


@api_view(['GET'])
def get_quest_data(request, qid):
    user = request.user
    quest = Quest.objects.get(id=qid)
    data = QuestFeedback.objects.get(quest=quest, user=user)
    if data:
        serializer = FeedbackSerializer(instance=data)
        return Response(serializer.data)

    return Response({"error": "no record found"})


@permission_classes(())
def download(request):
    if request.user.is_authenticated and request.user.is_staff:

        response = HttpResponse(content_type='text/csv')

        writer = csv.writer(response)
        writer.writerow(
            ['Username', 'Answer', 'Quest Rating', 'Feeling Rating'])

        for feedback in QuestFeedback.objects.all():
            writer.writerow((feedback.user.username, feedback.answer,
                             feedback.quest_rating, feedback.feeling_rating))

        response[
            'Content-Disposition'] = 'attachment; filename="quest_data.csv"'

        return response
    else:
        return HttpResponse('Unauthenticated')
