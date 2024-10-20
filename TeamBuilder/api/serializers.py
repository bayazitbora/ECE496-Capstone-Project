from rest_framework import serializers
from rest_framework.permissions import IsAuthenticated
from django.db import models
from .models import Skill, Interest, Profile
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

class InterestsSerializer(serializers.Serializer):
    interest = serializers.CharField()
    class Meta:
        model = Interest

class SkillsSerializer(serializers.Serializer):
    skill = serializers.CharField()
    class Meta:
        model = Skill

class ProfileSerializer(serializers.Serializer):
    courseCode      = serializers.CharField(max_length=100)
    hoursToCommit   = serializers.IntegerField(default=0)
    interests = InterestsSerializer(many=True)
    skills = SkillsSerializer(many=True)

    class Meta:
        model = Profile
        fields = ('courseCode', 'interests', 'skills', 'hoursToCommit')

