import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase-client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const family = searchParams.get("family");

  if (!family) {
    return NextResponse.json(
      { error: "Family parameter is required" },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabase
      .from("photos")
      .select("photoUrl")
      .eq("family_scientificNameWithoutAuthor", family)
      .order("createdAt", { ascending: false })
      .limit(1);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch latest photo" },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "No photos found for this family" },
        { status: 404 }
      );
    }

    return NextResponse.json({ url: data[0].photoUrl });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
