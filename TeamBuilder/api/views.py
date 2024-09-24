from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes

from django.http import HttpResponse, JsonResponse
from rest_framework.response import Response

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import status
from django.conf import settings
User = settings.AUTH_USER_MODEL
from django.contrib.auth import get_user_model

from .serializers import UserSerializer

@api_view(['GET'])
def getStatus(request):
    return HttpResponse(1)

#Public Endpoints-------------------------------
@api_view(['POST'])
def register_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        user = get_user_model().objects.get(username=request.data['username'])
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

#Protected Endpoints----------------------------

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def getUser(request):
    user = get_user_model().objects.get(username=request.data['username'])
    return Response ({
        "username": user.get_username(),
        "name": user.get_full_name(),
        #skills
        #store some of who they matched with
        #other user profile info
    })

    return HttpResponse(0)

@api_view(['POST'])
#@permission_classes([IsAuthenticated])
def updateProfile(request):
    if 'email' in request.data:
        user = get_user_model().objects.get(email__iexact=request.data['email'])
    elif 'username' in request.data:
        user = get_user_model().objects.get(username=request.data['username'])
    else:
        return Response({"message": "request did not contain username or email"}, 
                        status=status.HTTP_400_BAD_REQUEST)
    
    if 'profile' in request.data:
            #check if profile exists for user
            profile = user.profile(request.data['profile']['courseTitle'])
            if not profile:
                #Profiles is empty, create new profile
                profile = user.profile.create(courseTitle=request.data['profile']['courseTitle'])
                profile.update_profile(request.data['profile'])

            elif profile.count() == 1:
                #user has existing profile, update it
                profile.update_profile(request.data['profile'])

            else:
                #user has more than one profile, this is a bug, throw error for now
                return Response({"message": "User has more than one profile for a given course"}, 
                                status=status.HTTP_400_BAD_REQUEST)

                #user has one or more profiles
            profile = request.data['profile']
            status = user.get_profile().update_profile(profile)

    return Response({
        "user": user.username,
        "message": "User profile updated successfully!"
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def updateSkills(request):
    user = User.objects.get(username=request.data['username'])
    
    if 'skills' in request.data:
        user.update_skills(request.data['skills'])
        
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