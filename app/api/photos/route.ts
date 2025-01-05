import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase-client';

export const config = {
  api: {
    bodyParser: false, // Disable Next.js's default body parser
  },
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const images = formData.get('images');

    if (!images || !(images instanceof File)) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await images.arrayBuffer());
    const filename = `${Date.now()}-${images.name.replace(/\s+/g, '_')}`;

    // Upload to Supabase storage
    const { error: storageError } = await supabase.storage
      .from('photos') // Ensure this matches your bucket name
      .upload(`public/${filename}`, buffer, {
        contentType: images.type,
        upsert: false,
      });

    if (storageError) {
      throw storageError;
    }

    const photoUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/photos/${filename}`;

    // Construct the full URL for the recognize-plant API
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const recognizeResponse = await fetch(`${baseUrl}/api/recognize-plant`, {
      method: 'POST',
      body: formData,
    });

    if (!recognizeResponse.ok) {
      const errorText = await recognizeResponse.text();
      console.error('Recognize Plant API Error:', recognizeResponse.status, recognizeResponse.statusText, errorText);
      throw new Error(`Failed to recognize plant: ${recognizeResponse.status} ${recognizeResponse.statusText}`);
    }

    const recognizeData = await recognizeResponse.json();
    const bestMatch = recognizeData.data.results[0]; // Assuming results are sorted by score

    const familyScientificName = bestMatch.species.family.scientificNameWithoutAuthor;
    const genusScientificName = bestMatch.species.genus.scientificNameWithoutAuthor;

    // Insert record into the photos table
    const { data: dbData, error: dbError } = await supabase
      .from('photos')
      .insert([
        {
          photoUrl,
          createdAt: new Date().toISOString(),
          family_scientificNameWithoutAuthor: familyScientificName,
          genus_scientificNameWithoutAuthor: genusScientificName,
        },
      ]);

    if (dbError) {
      throw dbError;
    }

    return NextResponse.json({ message: 'File uploaded and record created successfully', data: dbData });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
} 