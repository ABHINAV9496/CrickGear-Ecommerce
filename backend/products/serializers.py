from rest_framework import serializers
from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model  = Product
        fields = [
            'id', 'name', 'description', 'price', 'old_price',
            'category', 'image', 'stock', 'sizes', 'is_available'
        ]

    def get_image(self, obj):
        # If real image file uploaded → return full URL
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)

        # If no image file → return key like "bat1", "ball1"
        # Frontend getImageSrc() maps this to assets["bat1"]
        return obj.image_key
