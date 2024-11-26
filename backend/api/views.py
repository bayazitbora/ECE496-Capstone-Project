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
from .models import Course, MyUser

from .algorithm.algorithm import cluster_and_match_students

from .serializers import UserSerializer, ProfileSerializer, MinorSerializer

import pandas as pd

#temp
import numpy as np
import random

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
        user.update_user(request.data) #updates Program of study, GPA, expectedGrad

        return Response({
                "user": serializer.data,
                "message": "User Created Successfully.  Now perform Login to get your token",
            }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/getStatus,',
        '/api/token',
        '/api/token/refresh',
        '/api/register',
        '/api/getUser',
        '/api/getSelf',
        '/api/createCourse',
        '/api/updateProfile',
        # add more routes...
    ]
    return Response(routes)

#Protected Endpoints----------------------------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def matchTeams(request):
    user = get_user_model().objects.get(username=request.user.username)
    if 'courseCode' in request.data:
        students = MyUser.objects.filter(is_teacher=False)
        #------------------------
        listOfDictOfStudentInfo = []
        for currUser in students:
            if (currUser.profile.filter(courseCode=request.data['courseCode'])):
                dictOfStudentInfo = {}
                #MyUser Info-------
                #UNCOMMENT to add username to dataframe
                # dictOfStudentInfo['username'] = currUser.username
                dictOfStudentInfo['GPA'] = currUser.GPA
                dictOfStudentInfo['major'] = currUser.programOfStudy
                
                #COMMENT after deciding how to handle courses taken
                dictOfStudentInfo['courses_taken'] = []
                dictOfStudentInfo['courses_taken'].append(request.data['courseCode'])

                #UNCOMMENT for list of minors in dataframe
                # dictOfStudentInfo['minors'] = []
                # currUserMinors = currUser.minors.all()
                # for minor in currUserMinors:
                #     dictOfStudentInfo['minors'].append(minor.minor)
                #COMMENT if doing the above
                dictOfStudentInfo['minor'] = currUser.minors.all()[0].minor

                #Profile Info-------
                profileToAdd = currUser.profile.filter(courseCode=request.data['courseCode'])
                dictOfStudentInfo['meeting_freq'] = profileToAdd.get().hoursToCommit

                dictOfStudentInfo['areas_of_interest'] = []
                for interest in profileToAdd.get().interests.all():
                    dictOfStudentInfo['areas_of_interest'].append(interest.interest)
                
                dictOfStudentInfo['technical_skills'] = []
                for skill in profileToAdd.get().skills.all():
                    dictOfStudentInfo['technical_skills'].append(skill.skill)
                listOfDictOfStudentInfo.append(dictOfStudentInfo)    
        #--------------------------    
        df = pd.DataFrame(listOfDictOfStudentInfo)
        # print(df)
        df2 = generate_students(10) #generate random 10 students
        new_df = pd.concat([df, df2]) #combine the real data with fake data
        # print(new_df)
        cluster_and_match_students(new_df, 3) #call algorithm
        # print(new_df)
        
        return Response({
        "user": user.username,
        "message": "Matched User!"
        }, status=status.HTTP_200_OK)
    else:
         return Response({
        "user": user.username,
        "message": "Missing courseCode in request."
    }, status=status.HTTP_400_BAD_REQUEST)




