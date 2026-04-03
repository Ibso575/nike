import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IoSearchOutline, IoHeartOutline, IoBagHandleOutline, IoMoon, IoSunny, IoMenuOutline, IoCloseOutline } from "react-icons/io5";
import { useCartStore } from '../stores/useCartStore';
import { useThemeStore } from '../stores/useThemeStore';
import { useLanguageStore } from '../stores/useLanguageStore';
import nikejump from '../assets/nikejump.svg';
import api from '../config/axios'; // Barcha mahsulotlarni olish uchun

const Header = () => {
  const { cart, wishlist } = useCartStore();
  const { isDark, toggleTheme } = useThemeStore();
  const language = useLanguageStore((state) => state.language);
  const toggleLanguage = useLanguageStore((state) => state.toggleLanguage);
  const t = useLanguageStore((state) => state.t);
  const [searchTerm, setSearchTerm] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 1. Sahifa yuklanganda barcha mahsulotlarni bazadan olib kelish
  useEffect(() => {
    api.get('/products')
      .then(res => setAllProducts(res.data.data))
      .catch(err => console.log("Search error:", err));
  }, []);

  // 2. Qidiruv matni o'zgarganda mahsulotlarni filtrlash
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts([]);
    } else {
      const results = allProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(results.slice(0, 5)); // Faqat dastlabki 5 ta natijani ko'rsatamiz
    }
  }, [searchTerm, allProducts]);

  return (
    <header className="w-full font-sans sticky top-0 z-50 bg-white dark:bg-gray-900 dark:text-white transition-colors">
      {/* 1. Top Mini Nav - Hidden on mobile */}
      <div className="hidden md:flex bg-[#f5f5f5] dark:bg-gray-800 px-6 md:px-12 py-1.5 justify-between items-center text-[12px] font-medium text-[#111] dark:text-white transition-colors">
        <div className="flex items-center">
          <Link to="/">
            <img src={nikejump} alt="Jordan" className="w-5 h-5 object-contain hover:opacity-70 transition" />
          </Link>
        </div>
        <div className="flex gap-4 items-center">
          <Link to="#" className="hover:text-gray-500 dark:hover:text-gray-400 transition-colors">{t('findStore')}</Link>
          <span className="text-gray-300 dark:text-gray-600">|</span>
          <Link to="/createproduct" className="hover:text-gray-500 dark:hover:text-gray-400 font-semibold text-blue-600 dark:text-blue-400 transition-colors">{t('createProduct')}</Link>
          <span className="text-gray-300 dark:text-gray-600">|</span>
          <Link to="/admin" className="hover:text-gray-500 dark:hover:text-gray-400 transition-colors">{t('signIn')}</Link>
          <span className="text-gray-300 dark:text-gray-600">|</span>
          
          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="px-3 py-1 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-[11px] font-bold uppercase"
            title={language === 'uz' ? 'Switch to English' : 'Oʻzbekchaga oʻtish'}
          >
            {language === 'uz' ? 'ENG' : 'UZ'}
          </button>
        </div>
      </div>

      {/* 2. Main Navigation */}
      <div className="bg-white dark:bg-gray-900 px-6 md:px-12 py-3 flex justify-between items-center border-b border-gray-100 dark:border-gray-800 relative transition-colors">
        {/* Nike Logo */}
        <Link to="/" className="flex-shrink-0">
          <svg height="60px" width="60px" fill="#111" viewBox="0 0 24 24" className="dark:fill-white">
            <path d="M21 8.719L7.836 14.303C6.74 14.768 5.818 15 5.075 15c-.836 0-1.445-.295-1.819-.884-.485-.76-.273-1.982.559-3.272.494-.754 1.122-1.446 1.734-2.108-.144.234-1.415 2.349-.025 3.345.275.2.666.298 1.147.298.386 0 .829-.063 1.316-.19L21 8.719z" />
          </svg>
        </Link>

        {/* Center Menu */}
        <nav className="hidden lg:flex items-center gap-6 text-[16px] font-bold">
          <Link to="/" className="text-black dark:text-white hover:text-gray-500 dark:hover:text-gray-400 transition-colors">{t('newFeatured')}</Link>
          <Link to="#" className="text-black dark:text-white hover:text-gray-500 dark:hover:text-gray-400 transition-colors">{t('men')}</Link>
          <Link to="#" className="text-black dark:text-white hover:text-gray-500 dark:hover:text-gray-400 transition-colors">{t('women')}</Link>
          <Link to="#" className="text-black dark:text-white hover:text-gray-500 dark:hover:text-gray-400 transition-colors">{t('kids')}</Link>
          <Link to="#" className="text-black dark:text-white hover:text-gray-500 dark:hover:text-gray-400 transition-colors">{t('sale')}</Link>
        </nav>

        {/* Right Side: Search & Icons */}
        <div className="flex items-center gap-3">
          {/* Hamburger Menu - Mobile Only */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition text-black dark:text-white"
            title="Menu"
          >
            {isMobileMenuOpen ? (
              <IoCloseOutline size={26} />
            ) : (
              <IoMenuOutline size={26} />
            )}
          </button>

          {/* Search Box */}
          <div className="hidden md:flex items-center bg-[#f5f5f5] dark:bg-gray-800 rounded-full px-4 py-2 hover:bg-[#e5e5e5] dark:hover:bg-gray-700 relative group transition-colors">
            <IoSearchOutline size={20} className="dark:text-white" />
            <input 
              type="text" 
              placeholder={t('search')}
              className="bg-transparent outline-none pl-2 w-32 focus:w-48 transition-all text-black dark:text-white placeholder-gray-600 dark:placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Qidiruv natijalari dropdown */}
            {filteredProducts.length > 0 && (
              <div className="absolute top-12 left-0 w-full bg-white dark:bg-gray-800 shadow-2xl rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-[100] min-w-[250px]">
                {filteredProducts.map((product) => (
                  <Link 
                    key={product.id}
                    to={`/product/${product.id}`}
                    onClick={() => setSearchTerm("")}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition border-b border-gray-50 dark:border-gray-700 last:border-none"
                  >
                    <img 
                      src={`${import.meta.env.VITE_API_URL}${product.image}`}
                      className="w-10 h-10 object-cover rounded" 
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = "/placeholder.svg";
                      }}
                    />
                    <div>
                      <p className="text-[13px] font-bold text-black dark:text-white truncate w-32">{product.name}</p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400">${product.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Wishlist */}
          <Link to="/wishlist" className="hidden md:flex relative p-2 border border-transparent dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition text-black dark:text-white">
            <IoHeartOutline size={26} />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 bg-[#ff4d4d] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link to="/cart" className="hidden md:flex relative p-2 border border-transparent dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition text-black dark:text-white">
            <IoBagHandleOutline size={26} />
            {cart.length > 0 && (
              <span className="absolute top-1 right-1 bg-black dark:bg-white text-white dark:text-black text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </Link>

          {/* Theme Toggle - Apple Style */}
          <button
            onClick={toggleTheme}
            className="hidden md:block p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all"
            title={isDark ? "Light mode" : "Dark mode"}
          >
            {isDark ? (
              <IoSunny size={26} className="text-yellow-500" />
            ) : (
              <IoMoon size={26} className="text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay - Apple Style Full Screen */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-white dark:bg-gray-950 overflow-hidden flex flex-col">
          {/* Mobile Menu Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-bold text-black dark:text-white">Menu</h2>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition text-black dark:text-white"
            >
              <IoCloseOutline size={28} />
            </button>
          </div>

          {/* Mobile Menu Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6">
            {/* Navigation Links */}
            <div className="flex flex-col gap-4">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Shopping</h3>
              
              <Link 
                to="/" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-medium text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {t('newFeatured')}
              </Link>
              
              <Link 
                to="#" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-medium text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {t('men')}
              </Link>
              
              <Link 
                to="#" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-medium text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {t('women')}
              </Link>
              
              <Link 
                to="#" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-medium text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {t('kids')}
              </Link>
              
              <Link 
                to="#" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-medium text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {t('sale')}
              </Link>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4">Account</h3>
              
              <div className="flex flex-col gap-4">
                <Link 
                  to="#" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-medium text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {t('findStore')}
                </Link>
                
                <Link 
                  to="/admin" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-medium text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {t('signIn')}
                </Link>
                
                <Link 
                  to="/createproduct" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  {t('createProduct')}
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile Menu Footer - Action Items */}
          <div className="border-t border-gray-200 dark:border-gray-800 px-6 py-6 bg-gray-50 dark:bg-gray-900">
            {/* Action Buttons Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Wishlist */}
              <Link 
                to="/wishlist" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex flex-col items-center gap-3 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="relative">
                  <IoHeartOutline size={32} className="text-black dark:text-white" />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {wishlist.length}
                    </span>
                  )}
                </div>
                <span className="text-[12px] font-medium text-black dark:text-white text-center">{t('myLikes')}</span>
              </Link>

              {/* Cart */}
              <Link 
                to="/cart" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex flex-col items-center gap-3 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="relative">
                  <IoBagHandleOutline size={32} className="text-black dark:text-white" />
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-black dark:bg-white text-white dark:text-black text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cart.length}
                    </span>
                  )}
                </div>
                <span className="text-[12px] font-medium text-black dark:text-white text-center">{t('bag')}</span>
              </Link>
            </div>

            {/* Language & Theme Buttons */}
            <div className="grid grid-cols-2 gap-4">
              {/* Language Switcher */}
              <button
                onClick={() => {
                  toggleLanguage();
                  setIsMobileMenuOpen(false);
                }}
                className="px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-[13px] font-bold uppercase"
              >
                {language === 'uz' ? 'ENG' : 'UZ'}
              </button>

              {/* Theme Toggle */}
              <button
                onClick={() => {
                  toggleTheme();
                  setIsMobileMenuOpen(false);
                }}
                className="px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-[13px] font-bold uppercase flex items-center justify-center gap-2"
              >
                {isDark ? (
                  <><IoSunny size={18} className="text-yellow-500" /> Light</>
                ) : (
                  <><IoMoon size={18} className="text-gray-700" /> Dark</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;