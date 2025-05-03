import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { query } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "shelter_admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { status } = await req.json();

    if (!["available", "adopted"].includes(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    // Verify the pet belongs to the shelter
    const pet = await query<{ shelter_id: number }>(
      `SELECT s.id as shelter_id
       FROM pet p
       JOIN shelter s ON s.id = p.shelter_id
       JOIN user_account u ON u.email = s.email_login
       WHERE p.id = $1 AND u.id = $2`,
      [params.id, session.user.id]
    ).then((rows) => rows[0]);

    if (!pet) {
      return NextResponse.json(
        { message: "Pet not found or unauthorized" },
        { status: 404 }
      );
    }

    // Update pet status
    await query(
      "UPDATE pet SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
      [status, params.id]
    );

    return NextResponse.json(
      { message: "Status updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Pet status update error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
