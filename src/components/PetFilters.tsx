"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export default function PetFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleFilterChange = (name: string, value: string) => {
    const queryString = createQueryString(name, value);
    router.push(`/pets${queryString ? `?${queryString}` : ""}`);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Species
          </label>
          <select
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={searchParams.get("species") || ""}
            onChange={(e) => handleFilterChange("species", e.target.value)}
          >
            <option value="">All Species</option>
            <option value="Dog">Dogs</option>
            <option value="Cat">Cats</option>
            <option value="Bird">Birds</option>
            <option value="Rabbit">Rabbits</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Age Range (months)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Min"
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={searchParams.get("minAge") || ""}
              onChange={(e) => handleFilterChange("minAge", e.target.value)}
              min="0"
            />
            <input
              type="number"
              placeholder="Max"
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={searchParams.get("maxAge") || ""}
              onChange={(e) => handleFilterChange("maxAge", e.target.value)}
              min="0"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Weight Range (kg)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Min"
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={searchParams.get("minWeight") || ""}
              onChange={(e) => handleFilterChange("minWeight", e.target.value)}
              min="0"
              step="0.1"
            />
            <input
              type="number"
              placeholder="Max"
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={searchParams.get("maxWeight") || ""}
              onChange={(e) => handleFilterChange("maxWeight", e.target.value)}
              min="0"
              step="0.1"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            type="text"
            placeholder="Search by name, breed..."
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={searchParams.get("search") || ""}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
