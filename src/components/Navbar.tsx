"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-primary shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center">
              <span className="text-white text-2xl md:text-3xl font-bold tracking-tight hover:text-primary-foreground/90 transition-colors duration-200">
                PetPal
              </span>
            </Link>
            <div className="hidden md:block">
              <div className="flex items-center space-x-6">
                <Link
                  href="/pets"
                  className="text-white/90 hover:text-white font-medium px-3 py-2 rounded-md transition-colors duration-200"
                >
                  Find Pets
                </Link>
                <Link
                  href="/shelters"
                  className="text-white/90 hover:text-white font-medium px-3 py-2 rounded-md transition-colors duration-200"
                >
                  Shelters
                </Link>
                <Link
                  href="/about"
                  className="text-white/90 hover:text-white font-medium px-3 py-2 rounded-md transition-colors duration-200"
                >
                  About
                </Link>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            {session ? (
              <div className="flex items-center space-x-6">
                <Link
                  href="/profile"
                  className="text-white/90 hover:text-white font-medium px-3 py-2 rounded-md transition-colors duration-200"
                >
                  Profile
                </Link>
                <button
                  onClick={() => signOut()}
                  className="bg-white text-primary hover:bg-primary-foreground/10 hover:text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 border-2 border-transparent hover:border-white"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/login"
                  className="text-white/90 hover:text-white font-medium px-3 py-2 rounded-md transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-white text-primary hover:bg-primary-foreground/10 hover:text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 border-2 border-transparent hover:border-white"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
