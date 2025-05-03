import { notFound } from "next/navigation";
import Image from "next/image";
import { query } from "@/lib/db";
import AdoptionForm from "@/components/AdoptionForm";

interface Pet {
  id: number;
  name: string;
  species: string;
  breed: string | null;
  sex: string;
  age_months: number;
  weight_kg: string | number;
  description: string;
  shelter_name: string;
  shelter_id: number;
  photos: { url: string }[];
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

async function getPet(id: string): Promise<Pet | null> {
  const pet = await query<Pet>(
    `
    SELECT 
      p.id,
      p.name,
      p.species,
      p.breed,
      p.sex,
      p.age_months,
      p.weight_kg::text,
      p.description,
      s.name as shelter_name,
      s.id as shelter_id,
      COALESCE(
        json_agg(
          json_build_object('url', pp.url)
          ORDER BY pp.sort_order
        ) FILTER (WHERE pp.id IS NOT NULL),
        '[]'
      ) as photos
    FROM pet p
    JOIN shelter s ON s.id = p.shelter_id
    LEFT JOIN pet_photo pp ON pp.pet_id = p.id
    WHERE p.id = $1 AND p.status = 'available'
    GROUP BY p.id, s.id, s.name
  `,
    [id]
  ).then((rows) => rows[0] || null);

  return pet;
}

export default async function PetPage({ params }: { params: { id: string } }) {
  const pet = await getPet(params.id);

  if (!pet) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Photo Gallery */}
          <div className="relative h-[500px]">
            {pet.photos.length > 0 ? (
              <Image
                src={pet.photos[0].url}
                alt={pet.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400">No photos available</span>
              </div>
            )}
          </div>

          <div className="p-8">
            <div className="flex flex-col lg:flex-row lg:justify-between">
              {/* Pet Details */}
              <div className="lg:w-2/3 lg:pr-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {pet.name}
                </h1>
                <p className="text-lg text-gray-600 mb-6">
                  {pet.breed ? `${pet.species} • ${pet.breed}` : pet.species}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Age</p>
                    <p className="text-lg font-medium mt-1">
                      {formatAge(pet.age_months)}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Weight</p>
                    <p className="text-lg font-medium mt-1">
                      {formatWeight(pet.weight_kg)} kg
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Sex</p>
                    <p className="text-lg font-medium mt-1">{pet.sex}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Shelter</p>
                    <p className="text-lg font-medium mt-1">
                      {pet.shelter_name}
                    </p>
                  </div>
                </div>

                <div className="prose max-w-none">
                  <h2 className="text-2xl font-semibold mb-4">
                    About {pet.name}
                  </h2>
                  <p className="text-gray-600 whitespace-pre-line leading-relaxed">
                    {pet.description}
                  </p>
                </div>
              </div>

              {/* Adoption Form */}
              <div className="lg:w-1/3 mt-8 lg:mt-0">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <AdoptionForm petId={pet.id} petName={pet.name} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
