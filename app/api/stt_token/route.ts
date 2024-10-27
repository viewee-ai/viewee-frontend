import { NextResponse } from 'next/server';

export async function GET() {
  const token = process.env.DEEPGRAM_API_KEY;
  
  return NextResponse.json({ token });
}