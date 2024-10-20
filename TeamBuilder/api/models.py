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

class Interest(models.Model):
    interest        = models.CharField(max_length=100)
    
    def __str__(self):
        return str(self.interest)

class Skill(models.Model):
    skill           = models.CharField(max_length=100, default="None")

    def __str__(self):
        return str(self.skill)

class Minor(models.Model):
    minor           = models.CharField(max_length=100, default="None")

    def __str__(self):
        return str(self.minor)

#Profile contains the user information that can be used to form teams
class Profile(models.Model):
    courseCode      = models.CharField(max_length=100)
    interests       = models.ManyToManyField(Interest, blank=True)
    skills          = models.ManyToManyField(Skill, blank=True)
    hoursToCommit   = models.IntegerField(default=0)

    #not implemented
    availableTimes  = models.ManyToManyField(AvailableTimes)

    class Meta:
        ordering = ["courseCode"]

    def __str__(self):
        message = (str(self.courseCode) 
                   + ", " 
                   + str(self.interests.all()) 
                   + ", "
                   + str(self.skills.all())
                   + ", "
                   + str(self.hoursToCommit)
                   )
        return message
    
    def update_interests(self, listOfInterests):
        for interest in listOfInterests:
            #interestToAdd = Interest(interest=interest)
            self.interests.create(interest=interest)

    def update_skills(self, listOfskills):
        for skill in listOfskills:
            #skillToAdd = Skill(skill=skill)
            self.skills.create(skill=skill)

    def update_profile(self, profile):
        if profile['interests']:
            self.update_interests(profile['interests'])

        if profile['skills']:
            self.update_skills(profile['skills'])

        self.hoursToCommit  = profile['hoursToCommit']

        self.save()

#MyUser contains administrative details that effect the user experience on the site
class MyUser(AbstractUser):
    is_teacher      = models.BooleanField(default=False)
    USER_TYPE_CHOICES = ( (('student', 'Student'), ('teacher', 'Teacher')))
    user_type       = models.CharField(max_length=20, choices=USER_TYPE_CHOICES)
    profile         = models.ManyToManyField(Profile) #many to many because may have multiple profiles per course
    email_verified  = models.BooleanField(default=False)
    first_name      = models.CharField(max_length=50)
    last_name       = models.CharField(max_length=50)
    programOfStudy  = models.CharField(max_length=200, default="N/A")
    minors          = models.ManyToManyField(Minor)
    expectedGrad    = models.IntegerField(default=0)
    GPA             = models.FloatField(default=0)

    def __str__(self):
        return self.email

    def is_teacher(self):
        return self.is_teacher

    def get_profile(self):
        return self.profile
    
    def update_minors(self, listOfMinors):
        for minor in listOfMinors:
            if not self.minors.filter(minor=minor):
                self.minors.create(minor=minor)

    def update_user(self, request):
        if request['first_name']:
            self.first_name = request['first_name']
        
        if request['last_name']:
            self.last_name = request['last_name']

        if request['pos']:
            self.programOfStudy = request['pos']
        
        if request['minors']:
            self.update_minors(request['minors'])

        if request['grad_year']:
            self.expectedGrad = request['grad_year']

        if request['gpa']:
            self.GPA = request['gpa']

        self.save()
        
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