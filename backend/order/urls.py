from django.urls import path
from . import views

urlpatterns = [
    path('',              views.PlaceOrderView.as_view()),
    path('my/',           views.MyOrdersView.as_view()),
    path('<int:pk>/cancel/', views.CancelOrderView.as_view()),
]
