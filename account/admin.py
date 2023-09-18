# account/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from account.models import Account
 
class AccountAdmin(UserAdmin):
    # 관리자 화면에 보여질 칼럼 지정
    list_display = ('userid', 'email', 'username', 'nickname', 'department', 'rank', 'age', 'gender','is_admin', 'is_staff', 'is_superuser', 'is_active')
    search_fields = ('userid', 'email', 'username', 'nickname', 'department', 'rank', 'age', 'gender')
    readonly_fields = ('userid', 'email', 'username', 'nickname', 'is_admin', 'is_staff', 'is_superuser')
 
    filter_horizontal = ()
    list_filter = ()
    fieldsets = ()
 
admin.site.register(Account, AccountAdmin)