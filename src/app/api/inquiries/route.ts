import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { query } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { petId, message } = await req.json();

    if (!petId || !message) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if pet exists and is available
    const pet = await query<{ id: number }>(
      "SELECT id FROM pet WHERE id = $1 AND status = 'available'",
      [petId]
    ).then((rows) => rows[0]);

    if (!pet) {
      return NextResponse.json(
        { message: "Pet not found or not available" },
        { status: 404 }
      );
    }

    // Create inquiry
    await query(
      "INSERT INTO inquiry (pet_id, user_id, message) VALUES ($1, $2, $3)",
      [petId, session.user.id, message]
    );

    return NextResponse.json(
      { message: "Inquiry submitted successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Inquiry submission error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
