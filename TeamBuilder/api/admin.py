from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

# Register your models here.
from . import models
admin.site.register(models.HoursFree)
admin.site.register(models.AvailableTimes)
admin.site.register(models.Skill)
admin.site.register(models.Profile)
admin.site.register(models.MyUser)
admin.site.register(models.Course)
