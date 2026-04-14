from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from .models import Product
from .serializers import ProductSerializer


# ── Pagination ─────────────────────────────────────────────────
class ProductPagination(PageNumberPagination):
    page_size             = 6
    page_size_query_param = 'limit'
    max_page_size         = 100


# ── Product List ───────────────────────────────────────────────
class ProductListView(generics.ListAPIView):
    serializer_class   = ProductSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class   = ProductPagination

    def get_queryset(self):
        try:
            queryset = Product.objects.filter(is_available=True)

            # Category filter
            category = self.request.query_params.get('category')
            if category and category != 'All':
                queryset = queryset.filter(category__iexact=category)

            # Search filter
            search = self.request.query_params.get('search')
            if search:
                queryset = queryset.filter(name__icontains=search)

            # Price range filter
            min_price = self.request.query_params.get('min_price')
            max_price = self.request.query_params.get('max_price')

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

            # Sort
            sort = self.request.query_params.get('sort')
            if sort == 'price_low':
                queryset = queryset.order_by('price')
            elif sort == 'price_high':
                queryset = queryset.order_by('-price')
            elif sort == 'newest':
                queryset = queryset.order_by('-id')
            else:
                queryset = queryset.order_by('id')

            return queryset

        except Exception:
            return Product.objects.filter(is_available=True).order_by('id')

    def get_serializer_context(self):
        return {'request': self.request}

    def list(self, request, *args, **kwargs):
        try:
            return super().list(request, *args, **kwargs)
        except Exception:
            return Response(
                {'detail': 'Failed to fetch products. Please try again.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# ── Product Detail ─────────────────────────────────────────────
class ProductDetailView(generics.RetrieveAPIView):
    queryset           = Product.objects.all()
    serializer_class   = ProductSerializer
    permission_classes = [permissions.AllowAny]

    def get_serializer_context(self):
        return {'request': self.request}

    def retrieve(self, request, *args, **kwargs):
        try:
            return super().retrieve(request, *args, **kwargs)
        except Product.DoesNotExist:
            return Response(
                {'detail': 'Product not found.'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception:
            return Response(
                {'detail': 'Failed to fetch product.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
