import datetime as dt

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
SCHEDULER = settings.SCHEDULER
from django.contrib.auth import get_user_model
from .models import Course, MyUser

from .serializers import UserSerializer, ProfileSerializer, MinorSerializer

import pandas as pd
import numpy as np
import random

from .algorithm.algorithm import cluster_and_match_students

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
        "title": user.title,
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
                courseCode = request.data['profile']['courseCode']
                courseQS = Course.objects.filter(courseCode=courseCode)
                if courseQS.count() == 1:
                    #if there is one course then add that student to that course
                    #if there is no course then maybe we should not let them make the profile?
                    courseQS.first().add_student(user)
                elif not courseQS:
                    return Response({"message":"Course Not Found"}, status=status.HTTP_400_BAD_REQUEST)

                # #check if course exists. if not, return error
                # if not course:

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
    if (not user.is_teacher):
        return Response(
                {
                    "user": request.user.username,
                    "message": "User does not have the required permissions."
                }, status=status.HTTP_403_FORBIDDEN)
    
    if not ('courseInfo' in request.data):
        if not 'courseCode' in request.data['courseInfo']:
            if not request.data['courseInfo']['courseCode']:
                return Response(
                    {
                        "user": request.user.username,
                        "message": "Course code not included"
                    }, status=status.HTTP_400_BAD_REQUEST)
    
    exists = Course.objects.filter(courseCode=request.data['courseInfo']['courseCode'], is_active=True)
    if exists:
         return Response(
                    {
                        "user": request.user.username,
                        "message": "Course Code Exists"
                    }, status=status.HTTP_400_BAD_REQUEST)
    
    course = Course(courseCode=request.data['courseInfo']['courseCode'])
    course.is_active = True
    course.update_course(request.data['courseInfo'])
    course.save()
    course.add_teacher(user)

    return Response({
        "user": user.username,
        "courseInfo":
        {
            "courseCode": course.courseCode,
            "courseName": course.courseName,
            "description": course.description,
            "session": course.session,
            "year": course.year,
            "groupSize": course.groupSize
        },
        "message": "Created course successfully"
    }, status=status.HTTP_200_OK)

#------------------------------------------------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def listCourses(request):
    courses = Course.objects.all()
    response = Response({}, status=status.HTTP_200_OK)
    for course in courses:
        response.data[course.courseCode] = {}
        response.data[course.courseCode]['courseCode'] = course.courseCode
        response.data[course.courseCode]['courseName'] = course.courseName
        response.data[course.courseCode]['description'] = course.description
        response.data[course.courseCode]['session'] = course.session
        response.data[course.courseCode]['year'] = course.year
        response.data[course.courseCode]['groupSize'] = course.groupSize
        response.data[course.courseCode]['isActive'] = course.is_active
        # response.data[course.courseCode]['teacher'] = course.teacher.all()
    return response
#------------------------------------------------

