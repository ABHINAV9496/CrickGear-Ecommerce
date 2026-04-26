from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Order
from .serializers import OrderSerializer


class AdminOrderListView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        try:
            orders = Order.objects.all().order_by('-created_at')
            serializer = OrderSerializer(orders, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {'detail': f'Error fetching system orders: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AdminOrderStatusUpdateView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def patch(self, request, pk):
        try:
            order = Order.objects.get(pk=pk)
            status_val = request.data.get('status')
            
            if status_val:
                order.status = status_val
                order.save()
            
            return Response(OrderSerializer(order).data)
        except Order.DoesNotExist:
            return Response({'detail': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response(
                {'detail': f'Error updating order status: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AdminOrderDeleteView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def delete(self, request, pk):
        try:
            order = Order.objects.get(pk=pk)
            order.delete()
            return Response({'detail': 'Order deleted permanently.'}, status=status.HTTP_204_NO_CONTENT)
        except Order.DoesNotExist:
            return Response({'detail': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response(
                {'detail': f'Error deleting order: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
