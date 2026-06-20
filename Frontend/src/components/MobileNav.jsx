import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Home, LayoutGrid, ShoppingBag, Store, User } from 'lucide-react';

export default function MobileNav() {
  const { totalItems } = useCart();
  const location = useLocation();
  const path = location.pathname;

  const isActive = (route) => {
    if (route === '/' && path === '/') return true;
    if (route !== '/' && path.startsWith(route)) return true;
    return false;
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 pb-safe z-50">
      <div className="flex justify-around items-center h-16 px-2">
        <Link to="/" className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${isActive('/') ? 'text-indigo-600' : 'text-slate-400 dark:text-slate-500'}`}>
          <Home className="w-5 h-5" />
          <span className={`text-[10px] ${isActive('/') ? 'font-semibold' : 'font-medium'}`}>Home</span>
        </Link>
        <Link to="/category" className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${isActive('/category') ? 'text-indigo-600' : 'text-slate-400 dark:text-slate-500'}`}>
          <LayoutGrid className="w-5 h-5" />
          <span className={`text-[10px] ${isActive('/category') ? 'font-semibold' : 'font-medium'}`}>Categories</span>
        </Link>
        <Link to="/cart" className="flex flex-col items-center justify-center w-full h-full relative -top-4">
          <div className="bg-indigo-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg shadow-indigo-200 border-4 border-slate-50">
            <ShoppingBag className="w-5 h-5" />
          </div>
          {totalItems > 0 && (
            <span className="absolute top-0 right-3 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-slate-50">
              {totalItems}
            </span>
          )}
        </Link>
        <Link to="/shop" className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${isActive('/shop') ? 'text-indigo-600' : 'text-slate-400 dark:text-slate-500'}`}>
          <Store className="w-5 h-5" />
          <span className={`text-[10px] ${isActive('/shop') ? 'font-semibold' : 'font-medium'}`}>Shop</span>
        </Link>
        <Link to="/account" className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${isActive('/account') ? 'text-indigo-600' : 'text-slate-400 dark:text-slate-500'}`}>
          <User className="w-5 h-5" />
          <span className={`text-[10px] ${isActive('/account') ? 'font-semibold' : 'font-medium'}`}>Profile</span>
        </Link>
      </div>
    </div>
  );
}
