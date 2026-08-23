import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api/axios';

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);

  const refreshProducts = useCallback(() => {
    setLoading(true);
    return api.get('/products')
      .then((res) => {
        const all = res.data;
        setProducts(all);
        const cats = {};
        all.forEach((p) => {
          const cat = p.product_category;
          if (!cats[cat]) cats[cat] = [];
          cats[cat].push(p);
        });
        setCategories(cats);
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
