'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import { addFavorite, removeFavorite } from 'store/favoritesSlice';
import { toggleTheme } from 'store/themeSlice';
import Link from 'next/link';
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';

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
  id: number;
  name: string;
  year: number;
  type: string;
  result_type: string;
  image_url?: string;
}

interface ClientHomeProps {
  initialMovies: Movie[];
}

export default function ClientHome({ initialMovies }: ClientHomeProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.favorites.list);
  const theme = useSelector((state: RootState) => state.theme);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`/api/search?query=${encodeURIComponent(searchTerm)}`);
      
      if (!res.ok) {
        throw new Error(`Search failed: ${res.status}`);
      }
      
      const data: SearchResponse = await res.json();
      
      const formattedMovies: Movie[] = (data.results || [])
        .filter(item => item.result_type === 'title') // Только фильмы/сериалы
        .map((item) => ({
          id: item.id.toString(),
          title: item.name,
          poster: item.image_url || `https://via.placeholder.com/300x450?text=${encodeURIComponent(item.name)}`,
          year: item.year?.toString() || 'Unknown',
          streaming: [],
        }));
      
      setMovies(formattedMovies);
      
      if (formattedMovies.length === 0) {
        setError('No movies found for your search term');
      }
      
    } catch (error) {
      console.error('Error searching movies:', error);
      setError('Failed to search movies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const isFavorite = (id: string): boolean => favorites.includes(id);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <header className="p-4 flex justify-between items-center border-b border-gray-300 dark:border-gray-700">
        <h1 className="text-3xl font-bold">MovieFinder</h1>
        <button 
          onClick={() => dispatch(toggleTheme())} 
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
        </button>
      </header>
      
      <main className="container mx-auto p-4">
        <div className="mb-6 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search movies..."
            className={`flex-1 p-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              theme === 'dark' 
                ? 'bg-gray-800 text-white border-gray-700' 
                : 'bg-white border-gray-300'
            }`}
          />
          <button
            onClick={handleSearch}
            disabled={loading || !searchTerm.trim()}
            className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className={`h-64 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                <div className={`h-4 mt-2 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                <div className={`h-4 mt-1 rounded w-3/4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
              </div>
            ))
          ) : movies.length === 0 && !loading ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              {searchTerm ? 'No movies found' : 'Start searching for movies'}
            </div>
          ) : (
            movies.map((movie) => (
              <div key={movie.id} className={`p-4 rounded-lg shadow-md transition-transform hover:scale-105 ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}>
                <Link href={`/movie/${movie.id}`} className="block">
                  <img 
                    src={movie.poster} 
                    alt={movie.title} 
                    className="w-full h-64 object-cover rounded-md mb-3"
                  />
                  <h2 className="text-lg font-semibold mb-1 line-clamp-2">{movie.title}</h2>
                  <p className="text-sm text-gray-500 mb-2">{movie.year}</p>
                </Link>
                <button
                  onClick={() => {
                    if (isFavorite(movie.id)) {
                      dispatch(removeFavorite(movie.id));
                    } else {
                      dispatch(addFavorite(movie.id));
                    }
                  }}
                  className={`w-full p-2 rounded-md text-white font-medium transition-colors ${
                    isFavorite(movie.id) 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'bg-green-500 hover:bg-green-600'
                  }`}
                >
                  {isFavorite(movie.id) ? '❤️ Remove Favorite' : '🤍 Add Favorite'}
                </button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}