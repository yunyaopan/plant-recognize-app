import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase-client";

export async function GET() {
  try {
    // Get unique family count
    const { count: familyCount } = await supabase
      .from("photos")
      .select("family_scientificNameWithoutAuthor", {
        count: "exact",
        head: true,
      });

    // Get unique genus count
    const { count: genusCount } = await supabase
      .from("photos")
      .select("genus_scientificNameWithoutAuthor", {
        count: "exact",
        head: true,
      });

    // Get total photo count
    const { count: totalPhotos } = await supabase
      .from("photos")
      .select("*", { count: "exact", head: true });

    return NextResponse.json({
      unique_families: familyCount || 0,
      unique_genera: genusCount || 0,
      total_photos: totalPhotos || 0,
    });
  } catch (error) {
    console.error("Error fetching photo counts:", error);
    return NextResponse.json(
      { error: "Failed to fetch photo counts" },
      { status: 500 }
    );
  }
}
