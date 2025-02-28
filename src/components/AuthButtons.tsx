"use client";

// not using for now
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function AuthButtons() {
  return (
    <div className="flex flex-col items-center space-y-2 mt-4">
      <Button onClick={() => signIn("google")} className="bg-red-600 hover:bg-red-700 text-white w-full">
        Sign in with Google
      </Button>
      <Button onClick={() => signIn("github")} className="bg-gray-800 hover:bg-gray-900 text-white w-full">
        Sign in with GitHub
      </Button>
    </div>
  );
}