from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import Cart, CartItem
from products.models import Product
from .serializers import CartSerializer


class MyCartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)


class CartUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_cart(self, user):
        cart, _ = Cart.objects.get_or_create(user=user)
        return cart

    def get_quantity(self, request):
        try:
            return int(request.data.get('quantity', 1))
        except (TypeError, ValueError):
            return None

    def post(self, request):
        cart = self.get_cart(request.user)
        product_id = request.data.get('product_id')
        quantity = self.get_quantity(request)
        size = request.data.get('size', '')

        if not product_id:
            return Response({'detail': 'Product ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

        if quantity is None or quantity < 1:
            return Response({'detail': 'Quantity must be a positive number.'}, status=status.HTTP_400_BAD_REQUEST)

        product = get_object_or_404(Product, id=product_id)

        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            size=size,
            defaults={'quantity': quantity}
        )

        if not created:
            cart_item.quantity += quantity
            cart_item.save()
            return Response(CartSerializer(cart).data, status=status.HTTP_200_OK)

        return Response(CartSerializer(cart).data, status=status.HTTP_201_CREATED)

    def put(self, request):
        cart = self.get_cart(request.user)
        item_id = request.data.get('item_id')
        quantity = self.get_quantity(request)

        if not item_id:
            return Response({'detail': 'Item ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

        if quantity is None:
            return Response({'detail': 'Quantity must be a number.'}, status=status.HTTP_400_BAD_REQUEST)

        cart_item = get_object_or_404(CartItem, id=item_id, cart=cart)

        if quantity <= 0:
            cart_item.delete()
        else:
            cart_item.quantity = quantity
            cart_item.save()

        return Response(CartSerializer(cart).data)

    def delete(self, request):
        cart = self.get_cart(request.user)
        item_id = request.data.get('item_id')

        if not item_id:
            return Response({'detail': 'Item ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

        cart_item = get_object_or_404(CartItem, id=item_id, cart=cart)
        cart_item.delete()

        return Response(CartSerializer(cart).data)


class CartClearView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        cart.items.all().delete()
        return Response({'detail': 'Cart cleared.'}, status=status.HTTP_200_OK)
