export default function Loading() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[50vh] p-4">
      <div className="flex flex-col items-center space-y-3">
        <div className="h-10 w-10 rounded-full border-3 border-primary/20 border-t-primary animate-spin" />
        <span className="text-xs font-semibold text-slate-500 tracking-wide">
          Loading Laxmi Classes...
        </span>
      </div>
    </div>
  );
}
