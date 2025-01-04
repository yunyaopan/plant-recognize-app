import { NextRequest, NextResponse } from 'next/server';

const plantNetApiKey = process.env.MYPLANTNET_API_KEY!;
const plantNetBaseUrl = process.env.MYPLANTNET_API_BASE_URL!;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { imageUrl } = body;

  if (!imageUrl) {
    return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
  }

  try {
    const response = await fetch(`${plantNetBaseUrl}/identify/all?api-key=${plantNetApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        images: [imageUrl],
        organs: ['leaf'], // Example organ, adjust as needed
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to call PlantNet API');
    }

    const data = await response.json();
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to recognize plant', details: error }, { status: 500 });
  }
} 