import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IoSearchOutline, IoHeartOutline, IoBagHandleOutline, IoMoon, IoSunny } from "react-icons/io5";
import { BarChart3 } from 'lucide-react';
import { useCartStore } from '../stores/useCartStore';
import { useThemeStore } from '../stores/useThemeStore';
import { useLanguageStore } from '../stores/useLanguageStore';
import nikejump from '../assets/nikejump.svg';
import api from '../config/axios';

const Header = () => {
  const { cart, wishlist } = useCartStore();
  const { isDark, toggleTheme } = useThemeStore();
  const { language, toggleLanguage, t } = useLanguageStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    api.get('/products')
      .then(res => setAllProducts(res.data.data))
      .catch(err => console.log("Search error:", err));
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts([]);
    } else {
      const results = allProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(results.slice(0, 5));
    }
  }, [searchTerm, allProducts]);

  return (
    <header className="w-full font-sans sticky top-0 z-[100] transition-colors duration-300 shadow-sm">
      {/* 1. Top Mini Nav - Light mode uchun fondagi kontrast */}
      <div className={`hidden md:flex px-6 md:px-12 py-1.5 justify-between items-center text-[12px] font-medium transition-colors ${
        isDark ? 'bg-[#111] text-white' : 'bg-[#f5f5f5] text-[#111]'
      }`}>
        <div className="flex items-center">
          <Link to="/">
            <img 
              src={nikejump} 
              alt="Jordan" 
              className={`w-5 h-5 object-contain transition-all duration-300 ${!isDark ? 'brightness-0' : 'invert'}`} 
            />
          </Link>
        </div>
        <div className="flex gap-4 items-center">
          <Link to="#" className="hover:opacity-60">{t('findStore')}</Link>
          <span className="opacity-20">|</span>
          <Link to="/login" className="hover:opacity-60">{t('signIn')}</Link>
          <button 
            onClick={toggleLanguage} 
            className={`px-3 py-1 rounded-full border font-bold uppercase ml-2 text-[10px] transition-colors ${
              isDark ? 'border-gray-600 hover:bg-gray-800' : 'border-gray-300 hover:bg-gray-200'
            }`}
          >
            {language === 'uz' ? 'ENG' : 'UZ'}
          </button>
        </div>
      </div>

      {/* 2. Main Navigation - Logoning ko'rinishi */}
      <div className={`px-6 md:px-12 py-3 flex justify-between items-center relative transition-all duration-300 ${
        isDark ? 'bg-black/90 backdrop-blur-md border-b border-white/10' : 'bg-white/90 backdrop-blur-md border-b border-gray-100'
      }`}>
        <Link to="/" className="flex-shrink-0 group">
          <svg 
            height="60px" 
            width="60px" 
            fill={isDark ? "#fff" : "#111"} 
            viewBox="0 0 24 24" 
            className="transition-all duration-500 group-hover:scale-110"
          >
            <path d="M21 8.719L7.836 14.303C6.74 14.768 5.818 15 5.075 15c-.836 0-1.445-.295-1.819-.884-.485-.76-.273-1.982.559-3.272.494-.754 1.122-1.446 1.734-2.108-.144.234-1.415 2.349-.025 3.345.275.2.666.298 1.147.298.386 0 .829-.063 1.316-.19L21 8.719z" />
          </svg>
        </Link>

        {/* Right Side: Search & Icons */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Qidiruv qismi - Dinamik ranglar */}
          <div className={`hidden md:flex items-center rounded-full px-4 py-2 relative transition-all ${
            isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
          }`}>
            <IoSearchOutline size={20} className={isDark ? 'text-white' : 'text-gray-900'} />
            <input 
              type="text" 
              placeholder={t('search')}
              className={`bg-transparent outline-none pl-2 w-32 focus:w-48 transition-all text-sm font-medium ${
                isDark ? 'text-white placeholder:text-gray-500' : 'text-black placeholder:text-gray-400'
              }`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            {/* Qidiruv natijalari */}
            {searchTerm && (
              <div className={`absolute top-12 left-0 w-full shadow-2xl rounded-2xl border overflow-hidden z-[100] min-w-[280px] ${
                isDark ? 'bg-gray-900 border-white/10' : 'bg-white border-gray-100'
              }`}>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <Link 
                      key={product.id}
                      to={`/product/${product.id}`}
                      onClick={() => setSearchTerm("")}
                      className={`flex items-center gap-3 p-4 transition border-b last:border-none ${
                        isDark ? 'hover:bg-white/5 border-white/5' : 'hover:bg-gray-50 border-gray-50'
                      }`}
                    >
                      <img src={product.image} className="w-12 h-12 object-contain bg-gray-50 rounded-lg" alt={product.name} />
                      <div className="overflow-hidden">
                        <p className={`text-[13px] font-bold truncate ${isDark ? 'text-white' : 'text-black'}`}>{product.name}</p>
                        <p className="text-[11px] text-gray-500 font-medium">${product.price}</p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="p-6 text-center text-sm text-gray-500 italic">Hech narsa topilmadi</div>
                )}
              </div>
            )}
          </div>

          {/* Ikonkalar */}
          <div className="flex items-center gap-1 md:gap-2">
            <Link to="/wishlist" className={`relative p-2 rounded-full transition-all ${isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-black'}`}>
              <IoHeartOutline size={26} />
              {wishlist?.length > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link to="/cart" className={`relative p-2 rounded-full transition-all ${isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-black'}`}>
              <IoBagHandleOutline size={26} />
              {cart.length > 0 && (
                <span className={`absolute top-1 right-1 text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center ${
                  isDark ? 'bg-white text-black' : 'bg-black text-white'
                }`}>
                  {cart.length}
                </span>
              )}
            </Link>

            {/* Rejim almashtirgich */}
            <button 
              onClick={toggleTheme} 
              className={`p-2 rounded-full transition-all duration-500 transform hover:rotate-12 ${
                isDark ? 'hover:bg-white/10 text-yellow-400' : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              {isDark ? <IoSunny size={26} /> : <IoMoon size={26} />}
            </button>
          </div>
          
          {/* Dashboard Tugmasi */}
          <Link to="/admin" className={`hidden lg:flex items-center gap-2 px-6 py-2.5 rounded-full transition-all text-xs font-black uppercase italic tracking-tighter hover:scale-105 active:scale-95 ${
            isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'
          }`}>
            <BarChart3 size={16} /> {t('dashboard')}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;