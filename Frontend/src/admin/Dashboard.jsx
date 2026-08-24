import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Package, ShoppingBag, UserCheck, Plus, Pencil, Trash2 } from 'lucide-react';

export default function Dashboard() {
  const [products, setProducts] = useState(() => {
    try {
      const cached = localStorage.getItem('cached_admin_products') || localStorage.getItem('cached_products');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  const [stats, setStats] = useState(() => {
    try {
      const cached = localStorage.getItem('cached_admin_stats');
      return cached ? JSON.parse(cached) : { total_products: 0, total_users: 0, total_registered: 0 };
    } catch {
      return { total_products: 0, total_users: 0, total_registered: 0 };
    }
  });

  const [loading, setLoading] = useState(() => {
    return !localStorage.getItem('cached_admin_stats');
  });

  useEffect(() => {
    Promise.all([
      api.get('/products'),
      api.get('/admin/dashboard'),
    ]).then(([productsRes, statsRes]) => {
      const prods = productsRes.data;
      const d = statsRes.data;
      const newStats = {
        total_products: d.total_products || prods.length || 0,
        total_users: d.total_users || 0,
        total_registered: d.total_users || 0,
      };
      setProducts(prods);
      setStats(newStats);
      try {
        localStorage.setItem('cached_admin_products', JSON.stringify(prods));
        localStorage.setItem('cached_admin_stats', JSON.stringify(newStats));
      } catch {
        // quota safety
      }
    }).catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/admin/products/${id}`);
      const updated = products.filter((p) => p.product_id !== id);
      setProducts(updated);
      setStats((prev) => ({ ...prev, total_products: Math.max(0, prev.total_products - 1) }));
      localStorage.setItem('cached_admin_products', JSON.stringify(updated));
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 flex items-center gap-4 transition-all hover:shadow-md">
          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Total Products</p>
            {loading && stats.total_products === 0 ? (
              <div className="h-8 w-16 bg-slate-200 dark:bg-slate-700 animate-pulse rounded mt-1" />
            ) : (
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total_products}</p>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 flex items-center gap-4 transition-all hover:shadow-md">
          <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Total Customers</p>
            {loading && stats.total_users === 0 ? (
              <div className="h-8 w-16 bg-slate-200 dark:bg-slate-700 animate-pulse rounded mt-1" />
            ) : (
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total_users}</p>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 flex items-center gap-4 transition-all hover:shadow-md">
          <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Registered Accounts</p>
            {loading && stats.total_registered === 0 ? (
              <div className="h-8 w-16 bg-slate-200 dark:bg-slate-700 animate-pulse rounded mt-1" />
            ) : (
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total_registered}</p>
            )}
          </div>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">All Products</h2>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Manage your store catalog and inventory.</p>
          </div>
          <Link to="/admin/products/add" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md active:scale-[0.98]">
            <Plus className="w-5 h-5" /> Add Product
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-700 border-b border-gray-100 dark:border-slate-700 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Product Info</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Discount</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {loading && products.length === 0 ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-slate-200 dark:bg-slate-700 rounded-xl" />
                        <div className="space-y-2">
                          <div className="w-36 h-4 bg-slate-200 dark:bg-slate-700 rounded" />
                          <div className="w-16 h-3 bg-slate-200 dark:bg-slate-700 rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><div className="w-20 h-6 bg-slate-200 dark:bg-slate-700 rounded-full" /></td>
                    <td className="px-6 py-4"><div className="w-16 h-5 bg-slate-200 dark:bg-slate-700 rounded" /></td>
                    <td className="px-6 py-4"><div className="w-12 h-5 bg-slate-200 dark:bg-slate-700 rounded" /></td>
                    <td className="px-6 py-4 text-right"><div className="w-16 h-8 bg-slate-200 dark:bg-slate-700 rounded ml-auto" /></td>
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 dark:bg-slate-700 mb-4">
                      <Package className="w-8 h-8 text-gray-400 dark:text-slate-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No products found</h3>
                    <p className="text-gray-500 dark:text-slate-400 text-sm max-w-sm mx-auto mb-6">Your catalog is currently empty. Start by adding a new product to your store.</p>
                    <Link to="/admin/products/add" className="inline-flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-700">
                      <Plus className="w-4 h-4" /> Add First Product
                    </Link>
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.product_id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-2 flex items-center justify-center shadow-sm shrink-0">
                          <img src={`/img/${p.product_image}`} className="max-w-full max-h-full object-contain" alt="" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white line-clamp-1">{p.product_name}</div>
                          <div className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">ID: #{p.product_id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 capitalize border border-blue-100">
                        {p.product_category || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">${p.product_price}</td>
                    <td className="px-6 py-4 text-sm font-medium">
                      {p.product_discount > 0 ? (
                        <span className="text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-100">-${p.product_discount}</span>
                      ) : (
                        <span className="text-gray-400 dark:text-slate-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link to={`/admin/products/edit/${p.product_id}`} className="p-2 text-gray-400 dark:text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Edit">
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleDelete(p.product_id)} className="p-2 text-gray-400 dark:text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
