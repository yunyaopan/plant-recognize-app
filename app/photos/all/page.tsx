"use client";

import React, { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";

interface Photo {
  id: string;
  photoUrl: string;
  family_scientificNameWithoutAuthor: string;
  genus_scientificNameWithoutAuthor: string; // Added genus
  date_taken: string | null; // Added date_taken
  country: string | null; // Added country
  city: string | null; // Added city
  district: string | null; // Added district
  createdAt: string;
}

export default function AllPhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true);
      try {
        const sortField = "family_scientificNameWithoutAuthor";
        const sortOrder = "asc";

        const response = await fetch(`/api/photos?sortField=${sortField}&sortOrder=${sortOrder}`);
        if (!response.ok) throw new Error("Failed to fetch photos");

        const data = await response.json();
        setPhotos(data);
      } catch (err) {
        setError("Error fetching photos");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Toaster position="bottom-center" />
      <h1 className="text-2xl font-bold mb-4">All Plant Photos</h1>
      {error && <p className="text-red-500">{error}</p>}
      {loading ? (
        <p>Loading photos...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {photos.map((photo) => (
            <div key={photo.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="bg-gray-200 h-48 md:h-64 lg:h-80 flex items-center justify-center">
                <img
                  src={photo.photoUrl}
                  alt={`Plant ${photo.family_scientificNameWithoutAuthor}`}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold">
                  {photo.family_scientificNameWithoutAuthor}
                </h3>
                <p className="text-md font-medium">
                  Genus: {photo.genus_scientificNameWithoutAuthor}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Date Taken: {photo.date_taken ? new Date(photo.date_taken).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }) : "N/A"}
                </p>
                <p className="text-sm text-gray-500">
                  Location: {photo.city || "N/A"}, {photo.district || "N/A"}, {photo.country || "N/A"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}