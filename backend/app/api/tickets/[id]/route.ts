import { NextResponse } from 'next/server';
import { supabase } from '@/src/lib/supabase';

export async function PATCH(request: Request, context: any) {
  const { id } = await context.params;
  try {
    const body = await request.json();
    const { data, error } = await supabase.from('tickets').update(body).eq('id', id).select().single();
    if (error) return NextResponse.json({ data: null, error }, { status: 500 });
    return NextResponse.json({ data, error: null });
  } catch (err) {
    return NextResponse.json({ data: null, error: 'Invalid payload' }, { status: 400 });
  }
}
