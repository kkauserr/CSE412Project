import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const preferences = await request.json();

    // Store preferences in the database
    await query(
      `INSERT INTO adopter_preferences (
        user_id,
        species,
        min_age_months,
        max_age_months,
        min_weight_kg,
        max_weight_kg,
        activity_level,
        living_space,
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id) DO UPDATE SET
        species = EXCLUDED.species,
        min_age_months = EXCLUDED.min_age_months,
        max_age_months = EXCLUDED.max_age_months,
        min_weight_kg = EXCLUDED.min_weight_kg,
        max_weight_kg = EXCLUDED.max_weight_kg,
        activity_level = EXCLUDED.activity_level,
        living_space = EXCLUDED.living_space,
        updated_at = CURRENT_TIMESTAMP`,
      [
        session.user.id,
        preferences.species,
        preferences.minAge,
        preferences.maxAge,
        preferences.minWeight,
        preferences.maxWeight,
        preferences.activityLevel,
        preferences.livingSpace,
      ]
    );

    // Get matching pets based on preferences
    const pets = await query(
      `SELECT 
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
      WHERE p.status = 'available'
        AND p.species = $1
        AND ($2::integer IS NULL OR p.age_months >= $2)
        AND ($3::integer IS NULL OR p.age_months <= $3)
        AND ($4::numeric IS NULL OR p.weight_kg >= $4)
        AND ($5::numeric IS NULL OR p.weight_kg <= $5)
      ORDER BY p.created_at DESC
      LIMIT 10`,
      [
        preferences.species,
        preferences.minAge || null,
        preferences.maxAge || null,
        preferences.minWeight || null,
        preferences.maxWeight || null,
      ]
    );

    return NextResponse.json({ success: true, pets });
  } catch (error) {
    console.error("Error saving preferences:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
