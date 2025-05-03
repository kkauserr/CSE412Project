import Link from "next/link";
import Image from "next/image";

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

function formatAge(months: number): string {
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (years > 0) {
    return `${years} year${years > 1 ? "s" : ""}${
      remainingMonths > 0
        ? `, ${remainingMonths} month${remainingMonths > 1 ? "s" : ""}`
        : ""
    }`;
  }
  return `${months} month${months > 1 ? "s" : ""}`;
}

function formatWeight(weight: string | number): string {
  const numWeight = typeof weight === "string" ? parseFloat(weight) : weight;
  return numWeight.toFixed(1);
}

export default function PetCard({ pet }: { pet: Pet }) {
  return (
    <Link href={`/pets/${pet.id}`} className="block">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
        <div className="relative h-56">
          {pet.image_url ? (
            <Image
              src={pet.image_url}
              alt={pet.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400">No photo available</span>
            </div>
          )}
        </div>

        <div className="p-5">
          <h3 className="font-semibold text-xl text-gray-900 mb-1">
            {pet.name}
          </h3>
          <p className="text-gray-600 mb-3">
            {pet.breed ? `${pet.species} • ${pet.breed}` : pet.species}
          </p>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-1.5">
              <svg
                className="w-4 h-4"
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
              <span>{formatAge(pet.age_months)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                />
              </svg>
              <span>{formatWeight(pet.weight_kg)} kg</span>
            </div>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <svg
              className="w-4 h-4 mr-1.5"
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <p className="truncate">{pet.shelter_name}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
