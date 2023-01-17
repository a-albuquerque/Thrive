from django.db.models import Q

from rest_framework.fields import empty # is this import being used?
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from questdata.models import *
from .models import *
from journeys.models import *
from journeys.serializers import JourneySerializer, QuestSerializer
from .serializers import CompletedProgressSerializer


# Create your views here.
@api_view(['GET'])
def progress(request, jid):
    user = request.user
    journey = Journey.objects.get(id=jid)
    q = journey.quests.all()
    quests = QuestSerializer(q, many=True).data
    completed_quests = []
    skipped_quests = []

    for quest in q:
        qset = Progress.objects.filter(user=user, quest=quest, journey=journey)
        if qset:
            cquest = qset.first()
            if cquest.progress == 1:
                completed_quests.append(
                    QuestSerializer(instance=cquest.quest).data)
            elif cquest.progress == 0:
                skipped_quests.append(
                    QuestSerializer(instance=cquest.quest).data)

    return Response({"completed": completed_quests, "skipped": skipped_quests})
    
@api_view(['POST'])
def complete_quest(request, qid):
    user = request.user
    quest = Quest.objects.get(id=qid)
    qset = Progress.objects.filter(quest=quest, user=user)
    if qset:
        prog = qset.first()
        prog.progress = 1
        prog.save()
    try:
        journey = Journey.objects.get(id=int(request.data['jid']))
        Progress(quest=quest, journey=journey, user=user, progress=1).save()
    except:
        pass
    QuestFeedback(user=request.user, quest=quest, answer=request.data["answer"],
                  feeling_rating=request.data["feeling_rating"],
                  quest_rating=request.data["quest_rating"],
                  survey_answer=request.data["survey_answer"]).save()

    return Response({"Success": "Success"})


@api_view(['GET'])
def skip_quest(request, qid):
    user = request.user
    quest = Quest.objects.get(id=qid)
    qset = Progress.objects.filter(quest=quest, user=user)

    if qset:
        prog = qset.first()
        prog.progress = 0
        prog.save()
    else:
        Progress(quest=quest, user=user, progress=0).save()

    return Response({"Success": "Success"})

@api_view(['GET'])
def check_complete_journey(request, jid):
    user = request.user
    journey = Journey.objects.get(id=jid)
    q = journey.quests.all()
    complete = True
    for quest in q:
        qset = Progress.objects.filter(user=user, quest=quest, journey=journey)
        if not qset:
            complete = False
            break
    if complete:
        return Response({"response": "true"})
    else:
        return Response({"response": "false"})

@api_view(['GET'])
def incomplete_journey(request):
    user = request.user
    journeys = Journey.objects.all()
    incomplete_journey = []
    # complete_journey = []

    #completed journeys
    completed = []
    for journey in journeys:
        q = journey.quests.all()
        # quests = []
        # for qid in q:
        #     quests.append(Quest.objects.get(id = qid))
        
        quests = QuestSerializer(q, many=True).data
        data = JourneySerializer(instance=journey).data
        data['quests'] = quests
        incomplete = False
        for quest in q:
            qset = Progress.objects.filter(user=user, quest=quest, journey=journey)
            if not qset:
                incomplete = True
                break
            progress_obj = qset.first()
            if progress_obj.progress != 1:
                incomplete = True
                break
        if incomplete:
            continue
        completed.append(journey)
        # complete_journey.append(data)

    # incompleted journeys
    incompleted = []
    for j in journeys:
        if(j not in completed):
            incompleted.append(j)

    for j in incompleted:
        progress = False
        q = j.quests.all()
        quests = QuestSerializer(q, many=True).data
        data = JourneySerializer(instance=j).data
        data['quests'] = quests

        # quests = []
        # for qid in q:
        #     quests.append(Quest.objects.get(id = qid))

        for quest in q:
            qset = Progress.objects.filter(user=user, quest=quest, journey=j)
            if qset:
                progress = True
                break
        if progress:
            incomplete_journey.append(data)

    return Response(incomplete_journey)


@api_view(['DELETE'])
def drop_journey(request, jid):
    user = request.user
    pset = Progress.objects.filter(user=user)
    if pset:
        for progress in pset:
            if progress.journey.id == jid:
                Progress.objects.get(id=progress.id).delete()
    else:
        return Response({"success": "Failure"})
    return Response({"success": "Success"})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_completed_history(request):
    """Searches for the user's complete progress history on their quests and
    journeys.

    In the request, the only thing that is needed is for it to be authenticated.
    """
    progresses = Progress.manager.get_completed(request.user)
    response_objects = CompletedProgressSerializer(progresses, many=True).data

    return Response({"completed": response_objects})