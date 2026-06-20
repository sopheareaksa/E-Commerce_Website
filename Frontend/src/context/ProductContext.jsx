import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all products once when app loads
    api.get('/products')
      .then((res) => {
        const all = res.data;
        setProducts(all);
        // Pre-filter categories client-side so no extra API calls later
        const cats = {};
        all.forEach((p) => {
          const cat = p.product_category;
          if (!cats[cat]) cats[cat] = [];
          cats[cat].push(p);
        });
        setCategories(cats);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getByCategory = (cat) => categories[cat] || [];

  return (
    <ProductContext.Provider value={{ products, categories, getByCategory, loading }}>
      {children}
    </ProductContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useProducts = () => useContext(ProductContext);
