'use client';

import React, { createContext, useContext } from 'react';
import { Product } from '@/types';
import { PRODUCTS } from '@/lib/products';

// The in-stock product list, loaded once on the server (from MongoDB) in the root layout.
const ProductsContext = createContext<Product[]>(PRODUCTS);

export function ProductsProvider({ products, children }: { products: Product[]; children: React.ReactNode }) {
  return <ProductsContext.Provider value={products}>{children}</ProductsContext.Provider>;
}

export const useProducts = (): Product[] => useContext(ProductsContext);
