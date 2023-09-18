# community/forms.py
from django import forms
from .models import Notice, Rating

class NoticeForm(forms.ModelForm):
    file = forms.FileField(required=False)  # 파일 필드 추가

    class Meta:
        model = Notice
        fields = ('title', 'content', 'file')  # 파일 필드 추가
        
class RatingForm(forms.ModelForm):
    item = forms.CharField(max_length=100)
    value = forms.IntegerField()

    class Meta:
        model = Rating
        fields = [
            'item',
            'value',
            'score_1',
            'score_2',
            'score_3',
            'score_4',
            'score_5',
            'score_6',
            'score_7',
            'score_8',
            'score_9',
            'score_10',
            'score_11',
            'score_12',
            'score_13',
            'score_14',
        ]