import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.WATCHMODE_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ 
        error: 'API key not found in environment variables' 
      }, { status: 500 });
    }

    // Тестируем API ключ простым запросом к статусу
    const response = await fetch(
      `https://api.watchmode.com/v1/regions/?apiKey=${apiKey}`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'MovieFinder/1.0'
        }
      }
    );

    const responseText = await response.text();
    
    return NextResponse.json({
      status: response.status,
      statusText: response.statusText,
      apiKey: apiKey ? `${apiKey.substring(0, 8)}...` : 'NOT_SET',
      response: responseText ? JSON.parse(responseText) : null,
      headers: Object.fromEntries(response.headers.entries())
    });

  } catch (error) {
    return NextResponse.json({
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}