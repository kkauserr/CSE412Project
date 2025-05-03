import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
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
        living_space
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (user_id) DO UPDATE SET
        species = EXCLUDED.species,
        min_age_months = EXCLUDED.min_age_months,
        max_age_months = EXCLUDED.max_age_months,
        min_weight_kg = EXCLUDED.min_weight_kg,
        max_weight_kg = EXCLUDED.max_weight_kg,
        activity_level = EXCLUDED.activity_level,
        living_space = EXCLUDED.living_space`,
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving preferences:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
