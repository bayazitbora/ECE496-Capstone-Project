from django.db import models
from django.conf import settings
import datetime
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
    matchedUsers    = models.ManyToManyField(User, related_name='matchedUsers')

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
                   + ", "
                   + str(self.matchedUsers.all())
                   )
        return message
    
    def update_interests(self, listOfInterests):
        for interest in listOfInterests:
            inter = Interest.objects.filter(interest=interest)
            if inter:
                #interestToAdd = Interest(interest=interest)
                self.interests.add(inter.first())
            else:
                self.interests.create(interest=interest)

    def update_skills(self, listOfskills):
        for skill in listOfskills:
            sk = Skill.objects.filter(skill=skill)
            #skillToAdd = Skill(skill=skill)
            if sk:
                self.skills.add(sk.first())
            else:
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
    title           = models.CharField(null=True, max_length=20)
    bio             = models.TextField(null=True)
    programOfStudy  = models.CharField(max_length=200, default="N/A")
    minors          = models.ManyToManyField(Minor)
    expectedGrad    = models.IntegerField(default=0)
    GPA             = models.FloatField(default=0)

    def __str__(self):
        return self.email

    def get_is_teacher(self):
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
        if 'pos' in request:
            if request['pos']:
                self.programOfStudy = request['pos']
        
        if 'minors' in request:
            if request['minors']:
                self.update_minors(request['minors'])
        if 'grad_year' in request:
            if request['grad_year']:
                self.expectedGrad = request['grad_year']
        if 'gpa' in request:
            if request['gpa']:
                self.GPA = request['gpa']

        self.is_teacher = False
        if 'teacher' in request:
            if request['teacher'] == "True":
                self.is_teacher = True
                self.user_type = 'teacher'
                if 'title' in request:
                    self.title = request['title']

        if 'bio' in request:
            self.bio = request.get('bio')

        self.save()
        
class Course(models.Model):
    is_active       = models.BooleanField()
    courseCode      = models.CharField(max_length=50)
    courseName      = models.CharField(max_length=140, default="N/A")
    session         = models.CharField(max_length=50, default="Fall")
    year            = models.IntegerField(default=datetime.datetime.now().year)  # Change default year to current year
    description     = models.CharField(max_length=500, default="")

    teacher         = models.ManyToManyField(MyUser, related_name='teachers')
    students        = models.ManyToManyField(MyUser, related_name='students')
    matchDate       = models.DateTimeField(null=True)
    jobID           = models.CharField(max_length=256, null=True)
    groupSize       = models.IntegerField(default=2)

    def __str__ (self):
        return self.courseCode
    
    def add_teacher(self, user):
        self.teacher.add(user)

    def add_student(self, user):
        self.students.add(user)

    def update_course(self, courseInfo):
        if 'courseName' in courseInfo:
            self.courseName = courseInfo['courseName']

        if 'courseCode' in courseInfo:
            self.courseCode = courseInfo['courseCode']

        if 'session' in courseInfo:
            if courseInfo['session'] == 'Fall':
                self.session = 'Fall'
            if courseInfo['session'] == 'Winter':
                self.session = 'Winter'
            if courseInfo['session'] == 'Summer':
                self.session = 'Summer'

        if 'year' in courseInfo:
            self.year = courseInfo['year']

        if 'description' in courseInfo:
            self.description = courseInfo['description']

        if 'groupSize' in courseInfo:
            self.groupSize = courseInfo['groupSize']
    
    def add_job(self, jobID, matchDate):
        self.jobID = jobID
        self.matchDate = matchDate
        self.save()

class Review(models.Model):
    reviewer = models.ForeignKey(User, related_name='reviews_given', on_delete=models.CASCADE)
    reviewee = models.ForeignKey(User, related_name='reviews_received', on_delete=models.CASCADE)
    score = models.IntegerField(default=0)
    comment = models.TextField()

    def __str__(self):
        return f'Review from {self.reviewer.username} to {self.reviewee.username}'

class Message(models.Model):
    sender = models.ForeignKey(User, related_name='sent_messages', on_delete=models.CASCADE)
    receiver = models.ForeignKey(User, related_name='received_messages', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    text = models.TextField()
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Message from {self.sender.username} to {self.receiver.username}'