import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const searchQuery = searchParams.get("q");

  if (!searchQuery) {
    return NextResponse.json(
      { error: "Search query is required" },
      { status: 400 }
    );
  }

  try {
    const shelters = await query(
      `SELECT 
        s.id,
        s.name,
        s.address,
        s.phone,
        COUNT(p.id) as pet_count
      FROM shelter s
      LEFT JOIN pet p ON p.shelter_id = s.id AND p.status = 'available'
      WHERE 
        s.name ILIKE $1 OR 
        s.address ILIKE $1
      GROUP BY s.id, s.name, s.address, s.phone
      ORDER BY s.name
      LIMIT 10`,
      [`%${searchQuery}%`]
    );

    return NextResponse.json(shelters);
  } catch (error) {
    console.error("Error searching shelters:", error);
    return NextResponse.json(
      { error: "Failed to search shelters" },
      { status: 500 }
    );
  }
}
