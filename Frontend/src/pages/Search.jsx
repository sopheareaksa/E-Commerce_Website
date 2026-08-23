import { useEffect, useState, useMemo, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import { Search as SearchIcon } from 'lucide-react';

export default function Search() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const query = params.get('q') || '';
  const [results, setResults] = useState([]);
  const [searchInput, setSearchInput] = useState(query);
  const [maxPrice, setMaxPrice] = useState(10000);

  // Dropdown states
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch full grid search results on URL change
  useEffect(() => {
    if (!query) return;
    api.get(`/products/search?q=${encodeURIComponent(query)}`).then((res) => {
      setResults(res.data);
    }).catch(() => {});
  }, [query]);

  // Fetch live suggestions on user typing (with debouncing)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput.trim().length > 1) {
        api
          .get(`/products/search?q=${encodeURIComponent(searchInput.trim())}`)
          .then((res) => {
            setSuggestions(res.data);
            setShowDropdown(true);
          })
          .catch(() => setSuggestions([]));
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    }, 300); // 300ms delay to prevent excessive API requests

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Hide dropdown when clicking outside component
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const brands = [
    { slug: 'all', label: 'All Products' },
    { slug: 'sony', label: 'Sony' },
    { slug: 'apples', label: 'Apple' },
    { slug: 'samsungs', label: 'Samsung' },
    { slug: 'panasonics', label: 'Panasonic' },
  ];

  const filtered = useMemo(() => {
    return results.filter((p) => parseFloat(p.product_price) <= maxPrice);
  }, [results, maxPrice]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setShowDropdown(false);
      setParams({ q: searchInput.trim() });
    }
  };

  const handleSelectSuggestion = (productName) => {
    setSearchInput(productName);
    setShowDropdown(false);
    setParams({ q: productName });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 mb-16 mt-5">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 md:sticky md:top-24">
            <h2 className="font-bold text-lg text-slate-900 dark:text-white mb-6">Search</h2>

            {/* Search Input Container with Dropdown */}
            <form onSubmit={handleSearchSubmit} className="mb-6 relative" ref={dropdownRef}>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onFocus={() => searchInput.trim().length > 1 && setShowDropdown(true)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border border-transparent rounded-xl text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-slate-800 dark:text-slate-200"
                  placeholder="Search products..."
                  autoFocus
                />
              </div>

              {/* Suggestions Dropdown */}
              {showDropdown && (
                <ul className="absolute z-50 left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700">
                  {suggestions.length > 0 ? (
                    suggestions.map((item) => (
                      <li
                        key={item.product_id}
                        onClick={() => handleSelectSuggestion(item.product_name)}
                        className="px-4 py-2.5 text-sm hover:bg-indigo-50 dark:hover:bg-slate-700 cursor-pointer text-slate-700 dark:text-slate-200 flex items-center justify-between"
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
                    <li className="px-4 py-3 text-xs text-slate-400 text-center">
                      No matching products
                    </li>
                  )}
                </ul>
              )}

              <button
                type="submit"
                className="w-full mt-3 bg-indigo-600 text-white py-2 rounded-xl font-semibold hover:bg-indigo-700 active:scale-95 transition-all"
              >
                Search
              </button>
            </form>

            {/* Brand Filter */}
            <div className="mb-8">
              <h3 className="font-semibold text-sm text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wider">
                Brand
              </h3>
              <div className="space-y-3">
                {brands.map((b) => (
                  <label
                    key={b.slug}
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => navigate(`/category/${b.slug}`)}
                  >
                    <input
                      type="radio"
                      name="category"
                      value={b.slug}
                      checked={b.slug === 'all'}
                      readOnly
                      className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 cursor-pointer"
                    />
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 transition-colors">
                      {b.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-4">
              <h3 className="font-semibold text-sm text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wider">
                Max Price
              </h3>
              <input
                type="range"
                min={0}
                max={10000}
                step={50}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400 mt-3 font-medium">
                <span>$0</span>
                <span>${maxPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="font-black text-3xl md:text-4xl text-slate-900 dark:text-white tracking-tight">
                {query ? `Results for "${query}"` : 'Search Products'}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2">
                Find exactly what you're looking for.
              </p>
            </div>
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((product) => (
                <ProductCard key={product.product_id} product={product} />
              ))}
            </div>
          ) : query ? (
            <div className="text-center py-16">
              <SearchIcon className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                No results found
              </h2>
              <p className="text-slate-500 dark:text-slate-400">Try adjusting your search terms.</p>
            </div>
          ) : (
            <div className="text-center py-16">
              <SearchIcon className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                Enter a search term
              </h2>
              <p className="text-slate-500 dark:text-slate-400">Use the sidebar to search for products.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}