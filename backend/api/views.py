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
from .models import Course, MyUser, Review, Message

from .serializers import UserSerializer, ProfileSerializer, MinorSerializer, ReviewSerializer, MessageSerializer

import pandas as pd
import numpy as np
import random

from .algorithm.algorithm import cluster_and_match_students
from django.db.models import Q

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
        "title": user.title,
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
        user = get_user_model().objects.get(Q(email__iexact=request.user.email))
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


#------------------------------------------------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def listUsersInCourse(request):
    user = get_user_model().objects.get(username=request.user.username)    
    courseCode = ""
    if 'courseCode' in request.data:
        courseCode = request.data['courseCode']
    else:
        return Response(
                    {
                        "user": request.user.username,
                        "message": "Course code not included"
                    }, status=status.HTTP_400_BAD_REQUEST)
    course = Course.objects.filter(courseCode=courseCode)
    if course.count() > 1:
        return Response(
                    {
                        "user": request.user.username,
                        "courseCode": request.data['courseCode'],
                        "message": "Multiple Courses with that course code."
                    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    course = course.first()
    response = Response(
        {},
        status=status.HTTP_200_OK
    )
    teachers = course.teacher.all()
    for teacher in teachers:
        response.data['teachers'] = teacher.email
    
    students = course.students.all()
    response.data['studentsEmail'] = []
    response.data['studentsUsername'] = []
    for student in students:
        response.data['studentsEmail'].append(student.email)
        response.data['studentsUsername'].append(student.username)

    return response

#------------------------------------------------


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
        'courses_taken': random.sample(courses_categories, k.random.randint(1, len(courses_categories))),
        'areas_of_interest': random.sample(interests_categories, k.random.randint(1, len(interests_categories))),
        'technical_skills': random.sample(skills_categories, k.random.randint(1, len(skills_categories))),
        #'schedule': random.sample(schedule_categories, k.random.randint(1, len(schedule_categories))), # change according to questionnaire
        'meeting_freq': meeting_freq # change according to questionnaire
    }

def generate_students(n):
    return pd.DataFrame([generate_random_student() for _ in range(n)])


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_review(request):
    reviewer = get_user_model().objects.get(username=request.user.username)
    reviewee_username = request.data.get('reviewee')
    score = request.data.get('score')
    comment = request.data.get('comment')

    if not reviewee_username or score is None or comment is None:
        return Response({"message": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)

    reviewee = get_user_model().objects.filter(username=reviewee_username).first()
    if not reviewee:
        return Response({"message": "Reviewee not found"}, status=status.HTTP_404_NOT_FOUND)

    review = Review(reviewer=reviewer, reviewee=reviewee, score=score, comment=comment)
    review.save()

    review_data = ReviewSerializer(review).data
    return Response({"message": "Review added successfully", "review": review_data}, status=status.HTTP_201_CREATED)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_review(request):
    reviewee = get_user_model().objects.get(username=request.user.username)
    review_id = request.data.get('review_id')

    if not review_id:
        return Response({"message": "Missing review ID"}, status=status.HTTP_400_BAD_REQUEST)

    review = Review.objects.filter(id=review_id, reviewee=reviewee).first()
    if not review:
        return Response({"message": "Review not found or you do not have permission to delete this review"}, status=status.HTTP_404_NOT_FOUND)

    review.delete()
    return Response({"message": "Review deleted successfully"}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_reviews(request):
    username = request.query_params.get('username')
    if not username:
        return Response({"message": "Username is required"}, status=status.HTTP_400_BAD_REQUEST)

    user = get_user_model().objects.filter(username=username).first()
    if not user:
        return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    reviews = Review.objects.filter(reviewee=user)
    serialized_reviews = ReviewSerializer(reviews, many=True)
    return Response({"reviews": serialized_reviews.data, "user": username}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_message(request):
    sender = request.user
    receiver_username = request.data.get('receiver')
    title = request.data.get('title')
    text = request.data.get('text')

    if not receiver_username or not title or not text:
        return Response({"message": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)

    receiver = get_user_model().objects.filter(username=receiver_username).first()
    if not receiver:
        return Response({"message": "Receiver not found"}, status=status.HTTP_404_NOT_FOUND)

    message = Message(sender=sender, receiver=receiver, title=title, text=text)
    message.save()

    message_data = MessageSerializer(message).data
    return Response({"message": "Message sent successfully", "message_data": message_data}, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_messages(request):
    user = request.user
    received_messages = Message.objects.filter(receiver=user)
    sent_messages = Message.objects.filter(sender=user)

    received_data = MessageSerializer(received_messages, many=True).data
    sent_data = MessageSerializer(sent_messages, many=True).data

    return Response({"received_messages": received_data, "sent_messages": sent_data}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_message(request):
    user = request.user
    message_id = request.data.get('message_id')

    if not message_id:
        return Response({"message": "Missing message ID"}, status=status.HTTP_400_BAD_REQUEST)

    message = Message.objects.filter(id=message_id, receiver=user).first()
    if not message:
        return Response({"message": "Message not found or you do not have permission to delete this message"}, status=status.HTTP_404_NOT_FOUND)

    message.delete()
    return Response({"message": "Message deleted successfully"}, status=status.HTTP_200_OK)