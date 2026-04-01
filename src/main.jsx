import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'

// Context'ni import qilish
import { CartProvider } from './context/cartcontext.jsx'
import { ThemeProvider } from './context/themecontext.jsx'
import { LanguageProvider } from './context/languagecontext.jsx'

import App from './App.jsx' 
import Admin from './pages/admin.jsx' 
import CreateProduct from './pages/create.jsx'
import Layout from './Layout/mainlayout.jsx'
import ProductDetail from './pages/about.jsx'
import WishlistPage from './pages/like.jsx'
import CartPage from './pages/cart.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* ❗ ThemeProvider, LanguageProvider va CartProvider hamma narsani o'rab turishi shart */}
    <LanguageProvider>
      <ThemeProvider>
        <CartProvider> 
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
        </CartProvider>
      </ThemeProvider>
    </LanguageProvider>
  </StrictMode>,
)