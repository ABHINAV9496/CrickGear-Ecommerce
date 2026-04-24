import os
import django
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from products.models import Product   

def run():
    BASE_DIR  = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    file_path = os.path.join(BASE_DIR, 'CrickGear-Ecommerce', 'src', 'data', 'db.json')
    print("Reading from:", file_path)

    with open(file_path, 'r') as f:
        data = json.load(f)

    products = data.get('products', [])

    for item in products:
        Product.objects.update_or_create(
            name=item['name'],
            defaults={
                'description':  item.get('description', ''),
                'price':        item.get('price', 0),
                'old_price':    item.get('old_price'),
                'category':     item.get('category'),
                'stock':        item.get('stock', 0),
                'sizes':        item.get('sizes', []),
                'image_key':    item.get('image', ''),
                'is_available': True,
            }
        )
        print(f"  - {item['name']}")

    print(f"\n[OK] {len(products)} Products Seeded Successfully!")


run()