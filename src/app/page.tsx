import Link from "next/link";
import Image from "next/image";
import { query } from "@/lib/db";
import { StatsSection } from "../components/StatsSection";

async function getStats() {
  const stats = await query<{ pet_count: number; shelter_count: number }>(
    `SELECT 
      (SELECT COUNT(*) FROM pet WHERE status = 'available') as pet_count,
      (SELECT COUNT(*) FROM shelter) as shelter_count`
  ).then((rows) => rows[0]);

  return stats;
}

export default async function HomePage() {
  const stats = await getStats();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Find Your Perfect Pet Companion
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl">
                Connect with local shelters and discover your new best friend.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link href="/pets" className="btn-primary text-lg">
                  Browse Pets
                </Link>
                <Link href="/quiz" className="btn-secondary text-lg">
                  Take Matching Quiz
                </Link>
              </div>
              <StatsSection
                petCount={stats.pet_count}
                shelterCount={stats.shelter_count}
              />
            </div>
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&q=80"
                alt="Happy pets"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-primary/20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            How PetPal Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Search</h3>
              <p className="text-gray-600">
                Browse our extensive database of pets or use our advanced
                filters to find your perfect match based on species, age, size,
                and location.
              </p>
            </div>
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Connect</h3>
              <p className="text-gray-600">
                Take our matching quiz to find pets that fit your lifestyle. Get
                personalized recommendations based on your preferences and
                living situation.
              </p>
            </div>
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Adopt</h3>
              <p className="text-gray-600">
                Submit your application directly through our platform. Our
                partner shelters will review and contact you to complete the
                adoption process.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Why Choose PetPal?
            </h2>
            <p className="text-xl text-gray-600">
              We're committed to making pet adoption simple, efficient, and
              joyful for both shelters and adopters.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Matching</h3>
              <p className="text-gray-600">
                Our intelligent quiz system helps match you with pets that fit
                your lifestyle and preferences.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Local Shelters</h3>
              <p className="text-gray-600">
                Partner with verified local shelters to ensure safe and
                legitimate adoptions.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Real-time Updates</h3>
              <p className="text-gray-600">
                Get instant notifications about pet availability and application
                status.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Find Your Perfect Pet?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Take our quick matching quiz or browse available pets to start your
            adoption journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/quiz"
              className="bg-white text-primary hover:bg-gray-100 transition-colors duration-200 px-8 py-3 rounded-lg font-medium"
            >
              Start Quiz
            </Link>
            <Link
              href="/pets"
              className="bg-primary-foreground/10 text-white hover:bg-primary-foreground/20 transition-colors duration-200 px-8 py-3 rounded-lg font-medium"
            >
              View All Pets
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
