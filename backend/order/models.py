from django.db import models
from django.contrib.auth.models import User
from products.models import Product


class Order(models.Model):
    STATUS_CHOICES = [
        ('Placed',     'Placed'),
        ('Processing', 'Processing'),
        ('Shipped',    'Shipped'),
        ('Delivered',  'Delivered'),
        ('Cancelled',  'Cancelled'),
    ]
    PAYMENT_CHOICES = [
        ('COD', 'Cash on Delivery'),
        ('UPI', 'UPI'),
    ]

    user               = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    total              = models.DecimalField(max_digits=10, decimal_places=2)
    status             = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Placed')
    payment_method     = models.CharField(max_length=10, choices=PAYMENT_CHOICES, default='COD')
    upi_id             = models.CharField(max_length=100, blank=True)

    shipping_full_name = models.CharField(max_length=100)
    shipping_phone     = models.CharField(max_length=15)
    shipping_street    = models.CharField(max_length=255)
    shipping_city      = models.CharField(max_length=100)
    shipping_state     = models.CharField(max_length=100)
    shipping_pincode   = models.CharField(max_length=10)

    created_at         = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.id} - {self.user.username}"


class OrderItem(models.Model):
    order    = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product  = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    name     = models.CharField(max_length=200)       
    price    = models.DecimalField(max_digits=10, decimal_places=2) 
    quantity = models.PositiveIntegerField()
    size     = models.CharField(max_length=20, blank=True)
    image    = models.CharField(max_length=500, blank=True)  

    def __str__(self):
        return f"{self.quantity}x {self.name}"
