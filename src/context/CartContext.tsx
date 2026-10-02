'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Size, OrderItem } from '@/types';
import { trackAddToCart } from '@/lib/metaPixel';
import { trackGAAddToCart } from '@/lib/gtag';

interface CartContextType {
  cart: OrderItem[];
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, size: Size, quantity?: number) => void;
  updateQuantity: (productId: string, size: Size, quantity: number) => void;
  removeFromCart: (productId: string, size: Size) => void;
  clearCart: () => void;
  directBuyItem: OrderItem | null;
  setDirectBuy: (product: Product, size: Size, quantity?: number) => void;
  clearDirectBuy: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'saga_fabrics_cart_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [directBuyItem, setDirectBuyItem] = useState<OrderItem | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setCart(parsed);
        }
      }
    } catch (e) {
      console.error('Error loading cart from storage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Error saving cart to storage', e);
    }
  }, [cart, isLoaded]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = (product: Product, size: Size, quantity = 1) => {
    const effectiveSize = size || (product.sizes?.[0] || 'M');

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === product.id && item.size === effectiveSize
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      const newItem: OrderItem = {
        productId: product.id,
        productTitle: product.title,
        image: product.images[0],
        size: effectiveSize,
        price: product.price,
        quantity,
      };

      return [...prev, newItem];
    });

    // Tracking
    trackAddToCart(product, quantity);
    trackGAAddToCart(
      {
        id: product.id,
        title: product.title,
        price: product.price,
        tags: product.tags,
      },
      quantity,
      effectiveSize
    );

    // Automatically open the cart drawer to give immediate visual feedback
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: string, size: Size, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId && item.size === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeFromCart = (productId: string, size: Size) => {
    setCart((prev) =>
      prev.filter((item) => !(item.productId === productId && item.size === size))
    );
  };

  const clearCart = () => {
    setCart([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (e) {}
  };

  const setDirectBuy = (product: Product, size: Size, quantity = 1) => {
    const effectiveSize = size || (product.sizes?.[0] || 'M');
    const item: OrderItem = {
      productId: product.id,
      productTitle: product.title,
      image: product.images[0],
      size: effectiveSize,
      price: product.price,
      quantity,
    };
    setDirectBuyItem(item);

    // Also track
    trackAddToCart(product, quantity);
    trackGAAddToCart(
      {
        id: product.id,
        title: product.title,
        price: product.price,
        tags: product.tags,
      },
      quantity,
      effectiveSize
    );
  };

  const clearDirectBuy = () => {
    setDirectBuyItem(null);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartTotal,
        isCartOpen,
        openCart,
        closeCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        directBuyItem,
        setDirectBuy,
        clearDirectBuy,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
