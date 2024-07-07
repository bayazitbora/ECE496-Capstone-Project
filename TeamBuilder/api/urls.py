from django.contrib import admin
from django.urls import path, include
from .views import getStatus, getUser, updateUser

urlpatterns = [
    path('getStatus/', getStatus, name="getStatus"),
    path('getUser/', getUser, name="getUser"),
    path('updateUser/', updateUser, name="updateUser")
]
