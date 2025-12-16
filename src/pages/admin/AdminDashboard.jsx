import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const USERS_API = "http://localhost:5000/users";
const PRODUCTS_API = "http://localhost:5000/products";

/* PIE COLORS */
const PIE_COLORS = [
  "#ff1a1a",
  "#ff9800",
  "#03dac6",
  "#7c4dff",
  "#4caf50",
];

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const usersRes = await axios.get(USERS_API);
    const productsRes = await axios.get(PRODUCTS_API);

    let allOrders = [];
    usersRes.data.forEach((user) => {
      if (user.orders) {
        allOrders = allOrders.concat(user.orders);
      }
    });

    setOrders(allOrders);
    setProducts(productsRes.data);
  };

  /* ================= FILTER VALID ORDERS ================= */
  // ❌ Cancelled orders should NOT count in revenue
  const validOrders = orders.filter(
    (order) => order.status !== "Cancelled"
  );

  /* ================= BASIC STATS ================= */
  let totalRevenue = 0;
  validOrders.forEach((order) => {
    totalRevenue += order.total || 0;
  });

  const totalOrders = orders.length;
  const totalProducts = products.length;

  /* ================= WEEKLY INCOME ================= */
  const weeklyIncome = [
    { week: "Week 1", income: 0 },
    { week: "Week 2", income: 0 },
    { week: "Week 3", income: 0 },
    { week: "Week 4", income: 0 },
  ];

  validOrders.forEach((order) => {
    const day = new Date(order.date).getDate();

    if (day <= 7) weeklyIncome[0].income += order.total;
    else if (day <= 14) weeklyIncome[1].income += order.total;
    else if (day <= 21) weeklyIncome[2].income += order.total;
    else weeklyIncome[3].income += order.total;
  });

  /* ================= REVENUE BY CATEGORY ================= */
  const revenueMap = {};
  validOrders.forEach((order) => {
    order.items.forEach((item) => {
      if (!revenueMap[item.category]) {
        revenueMap[item.category] = 0;
      }
      revenueMap[item.category] += item.price * item.quantity;
    });
  });

  const revenueByCategory = [];
  for (let category in revenueMap) {
    revenueByCategory.push({
      category,
      revenue: revenueMap[category],
    });
  }

  /* ================= PRODUCTS BY CATEGORY ================= */
  const categoryCount = {};
  products.forEach((product) => {
    if (!categoryCount[product.category]) {
      categoryCount[product.category] = 0;
    }
    categoryCount[product.category]++;
  });

  const productsByCategory = [];
  for (let category in categoryCount) {
    productsByCategory.push({
      name: category,
      value: categoryCount[category],
    });
  }

  /* ================= TOP SELLING ================= */
  const sellingMap = {};
  validOrders.forEach((order) => {
    order.items.forEach((item) => {
      if (!sellingMap[item.name]) {
        sellingMap[item.name] = 0;
      }
      sellingMap[item.name] += item.quantity;
    });
  });

  const topSelling = Object.keys(sellingMap)
    .map((name) => ({ name, sold: sellingMap[name] }))
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5);

  /* ================= RECENT ORDERS ================= */
  const recentOrders = orders
  .slice()
  .sort((a, b) => Number(b.id) - Number(a.id))
  .slice(0, 5);


  /* FORMAT DATE & TIME FROM ORDER ID */
  const formatOrderDateTime = (orderId) => {
    const d = new Date(Number(orderId));
    return `${d.toLocaleDateString()} • ${d.toLocaleTimeString()}`;
  };

  /* ================= STYLES ================= */
  const tooltipStyle = {
    background: "#0a0a0a",
    border: "1px solid #444",
    color: "#fff",
    fontSize: "13px",
  };

  const pieLabel = ({ name, percent }) =>
    `${name} ${(percent * 100).toFixed(0)}%`;

  return (
    <div className="text-white">

      {/* TITLE */}
      <h1 className="text-3xl font-bold text-center mb-12">
        Admin <span className="text-red-500">Dashboard</span>
      </h1>

      {/* ================= TOP CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
        <div className="bg-red-600 p-6 rounded-xl">
          <p className="text-red-200 text-sm">Total Revenue</p>
          <p className="text-3xl font-bold">₹{totalRevenue}</p>
        </div>

        <div className="bg-blue-600 p-6 rounded-xl">
          <p className="text-blue-200 text-sm">Total Orders</p>
          <p className="text-3xl font-bold">{totalOrders}</p>
        </div>

        <div className="bg-green-600 p-6 rounded-xl">
          <p className="text-green-200 text-sm">Total Products</p>
          <p className="text-3xl font-bold">{totalProducts}</p>
        </div>
      </div>

      {/* ================= WEEKLY INCOME ================= */}
      <div className="bg-[#111] p-6 rounded-xl border border-gray-700 mb-14">
        <h2 className="text-xl font-semibold mb-4">Weekly Income</h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={weeklyIncome}>
            <XAxis dataKey="week" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip contentStyle={tooltipStyle} cursor={false} />
            <Line
              type="monotone"
              dataKey="income"
              stroke="#ff1a1a"
              strokeWidth={3}
              dot={{ fill: "#ff1a1a" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ================= REVENUE + PRODUCTS ================= */}
      <div className="grid md:grid-cols-2 gap-10 mb-14">

        <div className="bg-[#111] p-6 rounded-xl border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Revenue by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueByCategory}>
              <XAxis dataKey="category" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip contentStyle={tooltipStyle} cursor={false} />
              <Bar dataKey="revenue" fill="#03dac6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#111] p-6 rounded-xl border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Products by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={productsByCategory}
                dataKey="value"
                nameKey="name"
                outerRadius={110}
                label={pieLabel}
                labelStyle={{ fill: "#fff" }}
              >
                {productsByCategory.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* ================= LISTS ================= */}
      <div className="grid md:grid-cols-2 gap-10">

        <div className="bg-[#111] p-6 rounded-xl border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Top Selling Products</h2>
          {topSelling.map((p, i) => (
            <div key={i} className="flex justify-between border-b border-gray-700 py-2">
              <span>{p.name}</span>
              <span className="text-red-500">{p.sold} sold</span>
            </div>
          ))}
        </div>

        <div className="bg-[#111] p-6 rounded-xl border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          {recentOrders.map((o) => (
            <div key={o.id} className="border-b border-gray-700 py-2">
              <p className="font-semibold">Order #{o.id}</p>
              <p className="text-gray-400 text-sm">
                {formatOrderDateTime(o.id)}
              </p>
              <p className="text-green-400 text-sm font-semibold">
                ₹{o.total}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
