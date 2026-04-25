from django.urls import path
from . import views
from .admin_views import DashboardStatsView

urlpatterns = [
    path('',         views.ProductListView.as_view()),
    path('<int:pk>/', views.ProductDetailView.as_view()),
    
    # Admin Stats
    path('admin/stats/', DashboardStatsView.as_view(), name='admin-stats'),
]
