from django.db import models
from django.contrib.auth.models import User
# Create your models here.

#we would include an entry for each skill and question answered
class Skill(models.Model):
    name = models.CharField(max_length=50)

class Profile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    skills = models.ManyToManyField(Skill, blank=True)