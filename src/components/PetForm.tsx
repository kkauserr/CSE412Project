"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Photo {
  id: number;
  url: string;
  sort_order: number;
}

interface Pet {
  id: number;
  name: string;
  species: string;
  breed: string | null;
  sex: string;
  age_months: number;
  weight_kg: number;
  description: string;
  photos: Photo[];
}

interface PetFormProps {
  pet?: Pet;
}

export default function PetForm({ pet }: PetFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const photoFiles = Array.from(formData.getAll("photos")) as File[];

    try {
      // First, save the pet details
      const petResponse = await fetch(
        pet ? `/api/pets/${pet.id}` : "/api/pets",
        {
          method: pet ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.get("name"),
            species: formData.get("species"),
            breed: formData.get("breed") || null,
            sex: formData.get("sex"),
            age_months: parseInt(formData.get("age_months") as string),
            weight_kg: parseFloat(formData.get("weight_kg") as string),
            description: formData.get("description"),
          }),
        }
      );

      if (!petResponse.ok) {
        const data = await petResponse.json();
        throw new Error(data.message || "Failed to save pet");
      }

      const { id: petId } = await petResponse.json();

      // Then, upload photos if any
      if (photoFiles.length > 0) {
        const uploadPromises = photoFiles.map(async (file, index) => {
          const photoData = new FormData();
          photoData.append("photo", file);
          photoData.append("sort_order", index.toString());

          const uploadResponse = await fetch(
            `/api/pets/${petId || pet?.id}/photos`,
            {
              method: "POST",
              body: photoData,
            }
          );

          if (!uploadResponse.ok) {
            throw new Error("Failed to upload photo");
          }
        });

        await Promise.all(uploadPromises);
      }

      router.push("/dashboard");
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
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <div className="bg-white shadow-sm rounded-lg p-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm mb-6">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={pet?.name}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="species"
              className="block text-sm font-medium text-gray-700"
            >
              Species
            </label>
            <select
              id="species"
              name="species"
              defaultValue={pet?.species}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select species</option>
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
              <option value="Bird">Bird</option>
              <option value="Rabbit">Rabbit</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="breed"
              className="block text-sm font-medium text-gray-700"
            >
              Breed (optional)
            </label>
            <input
              type="text"
              id="breed"
              name="breed"
              defaultValue={pet?.breed || ""}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="sex"
              className="block text-sm font-medium text-gray-700"
            >
              Sex
            </label>
            <select
              id="sex"
              name="sex"
              defaultValue={pet?.sex}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select sex</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="age_months"
              className="block text-sm font-medium text-gray-700"
            >
              Age (months)
            </label>
            <input
              type="number"
              id="age_months"
              name="age_months"
              defaultValue={pet?.age_months}
              required
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="weight_kg"
              className="block text-sm font-medium text-gray-700"
            >
              Weight (kg)
            </label>
            <input
              type="number"
              id="weight_kg"
              name="weight_kg"
              defaultValue={pet?.weight_kg}
              required
              min="0"
              step="0.1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              defaultValue={pet?.description}
              required
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Current Photos
            </label>
            <div className="mt-2 grid grid-cols-2 gap-4">
              {pet?.photos.map((photo) => (
                <div key={photo.id} className="relative">
                  <Image
                    src={photo.url}
                    alt="Pet photo"
                    width={200}
                    height={200}
                    className="rounded-lg object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="photos"
              className="block text-sm font-medium text-gray-700"
            >
              Add Photos
            </label>
            <input
              type="file"
              id="photos"
              name="photos"
              accept="image/*"
              multiple
              onChange={(e) => setPhotos(Array.from(e.target.files || []))}
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving..." : pet ? "Save Changes" : "Add Pet"}
          </button>
        </div>
      </div>
    </form>
  );
}
