import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Upload qo'shimchasini sozlash
const upload = multer({
  dest: 'public/uploads/',
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// Mock mahsulotlar database
let products = [
  {
    id: 1,
    name: 'Nike Air Max 90',
    category: "Men's Shoes",
    price: 129.99,
    rating: 4.5,
    stock: 50,
    image: '/uploads/air-max-90.jpg',
    description: 'Classic Nike Air Max 90 sneakers'
  },
  {
    id: 2,
    name: 'Nike Revolution 6',
    category: "Running Shoes",
    price: 69.99,
    rating: 4.2,
    stock: 100,
    image: '/uploads/revolution-6.jpg',
    description: 'Lightweight running shoes'
  },
  {
    id: 3,
    name: 'Nike Cortez',
    category: "Unisex",
    price: 89.99,
    rating: 4.8,
    stock: 30,
    image: '/uploads/cortez.jpg',
    description: 'Classic Nike Cortez design'
  },
];

let nextId = 4;

// ROUTES

// GET barcha mahsulotlar
app.get('/products', (req, res) => {
  console.log('GET /products');
  res.json({ data: products });
});

// GET bitta mahsulot
app.get('/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ error: 'Mahsulot topilmadi' });
  }
  res.json({ data: product });
});

// POST mahsulot yaratish
app.post('/products', upload.single('image'), (req, res) => {
  console.log('POST /products', req.body);
  
  const { name, category, price, description, stock, rating } = req.body;
  
  if (!name || !category || !price) {
    return res.status(400).json({ error: 'Name, category va price majburiy' });
  }
  
  const newProduct = {
    id: nextId++,
    name,
    category,
    price: parseFloat(price),
    description: description || '',
    stock: parseInt(stock) || 0,
    rating: parseFloat(rating) || 4.5,
    image: req.file ? `/uploads/${req.file.filename}` : '/uploads/placeholder.jpg'
  };
  
  products.push(newProduct);
  res.status(201).json({ message: 'Success', data: newProduct });
});

// PUT mahsulotni yangilash
app.put('/products/:id', upload.single('image'), (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ error: 'Mahsulot topilmadi' });
  }
  
  const { name, category, price, description, stock, rating } = req.body;
  
  product.name = name || product.name;
  product.category = category || product.category;
  product.price = price ? parseFloat(price) : product.price;
  product.description = description || product.description;
  product.stock = stock ? parseInt(stock) : product.stock;
  product.rating = rating ? parseFloat(rating) : product.rating;
  
  if (req.file) {
    product.image = `/uploads/${req.file.filename}`;
  }
  
  res.json({ message: 'Updated', data: product });
});

// DELETE mahsulot o'chirish
app.delete('/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Mahsulot topilmadi' });
  }
  
  const deleted = products.splice(index, 1);
  res.json({ message: 'Deleted', data: deleted[0] });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server xatosi' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server ishlamokta: http://localhost:${PORT}`);
});
