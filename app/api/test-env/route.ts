import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    secret: process.env.SECRET_STRING ?? 'NOT_FOUND',
    password: process.env.PASSWORD ?? 'NOT_FOUND',
  });
}
