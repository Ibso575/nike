# Zustand Store Reference - Quick Guide

## How to Use Zustand Stores in Your Components

### 1. **Import the Store**
```javascript
import { useCartStore } from '../stores/useCartStore';
import { useLanguageStore } from '../stores/useLanguageStore';
import { useThemeStore } from '../stores/useThemeStore';
```

---

## 🛒 Cart Store - `useCartStore`

### Get entire state
```javascript
const store = useCartStore();
console.log(store.cart);
console.log(store.wishlist);
```

### Get specific values (recommended)
```javascript
const cart = useCartStore((state) => state.cart);
const wishlist = useCartStore((state) => state.wishlist);
```

### Get actions
```javascript
const addToCart = useCartStore((state) => state.addToCart);
const removeFromCart = useCartStore((state) => state.removeFromCart);
const addToWishlist = useCartStore((state) => state.addToWishlist);
const removeFromWishlist = useCartStore((state) => state.removeFromWishlist);
```

### Combined usage (most common)
```javascript
function MyComponent() {
  const { cart, wishlist, addToCart, removeFromCart } = useCartStore();
  
  return (
    <div>
      <p>Cart items: {cart.length}</p>
      <p>Liked items: {wishlist.length}</p>
      <button onClick={() => addToCart(product)}>Add</button>
      <button onClick={() => removeFromCart(id)}>Remove</button>
    </div>
  );
}
```

---

## 🌐 Language Store - `useLanguageStore`

### Get translated strings
```javascript
const t = useLanguageStore((state) => state.t);
console.log(t('addToCart'));     // Returns translation for current language
console.log(t('checkout'));
```

### Get current language
```javascript
const language = useLanguageStore((state) => state.language);
console.log(language); // 'uz' or 'en'
```

### Toggle language
```javascript
const toggleLanguage = useLanguageStore((state) => state.toggleLanguage);
toggleLanguage(); // Switches uz ↔️ en
```

### Set specific language
```javascript
const setLanguage = useLanguageStore((state) => state.setLanguage);
setLanguage('en');
```

### Typical component usage
```javascript
function Navbar() {
  const t = useLanguageStore((state) => state.t);
  const { language, toggleLanguage } = useLanguageStore((state) => ({
    language: state.language,
    toggleLanguage: state.toggleLanguage
  }));
  
  return (
    <div>
      <h1>{t('allProducts')}</h1>
      <p>Current: {language}</p>
      <button onClick={toggleLanguage}>
        {language === 'uz' ? 'ENG' : 'UZ'}
      </button>
    </div>
  );
}
```

---

## 🌙 Theme Store - `useThemeStore`

### Get dark mode state
```javascript
const isDark = useThemeStore((state) => state.isDark);
console.log(isDark); // true or false
```

### Toggle theme
```javascript
const toggleTheme = useThemeStore((state) => state.toggleTheme);
toggleTheme(); // Switches light ↔️ dark
```

### Set specific theme
```javascript
const setTheme = useThemeStore((state) => state.setTheme);
setTheme(true);  // Enable dark mode
setTheme(false); // Enable light mode
```

### Typical component usage
```javascript
function ThemeToggle() {
  const { isDark, toggleTheme } = useThemeStore();
  
  return (
    <button onClick={toggleTheme}>
      {isDark ? '☀️ Light' : '🌙 Dark'}
    </button>
  );
}
```

---

## 🎯 Advanced Patterns

### 1. **Using Non-Reactive State (performance)**
```javascript
// Don't re-render on every change, get state once
function Component() {
  const handleSubmit = () => {
    const state = useCartStore.getState();
    console.log('Current cart:', state.cart);
    state.addToCart(product);
  };
  
  return <button onClick={handleSubmit}>Add</button>;
}
```

### 2. **Subscribe to Changes**
```javascript
// Listen for any changes
const unsubscribe = useCartStore.subscribe((state) => {
  console.log('Cart updated:', state.cart);
});

// Cleanup when component unmounts
useEffect(() => {
  return unsubscribe;
}, []);
```

### 3. **Custom Hooks from Stores**
```javascript
// Create a custom hook for cleaner component code
function useShoppingCart() {
  return useCartStore((state) => ({
    items: state.cart,
    likes: state.wishlist,
    addItem: state.addToCart,
    removeItem: state.removeFromCart,
  }));
}

// Use in component
function Cart() {
  const { items, removeItem } = useShoppingCart();
  return items.map(item => (
    <div key={item.id}>
      {item.name}
      <button onClick={() => removeItem(item.id)}>Remove</button>
    </div>
  ));
}
```

### 4. **Computed Values**
```javascript
function Cart() {
  const cart = useCartStore((state) => state.cart);
  
  // Compute total
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  
  return <div>Total: ${total}</div>;
}
```

---

## 📋 Common Tasks

### Add item to cart
```javascript
const { addToCart } = useCartStore();
addToCart({ id: 1, name: 'Nike Shoes', price: 100 });
```

### Remove item from cart
```javascript
const { removeFromCart } = useCartStore();
removeFromCart(productId);
```

### Clear entire cart
```javascript
const { clearCart } = useCartStore();
clearCart();
```

### Like a product
```javascript
const { addToWishlist } = useCartStore();
addToWishlist(product);
```

### Get product count
```javascript
const cart = useCartStore((state) => state.cart);
cart.length; // Number of items
```

### Get translated text
```javascript
const t = useLanguageStore((state) => state.t);
const text = t('addToCart'); // 'Savat' in Uzbek, 'Add to Cart' in English
```

### Switch language
```javascript
const toggleLanguage = useLanguageStore((state) => state.toggleLanguage);
onClick={() => toggleLanguage()}
```

### Enable dark mode
```javascript
const { setTheme } = useThemeStore();
setTheme(true);
```

---

## ✨ Performance Tips

1. **Always use selectors for specific state** - avoid re-renders
   ```javascript
   // ✅ Good
   const cart = useCartStore((state) => state.cart);
   
   // ❌ Avoid
   const store = useCartStore();
   ```

2. **Memoize selectors** if they're complex
3. **Use `.getState()` for non-reactive access** in event handlers
4. **Persist middleware handles localStorage** automatically

---

## 🆘 Troubleshooting

**Q: Why isn't my component updating?**
- A: Make sure you're using the selector pattern to access state

**Q: How do I reset store to initial state?**
- A: Create a reset action in the store or use `useState` for local state

**Q: Can I use multiple stores together?**
- A: Yes! Just import and use multiple stores in the same component

**Q: Where's the data persisted?**
- A: Language and Theme are in localStorage (you can see in DevTools)
- A: Cart exists in memory only (clears on page reload by default)

---

## 📚 Files Reference

| Store | File | Key States | Actions |
|-------|------|-----------|---------|
| Cart | `useCartStore.js` | `cart`, `wishlist` | `addToCart`, `removeFromCart`, `addToWishlist`, `removeFromWishlist`, `clearCart`, `clearWishlist` |
| Language | `useLanguageStore.js` | `language` | `t()`, `toggleLanguage`, `setLanguage` |
| Theme | `useThemeStore.js` | `isDark` | `toggleTheme`, `setTheme`, `initializeTheme` |

---

**Happy coding! 🚀**
