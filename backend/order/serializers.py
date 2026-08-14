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


class ShippingAddressSerializer(serializers.Serializer):
    fullName = serializers.CharField(max_length=100)
    phone    = serializers.CharField(max_length=15)
    street   = serializers.CharField(max_length=255)
    city     = serializers.CharField(max_length=100)
    state    = serializers.CharField(max_length=100)
    pincode  = serializers.CharField(max_length=10)


class OrderItemInputSerializer(serializers.Serializer):
    id       = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)
    size     = serializers.CharField(required=False, allow_blank=True, default='')


class PlaceOrderSerializer(serializers.Serializer):
    # The client only sends which products it wants and how many.
    # Prices, names and images are always read from the database server-side,
    # so the total can never be manipulated by the client.
    items           = serializers.ListField(child=OrderItemInputSerializer(), min_length=1)
    paymentMethod   = serializers.ChoiceField(choices=['COD', 'UPI'])
    upiId           = serializers.CharField(required=False, allow_blank=True, default='')
    shippingAddress = ShippingAddressSerializer()
