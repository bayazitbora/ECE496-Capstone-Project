from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes

from django.http import HttpResponse, JsonResponse
from rest_framework.response import Response

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import status
from django.contrib.auth.models import User

from .serializers import UserSerializer

#Public Endpoints-------------------------------
@api_view(['POST'])
def register_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        user = User.objects.get(username=request.data['username'])
        user.set_password(request.data['password']) #hashes user password
        user.save()

        return Response({
                "user": serializer.data,
                "message": "User Created Successfully.  Now perform Login to get your token",
            })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/token',
        '/api/token/refresh'
        # add more routes...
    ]
    return Response(routes)

@api_view(['GET'])
def getStatus(request):
    return HttpResponse(1)

#Protected Endpoints----------------------------

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def getUser(request):
    user = request.user

    return HttpResponse(0)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def updateUser(request):
    #update the user information
    #Return in JSON format or call getUser
    return HttpResponse(0)

#------------------------------------------------

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