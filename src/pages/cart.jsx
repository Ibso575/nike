import React from 'react';
import { motion } from 'framer-motion';
import { IoTrashOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { useCart } from '../context/cartcontext';
import { useLanguage } from '../context/languagecontext';

const Cart = () => {
  const { cart, removeFromCart } = useCart();
  const { t } = useLanguage();

  // Umumiy summani hisoblash
  const subtotal = cart.reduce((acc, item) => acc + item.price, 0);
  const delivery = subtotal > 0 ? 15.00 : 0; // Masalan, yetkazib berish narxi
  const total = subtotal + delivery;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.3 }}
      className="max-w-[1100px] mx-auto px-6 md:px-10 py-10 min-h-[70vh] bg-white dark:bg-gray-950 text-black dark:text-white transition-colors"
    >
      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* 1. Left Side: Products List */}
        <div className="flex-grow">
          <h1 className="text-2xl font-medium mb-6">{t('bag')}</h1>
          
          {cart.length === 0 ? (
            <div className="py-10">
              <p className="text-gray-500 dark:text-gray-400 mb-4">{t('noProductsCart')}</p>
              <Link title="Shop" to="/" className="underline font-bold hover:text-gray-600 dark:hover:text-gray-300 transition-colors">{t('startShopping')}</Link>
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              {cart.map((item, index) => (
                <div key={`${item.id}-${index}`} className="flex gap-4 md:gap-6 border-b border-gray-100 dark:border-gray-800 pb-8">
                  {/* Product Image */}
                  <div className="w-24 h-24 md:w-40 md:h-40 bg-[#f5f5f5] dark:bg-gray-800 flex-shrink-0">
                    <img 
                      src={`${import.meta.env.VITE_API_URL}${item.image}`}
                      alt={item.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder.svg";
                      }}
                    />
                  </div>
                  
                  {/* Product Details */}
                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-[16px] uppercase italic">{item.name}</h3>
                        <p className="font-bold text-[16px]">${item.price}</p>
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 text-[14px]">{item.category}</p>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-4 mt-4">
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 transition"
                      >
                        <IoTrashOutline size={22} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 2. Right Side: Summary */}
        <div className="lg:w-[350px]">
          <h2 className="text-2xl font-medium mb-6">{t('summary')}</h2>
          
          <div className="flex flex-col gap-4 text-[15px]">
            <div className="flex justify-between">
              <span>{t('subtotal')}</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>{t('delivery')}</span>
              <span>{delivery === 0 ? t('free') : `$${delivery.toFixed(2)}`}</span>
            </div>
            
            <div className="flex justify-between border-t border-b border-gray-100 dark:border-gray-800 py-4 mt-2 font-bold text-[16px]">
              <span>{t('total')}</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <button 
            disabled={cart.length === 0}
            className="w-full bg-black dark:bg-white text-white dark:text-black py-5 rounded-full font-bold mt-8 hover:bg-[#333] dark:hover:bg-gray-200 transition-all disabled:bg-gray-200 dark:disabled:bg-gray-700"
          >
            {t('checkout')}
          </button>
        </div>

      </div>
    </motion.div>
  );
};

export default Cart;