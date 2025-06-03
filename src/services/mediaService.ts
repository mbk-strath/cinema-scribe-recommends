import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export type Book = Database['public']['Tables']['books']['Row'];
export type Movie = Database['public']['Tables']['movies']['Row'];

// Define a proper discriminated union for Media types
export type Media = 
  | (Book & { type: 'book' })
  | (Movie & { type: 'movie' });

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
  // Properly type books with the 'type' property
  return data.map(book => ({...book, type: 'book' as const}));
};

export const getBookById = async (id: string) => {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return { ...data, type: 'book' as const };
};

export const updateBook = async (id: string, updates: Partial<Omit<Book, 'id' | 'created_at' | 'updated_at'>>) => {
  const { data, error } = await supabase
    .from('books')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return { ...data, type: 'book' as const };
};

export const getBooksByGenre = async (genre: string) => {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .contains('genres', [genre])
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data.map(book => ({...book, type: 'book' as const}));
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
  // Properly type movies with the 'type' property
  return data.map(movie => ({...movie, type: 'movie' as const}));
};

export const getMovieById = async (id: string) => {
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return { ...data, type: 'movie' as const };
};

export const updateMovie = async (id: string, updates: Partial<Omit<Movie, 'id' | 'created_at' | 'updated_at'>>) => {
  const { data, error } = await supabase
    .from('movies')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return { ...data, type: 'movie' as const };
};

export const getMoviesByGenre = async (genre: string) => {
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .contains('genres', [genre])
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data.map(movie => ({...movie, type: 'movie' as const}));
};

// General functions
export const getAllMedia = async (): Promise<Media[]> => {
  const books = await getBooks();
  const movies = await getMovies();
  
  return [...books, ...movies] as Media[];
};

export const getMediaById = async (id: string): Promise<Media | null> => {
  // Try to find as book first
  try {
    return await getBookById(id);
  } catch (error) {
    // If not found as book, try as movie
    try {
      return await getMovieById(id);
    } catch (secondError) {
      return null;
    }
  }
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
  
  const books = booksResult.data?.map(book => ({...book, type: 'book' as const})) || [];
  const movies = moviesResult.data?.map(movie => ({...movie, type: 'movie' as const})) || [];
  
  return [...books, ...movies] as Media[];
};

// Reviews functions
export type Review = {
  id: string;
  media_id: string;
  media_type: 'book' | 'movie';
  user_id: string;
  rating: number;
  content: string | null;
  created_at: string;
  updated_at: string;
  user?: {
    username: string;
    avatar_url: string | null;
  }
};

export const addReview = async (review: Omit<Review, 'id' | 'created_at' | 'updated_at' | 'user'>) => {
  const { data, error } = await supabase
    .from('reviews')
    .insert(review)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateReview = async (id: string, updates: Partial<Pick<Review, 'rating' | 'content'>>) => {
  const { data, error } = await supabase
    .from('reviews')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteReview = async (id: string) => {
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

export const getReviewsByMediaId = async (mediaId: string): Promise<Review[]> => {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      profiles:user_id(username, avatar_url)
    `)
    .eq('media_id', mediaId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  
  // Transform the data to match the Review type with user information
  return data.map(review => ({
    ...review,
    user: review.profiles ? {
      username: review.profiles.username || 'Anonymous',
      avatar_url: review.profiles.avatar_url
    } : undefined
  })) as unknown as Review[];
};
