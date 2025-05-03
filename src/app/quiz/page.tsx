"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import PetCard from "@/components/PetCard";

interface Pet {
  id: number;
  name: string;
  species: string;
  breed: string | null;
  age_months: number;
  weight_kg: string | number;
  description: string;
  image_url: string | null;
  shelter_name: string;
  shelter_id: number;
}

const questions = [
  {
    text: "What type of pet are you looking for?",
    options: [
      { label: "Dog", value: "Dog" },
      { label: "Cat", value: "Cat" },
      { label: "Bird", value: "Bird" },
      { label: "Rabbit", value: "Rabbit" },
      { label: "Other", value: "Other" },
    ],
  },
  {
    text: "What age range are you comfortable with?",
    options: [
      { label: "Baby (0-6 months)", value: { min: 0, max: 6 } },
      { label: "Young (6-24 months)", value: { min: 6, max: 24 } },
      { label: "Adult (2-8 years)", value: { min: 24, max: 96 } },
      { label: "Senior (8+ years)", value: { min: 96, max: null } },
      { label: "Any age", value: { min: null, max: null } },
    ],
  },
  {
    text: "What size pet can you accommodate?",
    options: [
      { label: "Small (0-5 kg)", value: { min: 0, max: 5 } },
      { label: "Medium (5-15 kg)", value: { min: 5, max: 15 } },
      { label: "Large (15-30 kg)", value: { min: 15, max: 30 } },
      { label: "Extra Large (30+ kg)", value: { min: 30, max: null } },
      { label: "Any size", value: { min: null, max: null } },
    ],
  },
  {
    text: "What activity level are you looking for?",
    options: [
      { label: "Very Low", value: "very_low" },
      { label: "Low", value: "low" },
      { label: "Moderate", value: "moderate" },
      { label: "High", value: "high" },
      { label: "Very High", value: "very_high" },
    ],
  },
  {
    text: "What type of living space do you have?",
    options: [
      { label: "Apartment", value: "apartment" },
      { label: "House with small yard", value: "small_yard" },
      { label: "House with large yard", value: "large_yard" },
      { label: "Farm/Rural property", value: "farm" },
    ],
  },
];

export default function QuizPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [matchingPets, setMatchingPets] = useState<Pet[] | null>(null);

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = async (value: any) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      if (!session) {
        router.push("/auth/login?returnTo=/quiz");
        return;
      }

      setIsSubmitting(true);
      setError(null);

      try {
        const preferences = {
          species: newAnswers[0],
          minAge: newAnswers[1].min,
          maxAge: newAnswers[1].max,
          minWeight: newAnswers[2].min,
          maxWeight: newAnswers[2].max,
          activityLevel: newAnswers[3],
          livingSpace: newAnswers[4],
        };

        const response = await fetch("/api/quiz", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(preferences),
        });

        if (!response.ok) {
          throw new Error("Failed to save preferences");
        }

        const data = await response.json();
        setMatchingPets(data.pets);
      } catch (error) {
        setError("Something went wrong. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (matchingPets) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Your Matching Pets
            </h2>

            {matchingPets.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900">
                  No matching pets found
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Try adjusting your preferences or check back later for new
                  pets
                </p>
                <button
                  onClick={() => {
                    setCurrentQuestion(0);
                    setAnswers([]);
                    setMatchingPets(null);
                  }}
                  className="mt-6 btn-primary"
                >
                  Retake Quiz
                </button>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {matchingPets.map((pet) => (
                    <PetCard key={pet.id} pet={pet} />
                  ))}
                </div>
                <div className="mt-8 text-center">
                  <button
                    onClick={() => {
                      setCurrentQuestion(0);
                      setAnswers([]);
                      setMatchingPets(null);
                    }}
                    className="btn-secondary"
                  >
                    Retake Quiz
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="mb-8">
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Question {currentQuestion + 1} of {questions.length}
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm mb-6">
                {error}
              </div>
            )}

            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              {question.text}
            </h2>

            <div className="space-y-3">
              {question.options.map((option) => (
                <button
                  key={
                    typeof option.value === "string"
                      ? option.value
                      : option.label
                  }
                  onClick={() => handleAnswer(option.value)}
                  disabled={isSubmitting}
                  className="w-full text-left px-4 py-3 rounded-lg border border-gray-300 hover:border-primary hover:bg-primary/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
