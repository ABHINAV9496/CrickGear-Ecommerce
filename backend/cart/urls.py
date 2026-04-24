from django.urls import path
from . import views

urlpatterns = [
    path('', views.MyCartView.as_view(), name='my-cart'),
    path('update/', views.CartUpdateView.as_view(), name='cart-update'),
    path('clear/', views.CartClearView.as_view(), name='cart-clear'),
]
