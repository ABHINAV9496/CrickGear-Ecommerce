from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from .models import NewsletterSignup


class NewsletterSubscribeView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = (request.data.get('email') or '').strip()

        if not email:
            return Response({'detail': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            validate_email(email)
        except ValidationError:
            return Response({'detail': 'Enter a valid email address.'}, status=status.HTTP_400_BAD_REQUEST)

        _, created = NewsletterSignup.objects.get_or_create(email=email)

        if created:
            return Response({'detail': 'Subscribed successfully.'}, status=status.HTTP_201_CREATED)

        return Response({'detail': 'You are already subscribed.'}, status=status.HTTP_200_OK)
