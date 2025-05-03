import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { query } from "@/lib/db";
import PetForm from "@/components/PetForm";

interface Pet {
  id: number;
  name: string;
  species: string;
  breed: string | null;
  sex: string;
  age_months: number;
  weight_kg: number;
  description: string;
  photos: { id: number; url: string; sort_order: number }[];
}

async function getPet(id: string, userId: number): Promise<Pet | null> {
  const pet = await query<Pet>(
    `
    SELECT 
      p.id,
      p.name,
      p.species,
      p.breed,
      p.sex,
      p.age_months,
      p.weight_kg,
      p.description,
      COALESCE(
        json_agg(
          json_build_object(
            'id', pp.id,
            'url', pp.url,
            'sort_order', pp.sort_order
          ) ORDER BY pp.sort_order
        ) FILTER (WHERE pp.id IS NOT NULL),
        '[]'
      ) as photos
    FROM pet p
    JOIN shelter s ON s.id = p.shelter_id
    JOIN user_account u ON u.email = s.email_login
    LEFT JOIN pet_photo pp ON pp.pet_id = p.id
    WHERE p.id = $1 AND u.id = $2
    GROUP BY p.id
  `,
    [id, userId]
  ).then((rows) => rows[0] || null);

  return pet;
}

export default async function EditPetPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "shelter_admin") {
    redirect("/auth/login?returnTo=/dashboard");
  }

  const pet = await getPet(params.id, session.user.id);

  if (!pet) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Pet</h1>
        <PetForm pet={pet} />
      </div>
    </div>
  );
}
