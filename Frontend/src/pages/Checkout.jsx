import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Lock } from 'lucide-react';

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const { user, setLoginModalOpen } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ user_name: user?.user_name || '', user_email: user?.user_email || '', user_phone: '', user_city: '', user_address: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Please login to checkout</h1>
        <button onClick={() => setLoginModalOpen(true)} className="bg-indigo-600 text-white px-6 py-3 rounded-full font-semibold">Login</button>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Your cart is empty</h1>
      </div>
    );
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.product_price * item.quantity), 0);
  const discount = cart.reduce((sum, item) => {
    const disc = item.product_discount > 0 ? item.product_discount : item.product_price;
    return sum + ((item.product_price - disc) * item.quantity);
  }, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/orders', form);
      await clearCart();
      navigate(`/payment?order_id=${res.data.order_id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Checkout failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-8 pb-24 pt-10">
      <h1 className="text-3xl font-bold mb-10 text-slate-900 dark:text-white">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
            <h2 className="text-xl font-semibold border-b border-gray-100 dark:border-slate-700 pb-4 mb-6 text-slate-900 dark:text-white">Billing Details</h2>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Full Name</label>
                <input type="text" required value={form.user_name} onChange={(e) => setForm({ ...form, user_name: e.target.value })} placeholder="John Doe"
                  className="w-full border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Email Address</label>
                <input type="email" required value={form.user_email} onChange={(e) => setForm({ ...form, user_email: e.target.value })} placeholder="john@example.com"
                  className="w-full border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Phone Number</label>
                <input type="text" required value={form.user_phone} onChange={(e) => setForm({ ...form, user_phone: e.target.value })} placeholder="+855 89 674 732"
                  className="w-full border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">City</label>
                <input type="text" required value={form.user_city} onChange={(e) => setForm({ ...form, user_city: e.target.value })} placeholder="Phnom Penh"
                  className="w-full border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Full Address</label>
                <input type="text" required value={form.user_address} onChange={(e) => setForm({ ...form, user_address: e.target.value })} placeholder="123 Tech Avenue, Innovation District"
                  className="w-full border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200" />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-8 sticky top-28">
            <h2 className="text-xl font-semibold mb-6 text-slate-900 dark:text-white">Your Order</h2>

            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
              {cart.map((item) => {
                const price = item.product_discount > 0 ? item.product_discount : item.product_price;
                return (
                  <div key={item.product_id} className="flex justify-between items-center text-sm border-b border-gray-50 dark:border-slate-700 pb-3">
                    <div className="flex items-center gap-3">
                      <img src={`/img/${item.product_image}`} className="w-10 h-10 object-contain rounded bg-gray-50 dark:bg-slate-700" alt="" />
                      <div>
                        <p className="text-gray-800 dark:text-slate-200 font-medium truncate w-32">{item.product_name}</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">${(price * item.quantity).toFixed(2)}</span>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-gray-100 dark:border-slate-700 pt-6 mb-8">
              <div className="flex justify-between text-sm text-gray-600 dark:text-slate-400 mb-3">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-slate-400 mb-4">
                <span>Discount</span>
                <span className="text-red-500 font-medium">-${discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-xl text-gray-900 dark:text-white border-t border-gray-100 dark:border-slate-700 pt-4">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-indigo-600 text-white rounded-xl py-4 text-sm font-bold hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
            <p className="text-xs text-gray-400 dark:text-slate-500 text-center mt-4 flex items-center justify-center gap-1">
              <Lock className="w-3 h-3" /> Secure Checkout
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
