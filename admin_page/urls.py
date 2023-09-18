# rpg/urls.py
from django.urls import path, include
from . import views

app_name = "admin_page"

urlpatterns = [
    path('persona_statistics', views.admin_persona, name='admin_persona'),
    path("", views.admin_user, name='admin_user'), 
]