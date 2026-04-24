from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status

class CartAPITests(APITestCase):
    def setUp(self):
        self.shopper = User.objects.create_user(username="test_shopper", email="shopper@test.com", password="pass123")

    def test_fetch_active_cart(self):
        self.client.force_authenticate(user=self.shopper)
        response = self.client.get("/api/cart/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
