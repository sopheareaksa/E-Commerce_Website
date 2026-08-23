import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useProducts } from '../context/ProductContext';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export default function Products() {
  const [products, setProducts] = useState([]);
  const { refreshProducts } = useProducts();
  useEffect(() => {
    api.get('/admin/products').then((res) => {
      setProducts(res.data);
    }).catch(() => {});
  }, []);

  const deleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.delete(`/admin/products/${id}`);
      setProducts(products.filter((p) => p.product_id !== id));
      if (refreshProducts) await refreshProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400">Manage your store catalog.</p>
        </div>
        <Link to="/admin/products/add" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md active:scale-[0.98]">
          <Plus className="w-5 h-5" /> Add Product
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-700 border-b border-gray-100 dark:border-slate-700 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Image</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Discount</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 dark:bg-slate-700 mb-4">
                      <Plus className="w-8 h-8 text-gray-400 dark:text-slate-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No products found</h3>
                    <p className="text-gray-500 dark:text-slate-400 text-sm">Start by adding a new product.</p>
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.product_id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-2 flex items-center justify-center shadow-sm">
                        <img src={`/img/${p.product_image}`} className="max-w-full max-h-full object-contain" alt="" />
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{p.product_name}</td>
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
                        <button onClick={() => deleteProduct(p.product_id)} className="p-2 text-gray-400 dark:text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete">
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
