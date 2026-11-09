import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, response: NextResponse) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  console.log(code)
}