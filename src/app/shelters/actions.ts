"use server";

import { query } from "@/lib/db";

export interface Shelter {
  id: number;
  name: string;
  address: string;
  phone: string;
  pet_count: number;
}

// Define specific pet types
type PetType = "dog" | "cat" | "bird" | "rabbit" | "other";

interface Pet {
  id: number;
  name: string;
  type: PetType;
  image_url?: string;
}

// Organized pet images by specific types
const petImages = {
  dog: [
    "https://images.unsplash.com/photo-1543466835-00a7907e9de1",
    "https://images.unsplash.com/photo-1587300003388-59208cc962cb",
    "https://images.unsplash.com/photo-1517849845537-4d257902454a",
    "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e",
    "https://images.unsplash.com/photo-1583337130417-3346a1be7dee",
  ],
  cat: [
    "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba",
    "https://images.unsplash.com/photo-1573865526739-10659fec78a5",
    "https://images.unsplash.com/photo-1495360010541-f48722b34f7d",
    "https://images.unsplash.com/photo-1518791841217-8f162f1e1131",
    "https://images.unsplash.com/photo-1574158622682-e40e69881006",
  ],
  rabbit: [
    "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308",
    "https://images.unsplash.com/photo-1589933767411-38a58367efd7",
    "https://images.unsplash.com/photo-1452857297128-d9c29adba80b",
    "https://images.unsplash.com/photo-1591382386627-349b692688ff",
    "https://images.unsplash.com/photo-1593099295589-ddb779f4a0b9",
  ],
  bird: [
    "https://images.unsplash.com/photo-1552728089-57bdde30beb3",
    "https://images.unsplash.com/photo-1544923408-75c5cef46f14",
    "https://images.unsplash.com/photo-1595780951345-d291d3e63f57",
    "https://images.unsplash.com/photo-1591198936750-16d8e15edb9e",
    "https://images.unsplash.com/photo-1591198936750-16d8e15edb9e",
  ],
  other: [
    "https://images.unsplash.com/photo-1425082661705-1834bfd09dca",
    "https://images.unsplash.com/photo-1583301286816-f4f05e1e8b25",
    "https://images.unsplash.com/photo-1548767797-d8c844163c4c",
    "https://images.unsplash.com/photo-1590418606746-018840f9cd0f",
    "https://images.unsplash.com/photo-1587559045816-8b0a54d1fbd2",
  ],
};

export async function updatePetImages() {
  try {
    // Get all pets with their current types and images
    const pets = await query<Pet>(`
      SELECT id, name, 
             CASE 
               WHEN LOWER(type) IN ('dog', 'cat', 'bird', 'rabbit') THEN LOWER(type)
               ELSE 'other'
             END as type,
             image_url
      FROM pet
    `);

    let updatedCount = 0;
    const usedImages: Record<PetType, Set<string>> = {
      dog: new Set(),
      cat: new Set(),
      bird: new Set(),
      rabbit: new Set(),
      other: new Set(),
    };

    for (const pet of pets) {
      const typeImages = petImages[pet.type];
      let unusedImages = typeImages.filter(
        (img) => !usedImages[pet.type].has(img)
      );

      // If all images are used, reset the collection for this type
      if (unusedImages.length === 0) {
        usedImages[pet.type].clear();
        unusedImages = typeImages;
      }

      // Select a random unused image
      const randomIndex = Math.floor(Math.random() * unusedImages.length);
      const newImage = unusedImages[randomIndex];

      // Skip if the new image is the same as the current one
      if (newImage === pet.image_url) {
        continue;
      }

      await query("UPDATE pet SET image_url = $1 WHERE id = $2", [
        newImage,
        pet.id,
      ]);

      usedImages[pet.type].add(newImage);
      updatedCount++;
    }

    return {
      success: true,
      message: `Successfully updated ${updatedCount} pet images`,
      updatedPets: updatedCount,
    };
  } catch (error) {
    console.error("Error updating pet images:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      updatedPets: 0,
    };
  }
}

export async function searchShelters(searchQuery: string) {
  try {
    const shelters = await query<Shelter>(
      `
      SELECT 
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
    `,
      [`%${searchQuery}%`]
    );
    return shelters;
  } catch (error) {
    console.error("Error searching shelters:", error);
    return [];
  }
}

export async function getShelters() {
  try {
    const shelters = await query<Shelter>(`
      SELECT 
        s.id,
        s.name,
        s.address,
        s.phone,
        COUNT(p.id) as pet_count
      FROM shelter s
      LEFT JOIN pet p ON p.shelter_id = s.id AND p.status = 'available'
      GROUP BY s.id, s.name, s.address, s.phone
      ORDER BY s.name
    `);
    return shelters;
  } catch (error) {
    console.error("Error fetching shelters:", error);
    return [];
  }
}
