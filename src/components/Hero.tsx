import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="w-full bg-green-50 py-20 flex flex-col items-center text-center">
      <h1 className="text-5xl md:text-6xl font-bold text-green-700">
        Find Your Perfect Pet Companion 🐶🐱
      </h1>
      <h2 className="text-xl md:text-2xl text-gray-700 mt-4 max-w-2xl">
        Discover loving pets ready for adoption. Give them a second chance at a happy home.
      </h2>
      <Button className="mt-6 px-6 py-3 text-lg bg-green-600 hover:bg-green-700 text-white">
        Get Started
      </Button>
    </section>
  );
}