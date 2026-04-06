import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "./config/axios";
import { useCartStore } from "./stores/useCartStore";
import { useLanguageStore } from "./stores/useLanguageStore";
import { useProductStore } from "./stores/useProductStore";
// 1. Theme store-ni import qilamiz
import { useThemeStore } from "./stores/useThemeStore"; 
import { motion } from "framer-motion";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

const App = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const { addToCart, addToWishlist } = useCartStore();
  const t = useLanguageStore((state) => state.t);
  const { products, setProducts, loading, setLoading } = useProductStore();

  // 2. Theme store-dan kerakli o'zgaruvchi va funksiyalarni olamiz
  const isDark = useThemeStore((state) => state.isDark);
  const initializeTheme = useThemeStore((state) => state.initializeTheme);

  // 3. Ilova yuklanganda va isDark o'zgarganda theme-ni tekshiramiz
  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/products");
        const productsData = res.data.data;
        setProducts(productsData);
        setLoading(false);
      } catch (err) {
        console.error("Mahsulotlarni yuklashda xato:", err);
        setLoading(false);
      }
    })();
  }, [setProducts, setLoading]);

  // Pagination hisoblash
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center h-96 ${isDark ? 'bg-gray-950 text-white' : 'bg-white text-black'}`}>
        <div className="text-xl font-medium animate-pulse">{t('loading')}</div>
      </div>
    );
  }

  return (
    // 4. Klasslarni isDark o'zgaruvchisiga to'liq bog'ladik
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-950 text-white' : 'bg-white text-black'}`}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-10 font-sans">
        <h1 className="text-2xl font-bold mb-8 italic uppercase tracking-wide">
          {t('allProducts')} ({products.length})
        </h1>
        
        {/* Mahsulotlar Grid-i */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {currentProducts.map((item) => (
            <motion.div 
              key={item.id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group cursor-pointer flex flex-col h-full"
            >
              {/* 1. Mahsulot Rasmi */}
              <Link to={`/product/${item.id}`} className="mb-4">
                <div className={`aspect-square overflow-hidden relative flex items-center justify-center transition-colors rounded-xl ${isDark ? 'bg-gray-900' : 'bg-[#f5f5f5]'}`}>
                  {item.image ? (
                    <img 
                      src={`${import.meta.env.VITE_API_URL}${item.image}`}
                      alt={item.name} 
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 p-4"
                      onError={(e) => {
                        e.target.src = "/placeholder.svg";
                      }}
                    />
                  ) : (
                    <img src="/placeholder.svg" alt="no image" className="w-full h-full object-contain p-4" />
                  )}
                  
                  {item.stock < 30 && (
                    <span className="absolute top-4 left-4 bg-red-600 text-white text-[10px] px-2 py-1 uppercase font-black">
                      Hot
                    </span>
                  )}
                </div>
              </Link>

              {/* 2. Mahsulot Ma'lumotlari */}
              <div className="flex flex-col flex-grow gap-1">
                <Link to={`/product/${item.id}`}>
                  <h3 className={`font-bold text-[15px] transition-colors ${isDark ? 'text-white group-hover:text-gray-400' : 'text-[#111] group-hover:text-gray-600'}`}>
                    {item.name}
                  </h3>
                </Link>
                <p className={`text-[13px] ${isDark ? 'text-gray-400' : 'text-[#7e7e7e]'}`}>{item.category}</p>
                
                <div className="text-[12px] text-yellow-500 flex items-center gap-1 mt-1 font-bold">
                  ⭐ {item.rating || 5}
                </div>

                <p className="font-black text-[18px] mt-auto pt-2">${item.price}</p>

                <div className="flex gap-2 mt-4">
                  <button 
                    onClick={() => addToCart(item)}
                    className={`flex-1 py-3 rounded-full transition text-xs font-black uppercase tracking-tighter border ${
                      isDark 
                      ? 'border-white bg-white text-black hover:bg-transparent hover:text-white' 
                      : 'border-black bg-black text-white hover:bg-transparent hover:text-black'
                    }`}
                  >
                    {t('addToCart')}
                  </button>
                  <button 
                    onClick={() => addToWishlist(item)}
                    className={`px-4 py-3 rounded-full transition border ${
                      isDark 
                      ? 'border-gray-700 hover:border-white' 
                      : 'border-gray-200 hover:border-black'
                    }`}
                  >
                    ❤️
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Apple Style Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-16 pb-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`w-12 h-12 flex items-center justify-center rounded-full border transition-all disabled:opacity-30 ${
                isDark ? 'border-gray-800 hover:border-gray-500' : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <IoChevronBack size={20} />
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                const showPage = totalPages <= 5 || page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;

                if (!showPage) {
                  if (page === 2 || page === totalPages - 1) return <span key={page}>...</span>;
                  return null;
                }

                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-12 h-12 flex items-center justify-center rounded-full font-bold transition-all ${
                      currentPage === page
                        ? (isDark ? "bg-white text-black" : "bg-black text-white")
                        : (isDark ? "hover:bg-gray-800" : "hover:bg-gray-100")
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`w-12 h-12 flex items-center justify-center rounded-full border transition-all disabled:opacity-30 ${
                isDark ? 'border-gray-800 hover:border-gray-500' : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <IoChevronForward size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;