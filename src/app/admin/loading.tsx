export default function AdminLoading() {
  return (
    <div className="space-y-6 sm:space-y-8 animate-pulse">
      {/* Header Banner Skeleton */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-4 w-28 bg-slate-200 rounded" />
          <div className="h-7 w-64 bg-slate-300 rounded" />
          <div className="h-3 w-48 bg-slate-100 rounded" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-28 bg-slate-200 rounded-lg" />
          <div className="h-9 w-28 bg-slate-200 rounded-lg" />
        </div>
      </div>

      {/* Metrics Grid Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex-shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-6 w-10 bg-slate-200 rounded" />
              <div className="h-3 w-20 bg-slate-100 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Panels Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            <div className="h-6 w-44 bg-slate-200 rounded" />
            <div className="space-y-3">
              <div className="h-16 bg-slate-50 rounded-lg border border-slate-100" />
              <div className="h-16 bg-slate-50 rounded-lg border border-slate-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
