export default function DashboardLoading() {
  return (
    <div className="space-y-6 sm:space-y-8 animate-pulse">
      {/* Banner Skeleton */}
      <div className="h-36 sm:h-44 bg-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-3">
        <div className="h-5 w-40 bg-slate-300 rounded-full" />
        <div className="h-8 w-64 bg-slate-300 rounded-lg" />
        <div className="h-4 w-96 max-w-full bg-slate-300 rounded" />
      </div>

      {/* Metrics Grid Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-100 flex-shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-6 w-12 bg-slate-200 rounded" />
              <div className="h-3 w-20 bg-slate-100 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-6 w-48 bg-slate-200 rounded" />
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
                <div className="h-5 w-24 bg-slate-100 rounded" />
                <div className="h-6 w-3/4 bg-slate-200 rounded" />
                <div className="h-4 w-full bg-slate-100 rounded" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="h-6 w-36 bg-slate-200 rounded" />
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                <div className="h-3 w-20 bg-slate-100 rounded" />
                <div className="h-4 w-full bg-slate-200 rounded" />
                <div className="h-3 w-4/5 bg-slate-100 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
