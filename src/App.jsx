// Bu sizning Home sahifangiz bo'ladi
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "./config/axios";
import { useCart } from "./context/cartcontext";
import { useLanguage } from "./context/languagecontext";
import { motion } from "framer-motion";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

const App = () => {
  const [product, setproduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const { addToCart, addToWishlist } = useCart();
  const { t } = useLanguage();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/products");
        setproduct(res.data.data);
        setLoading(false);
      } catch (err) {
        console.error("Mahsulotlarni yuklashda xato:", err);
        setLoading(false);
      }
    })();
  }, []);

  // Pagination hisoblash
  const totalPages = Math.ceil(product.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = product.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-xl font-medium animate-pulse">{t('loading')}</div>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-10 font-sans bg-white dark:bg-gray-950 text-black dark:text-white transition-colors">
      <h1 className="text-2xl font-bold mb-8 italic uppercase tracking-wide">
        {t('allProducts')} ({product.length})
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
              <div className="bg-[#f5f5f5] dark:bg-gray-800 aspect-square overflow-hidden relative flex items-center justify-center transition-colors">
                {item.image ? (
                  <img 
                    src={`${import.meta.env.VITE_API_URL}${item.image}`}
                    alt={item.name} 
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = "/placeholder.svg";
                    }}
                  />
                ) : (
                  <img src="/placeholder.svg" alt="no image" className="w-full h-full object-contain" />
                )}
                
                {/* Stokda kam qolgan bo'lsa ko'rsatish */}
                {item.stock < 30 && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] px-2 py-1 uppercase font-bold">
                    Kam qoldi
                  </span>
                )}
              </div>
            </Link>

            {/* 2. Mahsulot Ma'lumotlari */}
            <div className="flex flex-col flex-grow gap-1">
              <Link to={`/product/${item.id}`}>
                <h3 className="font-bold text-[15px] text-[#111] dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                  {item.name}
                </h3>
              </Link>
              <p className="text-[#7e7e7e] dark:text-gray-400 text-[13px]">{item.category}</p>
              
              {/* Reyting */}
              <div className="text-[12px] text-yellow-500 flex items-center gap-1 mt-1">
                ⭐ {item.rating || 5}
              </div>

              {/* Narx */}
              <p className="font-bold text-[16px] mt-auto pt-2">${item.price}</p>

              {/* Tugmalar */}
              <div className="flex gap-2 mt-4">
                <button 
                  onClick={() => addToCart(item)}
                  className="flex-1 border border-black dark:border-white py-2 rounded-full hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition text-sm font-bold"
                >
                  {t('addToCart')}
                </button>
                <button 
                  onClick={() => addToWishlist(item)}
                  className="flex-1 border border-black dark:border-white py-2 rounded-full hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition text-sm font-bold"
                >
                  {t('like')}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Apple Style Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-16 pb-8">
          {/* Orqagacha tugmasi */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 hover:border-gray-600 dark:hover:border-gray-400 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <IoChevronBack size={18} />
          </button>

          {/* Sahifa raqamlari */}
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              // Hamma sahifalarni ko'rsatish, lekin ekranda juda ko'p bo'lsa qisqartirish
              const showPage = totalPages <= 7 || 
                page === 1 || 
                page === totalPages || 
                Math.abs(page - currentPage) <= 2;

              if (!showPage) {
                if (page === 2 || page === totalPages - 1) {
                  return <span key={`dots-${page}`} className="px-1 text-gray-400 dark:text-gray-500">...</span>;
                }
                return null;
              }

              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 flex items-center justify-center rounded-full transition-all font-medium text-sm ${
                    currentPage === page
                      ? "bg-black dark:bg-white text-white dark:text-black"
                      : "border border-gray-300 dark:border-gray-600 hover:border-gray-600 dark:hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-white"
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          {/* Oldingaga tugmasi */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 hover:border-gray-600 dark:hover:border-gray-400 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <IoChevronForward size={18} />
          </button>

          {/* Sahifa ma'lumoti */}
          <div className="ml-4 text-sm text-gray-600 dark:text-gray-400 font-medium">
            {currentPage} / {totalPages}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
