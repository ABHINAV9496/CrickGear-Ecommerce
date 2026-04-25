from rest_framework import serializers
from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model  = Product
        fields = [
            'id', 'name', 'description', 'price', 'old_price',
            'category', 'image_url', 'image_key', 'stock', 'sizes', 'is_available'
        ]

    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
        return obj.image_key
