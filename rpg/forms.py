# rpg/forms.py
from django import forms
from django.contrib.auth import authenticate
from rpg.models import Persona
 
class RegisterPersona(forms.ModelForm):
    class Meta:
        model = Persona
        fields = ('topic_label', 'department', 'rank', 'age', 'gender', 'career', 'voice',)