  import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';

function Section({ title, items }) {
  if (items.length === 0) return null;
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 mb-16">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="font-black text-3xl md:text-4xl text-slate-900 dark:text-white tracking-tight">{title}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Grab these limited-time deals before they're gone.</p>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((p) => (
          <ProductCard key={p.product_id} product={p} />
        ))}
      </div>
    </section>
  );
}

export default function Shop() {
  const { getByCategory } = useProducts();

  const panasonics = getByCategory('panasonics').slice(0, 4);
  const sony = getByCategory('sony').slice(0, 4);
  const apples = getByCategory('apples').slice(4, 8);
  const samsungs = getByCategory('samsungs').slice(4, 8);

  return (
    <div className="mt-5">
      <Section title="Panasonic Products" items={panasonics} />
      <Section title="Sony Products" items={sony} />
      <Section title="Apple Products" items={apples} />
      <Section title="Samsung Products" items={samsungs} />
    </div>
  );
}
