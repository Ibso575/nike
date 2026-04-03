import { create } from 'zustand';

export const useCartStore = create((set) => ({
  cart: [],
  wishlist: [],

  // Add product to cart
  addToCart: (product) =>
    set((state) => ({
      cart: [...state.cart, product],
    })),

  // Remove product from cart by ID
  removeFromCart: (productId) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== productId),
    })),

  // Add product to wishlist (with duplicate prevention)
  addToWishlist: (product) =>
    set((state) => {
      if (!state.wishlist.find((item) => item.id === product.id)) {
        return { wishlist: [...state.wishlist, product] };
      }
      return state;
    }),

  // Remove product from wishlist by ID
  removeFromWishlist: (productId) =>
    set((state) => ({
      wishlist: state.wishlist.filter((item) => item.id !== productId),
    })),

  // Clear entire cart
  clearCart: () =>
    set(() => ({
      cart: [],
    })),

  // Clear entire wishlist
  clearWishlist: () =>
    set(() => ({
      wishlist: [],
    })),
}));
