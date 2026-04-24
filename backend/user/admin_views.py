from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from .serializers import UserSerializer

# ADMIN VIEWS

class AdminUserListView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        try:
            users = User.objects.all().order_by('-id')
            serializer = UserSerializer(users, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {'detail': f'Failed to fetch users: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AdminUserDetailView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
            serializer = UserSerializer(user)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response(
                {'detail': f'Error fetching user: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def patch(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
            # Handle toggling active status (blocking)
            if 'is_active' in request.data:
                user.is_active = request.data['is_active']
            
            # Allow updating other limited fields if needed
            if 'first_name' in request.data: user.first_name = request.data['first_name']
            if 'last_name' in request.data:  user.last_name = request.data['last_name']
            
            user.save()
            return Response(UserSerializer(user).data)
        except User.DoesNotExist:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response(
                {'detail': f'Error updating user: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
