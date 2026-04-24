from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.db.models import Sum, Count
from django.db.models.functions import TruncWeek
from order.models import Order, OrderItem
from products.models import Product
from user.models import User
import datetime

class DashboardStatsView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        try:
            # 1. Basic Totals
            total_revenue = Order.objects.exclude(status='Cancelled').aggregate(Sum('total'))['total__sum'] or 0
            total_orders = Order.objects.count()
            total_products = Product.objects.count()
            total_users = User.objects.count()

            # 2. Weekly Income (Last 4 weeks)
            weekly_income = []
            today = datetime.date.today()
            for i in range(3, -1, -1):
                start_date = today - datetime.timedelta(days=(i+1)*7)
                end_date = today - datetime.timedelta(days=i*7)
                
                income = Order.objects.exclude(status='Cancelled').filter(
                    created_at__date__gte=start_date,
                    created_at__date__lt=end_date
                ).aggregate(Sum('total'))['total__sum'] or 0
                
                weekly_income.append({
                    "week": f"Week {4-i}",
                    "income": float(income)
                })

            # 3. Revenue by Category
            category_revenue = {}
            order_items = OrderItem.objects.exclude(order__status='Cancelled').select_related('product')
            for item in order_items:
                cat = item.product.category if item.product else "Unknown"
                category_revenue[cat] = category_revenue.get(cat, 0) + (item.price * item.quantity)
            
            revenue_by_category = [{"category": k, "revenue": float(v)} for k, v in category_revenue.items()]

            # 4. Products by Category
            products_by_cat_data = Product.objects.values('category').annotate(count=Count('id'))
            products_by_category = [{"name": item['category'], "value": item['count']} for item in products_by_cat_data]

            # 5. Top Selling Products
            top_selling_data = OrderItem.objects.exclude(order__status='Cancelled').values('name').annotate(sold=Sum('quantity')).order_by('-sold')[:5]
            top_selling = [{"name": item['name'], "sold": item['sold']} for item in top_selling_data]

            # 6. Recent Orders
            recent_orders_data = Order.objects.all().order_by('-created_at')[:5]
            recent_orders = []
            for o in recent_orders_data:
                recent_orders.append({
                    "id": o.id,
                    "userName": o.user.username,
                    "total": float(o.total),
                    "status": o.status,
                    "date": o.created_at.strftime("%Y-%m-%d %H:%M:%S")
                })

            return Response({
                "totalRevenue": float(total_revenue),
                "totalOrders": total_orders,
                "totalProducts": total_products,
                "totalUsers": total_users,
                "weeklyIncome": weekly_income,
                "revenueByCategory": revenue_by_category,
                "productsByCategory": products_by_category,
                "topSelling": top_selling,
                "recentOrders": recent_orders
            })

        except Exception as e:
            return Response(
                {"detail": f"Failed to generate dashboard statistics: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
