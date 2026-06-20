import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const discount = product.product_discount > 0 && product.product_discount < product.product_price
    ? product.product_discount
    : product.product_price;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between">
      <div className="relative bg-slate-50 dark:bg-slate-900 rounded-xl aspect-square flex items-center justify-center p-6 overflow-hidden">
        {product.product_special_offer > 0 && (
          <span className="absolute top-3 left-3 bg-red-500/10 text-red-600 border border-red-500/20 px-2.5 py-1 rounded-md text-xs font-bold backdrop-blur-sm z-10">
            -{product.product_special_offer}%
          </span>
        )}
        <button className="absolute top-3 right-3 bg-white dark:bg-slate-800 p-2 rounded-full shadow-md text-gray-400 dark:text-slate-500 hover:text-red-500 hover:bg-red-50 transition-colors z-10 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
          <Heart className="w-4 h-4" />
        </button>
        <Link to={`/product/${product.product_id}`} className="w-full h-full">
          <img
            src={`/img/${product.product_image}`}
            alt={product.product_name}
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 mix-blend-multiply dark:mix-blend-normal"
            loading="lazy"
          />
        </Link>
      </div>
      <div className="pt-5 space-y-3">
        <div className="flex justify-between items-start gap-2">
          <Link to={`/product/${product.product_id}`}>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
              {product.product_name}
            </h3>
          </Link>
          <div className="flex items-center gap-1 text-amber-400 text-xs shrink-0">
            <Star className="w-3 h-3 fill-current" /> 4.8
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-black text-indigo-600">
            ${discount}
          </span>
          {product.product_discount > 0 && product.product_discount < product.product_price && (
            <span className="text-sm font-medium text-slate-400 dark:text-slate-500 line-through decoration-slate-300">
              ${product.product_price}
            </span>
          )}
        </div>
        <button
          onClick={async () => { await addToCart(product); navigate('/cart'); }}
          className="w-full bg-slate-900 text-white py-2.5 rounded-xl font-semibold hover:bg-indigo-600 active:scale-95 transition-all flex justify-center items-center gap-2"
        >
          <ShoppingCart className="w-4 h-4" /> Add to Cart
        </button>
      </div>
    </div>
  );
}
