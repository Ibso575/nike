import React, { useState } from 'react';
import api from '../config/axios';
import { useLanguage } from '../context/languagecontext';
import { motion } from 'framer-motion';

const CreateProduct = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    stock: '',
    rating: 4.5
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Input o'zgarganda ma'lumotlarni saqlash
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Rasmni tanlash
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // FormData ob'ekti (Rasmlarni yuborish uchun shart)
    const data = new FormData();
    data.append('name', formData.name);
    data.append('category', formData.category);
    data.append('price', formData.price);
    data.append('description', formData.description);
    data.append('stock', formData.stock);
    data.append('rating', formData.rating);
    if (image) data.append('image', image);

    try {
      const response = await api.post('/products', data);
      if (response.data.message === "Success") {
        alert(t('createSuccess'));
        // Formani tozalash
        setFormData({ name: '', category: '', price: '', description: '', stock: '', rating: 4.5 });
        setImage(null);
      }
    } catch (error) {
      console.error("Xatolik:", error);
      alert(t('createError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="max-w-[600px] mx-auto px-6 py-12 bg-white dark:bg-gray-950 text-black dark:text-white transition-colors min-h-screen"
    >
      <h1 className="text-3xl font-bold mb-8 italic uppercase tracking-tighter">{t('createNewProduct')}</h1>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-bold mb-2 uppercase">{t('productName')}</label>
          <input 
            type="text" name="name" required
            className="w-full border-b-2 border-gray-200 dark:border-gray-700 bg-transparent py-3 outline-none focus:border-black dark:focus:border-white transition"
            placeholder="Nike Air Max..."
            value={formData.name} onChange={handleChange}
          />
        </div>

        {/* Category & Price */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-bold mb-2 uppercase">{t('category')}</label>
            <input 
              type="text" name="category" required
              className="w-full border-b-2 border-gray-200 dark:border-gray-700 bg-transparent py-3 outline-none focus:border-black dark:focus:border-white transition"
              placeholder="Men's Shoes"
              value={formData.category} onChange={handleChange}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-bold mb-2 uppercase">{t('price')} ($)</label>
            <input 
              type="number" name="price" required
              className="w-full border-b-2 border-gray-200 dark:border-gray-700 bg-transparent py-3 outline-none focus:border-black dark:focus:border-white transition"
              placeholder="150"
              value={formData.price} onChange={handleChange}
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-bold mb-2 uppercase">{t('description')}</label>
          <textarea 
            name="description" rows="3"
            className="w-full border-2 border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white p-3 outline-none focus:border-black dark:focus:border-white transition rounded-lg"
            placeholder="Tell us about the product..."
            value={formData.description} onChange={handleChange}
          ></textarea>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-bold mb-2 uppercase">{t('productImage')}</label>
          <input 
            type="file" accept="image/*" required
            onChange={handleImageChange}
            className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black dark:file:bg-white file:text-white dark:file:text-black hover:file:bg-gray-800 dark:hover:file:bg-gray-200 cursor-pointer"
          />
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-black dark:bg-white text-white dark:text-black py-5 rounded-full font-bold uppercase tracking-widest hover:bg-gray-800 dark:hover:bg-gray-200 transition-all disabled:bg-gray-400 dark:disabled:bg-gray-700 mt-4"
        >
          {loading ? t('creating') : t('publishProduct')}
        </button>
      </form>
    </motion.div>
  );
};

export default CreateProduct;