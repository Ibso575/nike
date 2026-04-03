import React, { useState, useEffect } from 'react';
import api from "../config/axios";
import { useLanguageStore } from '../stores/useLanguageStore';
import { useProductStore } from '../stores/useProductStore';
import { useNavigate } from 'react-router-dom';
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { LogOut, LayoutGrid } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = ({ onLogout }) => {
  const { products } = useProductStore();
  const t = useLanguageStore((state) => state.t);
  const isDark = useLanguageStore((state) => state.isDarkMode);

  // Sample data for charts
  const chartColors = {
    bg: isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.9)',
    border: isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(203, 213, 225, 0.5)',
    text: isDark ? '#f1f5f9' : '#334155',
    gridColor: isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(203, 213, 225, 0.2)',
  };

  // Sales Trend Data
  const salesData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Sales',
        data: [12, 19, 3, 5, 2, 3, 9],
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Product Category Distribution
  const categoryData = {
    labels: ['Electronics', 'Clothing', 'Shoes', 'Accessories', 'Sports'],
    datasets: [
      {
        label: 'Products by Category',
        data: [12, 19, 8, 15, 10],
        backgroundColor: [
          '#6366f1',
          '#ec4899',
          '#f59e0b',
          '#10b981',
          '#3b82f6',
        ],
        borderColor: chartColors.border,
        borderWidth: 2,
      },
    ],
  };

  // Stock Status
  const stockData = {
    labels: ['In Stock', 'Low Stock', 'Out of Stock'],
    datasets: [
      {
        label: 'Stock Status',
        data: [45, 25, 10],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
        borderColor: chartColors.border,
        borderWidth: 2,
      },
    ],
  };

  // Revenue by Category
  const revenueData = {
    labels: ['Electronics', 'Clothing', 'Shoes', 'Accessories', 'Sports'],
    datasets: [
      {
        label: 'Revenue ($)',
        data: [1200, 1900, 800, 1500, 1000],
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(59, 130, 246, 0.8)',
        ],
        borderColor: chartColors.border,
        borderWidth: 2,
      },
    ],
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        labels: {
          color: chartColors.text,
          font: { size: 12 },
        },
      },
      tooltip: {
        backgroundColor: isDark ? '#334155' : '#1e293b',
        padding: 12,
        titleColor: '#fff',
        bodyColor: '#fff',
      },
    },
    scales: {
      y: {
        ticks: { color: chartColors.text },
        grid: { color: chartColors.gridColor },
      },
      x: {
        ticks: { color: chartColors.text },
        grid: { color: chartColors.gridColor },
      },
    },
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-slate-50'} p-8 transition-colors`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
              <LayoutGrid className="w-8 h-8 text-indigo-500" />
              Admin Dashboard
            </h1>
            <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Welcome back! Here's your business overview.
            </p>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Products', value: products.length, color: 'indigo' },
            { label: 'Total Revenue', value: '$6,400', color: 'green' },
            { label: 'Total Orders', value: '127', color: 'blue' },
            { label: 'Avg Rating', value: '4.7★', color: 'yellow' },
          ].map((stat, i) => (
            <div
              key={i}
              className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border rounded-lg p-6 shadow-sm`}
            >
              <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {stat.label}
              </p>
              <p className={`text-2xl font-bold mt-2 text-${stat.color}-500`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Sales Trend */}
          <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border rounded-lg p-6 shadow-sm`}>
            <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Weekly Sales Trend
            </h2>
            <Line data={salesData} options={commonOptions} height={250} />
          </div>

          {/* Revenue by Category */}
          <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border rounded-lg p-6 shadow-sm`}>
            <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Revenue by Category
            </h2>
            <Bar data={revenueData} options={commonOptions} height={250} />
          </div>

          {/* Category Distribution */}
          <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border rounded-lg p-6 shadow-sm`}>
            <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Product Categories
            </h2>
            <Doughnut data={categoryData} options={commonOptions} height={250} />
          </div>

          {/* Stock Status */}
          <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border rounded-lg p-6 shadow-sm`}>
            <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Stock Status
            </h2>
            <Pie data={stockData} options={commonOptions} height={250} />
          </div>
        </div>

        {/* Recent Products Table */}
        <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border rounded-lg p-6 shadow-sm overflow-x-auto`}>
          <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Recent Products ({products.length})
          </h2>
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                <th className={`text-left py-3 px-4 font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Name</th>
                <th className={`text-left py-3 px-4 font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Category</th>
                <th className={`text-left py-3 px-4 font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Price</th>
                <th className={`text-left py-3 px-4 font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Stock</th>
                <th className={`text-left py-3 px-4 font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Rating</th>
              </tr>
            </thead>
            <tbody>
              {products.slice(0, 5).map((product) => (
                <tr key={product.id} className={`border-b ${isDark ? 'border-slate-700 hover:bg-slate-700' : 'border-slate-200 hover:bg-slate-50'}`}>
                  <td className={`py-3 px-4 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{product.name}</td>
                  <td className={`py-3 px-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{product.category}</td>
                  <td className={`py-3 px-4 font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>${product.price}</td>
                  <td className={`py-3 px-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{product.stock}</td>
                  <td className={`py-3 px-4 text-yellow-500`}>⭐ {product.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Admin = () => {
  const navigate = useNavigate();
  const t = useLanguageStore((state) => state.t);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const login = async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);

    try {
      const res = await api.post("/auth/login", {
        username: form.get("username"),
        password: form.get("password"),
      });

      localStorage.setItem("token", res.data.data.token);

      api.defaults.headers.Authorization = "Bearer " + res.data.data.token;
      setIsAuthenticated(true);
    } catch (err) {
      alert(t('loginError'));
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    api.defaults.headers.Authorization = "";
    setIsAuthenticated(false);
  };

  if (isAuthenticated) {
    return <Dashboard onLogout={handleLogout} />;
  }


  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-100 dark:from-slate-900 to-white dark:to-slate-950 p-6 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-slate-800 dark:text-white">{t('adminPanel')}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{t('signInAdmin')}</p>
        </div>

        <form autoComplete="off" className="space-y-4" action="#" onSubmit={login}>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">{t('username')}</label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">{t('password')}</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium shadow-sm hover:scale-[1.01] transition-transform dark:from-indigo-600 dark:to-purple-600"
          >
            {t('logIn')}
          </button>

          <div className="text-center text-xs text-slate-400 dark:text-slate-500 mt-2">
            {t('forgotPassword')}
          </div>
        </form>
      </div>
    </div>
    </>
  );
}

export default Admin;
