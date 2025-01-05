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
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;

    // Upload to Supabase storage
    const { data: storageData, error: storageError } = await supabase.storage
      .from('photos') // Ensure this matches your bucket name
      .upload(`public/${filename}`, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (storageError) {
      throw storageError;
    }

    const photoUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/photos/${filename}`;

    // Insert record into the photos table
    const { data: dbData, error: dbError } = await supabase
      .from('photos')
      .insert([
        {
          photoUrl,
          createdAt: new Date().toISOString(),
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