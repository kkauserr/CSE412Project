"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Pet {
  id: number;
  name: string;
  species: string;
  breed: string | null;
  status: "available" | "adopted";
  created_at: string;
  image_url: string | null;
  inquiry_count: number;
}

interface Inquiry {
  id: number;
  pet_name: string;
  user_email: string;
  message: string;
  created_at: string;
}

interface DashboardTabsProps {
  pets: Pet[];
  inquiries: Inquiry[];
  shelterId: number;
}

export default function DashboardTabs({
  pets,
  inquiries,
  shelterId,
}: DashboardTabsProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"pets" | "inquiries">("pets");
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async (
    petId: number,
    newStatus: "available" | "adopted"
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/pets/${petId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      router.refresh();
    } catch (error) {
      console.error("Error updating pet status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("pets")}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm
              ${
                activeTab === "pets"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }
            `}
          >
            Pets ({pets.length})
          </button>
          <button
            onClick={() => setActiveTab("inquiries")}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm
              ${
                activeTab === "inquiries"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }
            `}
          >
            Recent Inquiries ({inquiries.length})
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="mt-6">
        {activeTab === "pets" ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium">Your Pets</h2>
              <Link
                href="/dashboard/pets/new"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Add New Pet
              </Link>
            </div>

            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pet
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Inquiries
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pets.map((pet) => (
                    <tr key={pet.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            {pet.image_url ? (
                              <Image
                                src={pet.image_url}
                                alt={pet.name}
                                width={40}
                                height={40}
                                className="rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200" />
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {pet.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {pet.species}
                          {pet.breed && ` • ${pet.breed}`}
                        </div>
                        <div className="text-sm text-gray-500">
                          Added {new Date(pet.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={pet.status}
                          onChange={(e) =>
                            handleStatusChange(
                              pet.id,
                              e.target.value as "available" | "adopted"
                            )
                          }
                          disabled={isLoading}
                          className="text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option value="available">Available</option>
                          <option value="adopted">Adopted</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {pet.inquiry_count} inquiries
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/dashboard/pets/${pet.id}/edit`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-medium mb-6">Recent Inquiries</h2>
            <div className="space-y-6">
              {inquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="bg-white shadow-sm rounded-lg p-6"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        Inquiry for {inquiry.pet_name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        From: {inquiry.user_email}
                      </p>
                      <p className="text-sm text-gray-500">
                        Received:{" "}
                        {new Date(inquiry.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-gray-600 whitespace-pre-line">
                    {inquiry.message}
                  </p>
                </div>
              ))}

              {inquiries.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  No inquiries yet
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
