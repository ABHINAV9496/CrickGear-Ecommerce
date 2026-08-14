from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404
from .models import Product
from .serializers import ProductSerializer
from .pagination import ProductPagination


class ProductListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        queryset = Product.objects.filter(is_available=True)

        category = request.query_params.get('category')
        if category and category != 'All':
            queryset = queryset.filter(category__iexact=category)

        search = request.query_params.get('search')
        if search:
            queryset = queryset.filter(name__icontains=search)

        min_price = request.query_params.get('min_price')
        max_price = request.query_params.get('max_price')

        if min_price:
            try:
                queryset = queryset.filter(price__gte=float(min_price))
            except ValueError:
                pass

        if max_price:
            try:
                queryset = queryset.filter(price__lte=float(max_price))
            except ValueError:
                pass

        sort = request.query_params.get('sort')
        if sort == 'price_low':
            queryset = queryset.order_by('price')
        elif sort == 'price_high':
            queryset = queryset.order_by('-price')
        elif sort == 'newest':
            queryset = queryset.order_by('-id')
        else:
            queryset = queryset.order_by('id')

        paginator = ProductPagination()
        page = paginator.paginate_queryset(queryset, request)
        if page is not None:
            serializer = ProductSerializer(page, many=True, context={'request': request})
            return paginator.get_paginated_response(serializer.data)

        serializer = ProductSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        if not request.user.is_staff:
            return Response({'detail': 'Authentication required.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = ProductSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ProductDetailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, pk):
        product = get_object_or_404(Product, pk=pk)
        serializer = ProductSerializer(product, context={'request': request})
        return Response(serializer.data)

    def patch(self, request, pk):
        if not request.user.is_staff:
            return Response({'detail': 'Authentication required.'}, status=status.HTTP_403_FORBIDDEN)

        product = get_object_or_404(Product, pk=pk)
        serializer = ProductSerializer(product, data=request.data, partial=True)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response(serializer.data)

    def delete(self, request, pk):
        if not request.user.is_staff:
            return Response({'detail': 'Authentication required.'}, status=status.HTTP_403_FORBIDDEN)

        product = get_object_or_404(Product, pk=pk)
        product.delete()
        return Response({'detail': 'Product deleted.'}, status=status.HTTP_204_NO_CONTENT)
