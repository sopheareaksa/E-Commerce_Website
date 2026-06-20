export default function Shipping() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Shipping Information</h1>
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-100 dark:border-slate-700 space-y-4 text-slate-600 dark:text-slate-400">
        <p>We offer reliable shipping across the country. Here is what you need to know.</p>
        <p><strong className="text-slate-900 dark:text-white">Standard Delivery:</strong> 3-5 business days.</p>
        <p><strong className="text-slate-900 dark:text-white">Express Delivery:</strong> 1-2 business days (additional fee applies).</p>
        <p><strong className="text-slate-900 dark:text-white">Free Shipping:</strong> Available on orders over $500.</p>
        <p><strong className="text-slate-900 dark:text-white">Tracking:</strong> You will receive a tracking number via email once your order ships.</p>
      </div>
    </div>
  );
}
