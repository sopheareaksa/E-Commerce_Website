import { useEffect, useState } from 'react';
import api from '../api/axios';
import { ShoppingBag, CheckCircle, Clock, DollarSign } from 'lucide-react';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, revenue: 0 });
  const [expanded, setExpanded] = useState(new Set());
  useEffect(() => {
    api.get('/admin/orders').then((res) => {
      const data = res.data;
      setOrders(data);
      const total = data.length;
      const completed = data.filter((o) => ['completed', 'paid'].includes(o.order_status?.toLowerCase())).length;
      const pending = total - completed;
      const revenue = data.reduce((s, o) => s + parseFloat(o.order_cost || 0), 0);
      setStats({ total, completed, pending, revenue });
    }).catch(() => {});
  }, []);

  const toggleOrder = (id) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const statusClass = (status) => {
    const s = status?.toLowerCase() || '';
    if (s === 'completed' || s === 'paid') return 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800';
    if (s === 'pending' || s === 'confirmed') return 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 border-teal-100 dark:border-teal-800';
    if (s === 'shipped') return 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-800';
    if (s === 'delivered') return 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800';
    if (s === 'cancelled' || s === 'canceled') return 'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-800';
    return 'bg-gray-50 dark:bg-slate-700 text-gray-600 dark:text-slate-300 border-gray-100 dark:border-slate-600';
  };

  const statusLabel = (status) => {
    const map = { confirmed: 'Confirmed', paid: 'Paid', shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled', canceled: 'Cancelled', pending: 'Pending', completed: 'Completed', on_hold: 'On Hold' };
    return map[status?.toLowerCase()] || status?.replace(/_/g, ' ') || 'Unknown';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-5 flex items-center gap-4">
          <div className="w-11 h-11 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-5 flex items-center gap-4">
          <div className="w-11 h-11 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">Completed</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completed}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-5 flex items-center gap-4">
          <div className="w-11 h-11 bg-amber-50 dark:bg-amber-900/30 rounded-xl flex items-center justify-center text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">Pending</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pending}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-5 flex items-center gap-4">
          <div className="w-11 h-11 bg-purple-50 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">Revenue</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">${stats.revenue.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">All Orders</h2>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Click any row to see product details for that order.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-700 border-b border-gray-100 dark:border-slate-700 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Order #</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Items</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 dark:bg-slate-700 mb-4">
                      <ShoppingBag className="w-8 h-8 text-gray-400 dark:text-slate-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No orders yet</h3>
                    <p className="text-gray-500 dark:text-slate-400 text-sm">Orders will appear here once customers start placing them.</p>
                  </td>
                </tr>
              ) : (
                orders.map((o) => {
                  const items = o.items || [];
                  const itemCount = items.length;
                  const isExpanded = expanded.has(o.order_id);
                  return [
                    <tr key={`summary-${o.order_id}`} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer" onClick={() => toggleOrder(o.order_id)}>
                      <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">#{o.order_id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {(o.user_name || 'G').charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">{o.user_name || 'Guest'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-slate-400">
                        <div className="flex flex-col">
                          <span>{o.user_phone || '—'}</span>
                          <span className="text-xs text-gray-400 dark:text-slate-500">{o.user_city || '—'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">${parseFloat(o.order_cost).toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusClass(o.order_status)}`}>
                          {statusLabel(o.order_status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-slate-400">
                        {new Date(o.order_date).toLocaleDateString()}
                        <div className="text-xs text-gray-400 dark:text-slate-500">{new Date(o.order_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 text-xs font-bold">
                          {itemCount}
                        </span>
                      </td>
                    </tr>,
                    isExpanded ? (
                      <tr key={`detail-${o.order_id}`} className="bg-gray-50/50 dark:bg-slate-700/30">
                        <td colSpan={7} className="px-6 py-4">
                          <div className="rounded-xl border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
                            <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50 flex items-center justify-between">
                              <h4 className="text-sm font-semibold text-gray-800 dark:text-slate-200">Order Products</h4>
                              <span className="text-xs text-gray-500 dark:text-slate-400">{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
                            </div>
                            <table className="w-full text-left">
                              <thead>
                                <tr className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                                  <th className="px-4 py-3">Product</th>
                                  <th className="px-4 py-3">Price</th>
                                  <th className="px-4 py-3">Qty</th>
                                  <th className="px-4 py-3 text-right">Subtotal</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                                {items.map((item, i) => (
                                  <tr key={i}>
                                    <td className="px-4 py-3">
                                      <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-slate-700 p-1 flex items-center justify-center shrink-0">
                                          <img src={`/img/${item.product_image}`} className="max-w-full max-h-full object-contain" alt="" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">{item.product_name}</span>
                                      </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-slate-400">${parseFloat(item.product_price).toFixed(2)}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-slate-400">{item.product_quantity}</td>
                                    <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white text-right">${(parseFloat(item.product_price) * item.product_quantity).toFixed(2)}</td>
                                  </tr>
                                ))}
                              </tbody>
                              <tfoot>
                                <tr className="border-t border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50">
                                  <td colSpan={3} className="px-4 py-3 text-sm font-semibold text-gray-700 dark:text-slate-300">Order Total</td>
                                  <td className="px-4 py-3 text-sm font-bold text-gray-900 dark:text-white text-right">${parseFloat(o.order_cost).toFixed(2)}</td>
                                </tr>
                              </tfoot>
                            </table>
                          </div>
                        </td>
                      </tr>
                    ) : null,
                  ];
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
