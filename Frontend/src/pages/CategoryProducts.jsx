import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';

export default function CategoryProducts() {
  const { category } = useParams();
  const navigate = useNavigate();
  const { products } = useProducts();
  const [maxPrice, setMaxPrice] = useState(10000);

  const brands = [
    { slug: 'all', label: 'All Products' },
    { slug: 'sony', label: 'Sony' },
    { slug: 'apples', label: 'Apple' },
    { slug: 'samsungs', label: 'Samsung' },
    { slug: 'panasonics', label: 'Panasonic' },
  ];

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCat = category === 'all' || p.product_category === category;
      const matchPrice = parseFloat(p.product_price) <= maxPrice;
      return matchCat && matchPrice;
    });
  }, [products, category, maxPrice]);

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 mb-16 mt-5">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 md:sticky md:top-24">
            <h2 className="font-bold text-lg text-slate-900 dark:text-white mb-6">Filters</h2>

            {/* Brand */}
            <div className="mb-8">
              <h3 className="font-semibold text-sm text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wider">Brand</h3>
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
                      checked={category === b.slug}
                      onChange={() => navigate(`/category/${b.slug}`)}
                      className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 cursor-pointer"
                    />
                    <span
                      className={`text-sm font-medium transition-colors ${
                        category === b.slug
                          ? 'text-indigo-600'
                          : 'text-slate-600 dark:text-slate-400 group-hover:text-indigo-600'
                      }`}
                    >
                      {b.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-4">
              <h3 className="font-semibold text-sm text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wider">Max Price</h3>
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
                Categories
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
          ) : (
            <div className="text-center py-16">
              <p className="text-red-500 col-span-full text-center py-12">Failed to load products. Please try again.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
