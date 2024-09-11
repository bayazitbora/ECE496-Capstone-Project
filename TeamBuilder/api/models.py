from django.db import models
from django.conf import settings
User = settings.AUTH_USER_MODEL
from django.contrib.auth.models import AbstractUser
# Create your models here.

#we would include an entry for each skill and question answered
class Skill(models.Model):
    name = models.CharField(max_length=50)

class Course(models.Model):
    is_active = models.BooleanField()
    courseCode = models.CharField(max_length=20)
    #assigned professor
    #assigned students
    

class MyUser(AbstractUser):
    is_teacher = models.BooleanField()
    USER_TYPE_CHOICES = ( (('student', 'Student'), ('teacher', 'Teacher'), ('teaching assistant','Teaching Assistant')))
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES)
    skills = models.ManyToManyField(Skill, blank=True)
    major = models.CharField(max_length=50)
    minor = models.CharField(max_length=50, default="N/A")

    def __str__(self):
        return self.email

    def is_teacher(self):
        return self.is_teacher
    
    def update_skills(self, listOfSkills):
        for skill in listOfSkills:
            skillToAdd = Skill(name=skill)
            self.skills.add(skillToAdd)
    