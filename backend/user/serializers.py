from rest_framework import serializers
from django.contrib.auth.models import User
from .models import ShippingAddress
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model  = User
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name']

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model  = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff', 'is_active']





class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model  = ShippingAddress
        fields = ['full_name', 'phone', 'street', 'city', 'state', 'pincode']


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = UserSerializer(self.user).data
        return data
