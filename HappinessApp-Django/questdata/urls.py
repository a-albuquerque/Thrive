from django.urls import path
from .views import *

urlpatterns = [
    path('download/', download, name="api-questdata-download"),
]
