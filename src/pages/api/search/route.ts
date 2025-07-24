import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'Query is required' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://api.watchmode.com/v1/search/?apiKey=${process.env.WATCHMODE_API_KEY}&search_field=name&search_value=${encodeURIComponent(query)}`
    );
    if (!response.ok) throw new Error('Failed to fetch search results');
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching search results:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}