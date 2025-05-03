import { query } from "@/lib/db";
import PetCard from "@/components/PetCard";
import PetFilters from "@/components/PetFilters";

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

interface SearchParams {
  species?: string;
  minAge?: string;
  maxAge?: string;
  minWeight?: string;
  maxWeight?: string;
  search?: string;
}

async function getPets(searchParams: SearchParams) {
  const conditions = [];
  const params = [];
  let paramCount = 1;

  // Get searchParams values after they are ready
  const species = searchParams.species;
  const minAge = searchParams.minAge;
  const maxAge = searchParams.maxAge;
  const minWeight = searchParams.minWeight;
  const maxWeight = searchParams.maxWeight;
  const search = searchParams.search;

  if (species) {
    conditions.push(`p.species = $${paramCount}`);
    params.push(species);
    paramCount++;
  }

  if (minAge) {
    conditions.push(`p.age_months >= $${paramCount}`);
    params.push(parseInt(minAge));
    paramCount++;
  }

  if (maxAge) {
    conditions.push(`p.age_months <= $${paramCount}`);
    params.push(parseInt(maxAge));
    paramCount++;
  }

  if (minWeight) {
    conditions.push(`p.weight_kg >= $${paramCount}`);
    params.push(parseFloat(minWeight));
    paramCount++;
  }

  if (maxWeight) {
    conditions.push(`p.weight_kg <= $${paramCount}`);
    params.push(parseFloat(maxWeight));
    paramCount++;
  }

  if (search) {
    conditions.push(`(
      p.name ILIKE $${paramCount}
      OR p.breed ILIKE $${paramCount}
      OR p.description ILIKE $${paramCount}
    )`);
    params.push(`%${search}%`);
    paramCount++;
  }

  const whereClause =
    conditions.length > 0
      ? `WHERE p.status = 'available' AND ${conditions.join(" AND ")}`
      : "WHERE p.status = 'available'";

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
    ${whereClause}
    ORDER BY p.created_at DESC
  `,
    params
  );

  return pets;
}

export default async function PetsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const pets = await getPets(searchParams);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Available Pets
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <PetFilters />
          </div>

          <div className="lg:col-span-3">
            {pets.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900">
                  No pets found
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Try adjusting your filters or search criteria
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pets.map((pet) => (
                  <PetCard key={pet.id} pet={pet} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
