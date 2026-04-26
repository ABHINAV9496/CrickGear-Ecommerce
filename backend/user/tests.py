from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status

class UserAPITests(APITestCase):
    def setUp(self):
        self.shopper = User.objects.create_user(username="test_shopper", email="shopper@test.com", password="pass123")
        self.boss = User.objects.create_superuser(username="test_boss", email="boss@test.com", password="pass123")

    def test_personal_profile(self):
        self.client.force_authenticate(user=self.shopper)
        response = self.client.get("/api/auth/profile/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_shipping_address(self):
        self.client.force_authenticate(user=self.shopper)
        response = self.client.get("/api/auth/address/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_admin_restricted_list(self):
        self.client.force_authenticate(user=self.shopper)
        response = self.client.get("/api/auth/admin/users/")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_access_list(self):
        self.client.force_authenticate(user=self.boss)
        response = self.client.get("/api/auth/admin/users/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
