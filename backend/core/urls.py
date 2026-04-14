"""
URL configuration for core project.
Separate apps — products, user, order — like the reference project structure.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),

    # ── Products app ─────────────────────────────────────────────
    path('api/products/', include('products.urls')),

    # ── User / Auth app ──────────────────────────────────────────
    path('api/auth/', include('user.urls')),

    # ── Order app ────────────────────────────────────────────────
    path('api/orders/', include('order.urls')),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)