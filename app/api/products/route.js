import { nestleProducts } from '@/lib/simEngine';
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(nestleProducts);
}
