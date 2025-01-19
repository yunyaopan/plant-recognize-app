import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase-client";
import sharp from "sharp";
import exifr from "exifr";

export const config = {
  api: {
    bodyParser: false, // Disable Next.js's default body parser
  },
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const images = formData.get("images");

    if (!images || !(images instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate image format
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedMimeTypes.includes(images.type)) {
      return NextResponse.json(
        { error: "Invalid file format. Only JPG, PNG, and WEBP are allowed." },
        { status: 400 }
      );
    }

    // Process image with sharp
    const originalBuffer = Buffer.from(await images.arrayBuffer());

    // Extract EXIF metadata
    const metadata = await exifr.parse(originalBuffer);
    let processedBuffer = await sharp(originalBuffer)
      .resize(1200, 1200, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({
        quality: 80,
        mozjpeg: true,
      })
      .toBuffer();

    // If still over 2MB, reduce quality further
    if (processedBuffer.byteLength > 2 * 1024 * 1024) {
      processedBuffer = await sharp(processedBuffer)
        .jpeg({
          quality: 70,
          mozjpeg: true,
        })
        .toBuffer();
    }

    const filename = `${Date.now()}-${images.name.replace(/\s+/g, "_")}`;

    // Upload to Supabase storage
    const { error: storageError } = await supabase.storage
      .from("photos") // Ensure this matches your bucket name
      .upload(`public/${filename}`, processedBuffer, {
        contentType: images.type,
        upsert: false,
      });

    if (storageError) {
      console.error("Supabase Storage Error:", {
        message: storageError.message,
        stack: storageError.stack,
      });
      throw storageError;
    }

    const photoUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/photos/public/${filename}`;

    // Construct the full URL for the recognize-plant API
    // const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const recognizeResponse = await fetch(
      `https://plant-recognize-app.vercel.app/api/recognize-plant`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!recognizeResponse.ok) {
      const errorText = await recognizeResponse.text();
      console.error(
        "Recognize Plant API Error:",
        recognizeResponse.status,
        recognizeResponse.statusText,
        errorText
      );
      throw new Error(
        `Failed to recognize plant: ${recognizeResponse.status} ${recognizeResponse.statusText}`
      );
    }

    const recognizeData = await recognizeResponse.json();
    const bestMatch = recognizeData.data.results[0]; // Assuming results are sorted by score

    const familyScientificName =
      bestMatch.species.family.scientificNameWithoutAuthor;
    const genusScientificName =
      bestMatch.species.genus.scientificNameWithoutAuthor;

    // Convert GPS coordinates from DMS to decimal
    const convertDMSToDecimal = (dms: number[], ref: string) => {
      const degrees = dms[0];
      const minutes = dms[1];
      const seconds = dms[2];
      let decimal = degrees + minutes / 60 + seconds / 3600;
      if (ref === "S" || ref === "W") {
        decimal = -decimal;
      }
      return decimal;
    };

    // Reverse geocode coordinates using Nominatim
    const reverseGeocode = async (lat: number, lon: number) => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
        );

        if (!response.ok) {
          throw new Error(`Nominatim API error: ${response.statusText}`);
        }

        const data = await response.json();
        return {
          country: data.address?.country,
          city:
            data.address?.city || data.address?.town || data.address?.village,
          district:
            data.address?.suburb ||
            data.address?.neighbourhood ||
            data.address?.city_district,
        };
      } catch (error) {
        console.error("Reverse geocoding failed:", error);
        return null;
      }
    };

    // Get location info if coordinates exist
    let locationInfo = null;
    if (metadata.GPSLatitude && metadata.GPSLongitude) {
      const lat = convertDMSToDecimal(
        metadata.GPSLatitude,
        metadata.GPSLatitudeRef
      );
      const lon = convertDMSToDecimal(
        metadata.GPSLongitude,
        metadata.GPSLongitudeRef
      );

      locationInfo = await reverseGeocode(lat, lon);
    }

    // Insert record into the photos table
    const { error: dbError } = await supabase.from("photos").insert([
      {
        photoUrl,
        createdAt: new Date().toLocaleString(),
        family_scientificNameWithoutAuthor: familyScientificName,
        genus_scientificNameWithoutAuthor: genusScientificName,
        latitude: metadata.GPSLatitude
          ? convertDMSToDecimal(metadata.GPSLatitude, metadata.GPSLatitudeRef)
          : null,
        longitude: metadata.GPSLongitude
          ? convertDMSToDecimal(metadata.GPSLongitude, metadata.GPSLongitudeRef)
          : null,
        date_taken: metadata.DateTimeOriginal || null,
        country: locationInfo?.country || null,
        city: locationInfo?.city || null,
        district: locationInfo?.district || null,
      },
    ]);

    if (dbError) {
      throw dbError;
    }

    return NextResponse.json({
      message: "File uploaded and record created successfully",
      data: {
        photoUrl,
        family_scientificNameWithoutAuthor: familyScientificName,
        genus_scientificNameWithoutAuthor: genusScientificName,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error uploading file:", {
        message: error.message,
        stack: error.stack,
      });
      return NextResponse.json(
        {
          error: "Failed to upload file",
          details: {
            message: error.message,
          },
        },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "An unknown error occurred during file upload" },
      { status: 500 }
    );
  }
}
