from django.contrib import admin
from django.urls import path, include
from . import views 
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('', views.getRoutes),
    path('getStatus/', views.getStatus, name="getStatus"),
    path('getUser/', views.getUser, name="getUser"),
    path('updateUser/', views.updateUser, name="updateUser"),

    path('token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

]
