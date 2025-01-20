import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-client";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const perPage = 45;
  const offset = (page - 1) * perPage;

  const { data: photos, error } = await supabase
    .from("photos")
    .select("*")
    .order("createdAt", { ascending: false })
    .range(offset, offset + perPage - 1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Adjust `createdAt` to local timezone
  const adjustedPhotos = photos.map((photo) => {
    const utcDate = new Date(photo.createdAt); // Parse UTC datetime
    const localDate = utcDate.toLocaleString(); // Convert to local timezone
    return { ...photo, createdAt: localDate }; // Replace `createdAt` with adjusted value
  });

  return NextResponse.json(adjustedPhotos);
}
