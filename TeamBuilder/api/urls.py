from django.contrib import admin
from django.urls import path, include
from . import views 
from . import serializers as serial
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('', views.getRoutes),
    path('getStatus/', views.getStatus, name="getStatus"),
    path('getUser/', views.getUser, name="getUser"),
    path('updateProfile/', views.updateProfile, name="updateProfile"),
    path('createCourse/', views.createCourse, name="createCourse"),

    path('register/', views.register_user, name='registerUser'),
    
    path('token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

]
