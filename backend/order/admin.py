from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model          = OrderItem
    extra          = 0
    readonly_fields = ['product', 'name', 'price', 'quantity', 'size', 'image']


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display  = ['id', 'user', 'total', 'status', 'payment_method', 'created_at']
    list_filter   = ['status', 'payment_method']
    search_fields = ['user__username', 'shipping_full_name', 'shipping_phone']
    readonly_fields = ['created_at']
    inlines       = [OrderItemInline]
