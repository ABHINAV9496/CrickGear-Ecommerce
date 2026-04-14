from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

from .models import ShippingAddress
from .serializers import RegisterSerializer, UserSerializer, ShippingAddressSerializer


# ── Register ───────────────────────────────────────────────────
class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        try:
            serializer = RegisterSerializer(data=request.data)

            if not serializer.is_valid():
                return Response(
                    serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST
                )

            user    = serializer.save()
            refresh = RefreshToken.for_user(user)

            return Response({
                'user':    UserSerializer(user).data,
                'access':  str(refresh.access_token),
                'refresh': str(refresh),
            }, status=status.HTTP_201_CREATED)

        except Exception:
            return Response(
                {'detail': 'Registration failed. Please try again.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer

# ── Login ──────────────────────────────────────────────────────
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


# ── Profile ────────────────────────────────────────────────────
class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            user_data = UserSerializer(request.user).data

            # Try to get saved address — optional
            try:
                addr = request.user.shipping_address
                user_data['address'] = ShippingAddressSerializer(addr).data
            except ShippingAddress.DoesNotExist:
                user_data['address'] = None

            # Order count
            try:
                user_data['orders_count'] = request.user.orders.count()
            except Exception:
                user_data['orders_count'] = 0

            return Response(user_data)

        except Exception:
            return Response(
                {'detail': 'Failed to load profile.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# ── Shipping Address ───────────────────────────────────────────
class ShippingAddressView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            # Check if user already has an address → update it
            try:
                addr       = request.user.shipping_address
                serializer = ShippingAddressSerializer(addr, data=request.data)
            except ShippingAddress.DoesNotExist:
                serializer = ShippingAddressSerializer(data=request.data)

            if not serializer.is_valid():
                return Response(
                    serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST
                )

            serializer.save(user=request.user)
            return Response(serializer.data)

        except Exception:
            return Response(
                {'detail': 'Failed to save address.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
