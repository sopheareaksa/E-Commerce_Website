export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Privacy Policy</h1>
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-100 dark:border-slate-700 space-y-4 text-slate-600 dark:text-slate-400">
        <p>We value your privacy. This policy explains how we collect, use, and protect your data.</p>
        <p><strong className="text-slate-900 dark:text-white">Collection:</strong> We collect name, email, phone, and address for order processing.</p>
        <p><strong className="text-slate-900 dark:text-white">Usage:</strong> Your data is used only for order fulfillment and customer support.</p>
        <p><strong className="text-slate-900 dark:text-white">Security:</strong> We use industry-standard encryption to protect your information.</p>
      </div>
    </div>
  );
}
