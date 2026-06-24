import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[70vh] items-center overflow-hidden bg-brand-950">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-brand-950 to-brand-900" />
      <div className="absolute inset-0 bg-grid-pattern bg-[size:44px_44px] opacity-30" />
      <div className="container-wide relative text-center">
        <p className="font-display text-7xl font-extrabold text-accent-400 sm:text-8xl">
          404
        </p>
        <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
          This page wasn&rsquo;t in our report
        </h1>
        <p className="mx-auto mt-4 max-w-md text-brand-100">
          The page you&rsquo;re looking for may have moved or no longer exists.
          Let&rsquo;s get you back on solid ground.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href="/" size="lg">
            <Home className="h-4 w-4" /> Back to Home
          </Button>
          <Button href="/services" size="lg" variant="white">
            <Search className="h-4 w-4" /> Browse Services
          </Button>
        </div>
      </div>
    </section>
  );
}
