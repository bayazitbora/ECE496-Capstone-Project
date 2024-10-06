from django.db import models
from django.conf import settings
User = settings.AUTH_USER_MODEL
from django.contrib.auth.models import AbstractUser
# Create your models here.

#we would include an entry for each skill and question answered
class HoursFree(models.Model):
    start_hour      = models.IntegerField()
    end_hour        = models.IntegerField()

class AvailableTimes(models.Model):
    monday          = models.ManyToManyField(HoursFree, related_name='monday')
    tuesday         = models.ManyToManyField(HoursFree, related_name='tuesday')
    wednesday       = models.ManyToManyField(HoursFree, related_name='wednesday')
    thursday        = models.ManyToManyField(HoursFree, related_name='thursday')
    friday          = models.ManyToManyField(HoursFree, related_name='friday')
    saturday        = models.ManyToManyField(HoursFree, related_name='saturday')
    sunday          = models.ManyToManyField(HoursFree, related_name='sunday')

class Skill(models.Model):
    skillName       = models.CharField(max_length=100, default="None")
    
#Profile contains the user information that can be used to form teams
class Profile(models.Model):
    courseCode    = models.CharField(max_length=100)
    minor           = models.CharField(max_length=100)
    major           = models.CharField(max_length=100)
    skills          = models.ManyToManyField(Skill, blank=True)
    hoursToCommit   = models.IntegerField(default=0)
    availableTimes  = models.ManyToManyField(AvailableTimes)

    class Meta:
        ordering = ["courseCode"]

    def __str__(self):
        #change this so we can index Profile by course
        #Profile(courseCode="ECE467") for example
        return (str(self.courseCode) + ", " 
                + str(self.major) + ", "
                + str(self.minor) + ", "
                + str(self.hoursToCommit)) 
    
    def update_skills(self, listOfSkills):
        for skill in listOfSkills:
            skillToAdd = Skill(name=skill)
            self.profile.skills.add(skillToAdd)
    def update_profile(self, profile):
        status = True
        self.major          = profile['major'] 
        self.minor          = profile['minor']
        self.hoursToCommit  = profile['hoursToCommit']
        #status = self.availableTimes.update_available_times(profile['availableTimes'])
        #status = self.skills

        return self
#MyUser contains administrative details that effect the user experience on the site
class MyUser(AbstractUser):
    is_teacher      = models.BooleanField(default=False)
    USER_TYPE_CHOICES = ( (('student', 'Student'), ('teacher', 'Teacher'), ('teaching assistant','Teaching Assistant')))
    user_type       = models.CharField(max_length=20, choices=USER_TYPE_CHOICES)
    profile         = models.ManyToManyField(Profile) #many to many because may have multiple profiles per course
    email_verified  = models.BooleanField(default=False)
    first_name      = models.CharField(max_length=50)
    last_name       = models.CharField(max_length=50)

    def __str__(self):
        return self.email

    def is_teacher(self):
        return self.is_teacher

    def get_profile(self):
        return self.profile
    
    def update_user(self, user):
        status = 0
        return status
class Course(models.Model):
    is_active       = models.BooleanField()
    courseCode      = models.CharField(max_length=50)
    courseName      = models.CharField(max_length=140, default="N/A")
    teacher         = models.ManyToManyField(MyUser, related_name='teachers')
    students        = models.ManyToManyField(MyUser, related_name='students')
    def __str__ (self):
        return self.courseCode
    
    def update_course(self, courseInfo, user):
        self.teacher.add(user)
        self.courseName = courseInfo['courseName']
        self.courseCode = courseInfo['courseCode']