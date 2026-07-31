export default function GlobalLoading() {
  return (
    <div className="pt-32 pb-24 bg-cream min-h-screen flex flex-col items-center justify-center text-center">
      <div className="w-12 h-12 border-2 border-latte border-t-transparent rounded-full animate-spin mb-4" />
      <p className="font-serif text-2xl text-espresso animate-pulse">Loading Brew Haven...</p>
    </div>
  );
}
