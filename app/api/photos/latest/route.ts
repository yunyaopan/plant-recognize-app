import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase-client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const families = searchParams.getAll("family");

  if (!families || families.length === 0) {
    return NextResponse.json(
      { error: "At least one family parameter is required" },
      { status: 400 }
    );
  }

  try {
    const results = await Promise.all(
      families.map(async (family) => {
        const { data, error } = await supabase
          .from("photos")
          .select("photoUrl, createdAt")
          .eq("family_scientificNameWithoutAuthor", family)
          .order("createdAt", { ascending: false })
          .limit(5);

        if (error) throw error;

        return {
          family,
          photos:
            data?.map((photo) => ({
              photoUrl: photo.photoUrl,
              createdAt: photo.createdAt,
            })) || [],
        };
      })
    );

    return NextResponse.json(results);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
