from django.contrib import admin
from django.urls import path, include
from . import views 
from . import serializers as serial
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    #getRoutes: will return a string of active routes on the server
    path('', views.getRoutes),

    #getStatus: returns 1 from the server
    path('getStatus/', views.getStatus, name="getStatus"),

    #getSelf: returns the user information of the authenticated user
    path('getSelf/', views.getSelf, name="getSelf"),

    #getUser: Returns the profiles information of the requested user
    path('getUser/', views.getUser, name="getUser"),

    #updateSelf: returns the user information of the authenticated user
    path('updateSelf/', views.updateSelf, name="updateSelf"),

    #updateProfile: updates user information such as: first, last name, gpa, etc
    path('updateProfile/', views.updateProfile, name="updateProfile"),

    #createCourse: creates a course object, !!not impl fully!!
    path('createCourse/', views.createCourse, name="createCourse"),

    #listCourses: lists all courses stored in the database
    path('listCourses/', views.listCourses, name="listCourses"),
    
    #listUserCourses: lists all courses that a user is a student/teacher of
    path('listUserCourses/', views.listUserCourses, name="listUserCourses"),
    
    #listUsersInCourse: lists all users related to a course
    path('listUsersInCourse/', views.listUsersInCourse, name="listUsersInCourse"),

    #scheduleMatch: given a courseCode and datetime, it adds a thread to match students
    #at a given time
    #JSON FORMAT:
    # "courseInfo": {
    #     "courseCode": "MIE100",
    #     "matchDate": "2025-01-28T04:24:58.-0500"
    # }
    path('scheduleMatch/', views.scheduleMatch, name="scheduleMatch"),

    #register: registers a user with a username and password
    path('register/', views.register_user, name='registerUser'),
    
    #token: given a username and password, will login a user and return a JWT.
    path('token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),

    #token/refresh: refreshes a users JWT to keep them logged in.
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    #addReview: adds a review
    path('addReview/', views.add_review, name="addReview"),

    #deleteReview: deletes a review
    path('deleteReview/', views.delete_review, name="deleteReview"),

    #getReviews: returns all reviews
    path('getReviews/', views.get_reviews, name="getReviews"),

    #sendMessage: sends a message from the authenticated user to another user
    path('sendMessage/', views.send_message, name="sendMessage"),

    #getMessages: retrieves all received and sent messages for the authenticated user
    path('getMessages/', views.get_messages, name="getMessages"),

    #deleteMessage: deletes a message for the authenticated user
    path('deleteMessage/', views.delete_message, name="deleteMessage"),
]
