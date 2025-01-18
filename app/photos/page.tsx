"use client";

import React, { useState, useEffect } from "react";

interface UploadResult {
  photoUrl: string;
  family_scientificNameWithoutAuthor: string;
  genus_scientificNameWithoutAuthor: string;
}

interface LatestRecognizedPhoto {
  id: string;
  photoUrl: string;
  family_scientificNameWithoutAuthor: string;
  created_at: string;
}

interface PlantFamily {
  id: string;
  family_scientificNameWithoutAuthor: string;
}

export default function PhotoUploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [plantFamilies, setPlantFamilies] = useState<PlantFamily[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [latestPhotos, setLatestPhotos] = useState<
    Record<string, { photoUrl: string; createdAt: string }[]>
  >({});
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [photosError, setPhotosError] = useState<string | null>(null);
  const [latestRecognized, setLatestRecognized] = useState<
    LatestRecognizedPhoto[]
  >([]);
  const [loadingLatest, setLoadingLatest] = useState(false);

  const fetchLatestPhotos = async (families: PlantFamily[]) => {
    setLoadingPhotos(true);
    setPhotosError(null);
    try {
      const familyNames = families.map(
        (f) => f.family_scientificNameWithoutAuthor
      );
      const queryParams = familyNames
        .map((f) => `family=${encodeURIComponent(f)}`)
        .join("&");
      const response = await fetch(`/api/photos/latest?${queryParams}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const photos: Record<string, { photoUrl: string; createdAt: string }[]> =
        {};

      data.forEach(
        (result: {
          family: string;
          photos: { photoUrl: string; createdAt: string }[];
        }) => {
          photos[result.family] = result.photos;
        }
      );

      setLatestPhotos(photos);
    } catch (err) {
      setPhotosError("Failed to load some photos");
      console.error("Error fetching photos:", err);
    } finally {
      setLoadingPhotos(false);
    }
  };

  const fetchPlantFamilies = async (page: number = 1) => {
    try {
      const response = await fetch(`/api/plant-families?page=${page}`);
      const data = await response.json();
      setPlantFamilies(data.families);
      setTotalPages(data.totalPages);
      setCurrentPage(page);
      fetchLatestPhotos(data.families);
    } catch (err) {
      console.error("Failed to fetch plant families:", err);
    }
  };

  useEffect(() => {
    const fetchLatestRecognized = async () => {
      setLoadingLatest(true);
      try {
        const response = await fetch("/api/photos/latest-recognized");
        if (!response.ok)
          throw new Error("Failed to fetch latest recognized photos");
        const data = await response.json();
        setLatestRecognized(data);
      } catch (err) {
        console.error("Error fetching latest recognized photos:", err);
      } finally {
        setLoadingLatest(false);
      }
    };

    fetchPlantFamilies();
    fetchLatestRecognized();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("images", selectedFile);

    try {
      const response = await fetch("/api/photos", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to upload photo: ${errorText}`);
      }

      const data = await response.json();
      console.log("API Response:", data);
      setUploadResult(data.data);
      setError(null);
    } catch (err) {
      setError(err as string);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Upload a Photo</h1>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-4"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Upload
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}
      {photosError && <p className="text-red-500 mt-4">{photosError}</p>}

      <h2 className="text-xl font-bold mt-8">Latest Recognized Plants</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {loadingLatest ? (
          <p>Loading latest recognized plants...</p>
        ) : latestRecognized.length > 0 ? (
          latestRecognized.map((photo) => (
            <div
              key={photo.id}
              className="bg-white shadow-md rounded-lg overflow-hidden"
            >
              <div className="bg-gray-200 h-32 flex items-center justify-center">
                <img
                  src={photo.photoUrl}
                  alt={`Recognized ${photo.family_scientificNameWithoutAuthor}`}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold">
                  {photo.family_scientificNameWithoutAuthor}
                </h3>
              </div>
            </div>
          ))
        ) : (
          <p>No recently recognized plants</p>
        )}
      </div>

      <h2 className="text-xl font-bold mt-8">Plant Families</h2>
      <div className="flex flex-col items-center gap-4 mt-4">
        <div className="flex gap-2">
          <button
            onClick={() => fetchPlantFamilies(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => fetchPlantFamilies(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span>Go to page:</span>
          <input
            type="number"
            min="1"
            max={totalPages}
            className="w-20 px-2 py-1 border rounded"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const page = parseInt((e.target as HTMLInputElement).value);
                if (!isNaN(page) && page >= 1 && page <= totalPages) {
                  fetchPlantFamilies(page);
                }
              }
            }}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {plantFamilies.map((family) => (
          <div
            key={family.id}
            className="bg-white shadow-md rounded-lg overflow-hidden"
          >
            <div className="bg-gray-200 h-32 flex items-center justify-center">
              {loadingPhotos ? (
                <p className="text-center">Loading...</p>
              ) : latestPhotos[family.family_scientificNameWithoutAuthor]
                  ?.length > 0 ? (
                <div className="relative h-full w-full">
                  {latestPhotos[family.family_scientificNameWithoutAuthor].map(
                    (photo, index) => (
                      <img
                        key={index}
                        src={photo.photoUrl}
                        alt={`Latest ${family.family_scientificNameWithoutAuthor}`}
                        className={`absolute h-full w-full object-cover transition-opacity duration-300 ${
                          index === 0 ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    )
                  )}
                </div>
              ) : (
                <p className="text-center">No Image</p>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold">
                {family.family_scientificNameWithoutAuthor}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {uploadResult &&
        !plantFamilies.some(
          (family) =>
            family.family_scientificNameWithoutAuthor ===
            uploadResult.family_scientificNameWithoutAuthor
        ) && (
          <p className="text-red-500 mt-4">Error: Plant family not matched.</p>
        )}
    </div>
  );
}
