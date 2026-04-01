import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../config/axios'; // O'zingiz yaratgan api instansiyasini import qiling
import { useLanguage } from '../context/languagecontext';
import { IoTrashOutline, IoCreateOutline, IoCloseOutline, IoChevronBackOutline } from "react-icons/io5";
import { motion } from 'framer-motion';

const About = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({});
  const [editImage, setEditImage] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      // baseURL allaqachon api.js da bor, shuning uchun faqat /products/${id} yetarli
      const res = await api.get(`/products/${id}`);
      const data = res.data.data || res.data;
      setProduct(data);
      setEditData(data);
      setLoading(false);
    } catch (err) {
      console.error("Xato:", err);
      setLoading(false);
    }
  };

  // 1. O'chirish (Delete)
  const handleDelete = async () => {
    if (window.confirm(t('confirmDelete') || "Are you sure you want to delete?")) {
      try {
        await api.delete(`/products/${id}`);
        alert(t('deleteSuccess') || "Deleted!");
        navigate('/');
      } catch (err) {
        alert(t('deleteError') || "Error deleting!");
      }
    }
  };

  // 2. Yangilash (Update)
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      let updateData = editData;
      
      // Agar rasm tanlangan bo'lsa, FormData ishlatamiz
      if (editImage) {
        const formData = new FormData();
        formData.append('name', editData.name);
        formData.append('price', editData.price);
        formData.append('category', editData.category || '');
        formData.append('description', editData.description || '');
        formData.append('stock', editData.stock || '');
        formData.append('rating', editData.rating || '');
        formData.append('image', editImage);
        updateData = formData;
      }
      
      await api.put(`/products/${id}`, updateData);
      setProduct(editData);
      setIsEditModalOpen(false);
      setEditImage(null);
      alert(t('updateSuccess') || "Updated!");
      // Yangilangan mahsulotni qaytadan yuklash
      fetchProduct();
    } catch (err) {
      alert(t('updateError') || "Error updating!");
      console.error(err);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-black italic bg-white dark:bg-gray-950 text-black dark:text-white">NIKE / {t('loading')}</div>;
  if (!product) return <div className="h-screen flex items-center justify-center font-bold bg-white dark:bg-gray-950 text-black dark:text-white">{t('noProduct')}</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-[1200px] mx-auto p-6 md:p-12 bg-white dark:bg-gray-950 text-black dark:text-white transition-colors min-h-screen">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 mb-8 font-bold uppercase text-[10px] tracking-widest hover:opacity-70 transition-opacity">
        <IoChevronBackOutline /> {t('back')}
      </button>

      <div className="flex flex-col md:flex-row gap-12">
        <div className="flex-1 bg-[#f5f5f5] dark:bg-gray-800 rounded-2xl overflow-hidden transition-colors">
          {/* Rasm yo'lini tekshirish: agar backend to'liq URL bermasa, baseURL bilan ulaymiz */}
          <img 
            src={product.image?.startsWith('http') ? product.image : `${import.meta.env.VITE_API_URL}${product.image}`} 
            alt={product.name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "/placeholder.svg";
            }}
          />
        </div>

        <div className="flex-1">
          <h1 className="text-5xl font-black uppercase italic mb-4 tracking-tighter leading-none text-black dark:text-white">{product.name}</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6 font-medium text-lg">{product.category}</p>
          <p className="text-3xl font-bold mb-10 italic">${product.price}</p>
          
          <div className="flex gap-4">
            <button onClick={() => setIsEditModalOpen(true)} className="flex-1 bg-black dark:bg-white text-white dark:text-black py-5 rounded-full font-bold uppercase hover:bg-zinc-800 dark:hover:bg-gray-200 transition">
              <IoCreateOutline size={20} className="inline mr-2"/> {t('edit')}
            </button>
            <button onClick={handleDelete} className="flex-1 border-2 border-red-600 dark:border-red-500 text-red-600 dark:text-red-500 py-5 rounded-full font-bold uppercase hover:bg-red-50 dark:hover:bg-red-950 transition">
              <IoTrashOutline size={20} className="inline mr-2"/> {t('delete')}
            </button>
          </div>
        </div>
      </div>

      {/* MODAL EDIT - CreateProduct bilan deyarli bir xil dizaynda bo'lishi kerak */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 w-full max-w-[500px] rounded-[40px] p-10 relative transition-colors">
            <button onClick={() => setIsEditModalOpen(false)} className="absolute top-8 right-8"><IoCloseOutline size={30} className="text-black dark:text-white" /></button>
            <h2 className="text-3xl font-black italic uppercase mb-8 text-black dark:text-white">{t('editDetails')}</h2>
            <form onSubmit={handleUpdate} className="flex flex-col gap-5">
              <input 
                className="border-b-2 border-gray-100 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white py-3 outline-none focus:border-black dark:focus:border-white font-bold" 
                value={editData.name} 
                onChange={(e) => setEditData({...editData, name: e.target.value})} 
                placeholder={t('productName')}
              />
              <input 
                className="border-b-2 border-gray-100 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white py-3 outline-none focus:border-black dark:focus:border-white font-bold" 
                value={editData.price} 
                onChange={(e) => setEditData({...editData, price: e.target.value})} 
                placeholder={t('price')}
              />
              <input 
                className="border-b-2 border-gray-100 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white py-3 outline-none focus:border-black dark:focus:border-white font-bold" 
                value={editData.category} 
                onChange={(e) => setEditData({...editData, category: e.target.value})} 
                placeholder={t('category')}
              />
              <div className="border-b-2 border-gray-100 dark:border-gray-600 py-3">
                <label className="text-sm font-bold text-gray-600 dark:text-gray-300 block mb-2">{t('image')} ({t('optional')})</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setEditImage(e.target.files[0])} 
                  className="w-full text-sm text-gray-600 dark:text-gray-400 file:mr-2 file:py-2 file:px-3 file:border file:border-gray-100 dark:file:border-gray-600 file:rounded file:text-sm file:font-bold hover:file:bg-gray-50 dark:hover:file:bg-gray-700"
                />
                {editImage && <p className="text-xs text-green-600 dark:text-green-400 mt-2">✓ Image selected: {editImage.name}</p>}
              </div>
              <button className="bg-black dark:bg-white text-white dark:text-black py-5 rounded-full font-black mt-4 uppercase hover:bg-zinc-800 dark:hover:bg-gray-200 transition">{t('updateProduct')}</button>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default About;