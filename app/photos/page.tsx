'use client';

import React, { useState, useEffect } from 'react';

interface UploadResult {
  photoUrl: string;
  family_scientificNameWithoutAuthor: string;
  genus_scientificNameWithoutAuthor: string;
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

  useEffect(() => {
    const fetchPlantFamilies = async () => {
      try {
        const response = await fetch('/api/plant-families');
        const data = await response.json();
        setPlantFamilies(data);
      } catch (err) {
        console.error('Failed to fetch plant families:', err);
      }
    };

    fetchPlantFamilies();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('images', selectedFile);

    try {
      const response = await fetch('/api/photos', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to upload photo: ${errorText}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      setUploadResult(data.data);
      setError(null);
    } catch (err) {
      setError(err as string);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Upload a Photo</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} className="mb-4" />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Upload
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      <h2 className="text-xl font-bold mt-8">Plant Families</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {plantFamilies.map((family) => (
          <div key={family.id} className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="bg-gray-200 h-32 flex items-center justify-center">
              {uploadResult && uploadResult.family_scientificNameWithoutAuthor === family.family_scientificNameWithoutAuthor ? (
                <img src={uploadResult.photoUrl} alt="Uploaded" className="h-full w-full object-cover" />
              ) : (
                <p className="text-center">No Image</p>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold">{family.family_scientificNameWithoutAuthor}</h3>
            </div>
          </div>
        ))}
      </div>

      {uploadResult && !plantFamilies.some(family => family.family_scientificNameWithoutAuthor === uploadResult.family_scientificNameWithoutAuthor) && (
        <p className="text-red-500 mt-4">Error: Plant family not matched.</p>
      )}
    </div>
  );
}