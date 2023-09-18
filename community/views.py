# community/views.py
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, get_object_or_404
from django.contrib import messages
from django.shortcuts import redirect, render
from django.urls import reverse
from django.http import HttpResponseBadRequest, HttpResponse, Http404
import urllib.parse
import mimetypes
import os
from rpg.models import Message
from .models import Notice, Survey, Rating
from .forms import NoticeForm, RatingForm


def commu_list(request):
    return render(request, 'community/commu_list.html')

# Create your views here.
def notice_list(request):
    notices = Notice.objects.filter(is_working=True).order_by('-created_at')
    reversed(notices)
    return render(request, 'community/notice_list.html', {'notices': notices})

@login_required
def notice_create(request):
    if request.method == "POST":
        form = NoticeForm(request.POST)
        if form.is_valid():
            notice = form.save(commit=False)
            if "file" in request.FILES:
                notice.file = request.FILES["file"]
            notice.save()
            messages.success(request, "공지사항 작성 완료")
            return redirect("community:commu_list")
    elif request.method == "GET":
        if not request.user.is_superuser:
            error_message = "허가되지 않은 행동입니다."
            script = f'<script>alert("{error_message}"); window.location.href="{reverse("community:commu_list")}";</script>'
            return HttpResponseBadRequest(script)
        else:
            form = NoticeForm()

    return render(request, "community/notice_create.html", {"form": form})

def notice_detail(request, pk):
    notice = get_object_or_404(Notice, pk=pk)

    if request.method == "POST" and 'download' in request.POST:
        if notice.file:
            file_path = notice.file.path
            if os.path.exists(file_path):
                with open(file_path, 'rb') as file:
                    file_name = os.path.basename(file_path)
                    file_name_encoded = urllib.parse.quote(file_name.encode('utf-8'))
                    content_type, _ = mimetypes.guess_type(file_path)
                    response = HttpResponse(file.read(), content_type=content_type)
                    response['Content-Disposition'] = f'attachment; filename*=UTF-8\'\'{file_name_encoded}'
                    return response
            else:
                message = "파일이 없습니다."
                return render(request, "community/notice_detail.html", {"notice": notice, "message": message})

    return render(request, "community/notice_detail.html", {"notice": notice})

def survey_list(request):
    user = request.user.nickname
    surveys = Survey.objects.filter(shared=True).select_related('author')
    user_rated_surveys = Rating.objects.filter(user_nickname=user).values_list('survey', flat=True)

    context = {
        'surveys': surveys,
        'user_rated_surveys': user_rated_surveys,
    }

    return render(request, 'community/survey_list.html', context)


def survey_detail(request, survey_id):
    survey = Survey.objects.get(id=survey_id)
    messages = Message.objects.filter(persona=survey.persona_id)
    checklist = [
            '구체적인 성과목표를 다시금 인식시켰습니까?',
            '원하는 모습이 무엇인지 구체적이고 명확하게 그려보게 하였습니까?',
            '목표 달성이 스스로에게 어떤 의미가 있는지 생각하게 하였습니까?',
            '현재의 성과 추진 상황을 객관적으로 바라볼 수 있게 하였습니까?',
            '현재 어떤 일이 일어나고 있는지 인식하게 하였습니까?',
            '현재 어떤 도전과 문제가 있는지 파악하게 하였습니까?',
            '목표와 현재의 갭(Gap)을 확인하도록 하였습니까?',
            '성과목표 달성을 위한 발전적 대안을 모색하게 하였습니까?',
            '고정관념에서 벗어나 새로운 시각으로 보도록 하였습니까?',
            '발상 단계에서 아이디어를 평가하지 않았습니까?',
            '성과목표의 최종 달성을 위한 구성원의 실행의지를 다졌습니까?',
            '목표를 달성하기 위한 대안 중에서 실행할 것을 선택하도록 하였습니까?',
            '구체적으로 무엇을, 언제, 어떻게 할 것인지 명확히 하도록 하였습니까?',
            '격려하고 지지하며 신뢰를 표시하였습니까?'
        ]
    
    user_has_rated = Rating.objects.filter(survey=survey, user_nickname=request.user.nickname).exists()
    
    if user_has_rated:
        error_message = "이미 참여한 설문입니다."
        script = f'<script>alert("{error_message}"); window.location.href="{reverse("community:commu_list")}";</script>'
        return HttpResponseBadRequest(script)
    
    if request.method == 'POST':
        ratings = []
        rating = Rating(survey=survey, user_nickname=request.user.nickname)

        for i, item in enumerate(checklist):
            rating_value = int(request.POST.get(f'rating_{i}', 0))
            setattr(rating, f'score_{i + 1}', rating_value)
        
        # Handle the comment separately
        comment = request.POST.get('comment', '')
        rating.comment = comment

        ratings.append(rating)

        Rating.objects.bulk_create(ratings)
        return redirect('community:commu_list')
    
    context = {
        'survey': survey,
        'messages': messages,
        'checklist': checklist
    }
    return render(request, 'community/survey_detail.html', context)

@login_required
def delete_notice(request, notice_id):
    if request.method == 'POST':
        notice = Notice.objects.get(id=notice_id)
        notice.is_working = False
        notice.save()
        return redirect('community:commu_list')