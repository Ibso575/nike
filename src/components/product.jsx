import React, { useEffect, useState } from 'react';
import api from '../config/axios'; // Sizdagi axios sozlamalari

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products') // API yo'lingizni tekshiring
      .then(res => {
        // Backend'dan kelgan JSON'da ma'lumotlar 'res.data.data' ichida kelyapti
        setProducts(res.data.data); 
        setLoading(false);
      })
      .catch(err => {
        console.error("Xatolik:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-xl font-medium animate-pulse">Yuklanmoqda...</div>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-10 font-sans">
      <h1 className="text-2xl font-bold mb-8 italic uppercase tracking-wide">
        Barcha Mahsulotlar ({products.length})
      </h1>
      
      {/* Mahsulotlar Grid-i */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((item) => (
          <div key={item.id} className="group cursor-pointer flex flex-col h-full">
            
            {/* 1. Mahsulot Rasmi */}
            <div className="bg-[#f5f5f5] aspect-square overflow-hidden mb-4 relative flex items-center justify-center">
              {item.image ? (
                <img 
                  src={`${import.meta.env.VITE_API_URL}${item.image}`}
                  alt={item.name} 
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = "/placeholder.svg"; // Local placeholder
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

            {/* 2. Mahsulot Ma'lumotlari */}
            <div className="flex flex-col flex-grow gap-1">
              <h3 className="font-bold text-[15px] text-[#111] group-hover:text-gray-600 transition-colors">
                {item.name}
              </h3>
              <p className="text-[#7e7e7e] text-[13px]">{item.category}</p>
              
              {/* Reyting (Nike uslubida) */}
              <div className="text-[12px] text-yellow-500 flex items-center gap-1 mt-1">
                ⭐ {item.rating}
              </div>

              {/* Narx */}
              <p className="font-bold text-[16px] mt-auto pt-2">${item.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Product;