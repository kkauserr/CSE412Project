"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Something went wrong.");
    } else {
      router.push("/login");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}
      <input type="text" name="name" placeholder="Full Name" required className="border p-2 w-full" />
      <input type="email" name="email" placeholder="Email" required className="border p-2 w-full" />
      <input type="password" name="password" placeholder="Password" required className="border p-2 w-full" />
      <button type="submit" className="bg-green-600 text-white p-2 w-full">Sign Up</button>
    </form>
  );
}