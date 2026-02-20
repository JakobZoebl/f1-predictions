
export function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0f18]">
      <div className="relative flex flex-col items-center">
        {/* Simple spinning ring with f1-neon light blue accent */}
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-slate-800 border-t-f1-neon"></div>
        <p className="mt-4 text-sm font-medium tracking-widest text-f1-neon uppercase">Loading</p>
      </div>
    </div>
  );
}
