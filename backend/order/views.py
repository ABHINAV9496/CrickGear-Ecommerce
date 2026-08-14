from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from decimal import Decimal
from django.db import transaction
from products.models import Product
from cart.models import Cart
from .models import Order, OrderItem
from .serializers import OrderSerializer, PlaceOrderSerializer


class PlaceOrderView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        if request.user.is_staff:
            return Response(
                {'detail': 'Admins are not allowed to place orders.'},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = PlaceOrderSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        data  = serializer.validated_data
        items = data['items']
        addr  = data['shippingAddress']

        try:
            with transaction.atomic():
                order_items = []
                total = Decimal('0.00')

                for item in items:
                    try:
                        product = Product.objects.select_for_update().get(id=item['id'])
                    except Product.DoesNotExist:
                        return Response(
                            {'detail': f'Product with id {item["id"]} not found.'},
                            status=status.HTTP_404_NOT_FOUND
                        )

                    if not product.is_available:
                        return Response(
                            {'detail': f'{product.name} is not available.'},
                            status=status.HTTP_400_BAD_REQUEST
                        )

                    if product.stock < item['quantity']:
                        return Response(
                            {'detail': f'Not enough stock for {product.name}. Only {product.stock} left.'},
                            status=status.HTTP_400_BAD_REQUEST
                        )

                    product.stock -= item['quantity']
                    product.save()

                    order_items.append(OrderItem(
                        product  = product,
                        name     = product.name,
                        price    = product.price,
                        quantity = item['quantity'],
                        size     = item.get('size', ''),
                        image    = product.image_key,
                    ))

                    total += product.price * item['quantity']

                order = Order.objects.create(
                    user               = request.user,
                    total              = total,
                    payment_method     = data['paymentMethod'],
                    upi_id             = data.get('upiId', ''),
                    shipping_full_name = addr['fullName'],
                    shipping_phone     = addr['phone'],
                    shipping_street    = addr['street'],
                    shipping_city      = addr['city'],
                    shipping_state     = addr['state'],
                    shipping_pincode   = addr['pincode'],
                )

                for item in order_items:
                    item.order = order
                order.items.bulk_create(order_items)

                Cart.objects.filter(user=request.user).delete()

                return Response(
                    OrderSerializer(order).data,
                    status=status.HTTP_201_CREATED
                )
        except Exception:
            return Response(
                {'detail': 'Failed to create order. Please try again.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class MyOrdersView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(user=request.user).order_by('-created_at')
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)


class CancelOrderView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            order = Order.objects.get(id=pk, user=request.user)
        except Order.DoesNotExist:
            return Response(
                {'detail': 'Order not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        if order.status == 'Cancelled':
            return Response(
                {'detail': 'Order is already cancelled.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if order.status == 'Delivered':
            return Response(
                {'detail': 'Delivered orders cannot be cancelled.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        with transaction.atomic():
            for item in order.items.select_related('product').all():
                if item.product:
                    product = Product.objects.select_for_update().get(id=item.product.id)
                    product.stock += item.quantity
                    product.save()

            order.status = 'Cancelled'
            order.save()

        return Response(OrderSerializer(order).data)
