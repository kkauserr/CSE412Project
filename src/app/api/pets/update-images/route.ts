import { NextResponse } from "next/server";
import { updatePetImages } from "@/app/shelters/actions";

export async function POST() {
  try {
    const result = await updatePetImages();
    if (result.success) {
      return NextResponse.json({ message: "Pet images updated successfully" });
    } else {
      return NextResponse.json(
        { error: "Failed to update pet images" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in update-images route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
