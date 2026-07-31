export default function MenuLoading() {
  return (
    <div className="pt-32 pb-24 bg-cream min-h-screen">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 text-center">
        <div className="w-12 h-12 border-2 border-latte border-t-transparent rounded-full animate-spin mx-auto mb-6" />
        <p className="font-serif text-2xl text-espresso animate-pulse">
          Crafting Menu Selections...
        </p>
      </div>
    </div>
  );
}
