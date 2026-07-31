import Link from "next/link";

export default function NotFound() {
  return (
    <div className="pt-32 pb-24 bg-cream min-h-screen flex flex-col items-center justify-center text-center px-6">
      <div className="eyebrow mb-3 justify-center">404 Error</div>
      <h1 className="font-serif text-5xl text-espresso mb-4 font-light">
        Page <em className="italic text-latte">Not Found</em>
      </h1>
      <p className="text-mid text-xs md:text-sm max-w-md mb-8 leading-relaxed font-sans">
        The sanctuary page you are looking for does not exist or has been moved.
      </p>
      <Link href="/" className="btn-luxury btn-dark">
        <span>Return Home</span>
      </Link>
    </div>
  );
}
