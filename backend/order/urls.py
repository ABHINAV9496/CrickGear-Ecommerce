from django.urls import path
from . import views, admin_views

urlpatterns = [
    # --- Shopper Routes ---
    path('my/', views.MyOrdersView.as_view(), name='my-orders'),
    path('place/', views.PlaceOrderView.as_view(), name='place-order'),
    path('<int:pk>/cancel/', views.CancelOrderView.as_view(), name='cancel-order'),

    # --- Admin Routes ---
    path('admin/all/', admin_views.AdminOrderListView.as_view(), name='admin-order-list'),
    path('admin/<int:pk>/status/', admin_views.AdminOrderStatusUpdateView.as_view(), name='admin-order-status'),
    path('admin/<int:pk>/delete/', admin_views.AdminOrderDeleteView.as_view(), name='admin-order-delete'),
]