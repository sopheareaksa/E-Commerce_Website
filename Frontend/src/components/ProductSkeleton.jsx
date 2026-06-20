export default function ProductSkeleton({ count = 4 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col justify-between animate-pulse"
        >
          <div className="bg-slate-200 dark:bg-slate-700 rounded-xl aspect-square mb-4" />
          <div className="space-y-3">
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
            <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-xl" />
          </div>
        </div>
      ))}
    </>
  );
}