@api_view(['POST'])
@permission_classes([IsAuthenticated])
def updateSelf(request):
    user = get_user_model().objects.get(username=request.user.username)
    user.update_user(request.data)

    return Response({
        "user": user.username,
        "message": "User updated successfully!"
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def getUser(request):
    if 'requested_user' in request.data:
        userQS = get_user_model().objects.filter(username=request.data['requested_user'])
    elif 'requested_email' in request.data:
        userQS = get_user_model().objects.filter(email__iexact=request.data['requested_email'])
    else:
        return Response({"message": "request did not contain username or email"}, 
                        status=status.HTTP_400_BAD_REQUEST)
    
    if userQS.count() == 1:
        user = userQS.first()
    if userQS.count() > 1:
        return Response({"message": "Username or email belongs to multiple users"}, 
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    if userQS.count() < 1:
        return Response({"message": "User not found."}, 
                        status=status.HTTP_400_BAD_REQUEST)

    response = Response({
        "username": user.username,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "pos": user.programOfStudy,
        "grad_year": user.expectedGrad,
        "minors": user.minors.values_list('minor', flat=True),
        "profiles": { 
        }
    })
    for iProfile in user.profile.all():
        serialized = ProfileSerializer(iProfile)
        response.data['profiles'][iProfile.courseCode] = serialized.data
    return response


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def getSelf(request):
    user = get_user_model().objects.get(username=request.user.username)
    response = Response ({
        "username": user.get_username(),
        "email": user.email,
        "name": user.get_full_name(),
        "first_name": user.first_name,
        "last_name": user.last_name,
        "teacher": str(user.is_teacher),
        "pos": user.programOfStudy,
        "grad_year": user.expectedGrad,
        "GPA": user.GPA,
        "minors": user.minors.values_list('minor', flat=True),
        "profiles": {
        }
    })
    for iProfile in user.profile.all():
        serialized = ProfileSerializer(iProfile)
        response.data['profiles'][iProfile.courseCode] = serialized.data
    return response

#------------------------------------------------

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def updateProfile(request):
    if request.user.email:
        user = get_user_model().objects.get(email__iexact=request.user.email)
    elif request.user.username:
        user = get_user_model().objects.get(username=request.user.username)
    else:
        return Response({"message": "Request did not contain username or email"}, 
                        status=status.HTTP_400_BAD_REQUEST)
    
    if 'profile' in request.data:
        if (not request.data['profile']['courseCode'] 
            or not request.data['profile']['hoursToCommit'] 
            or not request.data['profile']['interests']
            or not request.data['profile']['skills']
            ):
            
            return Response({"message": "Request contained malformed or empty information"}, 
                        status=status.HTTP_400_BAD_REQUEST)
        else:
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

                #add student to course list
                # course.students.add(user.username)
                # course.save()

            elif profile_QuerySet.count() == 1:
                #user has existing profile, update it
                profile = user.profile.get(courseCode=request.data['profile']['courseCode'])
                profile.update_profile(request.data['profile'])
                profile.save()
                
            else:
                #user has more than one profile, this is a bug, throw error for now
                return Response({"message": "User has more than one profile for a given course"}, 
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        print(user.profile.all())
        return Response({
            "user": user.username,
            "message": "User profile updated successfully!"
        }, status=status.HTTP_200_OK)
    else:
        return Response({"message": "Request contained no Profile field"}, 
                        status=status.HTTP_400_BAD_REQUEST)

#------------------------------------------------

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createCourse(request):
    user = get_user_model().objects.get(username=request.user.username)
    if not ('courseInfo' in request) or ('courseCode' in request):
        if not request.data['courseInfo']['courseCode']:
            return Response(
                {
                    "user": request.user.username,
                    "message": "Course code not included"
                }, status=status.HTTP_400_BAD_REQUEST)
    
    if (not user.is_teacher):
        return Response(
                {
                    "user": request.user.username,
                    "message": "User does not have the required permissions."
                }, status=status.HTTP_401_UNAUTHORIZED)
    
    course = Course(courseCode=request.data['courseInfo']['courseCode'])
    course.is_active = True
    course.update_course(request.data['courseInfo'], user)
    course.save()

    return Response({
        "user": user.username,
        "courseInfo":
        {
            "courseCode": course.courseCode,
            "courseName": course.courseName,
        },
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

#cant import algo_test so copying these here
def generate_random_student():
    major_categories = ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Computer Engineering', 'Industrial Engineering']
    minor_categories = ['Math', 'Physics', 'Chem', 'Econ', 'Business', 'None']
    courses_categories = ["Electric and Magnetic Fields", "Fields and Waves", "Dynamics", "Communication Systems", "Electric Drives", "Computer Systems Programming", "Physiological Control Systems", "Sensory Communication", "Introduction to Electronic Devices", "Mechanics"]
    interests_categories = ['AI', 'ML', 'Robotics', 'Circuits', 'Signal Processing', 'Thermodynamics', 'Fluid Mechanics']
    skills_categories = ['Python', 'Java', 'C++', 'MATLAB', 'VHDL', 'SolidWorks', 'AutoCAD']
    # Generate random GPA
    gpa = np.clip(np.random.normal(3, 1), 0, 4)  # Normal distribution centered at 3.0, clipped to [0, 4]
    meeting_freq = random.randint(1, 15) 
    return {
        'GPA': round(gpa, 2),
        'major': random.choice(major_categories),
        'minor': random.choice(minor_categories),
        'courses_taken': random.sample(courses_categories, k=random.randint(1, len(courses_categories))),
        'areas_of_interest': random.sample(interests_categories, k=random.randint(1, len(interests_categories))),
        'technical_skills': random.sample(skills_categories, k=random.randint(1, len(skills_categories))),
        #'schedule': random.sample(schedule_categories, k=random.randint(1, len(schedule_categories))), # change according to questionnaire
        'meeting_freq': meeting_freq # change according to questionnaire
    }

def generate_students(n):
    return pd.DataFrame([generate_random_student() for _ in range(n)])
