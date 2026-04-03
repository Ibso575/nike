import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useProductStore = create(
  persist(
    (set, get) => ({
      products: [],
      loading: false,

      // Set products
      setProducts: (products) => set({ products }),

      // Add product
      addProduct: (product) =>
        set((state) => ({
          products: [...state.products, product],
        })),

      // Update product
      updateProduct: (id, updatedData) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updatedData } : p
          ),
        })),

      // Delete product
      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),

      // Get product by ID
      getProductById: (id) => {
        const { products } = get();
        return products.find((p) => p.id === id);
      },

      // Clear all products
      clearProducts: () => set({ products: [] }),

      // Set loading state
      setLoading: (loading) => set({ loading }),
    }),
    {
      name: 'product-store',
    }
  )
);
