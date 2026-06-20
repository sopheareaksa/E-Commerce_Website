export default function Terms() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Terms of Service</h1>
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-100 dark:border-slate-700 space-y-4 text-slate-600 dark:text-slate-400">
        <p>Welcome to Zodiac Store. By using our website, you agree to these terms.</p>
        <p><strong className="text-slate-900 dark:text-white">Orders:</strong> All orders are subject to availability and confirmation.</p>
        <p><strong className="text-slate-900 dark:text-white">Payments:</strong> Prices are listed in USD. Payment must be completed before shipping.</p>
        <p><strong className="text-slate-900 dark:text-white">Returns:</strong> Products may be returned within 7 days if unused and in original packaging.</p>
        <p><strong className="text-slate-900 dark:text-white">Liability:</strong> We are not responsible for damages caused by misuse of products.</p>
      </div>
    </div>
  );
}
