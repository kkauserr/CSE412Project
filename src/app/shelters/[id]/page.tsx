import { notFound } from "next/navigation";
import { query } from "@/lib/db";
import PetCard from "@/components/PetCard";

interface Shelter {
  id: number;
  name: string;
  address: string;
  phone: string;
}

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

async function getShelterWithPets(id: string) {
  const shelter = await query<Shelter>(
    `SELECT id, name, address, phone FROM shelter WHERE id = $1`,
    [id]
  ).then((rows) => rows[0] || null);

  if (!shelter) {
    return null;
  }

  const pets = await query<Pet>(
    `
    SELECT 
      p.id,
      p.name,
      p.species,
      p.breed,
      p.age_months,
      p.weight_kg::text,
      p.description,
      pp.url as image_url,
      s.name as shelter_name,
      s.id as shelter_id
    FROM pet p
    LEFT JOIN pet_photo pp ON pp.pet_id = p.id AND pp.sort_order = 1
    JOIN shelter s ON s.id = p.shelter_id
    WHERE p.shelter_id = $1 AND p.status = 'available'
    ORDER BY p.created_at DESC
  `,
    [id]
  );

  return {
    ...shelter,
    pets,
  };
}

export default async function ShelterPage({
  params,
}: {
  params: { id: string };
}) {
  const data = await getShelterWithPets(params.id);

  if (!data) {
    notFound();
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{data.name}</h1>
          <div className="text-lg text-gray-600">
            <p className="mb-2">{data.address}</p>
            <p>{data.phone}</p>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 mb-8">
          Available Pets
        </h2>

        {data.pets.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">
              No pets available
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Check back later for new pets
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.pets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