#------------------------------------------------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def listUserCourses(request):
    user = get_user_model().objects.get(username=request.user.username)    
    courses = {}
    if user.is_teacher == True:
        #list courses that the user teaches
        courses = user.teachers.all()
    elif user.is_teacher == False:
        courses = user.students.all()


    response = Response(
                {
                    "user": user.username,
                    "courses": {}
                }, status=status.HTTP_200_OK)

    for course in courses:
        response.data['courses'][course.courseCode] = {}
        response.data['courses'][course.courseCode]['courseCode'] = course.courseCode
        response.data['courses'][course.courseCode]['courseName'] = course.courseName
        response.data['courses'][course.courseCode]['description'] = course.description
        response.data['courses'][course.courseCode]['session'] = course.session
        response.data['courses'][course.courseCode]['year'] = course.year
        response.data['courses'][course.courseCode]['groupSize'] = course.groupSize
        response.data['courses'][course.courseCode]['isActive'] = course.is_active

    return response

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def scheduleMatch(request):
    user = get_user_model().objects.get(username=request.user.username)
    if not user.is_teacher:
        return Response(
                {
                    "user": request.user.username,
                    "message": "User does not have the required permissions."
                }, status=status.HTTP_403_FORBIDDEN)

    if not 'courseInfo' in request.data:
        if not 'courseCode' in request.data['courseInfo']:
            return Response(
                    {
                        "user": request.user.username,
                        "message": "Course code not included"
                    }, status=status.HTTP_400_BAD_REQUEST)
    
    courseCode = request.data['courseInfo']['courseCode']
    course = Course.objects.filter(courseCode=courseCode)

    if course.count() > 1:
        return Response(
                    {
                        "user": request.user.username,
                        "message": "Multiple Courses with the same Code exist"
                    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    course = course[0] #select the first (and only) course in the list

    #Check if the requesting user is a listed teacher of the requested course
    userSet = course.teacher.filter(username=user.username)
    if not userSet:
         return Response(
                {
                    "user": request.user.username,
                    "message": "User does not have the required permissions to edit this course."
                }, status=status.HTTP_403_FORBIDDEN)
    
    #Check for date in JSON
    if not 'matchDate' in request.data['courseInfo']:
            return Response(
                    {
                        "user": request.user.username,
                        "message": "Matching Date not included"
                    }, status=status.HTTP_400_BAD_REQUEST)

    matchDateString = request.data['courseInfo']['matchDate']
    matchDate = dt.datetime.strptime(matchDateString, "%Y-%m-%dT%H:%M:%S.%z")#2025-01-26T04:13:58.UTC

    #Check if job exists, and cancel it
    if (SCHEDULER.get_job(course.jobID)):
        SCHEDULER.remove_job(course.jobID)
        print("Removed jobID: " + course.jobID + " from course: " + course.courseCode)

    jobName = courseCode + "_job"
    job = SCHEDULER.add_job(job_match, "date", [request, course], run_date=matchDate, name=jobName)
    print(SCHEDULER.get_jobs())
    course.add_job(job.id, matchDate)

    return Response({"message": "Matched Scheduled!"}, status=status.HTTP_200_OK)

def job_match(request, course):
    if 'courseCode' in request.data['courseInfo']:
        students = MyUser.objects.filter(is_teacher=False)
        listOfDictOfStudentInfo = []
        studentIndex = {}
        i = 0
        for currUser in students:
            if(currUser.profile.filter(courseCode=request.data['courseInfo']['courseCode'])):
                dictOfStudentInfo = {}
                studentIndex[i] = currUser.username
                #MyUser Info-------
                #UNCOMMENT to add username to dataframe
                # dictOfStudentInfo['username'] = currUser.username
                dictOfStudentInfo['GPA'] = currUser.GPA
                dictOfStudentInfo['major'] = currUser.programOfStudy
                
                #COMMENT after deciding how to handle courses taken
                dictOfStudentInfo['courses_taken'] = []
                dictOfStudentInfo['courses_taken'].append(request.data['courseInfo']['courseCode'])

                #UNCOMMENT for list of minors in dataframe
                # dictOfStudentInfo['minors'] = []
                # currUserMinors = currUser.minors.all()
                # for minor in currUserMinors:
                #     dictOfStudentInfo['minors'].append(minor.minor)
                #COMMENT if doing the above
                dictOfStudentInfo['minor'] = currUser.minors.all()[0].minor

                #Profile Info-------
                profileToAdd = currUser.profile.filter(courseCode=request.data['courseInfo']['courseCode'])
                dictOfStudentInfo['meeting_freq'] = profileToAdd.get().hoursToCommit

                dictOfStudentInfo['areas_of_interest'] = []
                for interest in profileToAdd.get().interests.all():
                    dictOfStudentInfo['areas_of_interest'].append(interest.interest)
                
                dictOfStudentInfo['technical_skills'] = []
                for skill in profileToAdd.get().skills.all():
                    dictOfStudentInfo['technical_skills'].append(skill.skill)
                listOfDictOfStudentInfo.append(dictOfStudentInfo) 
                i = i + 1
        print(dictOfStudentInfo)
        groupSize = course.groupSize
        df = pd.DataFrame(listOfDictOfStudentInfo)
        df2 = generate_students(10) #generate random 10 students
        new_df = pd.concat([df, df2], ignore_index=True) #combine the real data with fake data
        dictOfMatches = cluster_and_match_students(new_df, groupSize) 
        print(dictOfMatches)
        print(studentIndex)

        for groupID in dictOfMatches:
            for index in dictOfMatches[groupID]:
                if index in studentIndex: #check if user is real user since we are using generated students
                    username = studentIndex[index]
                    currUser = get_user_model().objects.filter(username=username).first()
                    currUser_profile = currUser.profile.filter(courseCode=course.courseCode).first()
                    print("Adding matched users to:", currUser.username)
                    for index2 in dictOfMatches[groupID]:
                        if index2 != index: #if the students within a group are not the same
                            #grab the student username and attach to forgien key relationship
                            matchedStudent = get_user_model().objects.filter(username=studentIndex[index2]).first()
                            currUser_profile.matchedUsers.add(matchedStudent)
                            currUser_profile.save()


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


def generate_random_student():
    major_categories = ['CS', 'EE', 'ME', 'CE', 'INDY']
    minor_categories = ['Math', 'Physics', 'Chem', 'Econ', 'Business', 'None']
    courses_categories = ["Electric and Magnetic Fields", "Fields and Waves", "Dynamics", "Communication Systems", "Electric Drives", "Computer Systems Programming", "Physiological Control Systems", "Sensory Communication", "Introduction to Electronic Devices", "Mechanics"]
    interests_categories = ['AI', 'ML', 'Robotics', 'Circuits', 'Signal Processing', 'Thermodynamics', 'Fluid Mechanics']
    skills_categories = ['Python', 'Java', 'C++', 'MATLAB', 'VHDL', 'SolidWorks', 'AutoCAD']

    # Days from Monday to Saturday
    days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
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