from django.urls import path
from . import views

urlpatterns = [
    path('', views.journeys, name="api-journeys"),
    path('<int:jid>/', views.journey, name="api-journey"),
    path('<int:jid>/quests/', views.quests, name="api-quests"),
    path('<int:jid>/quests/<int:qid>/', views.quest,
         name="api-quest"),
    path('<int:jid>/reorder-quests', views.re_order,
         name="api-re-order"),
    path('submit-journeys', views.submit_journeys, name="api-submit-journeys"),
    path('submit-quests', views.submit_quests, name="api-submit-quests"),
    path('submit-journeys/<int:jid>', views.update_user_journey, name="api-update-user-journey"),
    path('submit-quests/<int:qid>', views.update_user_quest, name="api-update-user-quest"),
    path('<int:jid>/reorder-quests/', views.re_order,
         name="api-re-order"),
    path('allquests/', views.all_quests, name="api-all-quests"),
]
