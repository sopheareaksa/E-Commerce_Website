export default function FAQ() {
  const faqs = [
    { q: 'How do I place an order?', a: 'Browse products, add to cart, proceed to checkout, and complete payment.' },
    { q: 'What payment methods are accepted?', a: 'We accept Visa, Mastercard, and ABA/ACLEDA bank transfers.' },
    { q: 'How long does shipping take?', a: 'Standard shipping takes 3-5 business days within the country.' },
    { q: 'Can I return a product?', a: 'Yes, returns are accepted within 7 days of delivery if the product is unused.' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Frequently Asked Questions</h1>
      <div className="space-y-4">
        {faqs.map((f, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-100 dark:border-slate-700">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{f.q}</h3>
            <p className="text-slate-500 dark:text-slate-400">{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
