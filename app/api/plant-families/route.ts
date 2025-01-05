import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase-client';

export async function GET() {
  const { data, error } = await supabase.from('plant_families').select('id, family_scientificNameWithoutAuthor');

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch plant families' }, { status: 500 });
  }

  return NextResponse.json(data);
} 