import React from 'react';
import api from "../config/axios";
import { useLanguage } from '../context/languagecontext';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

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
      navigate("/createproduct");
    } catch (err) {
      alert(t('loginError'));
      console.error(err);
    }
  };


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
  );}

export default Admin;
