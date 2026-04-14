from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import ShippingAddress


@admin.register(ShippingAddress)
class ShippingAddressAdmin(admin.ModelAdmin):
    list_display  = ['user', 'full_name', 'phone', 'city', 'state']
    search_fields = ['user__username', 'full_name', 'city']
