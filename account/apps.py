from django.apps import AppConfig


class AccountConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    default_app_config = 'account.apps.AccountConfig'
    name = "account"
