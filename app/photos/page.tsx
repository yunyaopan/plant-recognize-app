'use client';

import React, { useState } from 'react';

interface UploadResult {
  photoUrl: string;
  family_scientificNameWithoutAuthor: string;
  genus_scientificNameWithoutAuthor: string;
}

export default function PhotoUploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);

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

      {uploadResult && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold">Upload Result</h2>
          <img src={uploadResult.photoUrl} alt="Uploaded" className="mt-4 max-w-full h-auto" />
          <p className="mt-2">Family: {uploadResult.family_scientificNameWithoutAuthor}</p>
          <p>Genus: {uploadResult.genus_scientificNameWithoutAuthor}</p>
        </div>
      )}
    </div>
  );
} 

