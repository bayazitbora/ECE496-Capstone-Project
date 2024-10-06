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
from models import Course

from .serializers import UserSerializer, ProfileSerializer

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
    user = get_user_model().objects.get(username=request.user.username)
    return Response ({
        "username": user.get_username(),
        "name": user.get_full_name(),
        "profile": ProfileSerializer(user.profile.all())
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def updateProfile(request):
    if request.user.email:
        user = get_user_model().objects.get(email__iexact=request.user.email)
    elif request.user.username:
        user = get_user_model().objects.get(username=request.user.username)
    else:
        return Response({"message": "request did not contain username or email"}, 
                        status=status.HTTP_400_BAD_REQUEST)
    
    if 'profile' in request.data:
            #check if profile exists for user
            profile_QuerySet = user.profile.filter(courseCode=request.data['profile']['courseCode'])
            
            if not profile_QuerySet:
                #Profiles is empty, create new profile
                # courseCode = request.data['profile']['courseCode']
                # course = Course.filter(courseCode=courseCode)
                
                # #check if course exists. if not, return error
                # if not course:
                #     return Response({"message":"Course Not Found"}, status=status.HTTP_400_BAD_REQUEST)

                user.profile.create(courseCode=(request.data['profile']['courseCode']))
                profile = user.profile.get(courseCode=request.data['profile']['courseCode'])
                profile.update_profile(request.data['profile'])
                profile.save()
                print(profile)

                #add student to course list
                # course.students.add(user.username)
                # course.save()

            elif profile_QuerySet.count() == 1:
                #user has existing profile, update it
                profile = user.profile.get(courseCode=request.data['profile']['courseCode'])
                profile.update_profile(request.data['profile'])
                profile.save()
                print(profile)
                
            else:
                #user has more than one profile, this is a bug, throw error for now
                return Response({"message": "User has more than one profile for a given course"}, 
                                status=status.HTTP_400_BAD_REQUEST)

    print(user.profile.all())
    return Response({
        "user": user.username,
        "message": "User profile updated successfully!"
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createCourse(request):
    user = get_user_model().objects.get(username=request.user.username)
    if not user or not request.data['courseInfo']['courseName']:
        return Response(
            {
                "user": request.user.username,
                "message": "User not found."
            }, status=status.HTTP_400_BAD_REQUEST)
    course = Course(courseName=request.data['courseInfo']['courseName'])
    course.is_active = True
    course.update_course(request.data['courseInfo'], user)
    course.save()

    return Response({
        "user": user.username,
        "courseCode": course.courseName,
        "courseName": course.courseName,
        "message": "Created course successfully"
    }, status=status.HTTP_200_OK)

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