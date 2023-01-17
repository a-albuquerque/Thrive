from django.shortcuts import redirect, render
from rest_framework import status

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from .models import *
from .serializers import *
# from .forms import ImageForm

from django.core.mail import send_mail
receiver_email = 'bellwoodspw@gmail.com'


# Create your views here.


@api_view(['GET', 'POST'])
@permission_classes(())
def journeys(request):
    if request.method == "GET":
        lst = Journey.objects.all()
        jsonObj = []
        for j in lst:
            quests = j.quests.all()
            Qserializer = QuestSerializer(quests, many=True)
            data = JourneySerializer(instance=j).data
            data['quests'] = Qserializer.data
            jsonObj.append(data)
        return Response(jsonObj)
    else:
        serializer = JourneySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
        return Response(serializer.data)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes(())
def journey(request, jid):
    if request.method == "GET":
        j = Journey.objects.get(id=jid)
        Jserializer = JourneySerializer(instance=j)
        lst = j.quests.all()
        Qserializer = QuestSerializer(lst, many=True)
        data = Jserializer.data
        data['quests'] = Qserializer.data
        return Response(data)
    elif request.method == "PUT":
        j = Journey.objects.get(id=jid)
        serializer = JourneySerializer(instance=j, data=request.data)
        if serializer.is_valid():
            serializer.save()
        return Response(serializer.data)
    else:
        j = Journey.objects.get(id=jid)
        deleted = JourneySerializer(instance=j).data
        j.delete()
        return Response(deleted)


@api_view(['GET', 'POST'])
@permission_classes(())
def quests(request, jid):
    if request.method == "GET":
        j = Journey.objects.get(id=jid)
        lst = j.quests.all()
        serializer = QuestSerializer(lst, many=True)
        return Response(serializer.data)
    else:
        q = Quest(name=request.data["name"],
                  description=request.data["description"])
        q.save()
        serializer = QuestSerializer(instance=q)
        return Response(serializer.data)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes(())
def quest(request, qid):
    if request.method == "GET":
        q = Quest.objects.get(id=qid)
        Qserializer = QuestSerializer(instance=q)
        return Response(Qserializer.data)
    elif request.method == "PUT":
        q = Quest.objects.get(id=qid)
        serializer = QuestSerializer(instance=q, data=request.data)
        if serializer.is_valid():
            serializer.save()
        return Response(serializer.data)
    else:
        q = Quest.objects.get(id=qid)
        deleted = QuestSerializer(instance=q).data
        q.delete()
        return Response(deleted)

@api_view(['GET'])
@permission_classes(())
def all_quests(request):
    quests = Quest.objects.all()
    data = QuestSerializer(instance=quests, many=True).data
    return Response(data)

@api_view(['GET'])
@permission_classes(())
def re_order(request, jid):
    j = Journey.objects.get(id=jid)
    lst = j.quests.all()
    quests = QuestSerializer(lst, many=True).data
    new_order = request.GET.get('ids', '').split(',')

    for i in range(len(new_order)):
        qset = quests.filter(id=int(new_order[i]))
        if not qset:
            continue
        q = qset.first()
        q.order = i
        q.save()

    return redirect("/api/journeys/" + str(jid))


def notify_new_submission(request, typee, id):
    subject = ""
    message = ""
    if typee == "q":
        message = "A user has submitted new quest(s).\nQuest:\n"
        name = ""
        description = ""
        print(request.data.get("quests"))
        for q in request.data.get("quests"):
            if not (q == {} or "name" not in q.keys() or "description" not in q.keys()):
                name += str(q["name"]) + "; "
                description += str(q["description"]) + "; "
        message += "name: " + name + "\n"
        message += "description: " + description + "\n"
        message += "Their name is " + str(request.data.get("user_name")) + " and their email " + str(request.data.get("email"))
        subject = "New user submitted quest!"
    elif typee == "j":
        message = "A user has submitted a new journey. \n"
        message += "name: " + request.data.get("name") + "\n"
        message += "description: " + request.data.get("description") + "\n"
        message += "quests: " + str(request.data.get("quests")) + "\n"
        message += "ID: " + str(id) + "\n"
        message += "Their name is " + str(request.data.get("user_name")) + " and their email " + str(request.data.get("email"))
        subject = "New user submitted journey!"
    send_mail(subject, message, 'bellwoodspw@gmail.com', [receiver_email])



