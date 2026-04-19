import React, { useEffect, useState } from "react";
import api from "../../api";
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

const USERS_API = "/users";
const PRODUCTS_API = "/products";

const PIE_COLORS = [
  "#dc2626", // Red-600
  "#3b82f6", // Blue-500
  "#10b981", // Emerald-500
  "#f59e0b", // Amber-500
  "#8b5cf6", // Violet-500
];

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const usersRes = await api.get(USERS_API);
    const productsRes = await api.get(`${PRODUCTS_API}/?limit=1000`);

    let allOrders = [];
    usersRes.data.forEach((user) => {
      if (user.orders) {
        allOrders = allOrders.concat(user.orders);
      }
    });

    setOrders(allOrders);
    setProducts(productsRes.data.results || []);
  };

  const validOrders = orders.filter(
    (order) => order.status !== "Cancelled"
  );

  let totalRevenue = 0;
  validOrders.forEach((order) => {
    totalRevenue += order.total || 0;
  });

  const totalOrders = orders.length;
  const totalProducts = products.length;

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

  const revenueMap = {};
  validOrders.forEach((order) => {
    order.items.forEach((item) => {
      if (!revenueMap[item.category]) {
        revenueMap[item.category] = 0;
      }
      revenueMap[item.category] += item.price * item.quantity;
    });
  });

  const revenueByCategory = Object.keys(revenueMap).map((cat) => ({
    category: cat,
    revenue: revenueMap[cat],
  }));


  const categoryCount = {};
  products.forEach((product) => {
    if (!categoryCount[product.category]) {
      categoryCount[product.category] = 0;
    }
    categoryCount[product.category]++;
  });

  const productsByCategory = Object.keys(categoryCount).map((cat) => ({
    name: cat,
    value: categoryCount[cat],
  }));


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


  const recentOrders = orders
    .slice()
    .sort((a, b) => Number(b.id) - Number(a.id))
    .slice(0, 5);

  const formatOrderDateTime = (orderId) => {
    const d = new Date(Number(orderId));
    return `${d.toLocaleDateString()} • ${d.toLocaleTimeString()}`;
  };

  const tooltipStyle = {
    background: "#0a0a0a",
    border: "1px solid #444",
    color: "#fff",
    fontSize: "13px",
  };

  const pieLabel = ({ name, percent }) =>
    `${name} ${(percent * 100).toFixed(0)}%`;

  return (
    <div className="animate-fade-in-up">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-[#0a0a0a] border border-gray-800 p-6 rounded-lg relative overflow-hidden group hover:border-red-600/50 transition-colors">
          <div className="absolute top-0 left-0 w-full h-1 bg-red-600"></div>
          <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">Total Revenue</p>
          <p className="text-3xl font-bold text-white">₹{totalRevenue}</p>
        </div>

        <div className="bg-[#0a0a0a] border border-gray-800 p-6 rounded-lg relative overflow-hidden group hover:border-blue-500/50 transition-colors">
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
          <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">Total Orders</p>
          <p className="text-3xl font-bold text-white">{totalOrders}</p>
        </div>

        <div className="bg-[#0a0a0a] border border-gray-800 p-6 rounded-lg relative overflow-hidden group hover:border-green-500/50 transition-colors">
          <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
          <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">Total Products</p>
          <p className="text-3xl font-bold text-white">{totalProducts}</p>
        </div>
      </div>

      <div className="bg-[#0a0a0a] p-6 rounded-lg border border-gray-800 mb-10">
        <h2 className="text-lg font-semibold mb-6 border-b border-gray-800 pb-2 text-white">Weekly Income</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={weeklyIncome}>
            <XAxis dataKey="week" stroke="#666" tick={{fill: '#666', fontSize: 13}} />
            <YAxis stroke="#666" tick={{fill: '#666', fontSize: 13}} />
            <Tooltip contentStyle={tooltipStyle} cursor={{stroke: '#333'}} />
            <Line
              type="monotone"
              dataKey="income"
              stroke="#dc2626"
              strokeWidth={3}
              dot={{ fill: "#dc2626", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#ff1a1a' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-10">
        
        <div className="bg-[#0a0a0a] p-6 rounded-lg border border-gray-800">
          <h2 className="text-lg font-semibold mb-6 border-b border-gray-800 pb-2 text-white">Revenue by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueByCategory}>
              <XAxis dataKey="category" stroke="#666" tick={{fill: '#666', fontSize: 13}} />
              <YAxis stroke="#666" tick={{fill: '#666', fontSize: 13}} />
              <Tooltip contentStyle={tooltipStyle} cursor={{fill: '#151515'}} />
              <Bar dataKey="revenue" fill="#dc2626" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#0a0a0a] p-6 rounded-lg border border-gray-800">
          <h2 className="text-lg font-semibold mb-6 border-b border-gray-800 pb-2 text-white">Products by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={productsByCategory}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                label={pieLabel}
                labelStyle={{ fill: "#ccc", fontSize: 12 }}   
              >
                {productsByCategory.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="rgba(0,0,0,0)" />
                ))}
              </Pie>
              <Legend wrapperStyle={{ color: "#aaa", fontSize: '13px' }} iconType="circle" /> 
              <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: "#fff" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        
        <div className="bg-[#0a0a0a] p-6 rounded-lg border border-gray-800">
          <h2 className="text-lg font-semibold mb-4 border-b border-gray-800 pb-2 text-white">Top Selling Products</h2>
          <div className="flex flex-col gap-2">
            {topSelling.map((p, i) => (
              <div key={i} className="flex justify-between items-center bg-[#111] border border-gray-800 px-4 py-3 rounded">
                <span className="font-medium text-gray-200">{p.name}</span>
                <span className="text-red-500 font-bold bg-red-500/10 px-2 py-0.5 rounded text-sm">{p.sold} sold</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0a0a0a] p-6 rounded-lg border border-gray-800">
          <h2 className="text-lg font-semibold mb-4 border-b border-gray-800 pb-2 text-white">Recent Orders</h2>
          <div className="flex flex-col gap-2">
            {recentOrders.map((o) => (
              <div key={o.id} className="flex justify-between items-center bg-[#111] border border-gray-800 px-4 py-3 rounded hover:border-gray-700 transition-colors">
                <div>
                  <p className="font-bold text-gray-200">Order #{o.id.toString().slice(-5)}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    {formatOrderDateTime(o.id)}
                  </p>
                </div>
                <p className="text-green-500 text-sm font-bold bg-green-500/10 px-2 py-1 rounded">
                  ₹{o.total}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
