import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { AuthOptions } from "next-auth";

const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
      // Google OAuth Provider
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
  
      // Credentials (Email/Password) Provider
      CredentialsProvider({
        name: "Email",
        credentials: {
          email: { label: "Email", type: "email", placeholder: "user@example.com" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Missing credentials");
          }
  
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });
  
          if (!user || !user.password) {
            throw new Error("User not found");
          }
  
          const isValidPassword = await bcrypt.compare(credentials.password, user.password);
  
          if (!isValidPassword) {
            throw new Error("Invalid credentials");
          }
  
          // Ensure returned user matches NextAuth's expected `User` type
          return {
            id: user.id,
            email: user.email,
            name: user.name || null,
          };
        },
      }),
    ],
    pages: {
      signIn: "/login",
      signOut: "/",
    },
    session: {
      strategy: "jwt",
    },
    callbacks: {
      async session({ session, token }) {
        if (token) {
          session.user = {
            id: token.id as string,
            email: token.email as string,
            name: session.user?.name || null,
          };
        }
        return session;
      },
      async jwt({ token, user }) {
        if (user) {
          token.id = user.id;
          token.email = user.email;
        }
        return token;
      },
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };