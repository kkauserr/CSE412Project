"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface AdoptionFormProps {
  petId: number;
  petName: string;
}

export default function AdoptionForm({ petId, petName }: AdoptionFormProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!session) {
      router.push(`/auth/login?returnTo=/pets/${petId}`);
      return;
    }

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          petId,
          message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setMessage("");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Interested in {petName}?</h2>

      {!session && (
        <p className="text-sm text-gray-600 mb-4">
          Please{" "}
          <button
            onClick={() => router.push(`/auth/login?returnTo=/pets/${petId}`)}
            className="text-blue-600 hover:text-blue-500"
          >
            sign in
          </button>{" "}
          to submit an adoption inquiry.
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Message to the shelter
          </label>
          <textarea
            id="message"
            rows={4}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Tell us why you're interested in adopting this pet..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            disabled={!session}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !session}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting..." : "Submit Inquiry"}
        </button>
      </form>
    </div>
  );
}
