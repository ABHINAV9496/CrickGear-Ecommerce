from rest_framework import serializers
from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model  = OrderItem
        fields = ['id', 'name', 'price', 'quantity', 'size', 'image']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    shippingAddress = serializers.SerializerMethodField()

    class Meta:
        model  = Order
        fields = [
            'id', 'total', 'status', 'payment_method', 'upi_id',
            'shippingAddress', 'created_at', 'items'
        ]

    def get_shippingAddress(self, obj):
        return {
            'fullName': obj.shipping_full_name,
            'phone':    obj.shipping_phone,
            'street':   obj.shipping_street,
            'city':     obj.shipping_city,
            'state':    obj.shipping_state,
            'pincode':  obj.shipping_pincode,
        }


class PlaceOrderSerializer(serializers.Serializer):

    items           = serializers.ListField()
    total           = serializers.DecimalField(max_digits=10, decimal_places=2)
    paymentMethod   = serializers.ChoiceField(choices=['COD', 'UPI'])
    upiId           = serializers.CharField(required=False, allow_blank=True)
    shippingAddress = serializers.DictField()
