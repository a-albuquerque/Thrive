from rest_framework import serializers
from .models import UserMeta


class UserMetaSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserMeta
        fields = ['id', 'firstname', 'lastname', 'age', 'sex']
