# CrickGear E-commerce

A full-stack cricket equipment store with a **React frontend** and a **Django REST API backend**.

This project is my first personal full-stack project. This README explains the architecture, how the app works, and how to run it — written so I can explain every part of it clearly.

---

## Tech Stack

| Layer      | Technology |
|------------|------------|
| Frontend   | React 19, Vite 7, Tailwind CSS v4, React Router 7, Axios |
| State      | React Context (`ShopContext`) |
| Backend    | Django 6, Django REST Framework (DRF) |
| Auth       | JWT (SimpleJWT) with access + refresh tokens |
| Database   | PostgreSQL |
| Docs       | Swagger / ReDoc via drf-spectacular |

---

## Project Structure

```
CrickGear-Ecommerce/
├── index.html              # Entry HTML (title, SEO meta tags)
├── package.json            # Frontend dependencies & scripts
├── vite.config.js          # Vite + Tailwind configuration
├── src/
│   ├── main.jsx            # React entry point
│   ├── App.jsx             # All routes live here
│   ├── api.js              # Axios client + JWT refresh logic
│   ├── index.css           # Tailwind + global styles
│   ├── assets/             # Static product images
│   ├── context/
│   │   └── ShopContext.jsx # Global state: user, cart, auth
│   ├── components/         # Navbar, Footer, Hero, guards, etc.
│   ├── pages/              # Home, Collection, Product, Cart, Payment...
│   └── pages/admin/        # Admin dashboard, products, users, orders
│
└── backend/
    ├── manage.py
    ├── requirements.txt
    ├── seed.py             # Loads products from seed_data.json
    ├── seed_data.json      # Safe sample product data
    └── core/               # Django project config (settings, urls)
    └── products/           # Product app (models, views, API)
    └── user/               # Auth, profiles, addresses, password reset
    └── cart/               # Shopping cart
    └── order/              # Orders & order items
    └── newsletter/         # Newsletter signups
```

### The two halves

- **Frontend (React):** runs in the browser at `http://localhost:5173`. It has no business logic — it talks to the backend through the REST API and shows the result.
- **Backend (Django):** runs at `http://localhost:8000`. It owns all data: users, products, carts, orders. The React app calls it under `/api/...`.

The frontend talks to the backend through one axios client in `src/api.js`.

---

## How the app works (the flows you'll be asked about)

### 1. Login & JWT auth

1. User submits email + password (or Google OAuth).
2. Backend verifies credentials and returns two tokens:
   - **Access token** (short-lived, 30 min) — sent on every API request in the `Authorization` header.
   - **Refresh token** (7 days) — used only to get a new access token.
3. The frontend stores both in `localStorage` and re-attaches the access token on every request via an axios **interceptor** (`src/api.js`).
4. If a request comes back `401` (token expired), the interceptor automatically calls `/auth/refresh/` with the refresh token, retries the original request, and only logs the user out if the refresh also fails.

> **Why this design?** Short-lived access tokens limit damage if one leaks, and the auto-refresh keeps the user logged in without them noticing.

### 2. Browsing products

- The Collection page calls `GET /api/products/?category=&search=&sort=&page=`.
- Filtering, sorting and pagination are all handled **server-side** by Django — the page just requests what it needs. (Try the Network tab: changing a filter sends a new request.)

### 3. Add to cart → place order

This is the money flow, and it's worth rehearsing:

1. **Add to cart** → `POST /api/cart/update/` with `{product_id, quantity, size}`. The cart is stored in the database, **not** the browser, so it follows the user across devices.
2. **Place order** → `POST /api/orders/place/` with the item ids + shipping address.
3. **Important:** the frontend sends **only** `{id, quantity, size}` per item — the backend reads the **price, name and image from the database** and computes the total itself. The client can never set a price.
4. The backend wraps everything in a **database transaction**: it locks each product row, checks the stock, decrements it, creates the order + items, and **clears the cart** — all atomically. If any product has too little stock, the whole order rolls back and the user gets a clear error.
5. Cancelling an order reverses it: stock is added back and the status becomes `Cancelled`.

> **Why this design?** Order placement is the riskiest operation (money + inventory), so it's the one place we must be strict.

### 4. Admin section

- `/admin` is only reachable by `is_staff` users — enforced both by a frontend route guard **and** by the backend (`IsAdminUser` permission) on every admin endpoint.
- Admin can: view dashboard charts/stats, add/edit/delete products, change order status (validated against allowed choices), and manage users.

---

## How to run it locally

### Backend (Django)

```bash
cd backend
python -m venv myvenv                # once
myvenv\Scripts\activate              # Windows
pip install -r requirements.txt

cp .env.example .env                 # fill in DB + email values
python manage.py migrate
python seed.py                    # optional: load 27 sample products from seed_data.json
python manage.py runserver
```

API docs are then at `http://localhost:8000/api/docs/` (Swagger) and `http://localhost:8000/api/redoc/`.

### Frontend (React)

```bash
npm install
cp .env.example .env                 # set VITE_API_URL=http://localhost:8000
npm run dev
```

Open `http://localhost:5173`.

---

## Environment variables

- Frontend (`.env`): `VITE_API_URL`, `VITE_GOOGLE_CLIENT_ID`
- Backend (`.env`): `SECRET_KEY`, `DEBUG`, `ALLOWED_HOSTS`, `DB_*`, `EMAIL_*`, `FRONTEND_URL`, `GOOGLE_CLIENT_ID`, `SECURE_*`

Never commit real `.env` values — the repo ships `.env.example` templates only.

---

## Security decisions worth mentioning

- **Server-side pricing** — order totals are computed from the DB, not trusted from the client.
- **JWT with short access tokens** + automatic refresh.
- **Database transactions + row locks** prevent overselling stock.
- **`ALLOWED_HOSTS` is explicit** (not `*`), and Basic Auth is disabled.
- **Newsletter & password reset** never reveal whether an email exists (non-enumerating responses).
- **Rate limiting on auth endpoints** — DRF `ScopedRateThrottle` (IP-based) on login, register, Google sign-in and password-reset request limits brute force and email bombing.
- **No secrets in git**: real `.env` files are ignored; `seed_data.json` contains only products (no user data).

---

## Performance

- **Route-based code splitting** — every page is `React.lazy()` loaded, so only the code for the page you visit is downloaded. The heavy `recharts` charting library is isolated in the admin dashboard chunk (main bundle ~242 kB vs ~780 kB before).
- **Vendor chunking** — `react`/`react-dom`/`react-router-dom` and `react-toastify` are split into stable, cacheable chunks.
- **Shared image helper** — one `src/utils/getProductImage.js` resolves local asset keys or remote URLs, used by all six pages that render product images.

---

## Notable API endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/register/` | Create account |
| POST | `/api/auth/login/` | Login → tokens |
| POST | `/api/auth/refresh/` | New access token |
| GET  | `/api/products/` | List/filter/sort products |
| GET  | `/api/products/<id>/` | Single product |
| GET  | `/api/cart/` | Fetch cart |
| POST/PUT/DELETE | `/api/cart/update/` | Add / update / remove item |
| POST | `/api/orders/place/` | Place order |
| GET  | `/api/orders/my/` | My orders |
| POST | `/api/orders/<id>/cancel/` | Cancel order |
| POST | `/api/newsletter/subscribe/` | Subscribe to newsletter |