@api_view(['GET', 'POST'])
@permission_classes(())
def submit_journeys(request):
    if request.method == "GET":
        journeys = SubmittedJourney.objects.all()
        serializer = SubmittedJourneySerializer(journeys, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)
    else:
        jserializer = SubmittedJourneySerializer(data=request.data)
        questsss = request.data.get("quests").copy()
        for q in request.data.get("quests"):
            if q == {} or q["name"] == "" or q["description"] == "":
                questsss.remove(q)
            else:
                q["email"] = request.data.get("email")
                q["user_name"] = request.data.get("user_name")
        qserializer = SubmittedQuestSerializer(data=questsss, many=True)
        if jserializer.is_valid() and qserializer.is_valid():
            new_journey = jserializer.save()
            # new_journey = SubmittedJourney.objects.get(name=jserializer.validated_data.get("name"),
            #                                            description=jserializer.validated_data.get("description"))
            new_id = new_journey.pk
            for q in questsss:
                q["journey"] = new_journey.pk
                qserializer = SubmittedQuestSerializer(data=q)
                if qserializer.is_valid():
                    qserializer.save()
                else:
                    return Response(qserializer.errors, status=status.HTTP_400_BAD_REQUEST)
            notify_new_submission(request, "j", new_id)
            return Response(jserializer.data, status=status.HTTP_201_CREATED)
        return Response(jserializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET", "POST"])
@permission_classes(())
def submit_quests(request):
    if request.method == "GET":
        quests = SubmittedQuest.objects.all()
        serializer = SubmittedQuestSerializer(quests, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)
    else:
        questsss = request.data.get("quests").copy()
        for q in request.data.get("quests"):
            if q == {} or q["name"] == "" or q["description"] == "":
                questsss.remove(q)
            else:
                q["email"] = request.data.get("email")
                q["user_name"] = request.data.get("user_name")
        qserializer = SubmittedQuestSerializer(data=questsss, many=True)
        if qserializer.is_valid():
            qserializer.save()
            notify_new_submission(request, "q", 0)
            return Response(qserializer.data, status=status.HTTP_201_CREATED)
        return Response(qserializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PATCH', "POST"])
@permission_classes(())
def update_user_quest(request, qid):
    q = SubmittedQuest.objects.get(pk=qid)
    og_approved = q.approved
    serializer = SubmittedQuestSerializer(q, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        q = SubmittedQuest.objects.get(pk=qid)
        approved = q.approved

        # check if this quest has an associated journey
        japproved = True
        have_journey = False
        if q.journey is not None:
            japproved = q.journey.approved
            have_journey = True

        if approved and japproved and og_approved:
            # add quest to Quest table
            new_quest = Quest(name=q.name, description=q.description,
                              media=q.media, survey_question=q.survey_question)
            new_quest.save()
            # create new JourneyQuest if the quest is associated with a joureny
            if have_journey:
                new_journeyquest = JourneyQuests(journey_id=q.journey.pk, quest_id=new_quest.pk, order=q.order)
                new_journeyquest.save()

            serializer = QuestSerializer(new_quest)
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        serializer = SubmittedQuestSerializer(q)
        return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["PATCH", "POST"])
@permission_classes(())
def update_user_journey(request, jid):
    j = SubmittedJourney.objects.get(pk=jid)
    og_approved = j.approved
    serializer = SubmittedJourneySerializer(j, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        j = SubmittedJourney.objects.get(pk=jid)
        approved = j.approved

        # publish journey if it is approved
        if approved and og_approved:
            quest_pk_lst = []

            # add journey to Journey table
            new_journey = Journey(name=j.name, description=j.description, media=j.media)
            new_journey.save()

            # add associated quests to Quest table and create associated JourneyQuest objects
            for q in j.submitted_quests.all():
                q.approved = True
                q.save()
                new_quest = Quest(name=q.name, description=q.description,
                                  media=q.media, survey_question=q.survey_question)
                new_quest.save()

                quest_pk_lst.append(new_quest.pk)
                new_journey_quest = JourneyQuests(journey_id=new_journey.pk, quest_id=new_quest.pk,
                                                  order=q.order)
                new_journey_quest.save()

            new_journey.quests.set(quest_pk_lst)  # add quests to new_journey and save
            new_journey.save()

            serializer = JourneySerializer(new_journey)
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        serializer = SubmittedJourneySerializer(j)
        return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
