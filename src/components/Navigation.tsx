import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export function Navigation() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="font-bold text-xl text-blue-600">
            Pet Adoption
          </Link>

          <div className="hidden md:flex space-x-8">
            <Link
              href="/pets"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Find Pets
            </Link>
            <Link
              href="/quiz"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Pet Quiz
            </Link>
            <Link
              href="/shelters"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Shelters
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {session ? (
              <>
                {session.user?.role === "shelter_admin" && (
                  <Link
                    href="/dashboard"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={() => signOut()}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
