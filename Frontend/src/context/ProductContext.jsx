import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api/axios';

const ProductContext = createContext();

const groupCategories = (list) => {
  const cats = {};
  if (Array.isArray(list)) {
    list.forEach((p) => {
      const cat = p.product_category;
      if (!cats[cat]) cats[cat] = [];
      cats[cat].push(p);
    });
  }
  return cats;
};

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('cached_products');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('cached_products');
      return saved ? groupCategories(JSON.parse(saved)) : {};
    } catch {
      return {};
    }
  });

  const [loading, setLoading] = useState(() => {
    return !localStorage.getItem('cached_products');
  });

  const refreshProducts = useCallback(() => {
    return api.get('/products')
      .then((res) => {
        const all = res.data;
        setProducts(all);
        const cats = groupCategories(all);
        setCategories(cats);
        try {
          localStorage.setItem('cached_products', JSON.stringify(all));
        } catch {
          // safety
        }
        return all;
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  const getByCategory = (cat) => categories[cat] || [];

  return (
    <ProductContext.Provider value={{ products, categories, getByCategory, loading, refreshProducts }}>
      {children}
    </ProductContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useProducts = () => useContext(ProductContext);
