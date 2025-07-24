import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import ClientHome from './ClientHome';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MovieFinder',
  description: 'Search and save your favorite movies',
};

interface Movie {
  id: string;
  title: string;
  poster: string;
  year: string;
  streaming: string[];
}

interface SearchResponse {
  results: SearchResult[];
}

interface SearchResult {
  id: string;
  name: string;
  year: number;
  type: string;
}

async function fetchInitialMovies(): Promise<Movie[]> {
  try {
    const res = await fetch(
      `https://api.watchmode.com/v1/list-titles/?apiKey=${process.env.WATCHMODE_API_KEY}&limit=6`,
      { cache: 'no-store' }
    );
    if (!res.ok) {
      console.error(`Fetch error: ${res.status} ${res.statusText}`);
      return []; // Return empty array on error
    }
    const data: SearchResponse = await res.json();
    return data.results.map((item) => ({
      id: item.id,
      title: item.name,
      poster: 'https://via.placeholder.com/300x450',
      year: item.year.toString(),
      streaming: [],
    }));
  } catch (error) {
    console.error('Error fetching initial movies:', error);
    return []; // Return empty array on error
  }
}

export default async function Home() {
  const initialMovies = await fetchInitialMovies();

  return <ClientHome initialMovies={initialMovies} />;
}