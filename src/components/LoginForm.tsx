"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // Prevents auto-redirection for debugging
    });

    if (result?.error) {
      setError(result.error);
    } else {
      router.push("/dashboard"); // Manually redirect after login
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}
      <input type="email" name="email" placeholder="Email" required className="border p-2 w-full" />
      <input type="password" name="password" placeholder="Password" required className="border p-2 w-full" />
      <button type="submit" className="bg-green-600 text-white p-2 w-full">Sign In</button>
    </form>
  );
}