from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from products.models import Product
from .models import Order, OrderItem
from .serializers import OrderSerializer, PlaceOrderSerializer


# ── Place Order ────────────────────────────────────────────────
class PlaceOrderView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
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

            # Validate cart is not empty
            if not items:
                return Response(
                    {'detail': 'Cart is empty.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Validate all products exist and have enough stock
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

            # Create the Order
            try:
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
            except Exception:
                return Response(
                    {'detail': 'Failed to create order.'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            # Create OrderItems and reduce stock
            for item in items:
                try:
                    OrderItem.objects.create(
                        order      = order,
                        product_id = item.get('id'),
                        name       = item.get('name', ''),
                        price      = item.get('price', 0),
                        quantity   = item.get('quantity', 1),
                        size       = item.get('size') or '',
                        image      = item.get('image') or '',
                    )

                    # Reduce stock
                    product       = Product.objects.get(id=item['id'])
                    product.stock = max(0, product.stock - item['quantity'])
                    product.save()

                except Product.DoesNotExist:
                    # Product deleted between validation and creation — skip
                    pass
                except Exception:
                    pass

            return Response(
                OrderSerializer(order).data,
                status=status.HTTP_201_CREATED
            )

        except Exception:
            return Response(
                {'detail': 'Failed to place order. Please try again.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# ── My Orders ──────────────────────────────────────────────────
class MyOrdersView(generics.ListAPIView):
    serializer_class   = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        try:
            return Order.objects.filter(
                user=self.request.user
            ).order_by('-created_at')
        except Exception:
            return Order.objects.none()

    def list(self, request, *args, **kwargs):
        try:
            return super().list(request, *args, **kwargs)
        except Exception:
            return Response(
                {'detail': 'Failed to fetch orders.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# ── Cancel Order ───────────────────────────────────────────────
class CancelOrderView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            # Find order — must belong to this user
            try:
                order = Order.objects.get(id=pk, user=request.user)
            except Order.DoesNotExist:
                return Response(
                    {'detail': 'Order not found.'},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Already cancelled?
            if order.status == 'Cancelled':
                return Response(
                    {'detail': 'Order is already cancelled.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Delivered cannot be cancelled
            if order.status == 'Delivered':
                return Response(
                    {'detail': 'Delivered orders cannot be cancelled.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Restore stock for each item
            for item in order.items.all():
                try:
                    if item.product:
                        item.product.stock += item.quantity
                        item.product.save()
                except Exception:
                    pass

            order.status = 'Cancelled'
            order.save()

            return Response(OrderSerializer(order).data)

        except Exception:
            return Response(
                {'detail': 'Failed to cancel order. Please try again.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
