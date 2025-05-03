import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { query, transaction } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email, password, role } = await req.json();

    // Validate input
    if (!email || !password || !role) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!["adopter", "shelter_admin"].includes(role)) {
      return NextResponse.json({ message: "Invalid role" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await query<{ id: number }>(
      "SELECT id FROM user_account WHERE email = $1",
      [email]
    ).then((rows) => rows[0]);

    if (existingUser) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create user account
    await transaction(async (client) => {
      const result = await client.query(
        "INSERT INTO user_account (email, hashed_password, role) VALUES ($1, $2, $3) RETURNING id",
        [email, hashedPassword, role]
      );

      // If shelter admin, create shelter record
      if (role === "shelter_admin") {
        await client.query(
          "INSERT INTO shelter (name, email_login, hashed_password, address, location, phone) VALUES ($1, $2, $3, $4, ST_Point(0, 0)::geography, $5)",
          [
            "New Shelter", // Default name
            email,
            hashedPassword,
            "Address pending", // Default address
            "Phone pending", // Default phone
          ]
        );
      }

      return result.rows[0];
    });

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
