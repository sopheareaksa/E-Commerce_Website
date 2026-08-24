import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { ShoppingBag, CreditCard, MapPin, LogOut, Clock, CheckCircle, XCircle, Truck, Package, Lock, KeyRound, ChevronDown, ChevronUp } from 'lucide-react';

export default function Account() {
  const { user, logout, setUser, setLoginModalOpen } = useAuth();
  const [orders, setOrders] = useState(() => {
    try {
      const cached = localStorage.getItem('cached_user_orders');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  const [loadingOrders, setLoadingOrders] = useState(() => !localStorage.getItem('cached_user_orders'));
  const [form, setForm] = useState({ user_name: user?.user_name || '', user_email: user?.user_email || '', user_phone: user?.user_phone || '' });
  const [passForm, setPassForm] = useState({ old_password: '', password: '', password_confirmation: '' });
  const [mode, setMode] = useState('dashboard');
  const [expandedOrders, setExpandedOrders] = useState(new Set());

  // Sync form fields when user data arrives/changes
  const [prevUserId, setPrevUserId] = useState(user?.user_id);
  if (user?.user_id !== prevUserId) {
    setPrevUserId(user?.user_id);
    if (user) {
      setForm({
        user_name: user.user_name || '',
        user_email: user.user_email || '',
        user_phone: user.user_phone || ''
      });
    }
  }

  useEffect(() => {
    if (!user) {
      setLoginModalOpen(true);
      return;
    }
    api.get('/orders')
      .then((res) => {
        if (Array.isArray(res.data)) {
          setOrders(res.data);
          try {
            localStorage.setItem('cached_user_orders', JSON.stringify(res.data));
          } catch {
            // quota safety
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoadingOrders(false));
  }, [user, setLoginModalOpen]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/profile', form);
      setUser(res.data);
      alert('Profile updated!');
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passForm.password !== passForm.password_confirmation) {
      alert('Passwords do not match.');
      return;
    }
    try {
      await api.put('/change-password', passForm);
      alert('Password updated successfully!');
      setPassForm({ old_password: '', password: '', password_confirmation: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Password change failed');
    }
  };

  const toggleOrder = (id) => {
    setExpandedOrders((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (!user) return null;

  const statusMeta = (status) => {
    const s = status?.toLowerCase() || '';
    if (s === 'completed' || s === 'paid') return { label: 'Paid', color: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400', icon: <CheckCircle className="w-4 h-4" /> };
    if (s === 'confirmed' || s === 'pending') return { label: 'Confirmed', color: 'bg-teal-100 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400', icon: <CheckCircle className="w-4 h-4" /> };
    if (s === 'shipped') return { label: 'Shipped', color: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400', icon: <Truck className="w-4 h-4" /> };
    if (s === 'delivered') return { label: 'Delivered', color: 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400', icon: <Package className="w-4 h-4" /> };
    if (s === 'cancelled' || s === 'canceled') return { label: 'Cancelled', color: 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400', icon: <XCircle className="w-4 h-4" /> };
    return { label: status || 'Unknown', color: 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300', icon: <Clock className="w-4 h-4" /> };
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">My Account</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-72 flex-shrink-0">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6">
            <div className="text-center mb-6 pb-6 border-b border-gray-100 dark:border-slate-700">
              <div className="w-20 h-20 rounded-full bg-indigo-600 text-white flex items-center justify-center text-3xl font-bold mx-auto mb-4 shadow-lg shadow-indigo-200">
                {user.user_name?.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">{user.user_name}</h2>
              <p className="text-gray-400 dark:text-slate-400 text-sm">{user.user_email}</p>
            </div>
            <nav className="space-y-2">
              <button onClick={() => setMode('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition font-medium cursor-pointer ${mode === 'dashboard' ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700'}`}>
                <ShoppingBag className="w-5 h-5" /> Orders
              </button>
              <button onClick={() => setMode('profile')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition font-medium cursor-pointer ${mode === 'profile' ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700'}`}>
                <MapPin className="w-5 h-5" /> Profile
              </button>
              <button onClick={() => setMode('security')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition font-medium cursor-pointer ${mode === 'security' ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700'}`}>
                <Lock className="w-5 h-5" /> Security
              </button>
              <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition font-medium cursor-pointer">
                <LogOut className="w-5 h-5" /> Sign Out
              </button>
            </nav>
          </div>
        </aside>

        <div className="flex-1">
          {mode === 'dashboard' && (
            <div className="space-y-8">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-8">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Recent Orders</h2>
                {loadingOrders && orders.length === 0 ? (
                  <div className="space-y-4 animate-pulse">
                    {[1, 2].map((i) => (
                      <div key={i} className="h-20 bg-slate-100 dark:bg-slate-700 rounded-2xl" />
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 dark:text-slate-400">
                    <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p>You have no recent orders.</p>
                    <Link to="/shop" className="inline-block mt-4 bg-indigo-600 text-white px-6 py-2 rounded-full font-semibold text-sm hover:bg-indigo-700 transition">
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((o) => {
                      const meta = statusMeta(o.order_status);
                      const isExpanded = expandedOrders.has(o.order_id);
                      const items = o.items || [];
                      return (
                        <div key={o.order_id} className="border border-gray-100 dark:border-slate-700 rounded-2xl overflow-hidden bg-white dark:bg-slate-800">
                          <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100 dark:border-slate-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700/50 transition" onClick={() => toggleOrder(o.order_id)}>
                            <div className="flex items-center gap-4">
                              <div>
                                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Order #{String(o.order_id).padStart(6, '0')}</span>
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{new Date(o.order_date).toLocaleDateString()}</p>
                              </div>
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${meta.color}`}>
                                {meta.icon} {meta.label}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-bold text-slate-900 dark:text-white">${parseFloat(o.order_cost).toFixed(2)}</span>
                              {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                            </div>
                          </div>
                          {isExpanded && (
                            <div className="px-6 py-4 bg-gray-50/50 dark:bg-slate-700/30">
                              <div className="space-y-3">
                                {items.map((item) => (
                                  <div key={item.order_item_id || item.product_id} className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-slate-700 p-1 flex items-center justify-center shrink-0">
                                      <img src={`/img/${item.product_image}`} className="max-w-full max-h-full object-contain" alt="" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{item.product_name}</p>
                                      <p className="text-xs text-slate-500 dark:text-slate-400">Qty: {item.product_quantity} × ${parseFloat(item.product_price).toFixed(2)}</p>
                                    </div>
                                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">${(parseFloat(item.product_price) * item.product_quantity).toFixed(2)}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between">
                                <div>
                                  <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block">Order Total</span>
                                  <span className="text-sm font-bold text-slate-900 dark:text-white">${parseFloat(o.order_cost).toFixed(2)}</span>
                                </div>
                                {o.order_status?.toLowerCase() !== 'paid' && o.order_status?.toLowerCase() !== 'cancelled' && (
                                  <Link
                                    to={`/payment?order_id=${o.order_id}`}
                                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-sm transition"
                                  >
                                    <CreditCard className="w-3.5 h-3.5" /> Pay Now
                                  </Link>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {mode === 'profile' && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Update Profile</h2>
              <form onSubmit={handleUpdate} className="space-y-6 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Full Name</label>
                  <input type="text" value={form.user_name} onChange={(e) => setForm({ ...form, user_name: e.target.value })}
                    className="w-full border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Email Address</label>
                  <input type="email" value={form.user_email} onChange={(e) => setForm({ ...form, user_email: e.target.value })}
                    className="w-full border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Phone Number</label>
                  <input type="text" value={form.user_phone} onChange={(e) => setForm({ ...form, user_phone: e.target.value })}
                    className="w-full border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200" />
                </div>
                <button type="submit" className="bg-indigo-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-indigo-700 transition cursor-pointer">
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {mode === 'security' && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Change Password</h2>
                  <p className="text-sm text-gray-500 dark:text-slate-400">Update your password to keep your account secure.</p>
                </div>
              </div>
              <form onSubmit={handleChangePassword} className="space-y-6 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Old Password</label>
                  <input type="password" value={passForm.old_password} onChange={(e) => setPassForm({ ...passForm, old_password: e.target.value })}
                    required
                    className="w-full border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">New Password</label>
                  <input type="password" value={passForm.password} onChange={(e) => setPassForm({ ...passForm, password: e.target.value })}
                    required minLength={6}
                    className="w-full border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Confirm New Password</label>
                  <input type="password" value={passForm.password_confirmation} onChange={(e) => setPassForm({ ...passForm, password_confirmation: e.target.value })}
                    required
                    className="w-full border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200" />
                </div>
                <button type="submit" className="bg-indigo-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-indigo-700 transition cursor-pointer">
                  Update Password
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
