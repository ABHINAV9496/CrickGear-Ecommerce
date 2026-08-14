from django.contrib.auth.models import User
from decimal import Decimal
from rest_framework.test import APITestCase
from rest_framework import status
from products.models import Product
from cart.models import Cart, CartItem
from .models import Order


class OrderAPITests(APITestCase):
    def setUp(self):
        self.shopper = User.objects.create_user(username="test_shopper", email="shopper@test.com", password="pass123")
        self.boss = User.objects.create_superuser(username="test_boss", email="boss@test.com", password="pass123")
        self.product = Product.objects.create(
            name="Test Bat", price="1000.00", category="Bats", stock=5, image_key="bat1", is_available=True, sizes=[]
        )

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
        response = self.client.post("/api/orders/place/", {})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_place_order_creates_order_decrements_stock_and_clears_cart(self):
        cart = Cart.objects.create(user=self.shopper)
        CartItem.objects.create(cart=cart, product=self.product, quantity=2, size="")

        self.client.force_authenticate(user=self.shopper)
        response = self.client.post("/api/orders/place/", {
            "items": [{"id": self.product.id, "quantity": 2, "size": ""}],
            "paymentMethod": "COD",
            "upiId": "",
            "shippingAddress": {
                "fullName": "Test Shopper",
                "phone": "9999999999",
                "street": "Main St",
                "city": "City",
                "state": "State",
                "pincode": "123456",
            },
        }, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Order.objects.filter(user=self.shopper).count(), 1)

        order = Order.objects.get(user=self.shopper)
        self.assertEqual(order.total, Decimal("2000.00"))
        self.assertEqual(order.items.count(), 1)

        self.product.refresh_from_db()
        self.assertEqual(self.product.stock, 3)

        self.assertEqual(CartItem.objects.filter(cart=cart).count(), 0)
