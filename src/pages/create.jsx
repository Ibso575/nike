import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../config/axios';
import { useLanguage } from '../context/languagecontext';
import { motion } from 'framer-motion';

// Yup validatsiya sxemasi
const validationSchema = Yup.object({
  name: Yup.string()
    .min(3, 'Kamida 3 ta harf kerak')
    .required('Mahsulot nomi majburiy'),
  category: Yup.string()
    .required('Kategoriya majburiy'),
  price: Yup.number()
    .positive('Musbat son kerak')
    .required('Narx majburiy'),
  description: Yup.string(),
  stock: Yup.number()
    .min(0, 'Musbat son kerak'),
  rating: Yup.number()
    .min(0, 'Musbat son kerak')
    .max(5, 'Maksimum 5 ball'),
});

const CreateProduct = () => {
  const { t } = useLanguage();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Formik hook-i
  const formik = useFormik({
    initialValues: {
      name: '',
      category: '',
      price: '',
      description: '',
      stock: '',
      rating: 4.5
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);

      // FormData ob'ekti (Rasmlarni yuborish uchun shart)
      const data = new FormData();
      data.append('name', values.name);
      data.append('category', values.category);
      data.append('price', values.price);
      data.append('description', values.description);
      data.append('stock', values.stock);
      data.append('rating', values.rating);
      if (image) data.append('image', image);

      try {
        const response = await api.post('/products', data);
        if (response.data.message === "Success") {
          alert(t('createSuccess'));
          // Formani tozalash
          resetForm();
          setImage(null);
        }
      } catch (error) {
        console.error("Xatolik:", error);
        alert(t('createError'));
      } finally {
        setLoading(false);
      }
    }
  });

  // Rasmni tanlash va Formik-ga qo'shish
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="max-w-[600px] mx-auto px-6 py-12 bg-white dark:bg-gray-950 text-black dark:text-white transition-colors min-h-screen"
    >
      <h1 className="text-3xl font-bold mb-8 italic uppercase tracking-tighter">{t('createNewProduct')}</h1>
      
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-bold mb-2 uppercase">{t('productName')}</label>
          <input 
            type="text"
            name="name"
            className="w-full border-b-2 border-gray-200 dark:border-gray-700 bg-transparent py-3 outline-none focus:border-black dark:focus:border-white transition"
            placeholder="Nike Air Max..."
            {...formik.getFieldProps('name')}
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
          )}
        </div>

        {/* Category & Price */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-bold mb-2 uppercase">{t('category')}</label>
            <input 
              type="text"
              name="category"
              className="w-full border-b-2 border-gray-200 dark:border-gray-700 bg-transparent py-3 outline-none focus:border-black dark:focus:border-white transition"
              placeholder="Men's Shoes"
              {...formik.getFieldProps('category')}
            />
            {formik.touched.category && formik.errors.category && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.category}</p>
            )}
          </div>
          <div className="flex-1">
            <label className="block text-sm font-bold mb-2 uppercase">{t('price')} ($)</label>
            <input 
              type="number"
              name="price"
              className="w-full border-b-2 border-gray-200 dark:border-gray-700 bg-transparent py-3 outline-none focus:border-black dark:focus:border-white transition"
              placeholder="150"
              {...formik.getFieldProps('price')}
            />
            {formik.touched.price && formik.errors.price && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.price}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-bold mb-2 uppercase">{t('description')}</label>
          <textarea 
            name="description"
            rows="3"
            className="w-full border-2 border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white p-3 outline-none focus:border-black dark:focus:border-white transition rounded-lg"
            placeholder="Tell us about the product..."
            {...formik.getFieldProps('description')}
          ></textarea>
          {formik.touched.description && formik.errors.description && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.description}</p>
          )}
        </div>

        {/* Stock */}
        <div>
          <label className="block text-sm font-bold mb-2 uppercase">Stock</label>
          <input 
            type="number"
            name="stock"
            className="w-full border-b-2 border-gray-200 dark:border-gray-700 bg-transparent py-3 outline-none focus:border-black dark:focus:border-white transition"
            placeholder="10"
            {...formik.getFieldProps('stock')}
          />
          {formik.touched.stock && formik.errors.stock && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.stock}</p>
          )}
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-bold mb-2 uppercase">Rating (0-5)</label>
          <input 
            type="number"
            name="rating"
            className="w-full border-b-2 border-gray-200 dark:border-gray-700 bg-transparent py-3 outline-none focus:border-black dark:focus:border-white transition"
            placeholder="4.5"
            min="0"
            max="5"
            step="0.1"
            {...formik.getFieldProps('rating')}
          />
          {formik.touched.rating && formik.errors.rating && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.rating}</p>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-bold mb-2 uppercase">{t('productImage')}</label>
          <input 
            type="file"
            accept="image/*"
            required
            onChange={handleImageChange}
            className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black dark:file:bg-white file:text-white dark:file:text-black hover:file:bg-gray-800 dark:hover:file:bg-gray-200 cursor-pointer"
          />
          {image && <p className="text-green-600 text-sm mt-1">✓ {image.name}</p>}
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