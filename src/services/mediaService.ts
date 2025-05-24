
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export type Book = Database['public']['Tables']['books']['Row'];
export type Movie = Database['public']['Tables']['movies']['Row'];
export type Media = Book | Movie & { type: 'book' | 'movie' };

// Book functions
export const addBook = async (book: Omit<Book, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('books')
    .insert(book)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getBooks = async () => {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data.map(book => ({...book, type: 'book'}));
};

export const getBooksByGenre = async (genre: string) => {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .contains('genres', [genre])
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data.map(book => ({...book, type: 'book'}));
};

// Movie functions
export const addMovie = async (movie: Omit<Movie, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('movies')
    .insert(movie)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getMovies = async () => {
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data.map(movie => ({...movie, type: 'movie'}));
};

export const getMoviesByGenre = async (genre: string) => {
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .contains('genres', [genre])
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data.map(movie => ({...movie, type: 'movie'}));
};

// General functions
export const getAllMedia = async (): Promise<Media[]> => {
  const books = await getBooks();
  const movies = await getMovies();
  
  return [...books, ...movies] as Media[];
};

export const getFeaturedMedia = async (): Promise<Media[]> => {
  const allMedia = await getAllMedia();
  // Get 3 random media items for the featured section
  return allMedia
    .sort(() => 0.5 - Math.random())
    .slice(0, 3) as Media[];
};

export const searchMedia = async (query: string): Promise<Media[]> => {
  const booksPromise = supabase
    .from('books')
    .select('*')
    .or(`title.ilike.%${query}%,author.ilike.%${query}%,description.ilike.%${query}%`);
  
  const moviesPromise = supabase
    .from('movies')
    .select('*')
    .or(`title.ilike.%${query}%,director.ilike.%${query}%,description.ilike.%${query}%`);
  
  const [booksResult, moviesResult] = await Promise.all([booksPromise, moviesPromise]);
  
  const books = booksResult.data?.map(book => ({...book, type: 'book'})) || [];
  const movies = moviesResult.data?.map(movie => ({...movie, type: 'movie'})) || [];
  
  return [...books, ...movies] as Media[];
};
