from django.contrib import admin
from django.urls import path, include
from django.shortcuts import render
from . import views


app_name = "analysis"
urlpatterns = [
    path("", views.intro, name="intro"),
    path("result/", views.result, name="result"),
    
]