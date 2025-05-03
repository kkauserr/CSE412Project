import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { query } from "@/lib/db";
import DashboardTabs from "@/components/DashboardTabs";

interface Pet {
  id: number;
  name: string;
  species: string;
  breed: string | null;
  status: "available" | "adopted";
  created_at: string;
  image_url: string | null;
  inquiry_count: number;
}

interface Inquiry {
  id: number;
  pet_name: string;
  user_email: string;
  message: string;
  created_at: string;
}

async function getShelterData(userId: number) {
  // Get shelter ID for the user
  const shelter = await query<{ id: number }>(
    "SELECT id FROM shelter WHERE email_login = (SELECT email FROM user_account WHERE id = $1)",
    [userId]
  ).then((rows) => rows[0]);

  if (!shelter) {
    return null;
  }

  // Get pets with inquiry counts
  const pets = await query<Pet>(
    `
    SELECT 
      p.id,
      p.name,
      p.species,
      p.breed,
      p.status,
      p.created_at,
      pp.url as photo_url,
      COUNT(i.id) as inquiry_count
    FROM pet p
    LEFT JOIN pet_photo pp ON pp.pet_id = p.id AND pp.sort_order = 1
    LEFT JOIN inquiry i ON i.pet_id = p.id
    WHERE p.shelter_id = $1
    GROUP BY p.id, pp.url
    ORDER BY p.created_at DESC
  `,
    [shelter.id]
  );

  // Get recent inquiries
  const inquiries = await query<Inquiry>(
    `
    SELECT 
      i.id,
      p.name as pet_name,
      u.email as user_email,
      i.message,
      i.created_at
    FROM inquiry i
    JOIN pet p ON p.id = i.pet_id
    JOIN user_account u ON u.id = i.user_id
    WHERE p.shelter_id = $1
    ORDER BY i.created_at DESC
    LIMIT 10
  `,
    [shelter.id]
  );

  return {
    shelterId: shelter.id,
    pets,
    inquiries,
  };
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "shelter_admin") {
    redirect("/auth/login?returnTo=/dashboard");
  }

  const data = await getShelterData(session.user.id);

  if (!data) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Shelter Dashboard
        </h1>
        <DashboardTabs
          pets={data.pets}
          inquiries={data.inquiries}
          shelterId={data.shelterId}
        />
      </div>
    </div>
  );
}
