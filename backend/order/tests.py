from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status

class OrderAPITests(APITestCase):
    def setUp(self):
        self.shopper = User.objects.create_user(username="test_shopper", email="shopper@test.com", password="pass123")
        self.boss = User.objects.create_superuser(username="test_boss", email="boss@test.com", password="pass123")

    def test_my_order_history(self):
        self.client.force_authenticate(user=self.shopper)
        response = self.client.get("/api/orders/my/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_admin_system_orders(self):
        self.client.force_authenticate(user=self.boss)
        response = self.client.get("/api/orders/admin/all/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_admin_place_order_block(self):
        self.client.force_authenticate(user=self.boss)
        response = self.client.get("/api/orders/place/")
        response = self.client.post("/api/orders/place/", {})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
