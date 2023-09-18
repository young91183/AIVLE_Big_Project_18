# community/models.py
from django.db import models
from rpg.models import Persona, Message
from account.models import Account
import os

class Notice(models.Model):
    title         = models.CharField(max_length=200, blank=False, null=False)
    content       = models.TextField(blank=True, null=True)
    created_at    = models.DateTimeField(auto_now_add=True)
    file          = models.FileField(upload_to="uploads/", null=True, blank=True)
    is_working    = models.BooleanField(default=True)
    
    def get_filename(self):
        return os.path.basename(self.file.name)
    
class Survey(models.Model):
    author        = models.ForeignKey(Account, to_field='nickname', on_delete=models.CASCADE)
    persona_id    = models.ForeignKey(Persona, on_delete=models.CASCADE)
    title         = models.CharField(max_length=100, blank=False, null=False)
    content       = models.TextField(blank=True, null=True)
    shared        = models.BooleanField(default=True)
    
    def __str__(self):
        return self.title

    def get_messages(self):
        return Message.objects.filter(persona=self.persona_id)

    class Meta:
        ordering = ("-id",)
        
class Rating(models.Model):
    survey = models.ForeignKey(Survey, on_delete=models.CASCADE)
    user_nickname = models.CharField(max_length=100)
    score_1 = models.IntegerField()
    score_2 = models.IntegerField()
    score_3 = models.IntegerField()
    score_4 = models.IntegerField()
    score_5 = models.IntegerField()
    score_6 = models.IntegerField()
    score_7 = models.IntegerField()
    score_8 = models.IntegerField()
    score_9 = models.IntegerField()
    score_10 = models.IntegerField()
    score_11 = models.IntegerField()
    score_12 = models.IntegerField()
    score_13 = models.IntegerField()
    score_14 = models.IntegerField()
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)