import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { Star, Heart, RefreshCw, ShoppingCart } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products, getByCategory } = useProducts();

  // Instant 0ms pre-fill from cached catalog
  const [product, setProduct] = useState(() => {
    const found = products.find((p) => String(p.product_id) === String(id));
    return found || null;
  });

  const [qty, setQty] = useState(1);
  const [mainImg, setMainImg] = useState(() => product?.product_image || '');
  const [related, setRelated] = useState(() => {
    if (product?.product_category) {
      return getByCategory(product.product_category).filter((p) => String(p.product_id) !== String(id)).slice(0, 4);
    }
    return [];
  });

  // Sync state if id or products change
  useEffect(() => {
    const found = products.find((p) => String(p.product_id) === String(id));
    if (found) {
      setProduct(found);
      setMainImg(found.product_image);
      if (found.product_category) {
        setRelated(getByCategory(found.product_category).filter((p) => String(p.product_id) !== String(id)).slice(0, 4));
      }
    }

    // Revalidate in background
    api.get(`/products/${id}`).then((res) => {
      setProduct(res.data);
      if (!mainImg) setMainImg(res.data.product_image);
    }).catch(() => {});
  }, [id, products, getByCategory, mainImg]);

  const images = product
    ? [product.product_image, product.product_image2, product.product_image3, product.product_image4].filter(Boolean)
    : [];
  const finalPrice = product
    ? (product.product_discount > 0 && product.product_discount < product.product_price ? product.product_discount : product.product_price)
    : 0;

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-slate-200 dark:bg-slate-800 rounded-2xl h-96" />
          <div className="space-y-4">
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
            <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded w-48" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 mb-4 rounded-2xl p-8 flex justify-center items-center h-96 shadow-sm">
            <img src={`/img/${mainImg || product.product_image}`} alt={product.product_name} className="max-h-full object-contain mix-blend-multiply dark:mix-blend-normal transition-all duration-300" />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <div className="flex space-x-4 flex-1 justify-center">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setMainImg(img)}
                  className={`w-20 h-20 bg-white dark:bg-slate-800 rounded-xl p-2 cursor-pointer flex items-center justify-center transition border-2 shadow-sm ${mainImg === img ? 'border-indigo-600 opacity-100 ring-2 ring-indigo-100' : 'border-gray-100 dark:border-slate-700 opacity-60 hover:opacity-100'}`}
                >
                  <img src={`/img/${img}`} className="object-contain w-full h-full" alt={`Thumb ${i + 1}`} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-200">{product.product_name}</h1>
          </div>

          <div className="flex items-center space-x-2 mb-4 text-sm">
            <div className="text-amber-400 flex">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />}
            </div>
            <span className="text-gray-400 dark:text-slate-500">(1 customer review)</span>
          </div>

          <div className="flex items-center space-x-3 mb-6 border-b border-gray-100 dark:border-slate-700 pb-6">
            <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">${finalPrice}</span>
            {product.product_discount > 0 && product.product_discount < product.product_price && (
              <span className="text-gray-400 dark:text-slate-500 line-through text-lg">${product.product_price}</span>
            )}
            {product.product_special_offer > 0 && (
              <span className="ml-2 bg-red-500/10 text-red-600 border border-red-500/20 text-xs font-bold px-2.5 py-1 rounded-md">-{product.product_special_offer}%</span>
            )}
          </div>

          <div className="flex items-center space-x-4 mb-8 mt-6">
            <div className="flex items-stretch border border-gray-300 dark:border-slate-600 rounded-xl overflow-hidden h-[46px]">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-12 flex items-center justify-center text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition font-semibold select-none leading-none">−</button>
              <input type="number" value={qty} min="1" readOnly className="w-14 text-center font-semibold text-gray-700 dark:text-slate-200 bg-transparent border-x border-gray-300 dark:border-slate-600 focus:outline-none m-0 p-0" />
              <button onClick={() => setQty(qty + 1)} className="w-12 flex items-center justify-center text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition font-semibold select-none leading-none">+</button>
            </div>
            <button
              onClick={async () => { await addToCart(product, qty); navigate('/cart'); }}
              className="bg-slate-900 hover:bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-md flex items-center gap-2 cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" /> Add to Cart
            </button>
          </div>

          <div className="flex items-center space-x-6 text-sm font-semibold text-gray-700 dark:text-slate-300 mb-8 border-b border-gray-100 dark:border-slate-700 pb-6">
            <span className="hover:text-red-500 transition cursor-pointer flex items-center gap-1"><Heart className="w-4 h-4" /> Browse Wishlist</span>
            <span className="hover:text-red-500 transition cursor-pointer flex items-center gap-1"><RefreshCw className="w-4 h-4" /> Add to compare</span>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-200">Related Products</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p) => (
              <div key={p.product_id} className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md transition-all group">
                <Link to={`/product/${p.product_id}`} className="block relative bg-slate-50 dark:bg-slate-900 rounded-xl mb-4 aspect-square flex items-center justify-center p-4">
                  {p.product_special_offer > 0 && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">-{p.product_special_offer}%</span>
                  )}
                  <img src={`/img/${p.product_image}`} alt={p.product_name} className="object-contain w-full h-full mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform" />
                </Link>
                <div className="text-xs text-gray-400 mb-1 flex justify-between">
                  <span className="capitalize">{p.product_category}</span>
                  <div className="text-amber-400 text-xs flex">★ 4.8</div>
                </div>
                <Link to={`/product/${p.product_id}`}>
                  <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-1 hover:text-indigo-600 truncate">{p.product_name}</h3>
                </Link>
                <div className="flex items-center space-x-2">
                  <span className="text-indigo-600 font-bold">${p.product_discount > 0 && p.product_discount < p.product_price ? p.product_discount : p.product_price}</span>
                  {p.product_discount > 0 && p.product_discount < p.product_price && (
                    <span className="text-gray-400 dark:text-slate-500 line-through text-xs">${p.product_price}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
