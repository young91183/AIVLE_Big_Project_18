from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponse
from rpg.models import Message
from account.models import Account
import numpy as np
import pandas as pd
import os, json

def result (request):
    qf = request.session.get("analysis_qf")
    if qf == 0 :
        return redirect("rpg:rpg_start")
    grow_df = pd.DataFrame()
    p_id = request.session.get("persona_id")[0]["id"]
    pie_counts_new = request.session["pie_counts"]
    scores = request.session.get("scores")
    d_scores = []
    for i in range(len(scores)):
        d_scores.append({"{0}".format(i+1) : scores[i]})
    
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
        # csv_url에서 CSV 파일을 읽어옴
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
    
    pie_chart_new = {
        "socre_mem" : json.dumps(list(d_scores)),
        "grow_counts" : json.dumps(list(grow_counts)),
        "pie_counts": json.dumps(list(pie_counts_new), ensure_ascii=False),
        "f_score" : request.session["scores"][-1],
        "pie_word": pie_counts_new,
    }
    return render(request, "analysis/result.html", {'pie_chart': pie_chart_new})







def intro (request):
    qf = request.session.get("analysis_qf")
    if qf == 0 :
        return redirect("rpg:rpg_start")
    df = pd.DataFrame()
    p_id = request.session.get("persona_id")[0]["id"]
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
    request.session["pie_counts"] = pie_counts
    pie_chart =   {
        "pie_counts": json.dumps(list(pie_counts)),
        "f_score" : request.session["scores"][-1],
    }
    return render(request, "analysis/intro.html", {'pie_chart': pie_chart})
