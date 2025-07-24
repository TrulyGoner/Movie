'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { addFavorite, removeFavorite } from '../store/favoritesSlice';
import { toggleTheme } from '../store/themeSlice';
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
  id: string;
  name: string;
  year: number;
  type: string;
}

interface ClientHomeProps {
  initialMovies: Movie[];
}

export default function ClientHome({ initialMovies }: ClientHomeProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.favorites.list);
  const theme = useSelector((state: RootState) => state.theme);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/search?query=${encodeURIComponent(searchTerm)}`);
      const data: SearchResponse = await res.json();
      const formattedMovies: Movie[] = data.results.map((item) => ({
        id: item.id,
        title: item.name,
        poster: 'https://via.placeholder.com/300x450', // Placeholder
        year: item.year.toString(),
        streaming: [],
      }));
      setMovies(formattedMovies);
    } catch (error) {
      console.error('Error searching movies:', error);
    }
    setLoading(false);
  };

  const isFavorite = (id: string): boolean => favorites.includes(id);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <header className="p-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold">MovieFinder</h1>
        <button onClick={() => dispatch(toggleTheme())} className="p-2 rounded-full">
          {theme === 'light' ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
        </button>
      </header>
      <main className="container mx-auto p-4">
        <div className="mb-4 flex">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search movies..."
            className={`flex-1 p-2 rounded-l-md border ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-white border-gray-300'}`}
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600"
          >
            Search
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-64 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 mt-2 rounded"></div>
              </div>
            ))
          ) : (
            movies.map((movie) => (
              <div key={movie.id} className={`p-4 rounded shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                <Link href={`/movie/${movie.id}`}>
                  <img src={movie.poster} alt={movie.title} className="w-full h-64 object-cover rounded" />
                  <h2 className="text-xl font-semibold mt-2">{movie.title}</h2>
                  <p>{movie.year}</p>
                </Link>
                <button
                  onClick={() => {
                    if (isFavorite(movie.id)) {
                      dispatch(removeFavorite(movie.id));
                    } else {
                      dispatch(addFavorite(movie.id));
                    }
                  }}
                  className={`mt-2 p-2 rounded ${isFavorite(movie.id) ? 'bg-red-500' : 'bg-green-500'} text-white`}
                >
                  {isFavorite(movie.id) ? 'Remove Favorite' : 'Add Favorite'}
                </button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}