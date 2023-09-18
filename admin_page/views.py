from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponse
from django.db.models import Count, Case, When, Value, CharField
from rpg.models import Persona
from account.models import Account, admin_info
import numpy as np
import pandas as pd
import os
import json
from django.db.models.functions import ExtractWeekDay, ExtractHour

def admin_persona(request):
    if not request.user.is_superuser:
        return redirect("common:home")
    # Rank 종류별 갯수
    rank_counts = list(Persona.objects.values('rank').annotate(rank_count=Count('rank')))

    # Department 종류별 갯수
    department_counts = list(Persona.objects.values('department').annotate(department_count=Count('department')))

    # 성별 종류별 갯수
    gender_counts = Persona.objects.values('gender').annotate(gender_count=Count('gender'))

    # 상황 종류별 갯수
    topic_label_counts = list(Persona.objects.values('topic_label').annotate(topic_label_count=Count('topic_label')))

    # 연차 종류별 갯수
    career_counts = Persona.objects.values('career').annotate(career_count=Count('career'))

    # 상황 종류별 갯수
    age_counts = (
        Persona.objects
        .annotate(age_group=Case(
            When(age__range=(20, 29), then=Value('20대')),
            When(age__range=(30, 39), then=Value('30대')),
            When(age__range=(40, 49), then=Value('40대')),
            When(age__range=(50, 59), then=Value('50대')),
            When(age__range=(60, 69), then=Value('60대')),
            
            # 추가적인 연령대 범위를 필요에 따라 추가해주세요
            default=Value('기타'),
            output_field=CharField(),
        ))
        .values('age_group')
        .annotate(age_group_count=Count('age_group'))
    )

    # Total counts
    total_ranks = sum([item['rank_count'] for item in rank_counts])

    # Calculate ratios
    for item in rank_counts:
        item['rank_ratio'] = item['rank_count'] / total_ranks * 100

    for item in department_counts:
        item['department_ratio'] = item['department_count'] / total_ranks * 100

    for item in gender_counts:
        item['gender_ratio'] = item['gender_count'] / total_ranks * 100

    for item in topic_label_counts:
        item['topic_label_ratio'] = item['topic_label_count'] / total_ranks * 100

    for item in career_counts:
        item['career_ratio'] = item['career_count'] / total_ranks * 100

    for item in age_counts:
        item['age_group_ratio'] = item['age_group_count'] / total_ranks * 100

    context = {
        'rank_counts': json.dumps(list(rank_counts)),
        'department_counts': json.dumps(list(department_counts)),
        'gender_counts': json.dumps(list(gender_counts)),
        'topic_label_counts': json.dumps(list(topic_label_counts)),
        'career_counts': json.dumps(list(career_counts)),
        'age_counts': json.dumps(list(age_counts)),
    }
    return render(request, "admin_page/admin_persona.html", context)


def admin_user(request):
    if not request.user.is_superuser:
        return redirect("common:home")
    
    #--------------------이용량 통계------------------------------#
    weekday_mapping = {
        0: '토요일',
        1: '일요일',
        2: '월요일',
        3: '화요일',
        4: '수요일',
        5: '목요일',
        6: '금요일',
    }
    
    login_counts_by_weekday = admin_info.objects.annotate(weekday=ExtractWeekDay('login_date')).values('weekday').annotate(count=Count('id')).order_by('weekday')

    # 시간대별로 로그인 횟수를 추출
    login_counts_by_hour = admin_info.objects.annotate(hour=ExtractHour('login_date')).values('hour').annotate(count=Count('id')).order_by('hour')

    # 요일별 로그인 횟수를 저장할 리스트 변수
    weekday_counts = [0] * 7  # 0부터 6까지의 인덱스를 가진 리스트

    # 시간대별 로그인 횟수를 저장할 리스트 변수
    hour_counts = [0] * 24  # 0부터 23까지의 인덱스를 가진 리스트

    # for i in range(len(weekday_counts)):
    #     weekday_counts[i] = { "weekday" : weekday_mapping[i], 'value' : weekday_counts[i]}
    
    # 요일별 로그인 횟수 추출 결과를 리스트 변수에 저장
    for entry in login_counts_by_weekday:
        weekday_counts[entry['weekday']] = entry['count']
    for i in range(len(weekday_counts)):
        if i==0:
            weekday_counts[i] = { 'weekday' : '토' , "value" : weekday_counts[i]}
        elif i==1:
            weekday_counts[i] = { 'weekday' : '일' , "value" : weekday_counts[i]}
        elif i==2:
            weekday_counts[i] = { 'weekday' : '월' , "value" : weekday_counts[i]}    
        elif i==3:
            weekday_counts[i] = { 'weekday' : '화' , "value" : weekday_counts[i]}    
        elif i==4:
            weekday_counts[i] = { 'weekday' : '수' , "value" : weekday_counts[i]}    
        elif i==5:
            weekday_counts[i] = { 'weekday' : '목' , "value" : weekday_counts[i]}    
        elif i==6:
            weekday_counts[i] = { 'weekday' : '금' , "value" : weekday_counts[i]}    
            
            
    
    # 시간대별 로그인 횟수 추출 결과를 리스트 변수에 저장
    for entry in login_counts_by_hour:
        hour_counts[entry['hour']] = entry['count']
    for i in range(len(hour_counts)):
        hour_counts[i] = { 'time' : i , "vlaue_hour" : hour_counts[i]}
        
    #--------------------------분석결과 통계--------------------------#
    
    
    
    context = {
        'weekday_counts': json.dumps(list(weekday_counts),ensure_ascii=False),
        'hour_counts': json.dumps(list(hour_counts)),
    }
    return render(request, "admin_page/admin_page.html", context)