import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag } from 'lucide-react';
import { useMemo } from 'react';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, totalPrice } = useCart();
  const { user, setLoginModalOpen } = useAuth();
  const navigate = useNavigate();

  const subtotal = useMemo(() =>
    cart.reduce((sum, item) => sum + (item.product_price * item.quantity), 0),
  [cart]);

  const discount = useMemo(() =>
    cart.reduce((sum, item) => {
      const disc = item.product_discount > 0 ? item.product_discount : item.product_price;
      return sum + ((item.product_price - disc) * item.quantity);
    }, 0),
  [cart]);

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <ShoppingBag className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Your cart is empty</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-6">Looks like you haven't added anything yet.</p>
        <Link to="/shop" className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-indigo-700 transition-colors">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-8 pb-20 grid grid-cols-1 lg:grid-cols-3 gap-16 mt-5">
      <div className="lg:col-span-2">
        <div className="border-t border-b border-gray-100 dark:border-slate-700 py-6 space-y-8">
          {cart.map((item) => {
            const price = item.product_discount > 0 ? item.product_discount : item.product_price;
            return (
              <div key={item.product_id || item.cart_item_id} className="flex items-center gap-6">
                <button
                  onClick={() => removeFromCart(item.product_id)}
                  className="text-gray-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 p-2 rounded-lg transition-colors font-bold text-base cursor-pointer"
                  title="Remove from cart"
                >
                  ✕
                </button>
                <div className="w-20 h-24 rounded flex-shrink-0">
                  <img src={`/img/${item.product_image}`} alt={item.product_name} className="mt-5 w-full object-contain" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-1">{item.product_category || 'Product'}</p>
                  <Link to={`/product/${item.product_id}`} className="text-sm font-medium mb-1 text-slate-900 dark:text-white hover:text-indigo-600">
                    {item.product_name}
                  </Link>
                  <p className="text-xs text-gray-500 dark:text-slate-400">Qty: {item.quantity}</p>
                </div>
                <div className="flex items-stretch border border-gray-200 dark:border-slate-700 rounded overflow-hidden h-[34px]">
                  <button
                    onClick={() => updateQuantity(item.product_id, Math.max(1, item.quantity - 1))}
                    className="w-8 flex items-center justify-center text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition font-semibold select-none leading-none"
                  >
                    −
                  </button>
                  <input
                    type="text"
                    value={item.quantity}
                    readOnly
                    className="w-12 text-center text-sm font-semibold text-gray-700 dark:text-slate-200 bg-transparent border-x border-gray-200 dark:border-slate-700 focus:outline-none m-0 p-0"
                  />
                  <button
                    onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                    className="w-8 flex items-center justify-center text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition font-semibold select-none leading-none"
                  >
                    +
                  </button>
                </div>
                <div className="w-24 text-right text-sm text-gray-600 dark:text-slate-400">
                  ${(price * item.quantity).toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="lg:col-span-1 mt-5">
        <h2 className="text-xl font-medium mb-6 text-slate-900 dark:text-white">Summary</h2>

        <div className="flex justify-between items-center mb-4 text-sm text-gray-600 dark:text-slate-400">
          <span>Subtotal</span>
          <span className="font-medium text-black dark:text-white">${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center mb-6 text-sm text-gray-600 dark:text-slate-400">
          <span>Discount</span>
          <span className="font-medium text-black dark:text-white">${discount.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center border-t border-gray-100 dark:border-slate-700 pt-6 mb-8">
          <span className="font-bold text-gray-900 dark:text-white">Total</span>
          <span className="font-bold text-gray-900 dark:text-white">USD ${totalPrice.toFixed(2)}</span>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Enter coupon code here"
            className="w-full border border-gray-200 dark:border-slate-700 rounded px-4 py-3 text-sm focus:outline-none focus:border-gray-400 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
          />
        </div>

        <button
          onClick={() => {
            if (!user) {
              setLoginModalOpen(true);
            } else {
              navigate('/checkout');
            }
          }}
          className="w-full bg-black text-white rounded py-4 text-sm font-medium hover:bg-gray-800 transition-colors inline-block text-center cursor-pointer"
        >
          Check Out
        </button>
      </div>
    </div>
  );
}
