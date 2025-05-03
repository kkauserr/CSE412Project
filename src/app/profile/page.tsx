"use client";

import { useSession } from "next-auth/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProfilePage() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">
            Please Sign In
          </h1>
          <p className="text-muted-foreground">
            You need to be signed in to view this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary/5 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-primary mb-4">My Profile</h1>
          <p className="text-muted-foreground text-lg">
            Manage your account and view your adoption journey
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="preferences" className="space-y-8">
          <TabsList className="bg-background border">
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="saved">Saved Pets</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent
            value="preferences"
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h2 className="text-2xl font-semibold mb-6">Pet Preferences</h2>
            {/* Preferences content */}
          </TabsContent>

          <TabsContent
            value="applications"
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h2 className="text-2xl font-semibold mb-6">My Applications</h2>
            {/* Applications content */}
          </TabsContent>

          <TabsContent
            value="saved"
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h2 className="text-2xl font-semibold mb-6">Saved Pets</h2>
            {/* Saved pets content */}
          </TabsContent>

          <TabsContent
            value="settings"
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h2 className="text-2xl font-semibold mb-6">Account Settings</h2>
            {/* Settings content */}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
