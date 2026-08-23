import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useProducts } from '../context/ProductContext';
import { Save, AlertCircle, CheckCircle } from 'lucide-react';

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { refreshProducts } = useProducts();
  const [form, setForm] = useState({
    product_name: '',
    product_category: '',
    product_price: '',
    product_discount: '',
    product_special_offer: '',
  });
  const [images, setImages] = useState({ product_image: null, product_image2: null, product_image3: null, product_image4: null });
  const [currentImages, setCurrentImages] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    api.get(`/products/${id}`).then((res) => {
      const p = res.data;
      setForm({
        product_name: p.product_name || '',
        product_category: p.product_category || '',
        product_price: p.product_price || '',
        product_discount: p.product_discount || '',
        product_special_offer: p.product_special_offer || '',
      });
      setCurrentImages({
        product_image: p.product_image,
        product_image2: p.product_image2,
        product_image3: p.product_image3,
        product_image4: p.product_image4,
      });
    }).catch(() => {
      navigate('/admin/dashboard');
    });
  }, [id, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImages({ ...images, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    data.append('_method', 'PUT');
    Object.entries(images).forEach(([k, v]) => { if (v) data.append(k, v); });

    try {
      await api.post(`/admin/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (refreshProducts) await refreshProducts();
      setSuccess('Product updated successfully!');
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Edit Product #{id}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Update the details of the product below.</p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-lg">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-8 rounded-r-lg">
          <div className="flex">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
            <div className="ml-3">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} encType="multipart/form-data"
        className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Product Name <span className="text-red-500">*</span></label>
            <input type="text" name="product_name" required value={form.product_name} onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white dark:bg-slate-800 text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Category <span className="text-red-500">*</span></label>
            <select name="product_category" required value={form.product_category} onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white dark:bg-slate-800 text-sm">
              <option value="">Select a category</option>
              <option value="apples">Apples</option>
              <option value="samsungs">Samsungs</option>
              <option value="panasonics">Panasonics</option>
              <option value="sony">Sony</option>
              <option value="featured">Featured</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Price <span className="text-red-500">*</span></label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold pointer-events-none">$</span>
                <input type="number" step="0.01" name="product_price" required value={form.product_price} onChange={handleChange}
                  className="w-full pl-7 pr-3 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white dark:bg-slate-800 text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Discount Price</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold pointer-events-none">$</span>
                <input type="number" step="0.01" name="product_discount" value={form.product_discount} onChange={handleChange}
                  className="w-full pl-7 pr-3 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white dark:bg-slate-800 text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Discount %</label>
              <div className="relative">
                <input type="number" min="0" max="100" name="product_special_offer" value={form.product_special_offer} onChange={handleChange}
                  className="w-full pl-3 pr-8 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white dark:bg-slate-800 text-sm"
                  placeholder="20" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold pointer-events-none">%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-slate-700 pt-6 mt-6">
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Product Images</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Leave file inputs empty to keep current images.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: 'product_image', label: 'Main Image' },
              { name: 'product_image2', label: 'Image 2' },
              { name: 'product_image3', label: 'Image 3' },
              { name: 'product_image4', label: 'Image 4' },
            ].map((img) => (
              <div key={img.name}>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{img.label}</label>
                {currentImages[img.name] && (
                  <img src={`/img/${currentImages[img.name]}`} className="w-16 h-16 object-contain mb-2 bg-gray-50 dark:bg-slate-700 rounded" alt="" />
                )}
                <input type="file" name={img.name} accept="image/*" onChange={handleFileChange}
                  className="w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 transition-all" />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-4 border-t border-gray-100 dark:border-slate-700 pt-6">
          <Link to="/admin/dashboard" className="px-6 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Cancel</Link>
          <button type="submit" disabled={submitting}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-sm active:scale-95 disabled:opacity-50">
            <Save className="w-4 h-4" /> {submitting ? 'Updating...' : 'Update Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
