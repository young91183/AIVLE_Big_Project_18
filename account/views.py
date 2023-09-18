# account/views.py
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.contrib.sites.shortcuts import get_current_site
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.template.loader import render_to_string
from django.core.exceptions import ValidationError
from .forms import RegistrationForm
from django.http import JsonResponse, HttpResponseBadRequest, HttpResponse
from django.views.decorators.http import require_POST
from .models import Account, admin_info
from captcha.models import CaptchaStore
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
#----------------------------------------------------------------------------------------------------------------------#
# 0. 필요 install 목록
# pip install captcha
# pip install django-simple-captcha
#----------------------------------------------------------------------------------------------------------------------#

# Create your views here.
def signup(request):
    if request.method == "POST":        
        form = RegistrationForm(request.POST)

        if form.is_valid():
            user = form.save()
            user = authenticate(request, userid=user.userid, password=form.cleaned_data['password1'])
            login(request, user)
            return redirect("common:home")
    else:
        form = RegistrationForm()
    
    return render(request, 'account/signup.html', {"form": form})

def login_view(request):
    if request.method == 'POST':
        userid = request.POST['userid']
        password = request.POST['password']
        captcha_word = request.POST.get('captcha', '')  # 캡챠 입력값 가져오기
        captcha_key = request.POST.get('captcha_0', '')  # 추가: 캡챠 키 가져오기

        account = Account.objects.filter(userid=userid).first()
        
        if account and account.password_attempt_count >= 5:
            # 로그인 시도 횟수가 5회 이상인 경우에만 캡챠 표시
            show_captcha = True
            if 'captcha_key' in request.session:
                captcha_key = request.session['captcha_key']
            else:
                captcha_key = CaptchaStore.generate_key()
                request.session['captcha_key'] = captcha_key
            captcha_image_url = '/captcha/image/{}'.format(captcha_key)
            
            # 캡챠 유효성 검사
            if captcha_key and captcha_word:
                if CaptchaStore.objects.filter(response=captcha_word, hashkey=captcha_key).count() == 0:
                    return render(request, 'account/login.html',
                                  {'error_message': '보안문구가 틀렸습니다.', 'show_captcha': show_captcha,
                                   'captcha_image_url': captcha_image_url, 'captcha_key': captcha_key})
            else:
                return render(request, 'account/login.html',
                              {'error_message': '보안문구를 입력하세요.', 'show_captcha': show_captcha,
                               'captcha_image_url': captcha_image_url, 'captcha_key': captcha_key})

            # 비밀번호 검증
            user = authenticate(request, userid=userid, password=password)
            if user is not None:
                login(request, user)
                account.password_attempt_count = 0  # 로그인 성공 시, 로그인 시도 횟수 초기화
                account.save()

                # 아이디 저장 여부 확인 및 처리
                if 'id-save-checkbox' in request.POST:
                    save_id = request.POST.get('id-save-checkbox')
                    if save_id == 'on':
                        response = redirect('common:home')
                        response.set_cookie('saved_id', userid, expires='Fri, 31 Dec 9999 23:59:59 GMT')
                        return response
                else:
                    response = redirect('common:home')
                    response.delete_cookie('saved_id')
                    return response    
                    
                return redirect('common:home')
            else:
                account.password_attempt_count += 1  # 로그인 실패 시, 로그인 시도 횟수 증가
                account.save()
                return render(request, 'account/login.html',
                              {'error_message': '아이디 또는 비밀번호를 잘못입력하셨습니다.', 'show_captcha': show_captcha,
                               'captcha_image_url': captcha_image_url, 'captcha_key': captcha_key})

        else:
            # 로그인 시도 횟수가 5회 미만인 경우에는 캡챠 표시하지 않음
            show_captcha = False
            captcha_image_url = ''
            captcha_key = ''

            # 비밀번호 검증
            user = authenticate(request, userid=userid, password=password)
            if user is not None:
                login(request, user)
                if account:
                    account.password_attempt_count = 0  # 로그인 성공 시, 로그인 시도 횟수 초기화
                    account.save()
                    admin_info_count = admin_info(
                        count   = 1
                    )
                    admin_info_count.save()
                
                # 아이디 저장 여부 확인 및 처리
                if 'id-save-checkbox' in request.POST:
                    save_id = request.POST.get('id-save-checkbox')
                    
                    if save_id == 'on':
                        response = redirect('common:home')
                        response.set_cookie('saved_id', userid, expires='Fri, 31 Dec 9999 23:59:59 GMT')
                        return response
                else:
                    response = redirect('common:home')
                    response.delete_cookie('saved_id')
                    return response
                    
                return redirect('common:home')
            
            else:
                # 로그인 실패 시, 로그인 시도 횟수 증가
                if account:
                    account.password_attempt_count += 1
                    account.save()

                return render(request, 'account/login.html',
                              {'error_message': '아이디 또는 비밀번호를 잘못입력하셨습니다.', 'show_captcha': show_captcha,
                               'captcha_image_url': captcha_image_url, 'captcha_key': captcha_key})
    else:
        # 로그인 시도 횟수가 5회 이상인 경우에만 캡챠 표시
        password_attempt_count = request.session.get('password_attempt_count', 0)
        show_captcha = password_attempt_count >= 5

        if 'captcha_key' in request.session:
            captcha_key = request.session['captcha_key']
        else:
            captcha_key = CaptchaStore.generate_key()
            request.session['captcha_key'] = captcha_key
        captcha_image_url = '/captcha/image/{}'.format(captcha_key)

        return render(request, 'account/login.html',
                      {'show_captcha': show_captcha, 'captcha_image_url': captcha_image_url, 'captcha_key': captcha_key})


def logout_view(requset):
    logout(requset)
    return redirect("common:home")

@require_POST
def check_duplicate(request):
    userid = request.POST.get('userid', None)

    response_data = {
        'is_taken': Account.objects.filter(userid=userid).exists()
    }

    return JsonResponse(response_data)

@require_POST
def check_duplicate_email(request):
    email = request.POST.get('email', None)

    response_data = {
        'is_taken': Account.objects.filter(email=email).exists()
    }

    return JsonResponse(response_data)

@require_POST
def check_nickname(request):
    nickname = request.POST.get('nickname', None)

    matching_accounts = Account.objects.filter(nickname__iexact=nickname)
    is_taken = any(account.nickname == nickname for account in matching_accounts)

    response_data = {
        'is_taken': is_taken
    }

    return JsonResponse(response_data)



def find_userid(request):
    if request.method == "POST":
        email = request.POST.get('email')
        
        # 이메일로 아이디를 보내는 로직
        try:
            account = Account.objects.get(email=email)
            to_email = account.email
            mail_subject = '아이디 찾기 결과'
            message = render_to_string('account/smtp_email.html', {
                        'username': account.username,
                        'userid' : account.userid
                        })
        
            send_email = EmailMessage(mail_subject, message, to=[to_email])
            send_email.send()
            
            return render(request, 'account/find_userid.html', {'email_sent': True})
        except Account.DoesNotExist:
            return render(request, 'account/find_userid.html', {'account_not_found': True})
    else:
        return render(request, 'account/find_userid.html')
    
def password_reset_request(request):
    if request.method == 'POST':
        userid = request.POST['userid']
        email = request.POST['email']
        
        Account = get_user_model()
        try:
            account = Account.objects.get(userid=userid, email=email)
        except Account.DoesNotExist:
            return render(request, 'account/password_reset_request.html', {'account_not_found': True})
        
        # Generate password reset token
        uidb64 = urlsafe_base64_encode(str(account.pk).encode())
        token = default_token_generator.make_token(account)
        
        # Build password reset URL
        current_site = get_current_site(request)
        domain = current_site.domain
        reset_url = f"http://{domain}/account/password-reset-confirm/{uidb64}/{token}"
        
        # Render password reset email template
        email_subject = '비밀번호 재설정'
        email_body = render_to_string('account/password_reset_email.html', {
            "username" : account.username,
            'reset_url': reset_url,
        })
        
        # Send password reset email
        email = EmailMessage(email_subject, email_body, to=[account.email])
        email.content_subtype = 'html'  # 이메일 내용이 HTML 형식임을 설정
        email.send()
        
        return render(request, 'account/password_reset_request.html', {'email_sent': True})
    
    return render(request, 'account/password_reset_request.html')

def password_reset_confirm(request, uidb64, token):
    try:
        # 유저 아이디 디코딩
        uid = urlsafe_base64_decode(uidb64).decode()
        user = Account.objects.get(pk=uid)
        
        # 토큰 유효성 검사
        if not default_token_generator.check_token(user, token):
            raise ValidationError('Invalid token')
        
        if request.method == 'POST':
            password = request.POST['password']
            confirm_password = request.POST['confirm_password']
            
            if password != confirm_password:
                return render(request, 'account/password_reset_confirm.html', {'error': '비밀번호가 일치하지 않습니다.'})
            
            user.set_password(password)
            user.save()
            
            return redirect('account:login')
        
        return render(request, 'account/password_reset_confirm.html', {'uidb64': uidb64, 'token': token})
    
    except (TypeError, ValueError, OverflowError, Account.DoesNotExist, ValidationError):
        return HttpResponseBadRequest('Bad Token')