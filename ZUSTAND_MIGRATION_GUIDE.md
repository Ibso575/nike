# Redux/Context to Zustand Migration Guide

## Overview
Your application has been successfully refactored from React Context API to **Zustand** state management. This provides:
- ✅ Simpler state management without provider hell
- ✅ Better performance (no unnecessary re-renders)
- ✅ Built-in persistence support
- ✅ Cleaner component code
- ✅ Easier debugging with devtools

---

## 📁 New Store Structure

### Location: `src/stores/`

```
stores/
├── useCartStore.js       # Cart & Wishlist state
├── useLanguageStore.js   # Language & Translations
└── useThemeStore.js      # Dark/Light theme
```

---

## 🏪 Store Details

### 1. Cart Store (`useCartStore.js`)

**States:**
- `cart` - Array of products in the cart
- `wishlist` - Array of liked products

**Actions:**
```javascript
import { useCartStore } from '../stores/useCartStore';

// Get state & actions
const { cart, wishlist, addToCart, removeFromCart, addToWishlist, removeFromWishlist, clearCart, clearWishlist } = useCartStore();

// Add product to cart
addToCart(product);

// Remove from cart
removeFromCart(productId);

// Add to wishlist
addToWishlist(product);

// Remove from wishlist
removeFromWishlist(productId);

// Clear entire cart
clearCart();

// Clear entire wishlist
clearWishlist();
```

---

### 2. Language Store (`useLanguageStore.js`)

**Features:**
- Automatic persistence to localStorage
- Support for Uzbek (uz) and English (en)
- Full translation dictionary included

**States:**
- `language` - Current language ('uz' or 'en')

**Actions:**
```javascript
import { useLanguageStore } from '../stores/useLanguageStore';

// Get state & actions
const language = useLanguageStore((state) => state.language);
const toggleLanguage = useLanguageStore((state) => state.toggleLanguage);
const t = useLanguageStore((state) => state.t);
const setLanguage = useLanguageStore((state) => state.setLanguage);

// Get translation
t('addToCart'); // Returns translated string

// Toggle between languages
toggleLanguage(); // Switches from uz to en or vice versa

// Set specific language
setLanguage('en');
```

---

### 3. Theme Store (`useThemeStore.js`)

**Features:**
- Automatic persistence to localStorage
- DOM manipulation (adds/removes 'dark' class)

**States:**
- `isDark` - Boolean for dark mode

**Actions:**
```javascript
import { useThemeStore } from '../stores/useThemeStore';

// Get state & actions
const isDark = useThemeStore((state) => state.isDark);
const toggleTheme = useThemeStore((state) => state.toggleTheme);
const setTheme = useThemeStore((state) => state.setTheme);

// Toggle theme
toggleTheme();

// Set specific theme
setTheme(true); // Enable dark mode
setTheme(false); // Enable light mode

// Initialize theme on app start (already done in main.jsx)
useThemeStore.getState().initializeTheme();
```

---

## 🔄 Migration Changes

### Before (Context API):
```javascript
import { useCart } from './context/cartcontext';
import { useLanguage } from './context/languagecontext';
import { useTheme } from './context/themecontext';

function MyComponent() {
  const { cart, addToCart } = useCart();
  const { t } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  
  return <div>...</div>;
}
```

### After (Zustand):
```javascript
import { useCartStore } from './stores/useCartStore';
import { useLanguageStore } from './stores/useLanguageStore';
import { useThemeStore } from './stores/useThemeStore';

function MyComponent() {
  const { cart, addToCart } = useCartStore();
  const t = useLanguageStore((state) => state.t);
  const { isDark, toggleTheme } = useThemeStore();
  
  return <div>...</div>;
}
```

---

## 📝 Files Updated

✅ **Entry Point:**
- `src/main.jsx` - Removed all context providers

✅ **Components:**
- `src/components/navbar.jsx` - Uses Zustand hooks

✅ **Pages:**
- `src/App.jsx` - Home page
- `src/pages/admin.jsx` - Admin login
- `src/pages/cart.jsx` - Shopping cart
- `src/pages/like.jsx` - Wishlist
- `src/pages/create.jsx` - Product creation
- `src/pages/about.jsx` - Product details

---

## 🎯 Usage Patterns

### Selecting Specific State (Optimal Performance)
```javascript
// ✅ Good - Only re-renders when cart changes
const cart = useCartStore((state) => state.cart);

// ✅ Good - Only re-renders when language changes
const t = useLanguageStore((state) => state.t);
```

### Getting Multiple Values
```javascript
// ✅ Good for multiple related states
const { cart, wishlist, addToCart } = useCartStore();

// Use selector for computed values
const cartTotal = useCartStore((state) => 
  state.cart.reduce((sum, item) => sum + item.price, 0)
);
```

### Updating State
```javascript
// Zustand creates immutable updates automatically
useCartStore.setState({ cart: [...newCart] });

// Or use actions (recommended)
useCartStore.getState().addToCart(product);
```

---

## 🔧 Advanced Features

### 1. **Persistence Middleware**
Both `useLanguageStore` and `useThemeStore` use persist middleware:
```javascript
export const useThemeStore = create(
  persist(
    (set) => ({
      // store logic
    }),
    { name: 'theme-store' } // localStorage key
  )
);
```

### 2. **Async Actions (if needed in future)**
```javascript
const useProductStore = create((set) => ({
  products: [],
  loading: false,
  
  fetchProducts: async () => {
    set({ loading: true });
    try {
      const res = await api.get('/products');
      set({ products: res.data.data, loading: false });
    } catch (error) {
      set({ loading: false });
    }
  },
}));
```

---

## 🚀 Performance Benefits

1. **No Provider Nesting** - No need for context provider wrappers
2. **Selective Re-renders** - Components only re-render on state changes they use
3. **Smaller Bundle** - Zustand is ~2KB vs Context boilerplate
4. **Direct Access** - Use `.getState()` for non-reactive access
5. **Devtools Support** - Can be added easily with middleware

---

## 📦 Adding Devtools (Optional)

If you want Redux Devtools support:

```bash
npm install zustand-devtools
```

Then modify store:
```javascript
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useCartStore = create(
  devtools((set) => ({
    // store logic
  }), { name: 'CartStore' })
);
```

---

## ✅ Testing Checklist

- [x] Cart add/remove functionality works
- [x] Wishlist add/remove functionality works
- [x] Language toggle works
- [x] Theme toggle works
- [x] Persistence (language & theme) survives page refresh
- [x] All pages display translations correctly
- [x] No console errors

---

## 🎓 Learning Resources

- [Zustand Official Docs](https://github.com/pmndrs/zustand)
- [Zustand Best Practices](https://github.com/pmndrs/zustand/wiki)
- [Migration Guide](https://github.com/pmndrs/zustand/discussions)

---

## 📞 Support

If you need to add more stores or modify existing ones:

1. **Create new store** in `src/stores/`
2. **Use same pattern** as existing stores
3. **Add persistence** if data should survive page refresh
4. **Update components** to use new store

Example:
```javascript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    { name: 'user-store' }
  )
);
```

---

**Migration Complete! 🎉**
