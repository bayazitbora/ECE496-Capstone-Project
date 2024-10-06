from rest_framework import serializers
from rest_framework.permissions import IsAuthenticated
from django.db import models
from django.conf import settings
User = settings.AUTH_USER_MODEL
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password

class UserSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = get_user_model()
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name']
        extra_kwargs = {'password': {'write_only': True}}

class SkillSerializer(serializers.Serializer):
    skill = serializers.CharField()


class ProfileSerializer(serializers.Serializer):
    skills = SkillSerializer(many=True)
    friends_list = serializers.SerializerMethodField()

    class Meta:
        fields = ('courseTitle', 'major', 'minor', 'skills', 'hoursToCommit')

