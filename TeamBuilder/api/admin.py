from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import MyUser

# Register your models here.
from . import models
admin.site.register(models.Skill)
admin.site.register(MyUser)