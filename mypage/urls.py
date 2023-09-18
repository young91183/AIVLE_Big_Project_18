from django.urls import path
from . import views
from rpg import views as rpg_views
app_name = 'mypage'

urlpatterns = [
    path('', views.mypage_view, name='mypage_view'),
    path('myp_info/', views.myp_info, name='myp_info'),
    path('myp_survey/', views.myp_survey, name='myp_survey'),
    path('update_profile/', views.update_profile, name='update_profile'),
    path('share_persona/<int:persona_id>/', views.share_persona, name='share_persona'),
    path('stop_sharing/<int:persona_id>/', views.stop_sharing, name='stop_sharing'),
    path('rating_list/<int:persona_id>/', views.rating_list, name='rating_list'),
    path('graph_draw/', views.graph_draw, name='graph_draw'),
    path('popup/', views.popup, name='popup'),
    # path('password_check/', views.password_check, name='password_check')
]
