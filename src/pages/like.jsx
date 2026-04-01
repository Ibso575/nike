import React from 'react';
import { useCart } from '../context/cartcontext';
import { useLanguage } from '../context/languagecontext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Likelist = () => {
  const { wishlist, addToCart } = useCart();
  const { t } = useLanguage();

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="max-w-7xl mx-auto px-6 py-10 bg-white dark:bg-gray-950 text-black dark:text-white transition-colors min-h-screen"
    >
      <h1 className="text-2xl font-bold mb-8 italic uppercase">{t('myLikes')}</h1>
      
      {wishlist.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 dark:text-gray-400 mb-4">{t('noLikes')}</p>
          <Link to="/" className="underline font-bold hover:text-gray-600 dark:hover:text-gray-300 transition-colors">{t('startShopping')}</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div key={item.id} className="group">
              <div className="bg-[#f5f5f5] dark:bg-gray-800 aspect-square overflow-hidden relative transition-colors">
                <img 
                  src={`${import.meta.env.VITE_API_URL}${item.image}`}
                  alt={item.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/placeholder.svg";
                  }}
                />
              </div>
              <div className="mt-3">
                <h3 className="font-bold text-black dark:text-white">{item.name}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{item.category}</p>
                <p className="font-bold mt-1">${item.price}</p>
                <button 
                  onClick={() => addToCart(item)}
                  className="mt-4 w-full border border-black dark:border-white text-black dark:text-white py-2 rounded-full hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition"
                >
                  {t('addToWish')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Likelist;