from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views, admin_views

urlpatterns = [
    path('register/', views.RegisterView.as_view()),
    path('login/',    views.CustomTokenObtainPairView.as_view()),
    path('refresh/',  TokenRefreshView.as_view()),
    path('profile/',  views.ProfileView.as_view()),
    path('address/',  views.ShippingAddressView.as_view()),
    path('password-reset/', views.PasswordResetRequestView.as_view(), name='password_reset'),
    path('password-reset-confirm/', views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('google/', views.GoogleLoginView.as_view(), name='google_login'),
    path('admin/users/', admin_views.AdminUserListView.as_view(), name='admin-user-list'),
    path('admin/users/<int:pk>/', admin_views.AdminUserDetailView.as_view(), name='admin-user-detail'),
]
