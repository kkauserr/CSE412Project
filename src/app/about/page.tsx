import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                About PetPal
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Connecting shelters with loving homes through technology and
                compassion. We're revolutionizing the pet adoption process,
                making it easier than ever to find your perfect companion.
              </p>
            </div>
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&q=80"
                alt="Happy pets and owners"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              At PetPal, we're dedicated to revolutionizing the pet adoption
              process. Our platform connects animal shelters with prospective
              adopters, making it easier than ever to find the perfect pet
              companion. We believe every pet deserves a loving home, and every
              person deserves to find their ideal pet match.
            </p>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="p-6 rounded-xl bg-primary/5">
                <div className="text-4xl font-bold text-primary mb-2">60%+</div>
                <div className="text-gray-600">Quiz Completion Rate</div>
              </div>
              <div className="p-6 rounded-xl bg-primary/5">
                <div className="text-4xl font-bold text-primary mb-2">25%+</div>
                <div className="text-gray-600">Adoption Rate</div>
              </div>
              <div className="p-6 rounded-xl bg-primary/5">
                <div className="text-4xl font-bold text-primary mb-2">
                  &lt;2min
                </div>
                <div className="text-gray-600">Listing Time</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              What Sets Us Apart
            </h2>
            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
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
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Smart Matching Algorithm
                  </h3>
                  <p className="text-gray-600">
                    Our intelligent quiz system uses advanced matching
                    algorithms to connect you with pets that perfectly match
                    your lifestyle, preferences, and living situation.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
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
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Secure Platform
                  </h3>
                  <p className="text-gray-600">
                    We prioritize the security of both shelters and adopters.
                    Our platform uses advanced authentication and data
                    protection measures to ensure safe and legitimate adoptions.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
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
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Real-time Updates
                  </h3>
                  <p className="text-gray-600">
                    Get instant notifications about pet availability and
                    application status. Our platform ensures you never miss an
                    opportunity to connect with your perfect pet.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Find Your Perfect Pet?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of happy pet owners who found their companions
            through PetPal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/quiz"
              className="bg-white text-primary hover:bg-gray-100 transition-colors duration-200 px-8 py-3 rounded-lg font-medium"
            >
              Take the Quiz
            </Link>
            <Link
              href="/pets"
              className="bg-primary-foreground/10 text-white hover:bg-primary-foreground/20 transition-colors duration-200 px-8 py-3 rounded-lg font-medium"
            >
              Browse Pets
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
