import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const { user } = useAuth();

  // Load cart from backend when user is logged in
  useEffect(() => {
    if (user) {
      api.get('/cart')
        .then((res) => {
          if (Array.isArray(res.data)) {
            setCart(res.data);
            try {
              localStorage.setItem('cart', JSON.stringify(res.data));
            } catch {
              // quota safety
            }
          }
        })
        .catch(() => {});
    }
  }, [user]);

  // Persist cart to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch {
      // quota safety
    }
  }, [cart]);

  const addToCart = useCallback(
    async (product, quantity = 1) => {
      // Instant optimistic UI update
      setCart((prev) => {
        const existing = prev.find((i) => i.product_id === product.product_id);
        let updated;
        if (existing) {
          updated = prev.map((i) =>
            i.product_id === product.product_id ? { ...i, quantity: i.quantity + quantity } : i
          );
        } else {
          updated = [...prev, { ...product, quantity }];
        }
        try {
          localStorage.setItem('cart', JSON.stringify(updated));
        } catch {
          // safety
        }
        return updated;
      });

      if (user) {
        try {
          await api.post('/cart', { product_id: product.product_id, quantity });
        } catch {
          // Re-fetch to reconcile on error
          api.get('/cart').then((res) => setCart(res.data)).catch(() => {});
        }
      }
    },
    [user]
  );

  const updateQuantity = useCallback(
    async (productId, quantity) => {
      if (quantity < 1) return;

      // Instant optimistic UI update
      setCart((prev) => {
        const updated = prev.map((i) =>
          i.product_id === productId ? { ...i, quantity } : i
        );
        try {
          localStorage.setItem('cart', JSON.stringify(updated));
        } catch {
          // safety
        }
        return updated;
      });

      if (user) {
        try {
          await api.put(`/cart/${productId}`, { quantity });
        } catch {
          // Fallback sync
          api.get('/cart').then((res) => setCart(res.data)).catch(() => {});
        }
      }
    },
    [user]
  );

  const removeFromCart = useCallback(
    async (productId) => {
      // Instant optimistic removal from UI and localStorage
      setCart((prev) => {
        const updated = prev.filter((i) => i.product_id !== productId);
        try {
          localStorage.setItem('cart', JSON.stringify(updated));
        } catch {
          // safety
        }
        return updated;
      });

      if (user) {
        try {
          await api.delete(`/cart/${productId}`);
        } catch {
          // Fallback sync on failure
          api.get('/cart').then((res) => setCart(res.data)).catch(() => {});
        }
      }
    },
    [user]
  );

  const clearCart = useCallback(async () => {
    setCart([]);
    localStorage.removeItem('cart');
    if (user) {
      try {
        await api.delete('/cart');
      } catch {
        /* ignore */
      }
    }
  }, [user]);

  const totalItems = useMemo(() => cart.reduce((sum, i) => sum + (parseInt(i.quantity, 10) || 1), 0), [cart]);

  const totalPrice = useMemo(
    () =>
      cart.reduce((sum, i) => {
        const price = parseFloat(i.product_discount) > 0 ? parseFloat(i.product_discount) : parseFloat(i.product_price);
        const qty = parseInt(i.quantity, 10) || 1;
        return sum + price * qty;
      }, 0),
    [cart]
  );

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  return useContext(CartContext);
}
