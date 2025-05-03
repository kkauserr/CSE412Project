import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: number;
    email: string;
    role: "adopter" | "shelter_admin";
  }

  interface Session {
    user: User & {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    role: "adopter" | "shelter_admin";
    email?: string | null;
    name?: string | null;
    picture?: string | null;
  }
}
