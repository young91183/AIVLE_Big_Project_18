# account/model.py
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models

class MyAccountManager(BaseUserManager):
    # 일반 user 생성
    def create_user(self, userid, email, username, nickname, department, rank, age, gender, password=None):
        if not userid:
            raise ValueError("Users must have an ID")
        if not email:
            raise ValueError("Users must have an email address.")
        if not username:
            raise ValueError("Users must have an username.")
        if not nickname:
            raise ValueError("Users must have an nickname.")
        if not department:
            raise ValueError("Users must have an department.")
        if not rank:
            raise ValueError("Users must have an rank.")
        if not age:
            raise ValueError("Users must have an age.")
        if not gender:
            raise ValueError("Users must have an gender.")
        user = self.model(
            userid = userid,
            email = self.normalize_email(email),
            username = username,
            nickname = nickname,
            department = department,
            rank = rank,
            age = age,
            gender = gender
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    # 관리자 User 생성
    def create_superuser(self, userid, email, username, nickname, department, rank, age, gender, password):
        user = self.create_user(
            userid = userid,
            email = self.normalize_email(email),
            username = username,
            nickname = nickname,
            department = department,
            rank = rank,
            age = age,
            gender = gender,
            password=password
        )
        
        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user

class Account(AbstractBaseUser):
    userid = models.CharField(max_length=32, unique=True, primary_key=True)
    email = models.EmailField(verbose_name='email', max_length=60, unique=True)
    username = models.CharField(max_length=45, null=False, blank=False)
    nickname = models.CharField(max_length=45, unique=True, db_collation='utf8_bin')  # collation 변경
    department = models.CharField(max_length=45)
    rank = models.CharField(max_length=45)
    age = models.IntegerField()
    gender = models.CharField(max_length=4)
    point = models.IntegerField(default=0)
    last_login = models.DateTimeField(verbose_name='last login', auto_now=True)
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False) 
    is_superuser = models.BooleanField(default=False) 
    password_attempt_count = models.IntegerField(default=0)
    
    objects = MyAccountManager()  # 헬퍼 클래스 사용
 
    USERNAME_FIELD = 'userid'  # 로그인 ID로 사용할 필드
    REQUIRED_FIELDS = ['email', 'username', 'nickname', 'department', 'rank', 'age', 'gender']  # 필수 작성 필드

    def __str__(self):
        return self.nickname
 
    def has_perm(self, perm, obj=None):
        return self.is_admin
 
    def has_module_perms(self, app_lable):
        return True

class admin_info(models.Model):
    login_date   = models.DateTimeField(auto_now_add=True)
    count   = models.IntegerField()
    class Meta:
        ordering    =   ("login_date",)
