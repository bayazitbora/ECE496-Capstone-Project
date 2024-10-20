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

    #register: registers a user with a username and password
    path('register/', views.register_user, name='registerUser'),
    
    #token: given a username and password, will login a user and return a JWT.
    path('token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),

    #token/refresh: refreshes a users JWT to keep them logged in.
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

]
