import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../config/axios';
import { useLanguageStore } from '../stores/useLanguageStore';
import { useProductStore } from '../stores/useProductStore';
// 1. Yangi theme store-ni import qilamiz
import { useThemeStore } from '../stores/useThemeStore'; 
import { IoTrashOutline, IoCreateOutline, IoCloseOutline, IoChevronBackOutline } from "react-icons/io5";
import { motion } from 'framer-motion';

const About = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const t = useLanguageStore((state) => state.t);
  const { updateProduct, deleteProduct } = useProductStore();
  
  // 2. Theme store-dan isDark ni olamiz
  const isDark = useThemeStore((state) => state.isDark);
  const initializeTheme = useThemeStore((state) => state.initializeTheme);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({});
  const [editImage, setEditImage] = useState(null);

  // 3. Sahifa yuklanganda theme-ni tekshiramiz
  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
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
    fetchProduct();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm(t('confirmDelete') || "Are you sure?")) {
      try {
        await api.delete(`/products/${id}`);
        deleteProduct(parseInt(id));
        navigate('/');
      } catch (_err) {
        alert("Error deleting!");
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      let updateData = editData;
      if (editImage) {
        const formData = new FormData();
        Object.keys(editData).forEach(key => formData.append(key, editData[key]));
        formData.append('image', editImage);
        updateData = formData;
      }
      
      const response = await api.put(`/products/${id}`, updateData);
      const updatedProduct = response.data.data || response.data;
      
      updateProduct(parseInt(id), updatedProduct);
      setProduct(updatedProduct);
      setIsEditModalOpen(false);
      setEditImage(null);
    } catch (err) {
      alert("Error updating!");
    }
  };

  if (loading) return (
    <div className={`h-screen flex items-center justify-center font-black italic transition-colors ${isDark ? 'bg-gray-950 text-white' : 'bg-white text-black'}`}>
      NIKE / {t('loading')}
    </div>
  );

  if (!product) return (
    <div className={`h-screen flex items-center justify-center font-bold transition-colors ${isDark ? 'bg-gray-950 text-white' : 'bg-white text-black'}`}>
      {t('noProduct')}
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-950 text-white' : 'bg-white text-black'}`}
    >
      <div className="max-w-[1200px] mx-auto p-6 md:p-12">
        <button 
          onClick={() => navigate(-1)} 
          className={`flex items-center gap-1 mb-8 font-bold uppercase text-[10px] tracking-widest hover:opacity-70 transition-opacity ${isDark ? 'text-white' : 'text-black'}`}
        >
          <IoChevronBackOutline /> {t('back')}
        </button>

        <div className="flex flex-col md:flex-row gap-12">
          <div className={`flex-1 aspect-square rounded-2xl overflow-hidden transition-colors ${isDark ? 'bg-gray-900' : 'bg-[#f5f5f5]'}`}>
            <img 
              src={product.image?.startsWith('http') ? product.image : `${import.meta.env.VITE_API_URL}${product.image}`} 
              alt={product.name} 
              className="w-full h-full object-contain p-8"
              onError={(e) => { e.target.src = "/placeholder.svg"; }}
            />
          </div>

          <div className="flex-1">
            <h1 className="text-5xl font-black uppercase italic mb-4 tracking-tighter leading-none">{product.name}</h1>
            <p className={`mb-6 font-medium text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{product.category}</p>
            <p className="text-3xl font-bold mb-10 italic">${product.price}</p>
            
            <div className="flex gap-4">
              <button 
                onClick={() => setIsEditModalOpen(true)} 
                className={`flex-1 py-5 rounded-full font-bold uppercase transition flex items-center justify-center gap-2 ${
                  isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-zinc-800'
                }`}
              >
                <IoCreateOutline size={20}/> {t('edit')}
              </button>
              <button 
                onClick={handleDelete} 
                className="flex-1 border-2 border-red-600 text-red-600 py-5 rounded-full font-bold uppercase hover:bg-red-600 hover:text-white transition flex items-center justify-center gap-2"
              >
                <IoTrashOutline size={20}/> {t('delete')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL EDIT */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className={`w-full max-w-[500px] rounded-[40px] p-10 relative transition-colors ${isDark ? 'bg-gray-900 border border-gray-800' : 'bg-white'}`}>
            <button onClick={() => setIsEditModalOpen(false)} className="absolute top-8 right-8">
              <IoCloseOutline size={30} className={isDark ? 'text-white' : 'text-black'} />
            </button>
            
            <h2 className={`text-3xl font-black italic uppercase mb-8 ${isDark ? 'text-white' : 'text-black'}`}>{t('editDetails')}</h2>
            
            <form onSubmit={handleUpdate} className="flex flex-col gap-6">
              <input 
                className={`border-b-2 bg-transparent py-3 outline-none font-bold transition-colors ${
                  isDark ? 'border-gray-700 text-white focus:border-white' : 'border-gray-100 text-black focus:border-black'
                }`} 
                value={editData.name} 
                onChange={(e) => setEditData({...editData, name: e.target.value})} 
                placeholder={t('productName')}
              />
              <input 
                className={`border-b-2 bg-transparent py-3 outline-none font-bold transition-colors ${
                  isDark ? 'border-gray-700 text-white focus:border-white' : 'border-gray-100 text-black focus:border-black'
                }`} 
                value={editData.price} 
                onChange={(e) => setEditData({...editData, price: e.target.value})} 
                placeholder={t('price')}
              />
              
              <div className="flex flex-col gap-2">
                <label className={`text-xs font-black uppercase ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('image')}</label>
                <input 
                  type="file" 
                  onChange={(e) => setEditImage(e.target.files[0])} 
                  className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
                />
              </div>

              <button className={`py-5 rounded-full font-black mt-4 uppercase transition ${
                isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-zinc-800'
              }`}>
                {t('updateProduct')}
              </button>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default About;