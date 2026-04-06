import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "https://fakestoreapi.com",
    timeout: 10000,
});

// Transform FakeStoreAPI data to match our app format
const transformProduct = (product) => {
  // Use placeholder images - reliable and no network issues
  const images = [
    "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg",
  ];

  return {
    id: product.id,
    name: product.title || product.name || "Nike Product",
    category: product.category || "Shoes",
    price: parseFloat(product.price),
    description: product.description || "Premium athletic footwear",
    image: images[product.id % images.length] || images[0],
    rating: product.rating?.rate || (Math.random() * 2 + 3.5).toFixed(1),
    stock: product.stock || Math.floor(Math.random() * 100) + 20,
  };
};

// Request interceptor
api.interceptors.request.use((config) => {
  if (!(config.data instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
  }
  
  console.log("📤 API Request:", config.method?.toUpperCase(), config.baseURL + config.url);
  return config;
}, error => {
  console.error("❌ Request error:", error);
  return Promise.reject(error);
});

// Response interceptor with data transformation
api.interceptors.response.use(
  (response) => {
    console.log("✅ API Response:", response.status);
    
    // Transform response data to match app format
    if (response.data) {
      if (Array.isArray(response.data)) {
        // Array of products (GET /products)
        response.data = { data: response.data.map(transformProduct) };
      } else if (response.data.id && response.data.title) {
        // Single product (GET /products/:id)
        response.data = { data: transformProduct(response.data) };
      }
    }
    
    return response;
  },
  (error) => {
    console.error("🚫 API Error:", error.response?.status, error.code);
    
    // If API fails, use local mock storage
    if (!error.response || error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      console.log("⚠️ Using local mock storage fallback");
      return handleLocalMockAPI(error.config);
    }
    
    return Promise.reject(error);
  }
);

// Local mock storage for offline support
function handleLocalMockAPI(config) {
  const method = config.method?.toUpperCase();
  const url = config.url;

  const defaultImages = [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1515562141207-5dca89f5e1a7?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=400&fit=crop",
  ];

  let mockProducts = JSON.parse(localStorage.getItem('mockProducts')) || [
    {
      id: 1,
      name: 'Nike Air Max 90',
      category: "Men's Shoes",
      price: 129.99,
      rating: 4.5,
      stock: 50,
      image: defaultImages[0],
      description: 'Classic Nike Air Max 90 sneakers'
    },
    {
      id: 2,
      name: 'Nike Revolution 6',
      category: "Running Shoes",
      price: 69.99,
      rating: 4.2,
      stock: 100,
      image: defaultImages[1],
      description: 'Lightweight running shoes'
    },
    {
      id: 3,
      name: 'Nike Cortez',
      category: "Unisex",
      price: 89.99,
      rating: 4.8,
      stock: 30,
      image: defaultImages[2],
      description: 'Classic Nike Cortez design'
    },
  ];

  if (method === 'GET' && url === '/products') {
    return Promise.resolve({
      status: 200,
      data: { data: mockProducts },
      config
    });
  }

  if (method === 'GET' && url.match(/\/products\/\d+/)) {
    const id = parseInt(url.split('/').pop());
    const product = mockProducts.find(p => p.id === id);
    
    if (!product) {
      return Promise.reject({
        response: { status: 404, data: { error: 'Not found' } },
        config
      });
    }
    
    return Promise.resolve({
      status: 200,
      data: { data: product },
      config
    });
  }

  if (method === 'POST' && url === '/products') {
    const data = config.data instanceof FormData 
      ? Object.fromEntries(config.data)
      : config.data;

    const newProduct = {
      id: Math.max(...mockProducts.map(p => p.id), 0) + 1,
      name: data.name,
      category: data.category,
      price: parseFloat(data.price),
      description: data.description || '',
      stock: parseInt(data.stock) || 0,
      rating: parseFloat(data.rating) || 4.5,
      image: '/uploads/placeholder.jpg'
    };

    mockProducts.push(newProduct);
    localStorage.setItem('mockProducts', JSON.stringify(mockProducts));

    return Promise.resolve({
      status: 201,
      data: { message: 'Success', data: newProduct },
      config
    });
  }

  if (method === 'PUT' && url.match(/\/products\/\d+/)) {
    const id = parseInt(url.split('/').pop());
    const data = config.data instanceof FormData 
      ? Object.fromEntries(config.data)
      : config.data;

    const index = mockProducts.findIndex(p => p.id === id);
    
    if (index === -1) {
      return Promise.reject({
        response: { status: 404, data: { error: 'Not found' } },
        config
      });
    }

    mockProducts[index] = {
      ...mockProducts[index],
      name: data.name || mockProducts[index].name,
      category: data.category || mockProducts[index].category,
      price: data.price ? parseFloat(data.price) : mockProducts[index].price,
      description: data.description !== undefined ? data.description : mockProducts[index].description,
      stock: data.stock ? parseInt(data.stock) : mockProducts[index].stock,
      rating: data.rating ? parseFloat(data.rating) : mockProducts[index].rating,
    };

    localStorage.setItem('mockProducts', JSON.stringify(mockProducts));

    return Promise.resolve({
      status: 200,
      data: { message: 'Updated', data: mockProducts[index] },
      config
    });
  }

  if (method === 'DELETE' && url.match(/\/products\/\d+/)) {
    const id = parseInt(url.split('/').pop());
    const index = mockProducts.findIndex(p => p.id === id);

    if (index === -1) {
      return Promise.reject({
        response: { status: 404, data: { error: 'Not found' } },
        config
      });
    }

    const deleted = mockProducts.splice(index, 1)[0];
    localStorage.setItem('mockProducts', JSON.stringify(mockProducts));

    return Promise.resolve({
      status: 200,
      data: { message: 'Deleted', data: deleted },
      config
    });
  }

  return Promise.reject({
    response: { status: 500, data: { error: 'Not implemented' } },
    config
  });
}

export default api;