from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from products.models import Product
from .models import Order, OrderItem
from .serializers import OrderSerializer, PlaceOrderSerializer
from django.db import transaction

class PlaceOrderView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        if request.user.is_staff:
            return Response(
                {'detail': 'Admins are not allowed to place orders.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            serializer = PlaceOrderSerializer(data=request.data)

            if not serializer.is_valid():
                return Response(
                    serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST
                )

            data  = serializer.validated_data
            addr  = data['shippingAddress']
            items = data['items']

            if not items:
                return Response(
                    {'detail': 'Cart is empty.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            for item in items:
                try:
                    product = Product.objects.get(id=item.get('id'))
                    if product.stock < item.get('quantity', 1):
                        return Response(
                            {'detail': f'Not enough stock for {product.name}. Only {product.stock} left.'},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                except Product.DoesNotExist:
                    return Response(
                        {'detail': f'Product with id {item.get("id")} not found.'},
                        status=status.HTTP_404_NOT_FOUND
                    )

            try:
                with transaction.atomic():
                    order = Order.objects.create(
                        user               = request.user,
                        total              = data['total'],
                        payment_method     = data['paymentMethod'],
                        upi_id             = data.get('upiId', ''),
                        shipping_full_name = addr.get('fullName', ''),
                        shipping_phone     = addr.get('phone', ''),
                        shipping_street    = addr.get('street', ''),
                        shipping_city      = addr.get('city', ''),
                        shipping_state     = addr.get('state', ''),
                        shipping_pincode   = addr.get('pincode', ''),
                    )

                    for item in items:
                        OrderItem.objects.create(
                            order      = order,
                            product_id = item.get('id'),
                            name       = item.get('name', ''),
                            price      = item.get('price', 0),
                            quantity   = item.get('quantity', 1),
                            size       = item.get('size') or '',
                            image      = item.get('image') or '',
                        )

                        product       = Product.objects.select_for_update().get(id=item['id'])
                        product.stock = max(0, product.stock - item['quantity'])
                        product.save()

                return Response(
                    OrderSerializer(order).data,
                    status=status.HTTP_201_CREATED
                )
            except Exception as e:
                return Response(
                    {'detail': f'Failed to create order: {str(e)}'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        except Exception as e:
            return Response(
                {'detail': f'Something went wrong: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class MyOrdersView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            orders = Order.objects.filter(user=request.user).order_by('-created_at')
            serializer = OrderSerializer(orders, many=True)
            return Response(serializer.data)
        except Exception:
            return Response(
                {'detail': 'Failed to fetch orders.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CancelOrderView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
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

        except Exception:
            return Response(
                {'detail': 'Failed to cancel order. Please try again.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )



