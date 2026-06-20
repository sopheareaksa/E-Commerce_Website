import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { Star, Heart, RefreshCw } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [mainImg, setMainImg] = useState('');
  const [related, setRelated] = useState([]);

  useEffect(() => {
    api.get(`/products/${id}`).then((res) => {
      setProduct(res.data);
      setMainImg(res.data.product_image);
    });
  }, [id]);

  useEffect(() => {
    if (product?.product_category) {
      api.get(`/products/category/${product.product_category}`).then((res) => {
        setRelated(res.data.filter((p) => p.product_id !== parseInt(id)).slice(0, 4));
      });
    }
  }, [product, id]);

  const images = product
    ? [product.product_image, product.product_image2, product.product_image3, product.product_image4].filter(Boolean)
    : [];
  const finalPrice = product
    ? (product.product_discount > 0 && product.product_discount < product.product_price ? product.product_discount : product.product_price)
    : 0;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <div className="bg-gray-100 dark:bg-slate-800 mb-4 rounded flex justify-center items-center h-96">
            {product && (
              <img src={`/img/${mainImg}`} alt={product.product_name} className="max-h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
            )}
          </div>
          <div className="flex items-center justify-between space-x-2">
            <button className="text-gray-400 dark:text-slate-500 hover:text-gray-800"><span className="sr-only">Prev</span>‹</button>
            <div className="flex space-x-4 flex-1 justify-center">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setMainImg(img)}
                  className={`w-20 h-20 bg-gray-100 dark:bg-slate-800 cursor-pointer flex items-center justify-center transition border-2 ${mainImg === img ? 'border-indigo-600 opacity-100' : 'border-transparent opacity-50 hover:opacity-100'}`}
                >
                  <img src={`/img/${img}`} className="object-contain w-full h-full" alt={`Thumb ${i + 1}`} />
                </button>
              ))}
            </div>
            <button className="text-gray-400 dark:text-slate-500 hover:text-gray-800"><span className="sr-only">Next</span>›</button>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-200">{product?.product_name || ''}</h1>
          </div>

          <div className="flex items-center space-x-2 mb-4 text-sm">
            <div className="text-yellow-400 flex">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
            </div>
            <span className="text-gray-400 dark:text-slate-500">(1 customer review)</span>
          </div>

          <div className="flex items-center space-x-3 mb-6 border-b border-gray-100 dark:border-slate-700 pb-6">
            <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">${product ? finalPrice : '0.00'}</span>
            {product && product.product_discount > 0 && product.product_discount < product.product_price && (
              <span className="text-gray-400 dark:text-slate-500 line-through text-lg">${product.product_price}</span>
            )}
            {product && product.product_special_offer > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">-{product.product_special_offer}%</span>
            )}
          </div>

          <div className="flex items-center space-x-4 mb-8 mt-6">
            <div className="flex items-stretch border border-gray-300 dark:border-slate-600 rounded overflow-hidden h-[42px]">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 flex items-center justify-center text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition font-semibold select-none leading-none">−</button>
              <input type="number" value={qty} min="1" readOnly className="w-12 text-center font-semibold text-gray-700 dark:text-slate-200 bg-transparent border-x border-gray-300 dark:border-slate-600 focus:outline-none m-0 p-0" />
              <button onClick={() => setQty(qty + 1)} className="w-10 flex items-center justify-center text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition font-semibold select-none leading-none">+</button>
            </div>
            <button
              onClick={async () => { if (product) { await addToCart(product, qty); navigate('/cart'); } }}
              disabled={!product}
              className="bg-gray-800 text-white px-8 py-3 font-semibold text-sm hover:bg-black transition disabled:opacity-50"
            >
              ADD TO CART
            </button>
          </div>

          <div className="flex items-center space-x-6 text-sm font-semibold text-gray-700 mb-8 border-b border-gray-100 dark:border-slate-700 pb-6">
            <span className="hover:text-red-500 transition cursor-pointer flex items-center gap-1"><Heart className="w-4 h-4" /> Browse Wishlist</span>
            <span className="hover:text-red-500 transition cursor-pointer flex items-center gap-1"><RefreshCw className="w-4 h-4" /> Add to compare</span>
          </div>
        </div>
      </div>

      <section className="mt-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-slate-200">Related Products</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {related.map((p) => (
            <div key={p.product_id} className="group">
              <Link to={`/product/${p.product_id}`} className="block relative bg-gray-100 dark:bg-slate-800 mb-4 h-64 flex items-center justify-center rounded-lg">
                {p.product_special_offer > 0 && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-sm">SALE!</span>
                )}
                <img src={`/img/${p.product_image}`} alt={p.product_name} className="object-contain w-full h-full mix-blend-multiply dark:mix-blend-normal p-4" />
              </Link>
              <div className="text-xs text-gray-400 mb-1 flex justify-between">
                <span className="capitalize">{p.product_category}</span>
                <div className="text-yellow-400 text-[10px] flex">★★★★★</div>
              </div>
              <Link to={`/product/${p.product_id}`}>
                <h3 className="font-semibold text-gray-800 dark:text-slate-200 mb-1 hover:text-red-500 cursor-pointer">{p.product_name}</h3>
              </Link>
              <div className="flex items-center space-x-2">
                <span className="text-indigo-600 font-bold">${p.product_discount > 0 && p.product_discount < p.product_price ? p.product_discount : p.product_price}</span>
                {p.product_discount > 0 && p.product_discount < p.product_price && (
                  <span className="text-gray-400 dark:text-slate-500 line-through text-sm">${p.product_price}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
