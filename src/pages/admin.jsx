import React, { useState, useEffect } from 'react';
import { useProductStore } from '../stores/useProductStore';
import { useThemeStore } from '../stores/useThemeStore'; 
import { Line, Bar, Doughnut, Radar, PolarArea } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { LogOut, LayoutGrid, ShoppingCart, Users, Package, TrendingUp } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

// --- UI KOMPONENTLARI ---
const StatCard = ({ isDark, title, value, icon: Icon, color }) => (
  <div className={`${isDark ? 'bg-[#1e293b] border-slate-700' : 'bg-white border-slate-200'} border rounded-[2rem] p-7 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 duration-500 group`}>
    <div className="flex justify-between items-center">
      <div>
        <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{title}</p>
        <p className={`text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{value}</p>
      </div>
      <div className={`p-4 rounded-2xl ${color} bg-opacity-10 group-hover:scale-110 transition-transform duration-500`}>
        <Icon size={28} className={color.replace('bg-', 'text-')} />
      </div>
    </div>
  </div>
);

const ChartContainer = ({ isDark, title, children }) => (
  <div className={`${isDark ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-100'} p-8 rounded-[2.5rem] border shadow-2xl transition-all duration-500`}>
    <h2 className={`mb-8 font-black text-sm uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
      {title}
    </h2>
    <div className="w-full h-[320px] flex items-center justify-center">
      {children}
    </div>
  </div>
);

const Dashboard = ({ onLogout }) => {
  const { products, fetchProducts } = useProductStore();
  const isDark = useThemeStore((state) => state.isDark);

  useEffect(() => {
    if (products.length === 0 && fetchProducts) fetchProducts();
  }, []);

  const chartColors = {
    text: isDark ? '#64748b' : '#94a3b8',
    grid: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)',
    accent: ['#6366f1', '#f472b6', '#fbbf24', '#3b82f6', '#10b981']
  };

  // --- LINE & BAR OPTIONS (X/Y SCALES) ---
  const linearOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { color: chartColors.text, usePointStyle: true, font: { size: 11, weight: '700' } } },
      tooltip: { backgroundColor: isDark ? '#1e293b' : '#fff', titleColor: isDark ? '#fff' : '#1e293b', padding: 12, borderRadius: 10 }
    },
    scales: {
      y: { grid: { color: chartColors.grid, drawBorder: false }, ticks: { color: chartColors.text } },
      x: { grid: { display: false }, ticks: { color: chartColors.text } }
    }
  };

  // --- RADIAL OPTIONS (NO X/Y SCALES - FIXES THE ERROR) ---
  // Xatoni oldini olish uchun scales qismidan x va y butunlay olib tashlandi
  const radialOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { color: chartColors.text, usePointStyle: true, font: { size: 11, weight: '700' } } }
    },
    scales: {
      r: { // Faqat radial o'qi ishlatiladi
        grid: { color: chartColors.grid },
        angleLines: { color: chartColors.grid },
        ticks: { display: false },
        pointLabels: { color: chartColors.text, font: { size: 10, weight: '700' } }
      }
    },
    cutout: '80%' // Doughnut uchun
  };

  const lineData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Performance',
      data: [65, 78, 66, 89, 76, 95, 102],
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 0
    }]
  };

  const donutData = {
    labels: ['Running', 'Basketball', 'Training', 'Lifestyle'],
    datasets: [{
      data: [35, 25, 20, 20],
      backgroundColor: chartColors.accent,
      borderWidth: 0,
      hoverOffset: 15
    }]
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0b0f1a]' : 'bg-slate-50'} p-6 md:p-12 transition-colors duration-700`}>
      <div className="max-w-7xl mx-auto">
        
        {/* Header - Light mode uchun bg-white */}
        <div className={`flex flex-col md:flex-row justify-between items-center mb-16 p-10 rounded-[3rem] transition-all duration-500 ${isDark ? 'bg-[#111827] border border-white/5 shadow-2xl' : 'bg-white shadow-xl border border-slate-100'}`}>
          <div className="flex items-center gap-6">
            <div className="bg-indigo-600 p-4 rounded-[1.5rem] shadow-2xl transform -rotate-3">
              <LayoutGrid className="text-white" size={32} />
            </div>
            <div>
              <h1 className={`text-4xl font-black tracking-tighter italic ${isDark ? 'text-white' : 'text-slate-900'}`}>DASHBOARD</h1>
              <p className={`text-[11px] font-bold uppercase tracking-[0.3em] ${isDark ? 'text-indigo-400' : 'text-indigo-500'}`}>Admin Panel</p>
            </div>
          </div>
          <button onClick={onLogout} className="px-10 py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-black transition-all shadow-lg active:scale-95">LOGOUT</button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <StatCard isDark={isDark} title="Products" value={products.length} icon={Package} color="text-indigo-500 bg-indigo-500" />
          <StatCard isDark={isDark} title="Revenue" value="$12.4k" icon={TrendingUp} color="text-emerald-500 bg-emerald-500" />
          <StatCard isDark={isDark} title="Orders" value="452" icon={ShoppingCart} color="text-amber-500 bg-amber-500" />
          <StatCard isDark={isDark} title="Users" value="1.1k" icon={Users} color="text-blue-500 bg-blue-500" />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
          <div className="lg:col-span-3">
            <ChartContainer isDark={isDark} title="Sales Velocity">
              <Line data={lineData} options={linearOptions} />
            </ChartContainer>
          </div>
          <div className="lg:col-span-2">
            <ChartContainer isDark={isDark} title="Revenue Source">
              <Bar data={{...lineData, datasets: [{...lineData.datasets[0], backgroundColor: '#10b981', borderRadius: 8}]}} options={linearOptions} />
            </ChartContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ChartContainer isDark={isDark} title="Categories">
            <Doughnut data={donutData} options={radialOptions} />
          </ChartContainer>
          <ChartContainer isDark={isDark} title="Market Sentiment">
            <Radar data={donutData} options={radialOptions} />
          </ChartContainer>
          <ChartContainer isDark={isDark} title="Inventory Spread">
            <PolarArea data={donutData} options={radialOptions} />
          </ChartContainer>
        </div>
      </div>
    </div>
  );
};

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  if (isAuthenticated) return <Dashboard onLogout={() => setIsAuthenticated(false)} />;
  return <div className="h-screen bg-[#0b0f1a] flex items-center justify-center font-black text-white text-5xl italic">NIKE ADMIN</div>;
};

export default Admin;