from django.shortcuts import render, redirect, get_object_or_404, get_list_or_404
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from django.http import JsonResponse, HttpResponse
from django.db.models import Sum, Count
from rpg.models import Persona, Message
from account.models import Account
from community.models import Survey, Rating
from django.urls import reverse
from django.contrib.auth.hashers import check_password
import numpy as np
import pandas as pd
import os, json



@login_required
def mypage_view(request):
    if not request.user.is_authenticated :
        return redirect('account:login')
    else :
        return render(request, 'mypage/myp.html')

@login_required
def myp_info(request):
    return render(request, 'mypage/myp_info.html')

@login_required
def myp_survey(request):
    user = request.user.nickname
    
    personas_with_messages = Persona.objects.filter(nickname=user).annotate(num_messages=Count('message')).filter(num_messages__gt=0)
    messages = Message.objects.filter(persona__in=personas_with_messages)
    first_p = personas_with_messages[0].id
    context = {
        'personas': personas_with_messages,
        'messages': messages,
        'first_p' : first_p,
    }
    return render(request, 'mypage/myp_survey.html', context)

@login_required
@require_POST
def share_persona(request, persona_id):
    try:
        persona = Persona.objects.get(pk=persona_id, nickname=request.user.nickname)
        persona.shared = True
        persona.save()

        title = request.POST.get('title')
        content = request.POST.get('content')

        author = Account.objects.get(nickname=request.user.nickname)
        survey = Survey(author=author, persona_id=persona, title=title, content=content)
        survey.save()

    except Persona.DoesNotExist:
        return redirect('mypage:myp_survey')

    return redirect('mypage:myp_survey')

@login_required
def stop_sharing(request, persona_id):
    if request.method == 'POST':  # 요청 메서드 확인
        try:
            persona = Persona.objects.get(pk=persona_id, nickname=request.user.nickname)
            persona.shared = False
            persona.save()
            
            author = Account.objects.get(nickname=request.user.nickname)
            surveys = Survey.objects.filter(author=author, persona_id=persona, shared=True)
            surveys.update(shared=False)

            # JsonResponse를 반환하여 요청이 성공적으로 처리되었음을 알려줍니다.
            return JsonResponse({'success': True})
        except Persona.DoesNotExist:
            # JsonResponse를 반환하여 요청 처리가 실패했음을 알려줍니다.
            return JsonResponse({'success': False})
    else:
        # 기존 리다이렉트 로직을 유지합니다.
        return redirect('mypage:myp_survey')

# @login_required
from django.shortcuts import render, redirect
from django.contrib import messages

def update_profile(request):
    if request.method == 'POST':
        user = request.user
        
        if 'update-department' in request.POST:
            department = request.POST['department']
            user.department = department            
        elif 'update-rank' in request.POST:
            rank = request.POST['rank']
            user.rank = rank
        elif 'update-password' in request.POST:
            password = request.POST['password_2']  # 입력한 비밀번호 값을 사용하도록 업데이트
            if len(password) > 0:
                user.set_password(password)
        
        user.save()
        
        return redirect(f"{reverse('mypage:popup')}?message=프로필 정보가 성공적으로 업데이트 되었습니다.")

    else:
        return render(request, 'mypage/myp_info.html')
    
def rating_list(request, persona_id):
    persona = get_object_or_404(Persona, id=persona_id)
    ratings = Rating.objects.filter(survey__persona_id=persona)

    group_counts = {
        'G': [0, 0, 0, 0],
        'R': [0, 0, 0, 0],
        'O': [0, 0, 0, 0],
        'W': [0, 0, 0, 0],
    }

    for rating in ratings:
        for i in range(1, 15):
            score = getattr(rating, f'score_{i}')
            if 1 <= i <= 3:
                group = 'G'
            elif 4 <= i <= 7:
                group = 'R'
            elif 8 <= i <= 10:
                group = 'O'
            elif 11 <= i <= 14:
                group = 'W'
            else:
                group = None

            if group:
                group_counts[group][score-1] += 1
    # 매핑 정보
    mapping = ["매우 그렇지 않다", "그렇지 않다", "그렇다", "매우 그렇다"]

    # 결과 저장을 위한 딕셔너리
    result = {}

    # 각 항목에 대해 반복
    for key, values in group_counts.items():
        result[key] = []
        for i, value in enumerate(values):
            result[key].append({
                "name": mapping[i],
                "value": value
            })

# 결과 출력
    for key, values in result.items():
        if key == 'G':
            G = values
        elif key == 'R':
            R = values
        elif key == 'O':
            O = values
        elif key == 'W':
            W = values
    comment = []

    for rating in ratings:
        comment.append(rating.comment)
    comments = "<br>".join(comment)

    context = {
        'G': json.dumps(list(G)),
        'R': json.dumps(list(R)),
        'O': json.dumps(list(O)),
        'W': json.dumps(list(W)),
        'comments' : comments
    }
    return JsonResponse(context)


