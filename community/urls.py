# community/urls.py
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

app_name = 'community'
urlpatterns = [
    path('', views.commu_list, name='commu_list'),
    path("notice/", views.notice_list, name="notice_list"),
    path("notice/<int:pk>/", views.notice_detail, name="notice_detail"),
    path("notice/create/", views.notice_create, name="notice_create"),
    path('survey/', views.survey_list, name="survey_list"),
    path('survey/<int:survey_id>/', views.survey_detail, name='survey_detail'),
    path('notice/<int:notice_id>/delete/', views.delete_notice, name='delete_notice'),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)