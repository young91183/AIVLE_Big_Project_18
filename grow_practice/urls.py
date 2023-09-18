from django.urls import path, include
from . import views

app_name = "grow_practice"
urlpatterns = [
    path('', views.grow_practice, name='grow_practice'),
    path('grow_start/', views.grow, name='grow_start'),
    path('stt/', views.stt, name="stt"),
]