def popup(request):
    message = request.GET.get('message', None)
    return render(request, 'mypage/myp_popup.html', {'message': message})

def graph_draw(request):
    p_id = request.POST.get("message")
    
    #-------------grow 데이터 호출 --------------#
    grow_df = pd.DataFrame()
    grow_db = Message.objects.filter(persona=p_id, name=request.user.nickname)
    grow_list = [
        {
            'id': msg.id, 
            'name': msg.name, 
            'persona': msg.persona.id,  # assuming persona object has an id
            'content': msg.content, 
            'send_date': msg.send_date.isoformat(), 
            'voice_url': msg.voice_url,
            'csv_url': msg.csv_url,
            'grow_url': msg.grow_url
        } 
        for msg in grow_db
    ]
    for grow in grow_list:
        grow_url = grow['grow_url']
        # grow_url에서 CSV 파일을 읽어옴
        df_temp = pd.read_csv(grow_url)
        # 읽어온 DataFrame을 df 아래에 붙임
        grow_df = pd.concat([grow_df, df_temp], ignore_index=True)
        
    request.session["Goal"] = 0
    request.session["Reality"] = 0
    request.session["Options"] = 0
    request.session["Will"] = 0
    request.session["ETC"] = 0
    l = len(grow_df['predict'])
    for i in range(l):
        request.session[grow_df['predict'][i]] += 1
    grow_counts = [
        {"name": "Goal", "value": request.session.get("Goal")},
        {"name": "Reality", "value": request.session.get("Reality")},
        {"name": "Options", "value": request.session.get("Options")},
        {"name": "Will", "value": request.session.get("Will")},
        {"name": "기타", "value": request.session.get("ETC")},
    ]
    
    #---------------------- 5요인 관련 데이터 불러오기 -----------------#
    df = pd.DataFrame()
    questions = Message.objects.filter(persona=p_id, name=request.user.nickname)
    questions_list = [
        {
            'id': msg.id, 
            'name': msg.name, 
            'persona': msg.persona.id, 
            'content': msg.content, 
            'send_date': msg.send_date.isoformat(), 
            'voice_url': msg.voice_url,
            'csv_url': msg.csv_url
        } 
        for msg in questions
    ]
    
    for question in questions_list:
        csv_url = question['csv_url']

        # csv_url에서 CSV 파일을 읽어옴
        df_temp = pd.read_csv(csv_url)
        # 읽어온 DataFrame을 df 아래에 붙임
        df = pd.concat([df, df_temp], ignore_index=True)
    
    request.session["관점변화"] = 0
    request.session["부정"] = 0
    request.session["인정"] = 0
    request.session["존중"] = 0
    request.session["판단"] = 0
    l = len(df['predict'])
    for i in range(l):
        request.session[df['predict'][i]] += 1
        
    perspective     = round((request.session.get("관점변화")/l) * 100, 0)
    negation        = round((request.session.get("부정")/l) * 100, 0)
    recognition     = round((request.session.get("인정")/l) * 100, 0)
    respect         = round((request.session.get("존중")/l) * 100, 0)
    judgment        = round((request.session.get("판단")/l) * 100, 0)
    pie_counts = [
        {"name": "인정", "value": recognition},
        {"name": "존중", "value": respect},
        {"name": "관점변화", "value": perspective},
        {"name": "판단", "value": judgment},
        {"name": "부정", "value": negation},
    ]
    
    perspective_s = such(perspective)
    negation_s = m_such(negation)
    recognition_s = such(recognition)
    judgment_s = m_such(judgment)
    respect_s = such(respect)
    
    
    data = {"grow": json.dumps(list(grow_counts)),
            "class" : json.dumps(list(pie_counts)),
            "perspective" : perspective_s,
            "negation" : negation_s,
            "recognition" : recognition_s,
            "judgment" : judgment_s,
            "respect" : respect_s,
            }
    
    return JsonResponse(data, content_type='application/json')


    
    
def such(score):
    if score < 20:
        text = '<span style="color: #F15F5F;">다소 적게</span>'
    elif 20<= score < 30:
        text = '<span style="color: #47C83E;">적절히 활용</span>'
    else :
        text = '<span style="color: #4374D9;">잘 활용</span>'
    
    return text

def m_such(score):
    if score < 10:
        text = '<span style="color: #47C83E;">하지 않았거나 매우적게</span>'
    elif 10<= score < 20:
        text = '<span style="color: #E0B94F;">어느정도</span>'
    else :
        text = '<span style="color: #F15F5F;">다소 많이</span>'
    
    return text

