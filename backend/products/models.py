from django.db import models


class Product(models.Model):
    name        = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price       = models.DecimalField(max_digits=10, decimal_places=2)
    old_price   = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    category    = models.CharField(max_length=100)
    image       = models.ImageField(upload_to='products/', blank=True, null=True)
    image_key   = models.CharField(max_length=100, blank=True)
    stock       = models.PositiveIntegerField(default=0)
    sizes       = models.JSONField(default=list, blank=True)
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return self.name
