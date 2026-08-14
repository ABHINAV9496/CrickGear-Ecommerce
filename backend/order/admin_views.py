from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Order
from .serializers import OrderSerializer


class AdminOrderListView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        orders = Order.objects.all().order_by('-created_at')
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)


class AdminOrderStatusUpdateView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def patch(self, request, pk):
        order = Order.objects.filter(pk=pk).first()
        if not order:
            return Response({'detail': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)

        status_val = request.data.get('status')
        valid_statuses = [choice[0] for choice in Order.STATUS_CHOICES]

        if status_val not in valid_statuses:
            return Response(
                {'detail': f'Invalid status. Choose from {valid_statuses}.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        order.status = status_val
        order.save()
        return Response(OrderSerializer(order).data)


class AdminOrderDeleteView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def delete(self, request, pk):
        order = Order.objects.filter(pk=pk).first()
        if not order:
            return Response({'detail': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)

        order.delete()
        return Response({'detail': 'Order deleted permanently.'}, status=status.HTTP_204_NO_CONTENT)
