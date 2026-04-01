import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

// Translations
const translations = {
  uz: {
    // Navbar
    findStore: 'Do\'ko\'n topish',
    becomeMember: 'A\'zo bo\'lish',
    signUpEmail: 'Emailga obuna bo\'lish',
    sendFeedback: 'Fikr yuborish',
    newFeatured: 'Yangi va Ajoyib',
    men: 'Erkaklar',
    women: 'Ayollar',
    kids: 'Bolalar',
    sale: 'Chegirmalar',
    search: 'Qidirish',
    signIn: 'Kirish',
    createProduct: 'Mahsulot yaratish',
    
    // Products
    allProducts: 'Barcha Mahsulotlar',
    addToCart: 'Savat',
    like: 'Like',
    lowStock: 'Kam qoldi',
    noImage: 'Rasm mavjud emas',
    
    // Cart
    bag: 'Savat',
    noProductsCart: 'Savatda hozircha mahsulotlar yo\'q.',
    startShopping: 'Xaridni boshlash',
    summary: 'Jami',
    subtotal: 'Subtotal',
    delivery: 'Yetkazib berish',
    free: 'Bepul',
    total: 'Jami summa',
    checkout: 'Sotib olish',
    
    // Wishlist
    myLikes: 'Sizga yoqqanlar',
    noLikes: 'Hozircha yoqtirilgan mahsulotlar yo\'q.',
    addToWish: 'Savatga qo\'shish',
    
    // Footer
    footerText: '© 2026 Nike, Inc. Barcha huquqlar himoyalangan',
    
    // Admin
    adminPanel: 'Admin Panel',
    signInAdmin: 'Mahsulotlar va buyurtmalarni boshqarish uchun kirish',
    username: 'Foydalanuvchi nomi',
    password: 'Parol',
    logIn: 'Kirish',
    forgotPassword: 'Parolni unutdingizmi? Tizim administratori bilan bog\'laning.',
    loginError: 'Username yoki password noto\'g\'ri!',
    
    // Create Product
    createNewProduct: 'Yangi Mahsulot Yaratish',
    productName: 'Mahsulot nomi',
    category: 'Kategoriya',
    price: 'Narx',
    description: 'Tavsif',
    productImage: 'Mahsulot rasmi',
    publishProduct: 'Chop etish',
    creating: 'Yaratilmoqda...',
    createSuccess: 'Mahsulot muvaffaqiyatli yaratildi!',
    createError: 'Xatolik yuz berdi!',
    
    // Product Detail
    edit: 'Tahrir',
    delete: 'O\'chirish',
    editDetails: 'Detallarni tahrir qilish',
    back: 'Orqaga',
    image: 'Rasm',
    optional: 'ixtiyoriy',
    updateProduct: 'Mahsulotni yangilash',
    loading: 'Yuklanmoqda...',
    noProduct: 'Mahsulot topilmadi.',
    confirmDelete: 'Haqiqatan ham o\'chirmoqchimisiz?',
    deleteSuccess: 'O\'chirildi!',
    deleteError: 'O\'chirishda xatolik!',
    updateSuccess: 'Yangilandi!',
    updateError: 'Yangilashda xatolik!',
  },
  en: {
    // Navbar
    findStore: 'Find a Store',
    becomeMember: 'Become a Member',
    signUpEmail: 'Sign Up for Email',
    sendFeedback: 'Send Us Feedback',
    newFeatured: 'New & Featured',
    men: 'Men',
    women: 'Women',
    kids: 'Kids',
    sale: 'Sale',
    search: 'Search',
    signIn: 'Sign In',
    createProduct: 'Create Product',
    
    // Products
    allProducts: 'All Products',
    addToCart: 'Add to Cart',
    like: 'Like',
    lowStock: 'Low Stock',
    noImage: 'No Image',
    
    // Cart
    bag: 'Bag',
    noProductsCart: 'No products in the bag yet.',
    startShopping: 'Start Shopping',
    summary: 'Summary',
    subtotal: 'Subtotal',
    delivery: 'Estimated Delivery & Handling',
    free: 'Free',
    total: 'Total',
    checkout: 'Member Checkout',
    
    // Wishlist
    myLikes: 'My Likes',
    noLikes: 'No liked products yet.',
    addToWish: 'Add to Cart',
    
    // Footer
    footerText: '© 2026 Nike, Inc. All Rights Reserved',
    
    // Admin
    adminPanel: 'Admin Panel',
    signInAdmin: 'Sign in to manage products and orders',
    username: 'Username',
    password: 'Password',
    logIn: 'Log in',
    forgotPassword: 'Forgot password? Contact the system administrator.',
    loginError: 'Username or password is incorrect!',
    
    // Create Product
    createNewProduct: 'Create New Product',
    productName: 'Product Name',
    category: 'Category',
    price: 'Price',
    description: 'Description',
    productImage: 'Product Image',
    publishProduct: 'Publish Product',
    creating: 'Creating...',
    createSuccess: 'Product created successfully!',
    createError: 'Error creating product!',
    
    // Product Detail
    edit: 'Edit',
    delete: 'Delete',
    editDetails: 'Edit Details',
    back: 'Back',
    image: 'Image',
    optional: 'optional',
    updateProduct: 'Update Product',
    loading: 'Loading...',
    noProduct: 'Product not found.',
    confirmDelete: 'Are you sure you want to delete?',
    deleteSuccess: 'Deleted!',
    deleteError: 'Error deleting!',
    updateSuccess: 'Updated!',
    updateError: 'Error updating!',
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const savedLang = localStorage.getItem('language');
    return savedLang || 'uz';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key) => {
    return translations[language]?.[key] || translations.uz[key] || key;
  };

  const toggleLanguage = () => {
    setLanguage(language === 'uz' ? 'en' : 'uz');
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
