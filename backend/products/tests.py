from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Product

class ProductAPITests(APITestCase):
    def setUp(self):
        self.boss = User.objects.create_superuser(username="test_boss", email="boss@test.com", password="pass123")
        self.product = Product.objects.create(
            name="Test Bat",
            category="Bats",
            price=5000,
            stock=10,
            image_key="bat1"
        )

    def test_public_product_list(self):
        # Anonymous users can see products
        response = self.client.get("/api/products/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_admin_dashboard_stats(self):
        # Admin can see stats
        self.client.force_authenticate(user=self.boss)
        response = self.client.get("/api/products/admin/stats/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_shopper_stats_block(self):
        # Regular user cannot see stats
        shopper = User.objects.create_user(username="shopper", password="pass123")
        self.client.force_authenticate(user=shopper)
        response = self.client.get("/api/products/admin/stats/")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
