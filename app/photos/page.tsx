"use client";

import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

interface LatestRecognizedPhoto {
  id: string;
  photoUrl: string;
  family_scientificNameWithoutAuthor: string;
  createdAt: string;
}

interface PlantFamily {
  id: string;
  family_scientificNameWithoutAuthor: string;
}

export default function PhotoUploadPage() {
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
  const [uniqueFamiliesCount, setUniqueFamiliesCount] = useState<number>(0);
  const [loadingCount, setLoadingCount] = useState(false);

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

    const fetchUniqueFamiliesCount = async () => {
      setLoadingCount(true);
      try {
        const response = await fetch("/api/photos/count");
        if (!response.ok)
          throw new Error("Failed to fetch unique families count");
        const data = await response.json();
        setUniqueFamiliesCount(data.unique_families);
      } catch (err) {
        console.error("Error fetching unique families count:", err);
      } finally {
        setLoadingCount(false);
      }
    };

    fetchPlantFamilies();
    fetchLatestRecognized();
    fetchUniqueFamiliesCount();
  }, []);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      // Immediately start uploading the file
      const uploadToast = toast.loading("Uploading photo...");

      const formData = new FormData();
      formData.append("images", file);

      try {
        const response = await fetch("/api/photos", {
          method: "POST",
          body: formData,
        });
        toast.loading("Recognizing plant...", { id: uploadToast });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to upload photo: ${errorText}`);
        }

        const data = await response.json();
        console.log("API Response:", data);
        setError(null);
        toast.success("Photo uploaded and plant recognized!", {
          id: uploadToast,
        });

        // Refresh latest recognized photos
        const latestResponse = await fetch("/api/photos/latest-recognized");
        if (!latestResponse.ok)
          throw new Error("Failed to fetch latest photos");
        const latestData = await latestResponse.json();
        setLatestRecognized(latestData);
      } catch (err) {
        setError((err as Error).message);
        toast.error("Failed to upload and recognize photo", {
          id: uploadToast,
        });
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Toaster position="bottom-center" />
      <h1 className="text-2xl font-bold mb-4">
        Upload a plant photo, and we'll identify its family!
      </h1>
      <label className="group cursor-pointer">
        <div className="w-full max-w-2xl border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
          <div className="relative inline-block">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-gray-400 group-hover:text-gray-500 transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <div className="absolute -top-1 -right-1 bg-white rounded-full p-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">
            Did you know there are over 400 plant families in the world?{" "}
            <br></br>Upload a photo to start your discovery!
          </p>
          <p className="text-sm text-gray-400">
            File must be JPEG, JPG, PNG, or WEBP
          </p>
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

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
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(photo.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>No recently recognized plants</p>
        )}
      </div>

      <h2 className="text-xl font-bold mt-8">Plant Families</h2>
      {loadingCount ? (
        <p className="text-gray-600">Loading family statistics...</p>
      ) : (
        <p className="text-gray-600">
          You have seen {uniqueFamiliesCount} plant families out of 415 plant
          families in the world
        </p>
      )}
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
    </div>
  );
}
