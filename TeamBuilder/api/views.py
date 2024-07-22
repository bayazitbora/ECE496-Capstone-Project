from django.shortcuts import render
from rest_framework.decorators import api_view

from django.http import HttpResponse

# Create your views here.

#Need user authentication in some areas too

@api_view(['GET'])
def getStatus(request):
    return HttpResponse(1)

@api_view(['POST'])
def getUser(request):
    #Get the user information fron the database
    #Return in JSON format
    return HttpResponse(0)

@api_view(['POST'])
def updateUser(request):
    #update the user information
    #Return in JSON format or call getUser
    return HttpResponse(0)