from django.contrib import admin
from .models import Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display  = ['id', 'name', 'category', 'price', 'stock', 'is_available']
    list_filter   = ['category', 'is_available']
    search_fields = ['name', 'category']
    list_editable = ['stock', 'is_available']
