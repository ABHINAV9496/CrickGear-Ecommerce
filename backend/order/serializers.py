from rest_framework import serializers
from .models import Order, OrderItem


# ── Order Item (read) ──────────────────────────────────────────
class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model  = OrderItem
        fields = ['id', 'name', 'price', 'quantity', 'size', 'image']


# ── Order (read) ───────────────────────────────────────────────
class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    # Convert flat shipping fields → nested object for frontend
    # Frontend expects: order.shippingAddress.fullName
    # Django stores:    order.shipping_full_name
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


# ── Place Order (write) ────────────────────────────────────────
class PlaceOrderSerializer(serializers.Serializer):
    """
    Receives order data POST from React:
    {
        items: [{id, name, price, quantity, size, image}],
        total: 1299,
        paymentMethod: "COD",
        upiId: "",
        shippingAddress: {fullName, phone, street, city, state, pincode}
    }
    """
    items           = serializers.ListField()
    total           = serializers.DecimalField(max_digits=10, decimal_places=2)
    paymentMethod   = serializers.ChoiceField(choices=['COD', 'UPI'])
    upiId           = serializers.CharField(required=False, allow_blank=True)
    shippingAddress = serializers.DictField()
