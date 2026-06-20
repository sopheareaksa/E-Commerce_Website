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

  // Load cart when user logs in
  useEffect(() => {
    if (user) {
      api.get('/cart').then((res) => setCart(res.data)).catch(() => {});
    }
  }, [user]);

  // Persist guest cart to localStorage
  useEffect(() => {
    if (!user) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, user]);

  const addToCart = useCallback(
    async (product, quantity = 1) => {
      // Optimistic update for everyone (instant UI)
      setCart((prev) => {
        const existing = prev.find((i) => i.product_id === product.product_id);
        if (existing) {
          return prev.map((i) =>
            i.product_id === product.product_id ? { ...i, quantity: i.quantity + quantity } : i
          );
        }
        return [...prev, { ...product, quantity }];
      });

      if (user) {
        try {
          await api.post('/cart', { product_id: product.product_id, quantity });
        } catch {
          // Reconcile with server on failure
          api.get('/cart').then((res) => setCart(res.data)).catch(() => {});
        }
      }
    },
    [user]
  );

  const updateQuantity = useCallback(
    async (productId, quantity) => {
      if (quantity < 1) return;

      if (user) {
        const item = cart.find((i) => i.product_id === productId);
        if (!item?.cart_item_id) return;

        const oldQuantity = item.quantity;

        // Optimistic
        setCart((prev) =>
          prev.map((i) => (i.product_id === productId ? { ...i, quantity } : i))
        );

        try {
          await api.put(`/cart/${item.cart_item_id}`, { quantity });
        } catch {
          // Revert on error
          setCart((prev) =>
            prev.map((i) => (i.product_id === productId ? { ...i, quantity: oldQuantity } : i))
          );
        }
      } else {
        setCart((prev) =>
          prev.map((i) => (i.product_id === productId ? { ...i, quantity } : i))
        );
      }
    },
    [user, cart]
  );

  const removeFromCart = useCallback(
    async (productId) => {
      if (user) {
        const item = cart.find((i) => i.product_id === productId);
        if (!item?.cart_item_id) return;

        // Optimistic
        setCart((prev) => prev.filter((i) => i.product_id !== productId));

        try {
          await api.delete(`/cart/${item.cart_item_id}`);
        } catch {
          // Re-fetch to restore correct state on failure
          api.get('/cart').then((res) => setCart(res.data)).catch(() => {});
        }
      } else {
        setCart((prev) => prev.filter((i) => i.product_id !== productId));
      }
    },
    [user, cart]
  );

  const clearCart = useCallback(async () => {
    if (user) {
      try {
        await api.delete('/cart');
      } catch {
        /* ignore */
      }
    }
    setCart([]);
    localStorage.removeItem('cart');
  }, [user]);

  const totalItems = useMemo(() => cart.reduce((sum, i) => sum + i.quantity, 0), [cart]);

  const totalPrice = useMemo(
    () =>
      cart.reduce((sum, i) => {
        const price = i.product_discount > 0 ? i.product_discount : i.product_price;
        return sum + price * i.quantity;
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
