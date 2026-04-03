import React, { useState } from 'react';
import api from "../config/axios";
import { useLanguageStore } from '../stores/useLanguageStore';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const navigate = useNavigate();
  const t = useLanguageStore((state) => state.t);
  const isDark = useLanguageStore((state) => state.isDarkMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.target);
    const username = form.get("username");
    const password = form.get("password");

    if (!username || !password) {
      setError("Please enter both username and password");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/auth/login", {
        username,
        password,
      });

      localStorage.setItem("token", res.data.data.token);
      api.defaults.headers.Authorization = "Bearer " + res.data.data.token;
      
      // Redirect to admin dashboard
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Try username: admin, password: admin");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50'} p-6 transition-colors`}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} bg-opacity-80 dark:bg-opacity-80 backdrop-blur-xl rounded-3xl shadow-2xl border p-8 md:p-10`}>
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-3 rounded-full">
                <LogIn className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {t('signIn') || 'Sign In'}
            </h1>
            <p className={`text-sm mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Access your admin dashboard
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
            >
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={login} autoComplete="off" className="space-y-5">
            {/* Username Field */}
            <div>
              <label className={`block text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'} mb-2`}>
                {t('username') || 'Username'}
              </label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="text"
                name="username"
                placeholder="admin"
                required
                className={`w-full px-4 py-3 rounded-lg transition-all duration-200 border-2 focus:outline-none focus:border-indigo-500 ${
                  isDark 
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-500 focus:bg-slate-600' 
                    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-slate-50'
                }`}
              />
            </div>

            {/* Password Field */}
            <div>
              <label className={`block text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'} mb-2`}>
                {t('password') || 'Password'}
              </label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="password"
                name="password"
                placeholder="••••••••"
                required
                className={`w-full px-4 py-3 rounded-lg transition-all duration-200 border-2 focus:outline-none focus:border-indigo-500 ${
                  isDark 
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-500 focus:bg-slate-600' 
                    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-slate-50'
                }`}
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className={`flex items-center gap-2 font-medium cursor-pointer ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                <input type="checkbox" className="w-4 h-4 rounded accent-indigo-500" />
                {t('rememberMe') || 'Remember me'}
              </label>
              <Link to="#" className="text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition">
                {t('forgotPassword') || 'Forgot?'}
              </Link>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin">⏳</div>
                  Logging in...
                </>
              ) : (
                <>
                  {t('logIn') || 'Sign In'} <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </form>

          {/* Demo Credentials */}
          <div className={`mt-8 p-4 rounded-xl ${isDark ? 'bg-slate-700/50' : 'bg-blue-50'} border ${isDark ? 'border-slate-600' : 'border-blue-200'}`}>
            <p className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'} mb-2`}>
              📝 {t('demoCredentials') || 'Demo Credentials'}:
            </p>
            <div className={`text-xs space-y-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              <p><span className="font-medium">Username:</span> admin</p>
              <p><span className="font-medium">Password:</span> admin</p>
            </div>
          </div>

          {/* Footer */}
          <p className={`text-center text-xs mt-6 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {t('backToHome') || 'Back to'} <Link to="/" className="text-indigo-500 hover:text-indigo-600 font-semibold">{t('home') || 'Home'}</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
