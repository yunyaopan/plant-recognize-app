import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase-client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit - 1;

  const { data, count, error } = await supabase
    .from("plant_families")
    .select("id, family_scientificNameWithoutAuthor", { count: "exact" })
    .range(startIndex, endIndex);

  if (error) {
    return NextResponse.json(
      { error: "Failed to fetch plant families" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    families: data,
    totalPages: Math.ceil((count || 0) / limit),
    currentPage: page,
  });
}
