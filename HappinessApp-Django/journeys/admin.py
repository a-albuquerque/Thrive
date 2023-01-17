from django.contrib import admin
from django.contrib.admin.options import TabularInline
from .models import *

# Register your models here.

# admin.site.register(Quest)
# admin.site.register(Journey)
admin.site.register(SubmittedQuest)
admin.site.register(SubmittedJourney)

@admin.register(Quest)
class QuestModel(admin.ModelAdmin):
    list_display = ('name', 'description')

class JourneyQuestsInline(TabularInline):
    model = JourneyQuests
    extra = 1

@admin.register(Journey)
class JourneyModel(admin.ModelAdmin):
    list_display = ('name', 'description')
    inlines = (JourneyQuestsInline,)
