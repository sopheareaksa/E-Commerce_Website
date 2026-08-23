import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { Search, ShoppingBag, User, Moon, Sun, Menu, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import api from '../api/axios'; // Make sure to import your API instance

export default function Navbar() {
  const { user, logout, isAdmin, setLoginModalOpen, setRegisterModalOpen } = useAuth();
  const { totalItems } = useCart();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Search states
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      setShowDropdown(false);
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);
    }
  };

  const handleSuggestionClick = (productName) => {
    setSearch(productName);
    setShowDropdown(false);
    navigate(`/search?q=${encodeURIComponent(productName)}`);
  };

  // Fetch live suggestions on user typing (with debouncing)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.trim().length > 1) {
        api
          .get(`/products/search?q=${encodeURIComponent(search.trim())}`)
          .then((res) => {
            setSuggestions(res.data);
            setShowDropdown(true);
          })
          .catch(() => setSuggestions([]));
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // Handle clicking outside for both user menu and search dropdown
  useEffect(() => {
    const handleClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const displayName = user?.user_name || user?.user_email?.split('@')[0] || 'Profile';

  return (
    <>
      <nav className="hidden md:block sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-700 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
              <img src="/img/logo.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-black text-2xl tracking-tight text-slate-900 dark:text-white">Zodiac</span>
          </Link>

          <div className="flex gap-8 text-sm font-semibold text-slate-600 dark:text-slate-400">
            <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
            <Link to="/shop" className="hover:text-indigo-600 transition-colors">Shop</Link>
            <Link to="/category" className="hover:text-indigo-600 transition-colors">Categories</Link>
            <Link to="/contact" className="hover:text-indigo-600 transition-colors">Contact</Link>
          </div>

          <div className="flex items-center gap-4">
            {/* Search Container with Ref for click-outside detection */}
            <div className="relative hidden lg:block" ref={searchRef}>
              <form onSubmit={handleSearch}>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => search.trim().length > 1 && setShowDropdown(true)}
                  placeholder="Search products..."
                  className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-transparent rounded-full text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all w-64"
                />
              </form>

              {/* Autocomplete Dropdown */}
              {showDropdown && (
                <ul className="absolute top-full mt-2 w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg max-h-60 overflow-y-auto z-50 overflow-hidden divide-y divide-gray-100 dark:divide-slate-700">
                  {suggestions.length > 0 ? (
                    suggestions.map((item) => (
                      <li
                        key={item.product_id}
                        onClick={() => handleSuggestionClick(item.product_name)}
                        className="px-4 py-3 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer text-slate-700 dark:text-slate-200 flex justify-between items-center transition-colors"
                      >
                        <span className="truncate">{item.product_name}</span>
                        {item.product_price && (
                          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold ml-2">
                            ${item.product_price}
                          </span>
                        )}
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400 text-center">
                      No results found
                    </li>
                  )}
                </ul>
              )}
            </div>

            <button onClick={() => navigate('/search')} className="p-2 text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors lg:hidden relative">
              <Search className="w-6 h-6" />
            </button>

            <button onClick={toggleTheme} className="p-2 text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors relative">
              {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>

            <Link to="/cart" className="p-2 text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors relative">
              <ShoppingBag className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center translate-x-1 -translate-y-1">
                  {totalItems}
                </span>
              )}
            </Link>

            {!user ? (
              <div className="flex items-center gap-2">
                <button onClick={() => setLoginModalOpen(true)} className="bg-indigo-600 px-6 py-2 rounded-full font-semibold hover:bg-indigo-700 hover:shadow-lg text-white transition-all active:scale-95">
                  Login
                </button>
                <button onClick={() => setRegisterModalOpen(true)} className="bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-slate-600 px-4 py-2 rounded-full font-semibold hover:bg-indigo-50 dark:hover:bg-slate-700 transition-all active:scale-95">
                  Register
                </button>
              </div>
            ) : (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:bg-slate-200 transition-all"
                  title="Logged in as user"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm">{displayName}</span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-40 rounded-xl shadow-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-200 overflow-hidden">
                    <Link to="/account" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-slate-700">View Account</Link>
                    {isAdmin && (
                      <Link to="/admin/dashboard" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-slate-700">Dashboard</Link>
                    )}
                    <button
                      onClick={() => { logout(); setUserMenuOpen(false); }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      <nav className="md:hidden sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-gray-200 dark:border-slate-700 p-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-100 dark:border-slate-700">
            <img src="/img/logo.png" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white">Zodiac</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="theme-toggle-btn p-2 text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-full">
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-full">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-white dark:bg-slate-900 pt-20 px-6 space-y-4">
          <Link to="/" onClick={() => setMobileOpen(false)} className="block py-3 text-lg font-semibold text-slate-800 dark:text-slate-200 border-b border-gray-100 dark:border-slate-700">Home</Link>
          <Link to="/shop" onClick={() => setMobileOpen(false)} className="block py-3 text-lg font-semibold text-slate-800 dark:text-slate-200 border-b border-gray-100 dark:border-slate-700">Shop</Link>
          <Link to="/category" onClick={() => setMobileOpen(false)} className="block py-3 text-lg font-semibold text-slate-800 dark:text-slate-200 border-b border-gray-100 dark:border-slate-700">Categories</Link>
          <Link to="/contact" onClick={() => setMobileOpen(false)} className="block py-3 text-lg font-semibold text-slate-800 dark:text-slate-200 border-b border-gray-100 dark:border-slate-700">Contact</Link>
          <Link to="/cart" onClick={() => setMobileOpen(false)} className="block py-3 text-lg font-semibold text-slate-800 dark:text-slate-200 border-b border-gray-100 dark:border-slate-700">Cart ({totalItems})</Link>
          {user ? (
            <>
              <Link to="/account" onClick={() => setMobileOpen(false)} className="block py-3 text-lg font-semibold text-slate-800 dark:text-slate-200 border-b border-gray-100 dark:border-slate-700">Account</Link>
              {isAdmin && <Link to="/admin/dashboard" onClick={() => setMobileOpen(false)} className="block py-3 text-lg font-semibold text-slate-800 dark:text-slate-200 border-b border-gray-100 dark:border-slate-700">Admin</Link>}
              <button onClick={() => { logout(); setMobileOpen(false); }} className="block py-3 text-lg font-semibold text-red-500">Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => { setLoginModalOpen(true); setMobileOpen(false); }} className="block py-3 text-lg font-semibold text-indigo-600 text-left w-full">Login</button>
              <button onClick={() => { setRegisterModalOpen(true); setMobileOpen(false); }} className="block py-3 text-lg font-semibold text-indigo-500 text-left w-full">Register</button>
            </>
          )}
        </div>
      )}
    </>
  );
}