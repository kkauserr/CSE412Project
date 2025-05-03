"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getShelters, searchShelters, type Shelter } from "./actions";

export default function SheltersPage() {
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Load initial data
  useEffect(() => {
    getShelters().then(setShelters);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const results = await searchShelters(searchQuery);
      setShelters(results);
    } catch (error) {
      console.error("Error searching shelters:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary/5 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Find Pet Shelters
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Connect with local shelters and discover your new best friend
          </p>
          <form onSubmit={handleSearch} className="flex gap-4 max-w-2xl">
            <input
              type="text"
              placeholder="Search by shelter name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shelters.length === 0 ? (
            <div className="col-span-full text-center text-muted-foreground">
              No shelters found. Try adjusting your search.
            </div>
          ) : (
            shelters.map((shelter) => (
              <div
                key={shelter.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold text-primary mb-2">
                  {shelter.name}
                </h3>
                <p className="text-muted-foreground mb-4">{shelter.address}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span>📞 {shelter.phone}</span>
                  <span>🐾 {shelter.pet_count} Pets</span>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <a href={`/shelters/${shelter.id}`}>View Details</a>
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
