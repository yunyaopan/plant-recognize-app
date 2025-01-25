"use client";

import React, { useState, useEffect } from "react";
import  { Toaster } from "react-hot-toast";
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import ImageUploader from '@/components/ImageUploader';
import JSConfetti from 'js-confetti';
import { useRef } from 'react';

interface LatestRecognizedPhoto {
  id: string;
  photoUrl: string;
  family_scientificNameWithoutAuthor: string;
  genus_scientificNameWithoutAuthor: string; // Add genus property
  createdAt: string;
}

interface PlantFamily {
  id: string;
  family_scientificNameWithoutAuthor: string;
}



// Skeleton component for loading state
const SkeletonCard = () => (
  <div className="bg-white shadow-md rounded-lg overflow-hidden h-[280px] animate-pulse">
    <div className="h-48 w-full bg-gray-300"></div>
    <div className="p-4">
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
    </div>
  </div>
);

export default function PhotoUploadPage() {
  const { t } = useTranslation();
  const router = useRouter();

  // Create a stable ref that won't change between renders
  const jsConfettiRef = useRef<JSConfetti | null>(null);
  const uploaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize JSConfetti with the container element
    if (!jsConfettiRef.current && uploaderRef.current) {
      jsConfettiRef.current = new JSConfetti();
    }
  }, []);

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

  // Move these functions outside of useEffect
  const fetchLatestRecognized = async () => {
    setLoadingLatest(true);
    try {
      const sortField = "createdAt";
      const sortOrder = "desc";
      const response = await fetch(`/api/photos?sortField=${sortField}&sortOrder=${sortOrder}`);
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

  useEffect(() => {
    fetchPlantFamilies();
    fetchLatestRecognized();
    fetchUniqueFamiliesCount();
  }, []);

  // Add new state variables after other state declarations
  const [latestUploadedFamily, setLatestUploadedFamily] = useState<string | null>(null);
  const [similarPhotos, setSimilarPhotos] = useState<LatestRecognizedPhoto[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);

  // Add new function after other fetch functions
  const fetchSimilarPhotos = async (familyName: string) => {
    setLoadingSimilar(true);
    try {
      const response = await fetch(
        `/api/photos?family_scientificNameWithoutAuthor=${encodeURIComponent(familyName)}&sortField=createdAt&sortOrder=desc`
      );
      if (!response.ok) throw new Error("Failed to fetch similar photos");
      const data = await response.json();
      setSimilarPhotos(data);
    } catch (err) {
      console.error("Error fetching similar photos:", err);
    } finally {
      setLoadingSimilar(false);
    }
  };

  // Define handleUploadSuccess at the component level
  const handleUploadSuccess = async (familyName: string) => {
    console.log('Upload success triggered with family:', familyName); // Debug log
    
    setLatestUploadedFamily(familyName);
    await fetchSimilarPhotos(familyName);
    
    if (jsConfettiRef.current) {
      jsConfettiRef.current.addConfetti({
        confettiColors: [
          '#f0b6ad', '#dc8864', '#ba4848', '#c75a1b', '#f7c435', '#818b2e', '#0b5227', '#85a993',
        ],
      });
    }

    // Refresh other data
    await Promise.all([
      fetchLatestRecognized(),
      fetchUniqueFamiliesCount(),
      fetchPlantFamilies(currentPage)
    ]);
  };

  // Add new section in the return statement after the file upload section and before "Latest Recognized Plants"
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div ref={uploaderRef}>
        <Toaster position="bottom-center" />
        <ImageUploader 
          onUploadSuccess={handleUploadSuccess}
          onError={setError}
        />
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}
      {photosError && <p className="text-red-500 mt-4">{photosError}</p>}

      {/* Grid containers with consistent card styles */}
      {latestUploadedFamily && (
        <div className="w-full max-w-7xl mt-8">
          {similarPhotos.length > 1 && (
            <h2 className="text-xl font-bold mb-4 text-center">
              {t('morePlantsFrom', { family: t(latestUploadedFamily) })}
            </h2>
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4 w-full max-w-7xl">
            {loadingSimilar ? (
              // Center the loading text or icon using flexbox
              <div className="flex justify-center items-center w-full h-full">
                <p className="text-center">...</p>
              </div>
            ) : similarPhotos.length > 1 ? (
              similarPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="bg-white shadow-md rounded-lg overflow-hidden h-[280px]"
                >
                  <div className="h-48 w-full">
                    <img
                      src={photo.photoUrl}
                      alt={`${photo.family_scientificNameWithoutAuthor} family plant`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                  <p className="text-sm text-gray-500 mt-1">
                  Genus: {photo.genus_scientificNameWithoutAuthor} {/* Display genus */}
                  </p>
                    <p className="text-sm text-gray-500">
                      {new Date(photo.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-lg text-green-600">
                {t('congratsNewFamily')}
              </p>
            )}
          </div>
        </div>
      )}

      <h2 className="text-xl font-bold mt-8">{t('latestRecognized')}</h2>
      <button
        onClick={() => router.push('/photos/all')}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        {t('viewAll')}
      </button>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4 w-full max-w-7xl">
        {loadingLatest ? (
          // Use SkeletonCard for loading state
          Array.from({ length: 8 }).map((_, index) => <SkeletonCard key={index} />)
        ) : latestRecognized.length > 0 ? (
          latestRecognized.map((photo) => (
            <div
              key={photo.id}
              className="bg-white shadow-md rounded-lg overflow-hidden h-[280px]"
            >
              <div className="h-48 w-full">
                <img
                  src={photo.photoUrl}
                  alt={`Recognized ${photo.family_scientificNameWithoutAuthor}`}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold truncate">
                  {t(photo.family_scientificNameWithoutAuthor) || photo.family_scientificNameWithoutAuthor}
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

      <h2 className="text-xl font-bold mt-8">{t('plantFamilies')}</h2>
      {loadingCount ? (
        <p className="text-gray-600">{t('loading')}</p>
      ) : (
        <p className="text-gray-600">
          {t('statistics', { count: uniqueFamiliesCount })}
        </p>
      )}

      <div className="flex flex-col items-center gap-4 mt-4">
        <div className="flex gap-2">
          <button
            onClick={() => fetchPlantFamilies(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            {t('previous')}
          </button>
          <span className="px-4 py-2">
            {t('page', { current: currentPage, total: totalPages })}
          </span>
          <button
            onClick={() => fetchPlantFamilies(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            {t('next')}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span>{t('goToPage')}</span>
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
      {/* Update plant families grid to use translations */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {plantFamilies.map((family) => (
          <div key={family.id} className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="bg-gray-200 h-32 flex items-center justify-center">
              {loadingPhotos ? (
                <p className="text-center">{t('loading')}</p>
              ) : latestPhotos[family.family_scientificNameWithoutAuthor]?.length > 0 ? (
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
                <p className="text-center">{t('noImage')}</p>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold">
                {t(family.family_scientificNameWithoutAuthor) || family.family_scientificNameWithoutAuthor}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
