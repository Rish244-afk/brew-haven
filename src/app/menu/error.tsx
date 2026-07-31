"use client";

export default function MenuError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="pt-32 pb-24 bg-cream min-h-screen flex flex-col items-center justify-center text-center px-6">
      <h2 className="font-serif text-3xl text-espresso mb-4">Unable to Load Menu</h2>
      <p className="text-sm text-mid max-w-md mb-6">{error.message || "A temporary issue occurred while retrieving menu items."}</p>
      <button
        onClick={() => reset()}
        className="font-sans text-xs tracking-[0.2em] uppercase text-latte border border-latte px-6 py-3 hover:bg-latte hover:text-dark transition-all"
      >
        Try Again
      </button>
    </div>
  );
}
