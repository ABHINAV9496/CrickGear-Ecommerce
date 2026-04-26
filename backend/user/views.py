from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from .models import ShippingAddress
from .serializers import RegisterSerializer, UserSerializer, ShippingAddressSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer

 
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
            
           
            try:
                send_mail(
                    subject='Welcome to CrickGear!',
                    message=(
                        f"Hi {user.first_name or user.username},\n\n"
                        f"Welcome to CrickGear! Your account has been created successfully.\n\n"
                        f"Username: {user.username}\n\n"
                        f"You can now shop our full range of cricket equipment.\n\n"
                        f"— The CrickGear Team"
                    ),
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[user.email],
                    fail_silently=False,
                )
            except Exception as e:
                print(f"Failed to send welcome email: {e}")

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



class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        try:
            return super().post(request, *args, **kwargs)
        except Exception as e:
            return Response(
                {'detail': 'Invalid credentials or server error.'},
                status=status.HTTP_401_UNAUTHORIZED
            )


class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            user_data = UserSerializer(request.user).data

            try:
                addr = request.user.shipping_address
                user_data['address'] = ShippingAddressSerializer(addr).data
            except ShippingAddress.DoesNotExist:
                user_data['address'] = None

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


class ShippingAddressView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            try:
                addr = request.user.shipping_address
                serializer = ShippingAddressSerializer(addr)
                return Response(serializer.data)
            except ShippingAddress.DoesNotExist:
                return Response({}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {'detail': f'Error fetching address: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def post(self, request):
        try:
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

        except Exception as e:
            return Response(
                {'detail': f'Failed to save address: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class PasswordResetRequestView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'detail': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'detail': 'If an account with this email exists, a reset link has been sent.'}, status=status.HTTP_200_OK)

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        reset_link = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}"

        try:
            send_mail(
                subject='Password Reset Request',
                message=f'Click the link to reset your password: {reset_link}',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=False,
            )
        except Exception as e:
            return Response({'detail': 'Failed to send email. Ensure SMTP is correctly configured.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({'detail': 'If an account with this email exists, a reset link has been sent.'}, status=status.HTTP_200_OK)


class PasswordResetConfirmView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        uidb64 = request.data.get('uidb64')
        token = request.data.get('token')
        new_password = request.data.get('new_password')

        if not uidb64 or not token or not new_password:
            return Response({'detail': 'Missing mandatory fields.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        if user is not None and default_token_generator.check_token(user, token):
            user.set_password(new_password)
            user.save()
            return Response({'detail': 'Password has been reset successfully.'}, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'Invalid or expired token.'}, status=status.HTTP_400_BAD_REQUEST)


class GoogleLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        token = request.data.get('token')
        if not token:
            return Response({'detail': 'Google token is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            id_info = id_token.verify_oauth2_token(
                token,
                google_requests.Request(),
                settings.GOOGLE_CLIENT_ID
            )
        except ValueError:
            return Response({'detail': 'Invalid Google token.'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            return Response({'detail': 'Google authentication failed.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        email      = id_info.get('email')
        first_name = id_info.get('given_name', '')
        last_name  = id_info.get('family_name', '')

        if not email:
            return Response({'detail': 'Email not provided by Google.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'username':   email.split('@')[0],
                    'first_name': first_name,
                    'last_name':  last_name,
                }
            )

            
            if created and User.objects.filter(username=user.username).exclude(pk=user.pk).exists():
                user.username = email
                user.save()

          
            if created:
                try:
                    send_mail(
                        subject='Welcome to CrickGear!',
                        message=(
                            f"Hi {first_name or user.username},\n\n"
                            f"Welcome to CrickGear! Your account has been created successfully using Google Sign-In.\n\n"
                            f"Username: {user.username}\n\n"
                            f"You can now shop our full range of cricket equipment.\n\n"
                            f"— The CrickGear Team"
                        ),
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        recipient_list=[email],
                        fail_silently=False,
                    )
                except Exception as e:
                    print(f"Failed to send Google welcome email: {e}")

           
            refresh = RefreshToken.for_user(user)
            return Response({
                'user':    UserSerializer(user).data,
                'access':  str(refresh.access_token),
                'refresh': str(refresh),
            }, status=status.HTTP_200_OK)

        except Exception:
            return Response({'detail': 'Failed to authenticate with Google.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



