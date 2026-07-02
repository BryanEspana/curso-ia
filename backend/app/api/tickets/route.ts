import { NextResponse } from 'next/server';
import { supabase } from '@/src/lib/supabase';

export async function GET() {
  const { data, error } = await supabase.from('tickets').select('*');
  if (error) return NextResponse.json({ data: null, error }, { status: 500 });
  return NextResponse.json({ data, error: null });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { data, error } = await supabase.from('tickets').insert([body]).select().single();
    if (error) return NextResponse.json({ data: null, error }, { status: 500 });
    return NextResponse.json({ data, error: null }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ data: null, error: 'Invalid payload' }, { status: 400 });
  }
}
