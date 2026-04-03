import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'

// Initialize theme from localStorage on app start
import { useThemeStore } from './stores/useThemeStore.js'

import App from './App.jsx' 
import Admin from './pages/admin.jsx' 
import CreateProduct from './pages/create.jsx'
import Layout from './Layout/mainlayout.jsx'
import ProductDetail from './pages/about.jsx'
import WishlistPage from './pages/like.jsx'
import CartPage from './pages/cart.jsx'

// Initialize theme
useThemeStore.getState().initializeTheme()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* ❗ Zustand stores are used directly in components - no providers needed */}
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<App />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="admin" element={<Admin />} />
          <Route path="createproduct" element={<CreateProduct />} />
        </Route>
      </Routes>
    </Router>
  </StrictMode>,
)