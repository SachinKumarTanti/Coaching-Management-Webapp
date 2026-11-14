export default function CoursesLoading() {
  return (
    <div className="flex flex-col animate-pulse">
      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <div className="h-6 w-32 bg-slate-800 rounded-full mx-auto" />
          <div className="h-9 w-72 bg-slate-800 rounded mx-auto" />
          <div className="h-4 w-96 max-w-full bg-slate-800 rounded mx-auto" />
        </div>
      </section>

      {/* Grid Skeleton */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-slate-200 p-6 space-y-4"
              >
                <div className="flex justify-between items-center">
                  <div className="h-5 w-20 bg-slate-100 rounded" />
                  <div className="h-4 w-24 bg-slate-100 rounded" />
                </div>
                <div className="h-6 w-3/4 bg-slate-200 rounded" />
                <div className="space-y-2">
                  <div className="h-4 w-full bg-slate-100 rounded" />
                  <div className="h-4 w-5/6 bg-slate-100 rounded" />
                </div>
                <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                  <div className="h-4 w-28 bg-slate-100 rounded" />
                  <div className="h-8 w-20 bg-slate-200 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
