"use client";

import React from "react";
import { useTranslation } from 'react-i18next';
import toast from "react-hot-toast";

interface ImageUploaderProps {
  onUploadSuccess: (familyName: string) => void;
  onError: (error: string) => void;
}

export default function ImageUploader({ onUploadSuccess, onError }: ImageUploaderProps) {
  const { t } = useTranslation();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const uploadToast = toast.loading("Uploading photo...");

      const formData = new FormData();
      formData.append("images", file);

      try {
        const response = await fetch("/api/photos", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          let errorMessage;
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || 'Failed to upload photo';
          } catch {
            errorMessage = await response.text();
          }
          throw new Error(errorMessage);
        }

        toast.loading("Recognizing plant...", { id: uploadToast });
        const data = await response.json();
        const familyName = data.data.family_scientificNameWithoutAuthor;
        
        onUploadSuccess(familyName);
        
        toast.success("Photo uploaded and plant recognized!", {
          id: uploadToast,
        });
      } catch (err) {
        const errorMessage = (err as Error).message;
        onError(errorMessage);
        toast.error(errorMessage || "Failed to upload and recognize photo", {
          id: uploadToast,
        });
      }
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">
        {t('uploadTitle')}
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
            {t('uploadPrompt')}
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
    </>
  );
}