import { NextRequest, NextResponse } from 'next/server';

const plantNetApiKey = process.env.MYPLANTNET_API_KEY!;
const plantNetBaseUrl = process.env.MYPLANTNET_API_BASE_URL!;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get('images');

    if (!imageFile || !(imageFile instanceof File)) {
      return NextResponse.json({ error: 'Image file is required' }, { status: 400 });
    }

    // Create a new FormData instance for the PlantNet API
    const plantNetFormData = new FormData();
    plantNetFormData.append('images', imageFile);
    //plantNetFormData.append('organs', 'leaf'); // Example organ, adjust as needed

    const response = await fetch(`${plantNetBaseUrl}/v2/identify/all?api-key=${plantNetApiKey}`, {
      method: 'POST',
      body: plantNetFormData,
    });
    //if plantnet api returns an normal http error 
    if (!response.ok) {
      const errorText = await response.text(); // Get the error response body
      console.error('PlantNet API Error:', response.status, response.statusText, errorText);
      throw new Error(`PlantNet API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json({ data });
  } 
  //general error handling
  catch (error) {
    return NextResponse.json({ error: 'Failed to recognize plant', details: error }, { status: 500 });
  }
} 