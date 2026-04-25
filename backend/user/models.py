from django.db import models
from django.contrib.auth.models import User


class ShippingAddress(models.Model):
    user     = models.OneToOneField(User, on_delete=models.CASCADE, related_name='shipping_address')
    full_name = models.CharField(max_length=100)
    phone    = models.CharField(max_length=15)
    street   = models.CharField(max_length=255)
    city     = models.CharField(max_length=100)
    state    = models.CharField(max_length=100)
    pincode  = models.CharField(max_length=10)

    def __str__(self):
        return f"{self.user.username}'s address"
