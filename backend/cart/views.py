from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import Cart, CartItem
from products.models import Product
from .serializers import CartSerializer, CartItemSerializer

class MyCartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            cart, _ = Cart.objects.get_or_create(user=request.user)
            serializer = CartSerializer(cart)
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {'detail': 'Failed to fetch cart. Please try again.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class CartUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_cart(self, user):
        cart, _ = Cart.objects.get_or_create(user=user)
        return cart

    def post(self, request):
        try:
            cart = self.get_cart(request.user)
            product_id = request.data.get('product_id')
            quantity = int(request.data.get('quantity', 1))
            size = request.data.get('size', '')

            if not product_id:
                return Response({'detail': 'Product ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

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

            return Response(CartSerializer(cart).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(
                {'detail': 'Failed to add item to cart. Please try again.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def put(self, request):
        try:
            cart = self.get_cart(request.user)
            item_id = request.data.get('item_id')
            quantity = int(request.data.get('quantity', 1))

            if not item_id:
                return Response({'detail': 'Item ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

            cart_item = get_object_or_404(CartItem, id=item_id, cart=cart)
            
            if quantity <= 0:
                cart_item.delete()
            else:
                cart_item.quantity = quantity
                cart_item.save()

            return Response(CartSerializer(cart).data)
        except Exception as e:
            return Response(
                {'detail': 'Failed to update cart. Please try again.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def delete(self, request):
        try:
            cart = self.get_cart(request.user)
            item_id = request.data.get('item_id')

            if not item_id:
                return Response({'detail': 'Item ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

            cart_item = get_object_or_404(CartItem, id=item_id, cart=cart)
            cart_item.delete()

            return Response(CartSerializer(cart).data)
        except Exception as e:
            return Response(
                {'detail': 'Failed to remove item from cart. Please try again.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class CartClearView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            cart, _ = Cart.objects.get_or_create(user=request.user)
            cart.items.all().delete()
            return Response({'detail': 'Cart cleared.'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {'detail': 'Failed to clear cart. Please try again.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

