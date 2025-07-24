import ClientHome from './ClientHome';

interface Movie {
  id: string;
  title: string;
  poster: string;
  year: string;
  streaming: string[];
}

interface SearchResponse {
  titles: SearchResult[];
}

interface SearchResult {
  id: number;
  title: string;
  year: number;
  type: string;
  poster?: string;
}

async function fetchInitialMovies(): Promise<Movie[]> {
  try {
    const apiKey = process.env.WATCHMODE_API_KEY;
    if (!apiKey) {
      console.error('WATCHMODE_API_KEY is not set');
      return [];
    }

    const res = await fetch(
      `https://api.watchmode.com/v1/list-titles/?apiKey=${apiKey}&limit=6&types=movie`,
      { 
        cache: 'no-store',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'MovieFinder/1.0'
        }
      }
    );
    
    if (!res.ok) {
      console.error(`Fetch error: ${res.status} ${res.statusText}`);
      return [];
    }
    
    const data: SearchResponse = await res.json();
    
    return (data.titles || []).map((item) => ({
      id: item.id.toString(),
      title: item.title,
      poster: item.poster || 'https://via.placeholder.com/300x450?text=' + encodeURIComponent(item.title),
      year: item.year?.toString() || 'Unknown',
      streaming: [],
    }));
  } catch (error) {
    console.error('Error fetching initial movies:', error);
    return [];
  }
}

export default async function Home() {
  const initialMovies = await fetchInitialMovies();

  return <ClientHome initialMovies={initialMovies} />;
}