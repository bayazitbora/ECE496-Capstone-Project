from django.shortcuts import render
from rest_framework.decorators import api_view

from django.http import HttpResponse, JsonResponse
from rest_framework.response import Response

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

# Create your views here.

#Need user authentication in some areas too
@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/token',
        '/api/token/refresh'
    ]
    return Response(routes)

@api_view(['GET'])
def getStatus(request):
    return HttpResponse(1)

@api_view(['POST'])
def getUser(request):
    #Get the user information fron the database
    #Return in JSON format
    return HttpResponse(0)

@api_view(['POST'])
def updateUser(request):
    #update the user information
    #Return in JSON format or call getUser
    return HttpResponse(0)

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        token['email'] = user.email
        # ...
        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer