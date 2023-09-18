# account/forms.py
from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import authenticate
from account.models import Account
from captcha.fields import CaptchaField
import re

# 회원 가입 폼
class RegistrationForm(UserCreationForm):
    hidden_userid = forms.CharField(max_length=20, widget=forms.HiddenInput())
    hidden_email = forms.EmailField(widget=forms.HiddenInput())
    hidden_nickname = forms.CharField(max_length=20, widget=forms.HiddenInput())

    class Meta:
        model = Account
        fields = ['hidden_userid', 'hidden_email', 'username', 'hidden_nickname', 'department', 'rank', 'age', 'gender']

    def clean_username(self):
        username = self.cleaned_data['username']
        return username

    def save(self, commit=True):
        instance = super().save(commit=False)
        instance.userid = self.cleaned_data['hidden_userid'].lower()  # 아이디를 소문자로 변환하여 저장
        instance.email = self.cleaned_data['hidden_email'].lower()  # 이메일을 소문자로 변환하여 저장
        instance.nickname = self.cleaned_data['hidden_nickname']
        if commit:
            instance.save()
        return instance
    
class CaptchaForm(forms.Form):
    captcha = CaptchaField()