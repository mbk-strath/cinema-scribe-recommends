
import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, Film, Plus } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { addBook, addMovie, getBooks, getMovies } from '@/services/mediaService';
import { Book as BookType, Movie as MovieType } from '@/services/mediaService';

const Admin = () => {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [books, setBooks] = useState<BookType[]>([]);
  const [movies, setMovies] = useState<MovieType[]>([]);
  const [isBookDialogOpen, setIsBookDialogOpen] = useState(false);
  const [isMovieDialogOpen, setIsMovieDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Redirect if not logged in or not an admin
    if (!isLoading && (!user || !isAdmin)) {
      toast({
        title: "Access denied",
        description: "You must be an admin to access this page.",
        variant: "destructive"
      });
      navigate('/');
    }
  }, [user, isAdmin, isLoading, navigate, toast]);

  useEffect(() => {
    if (user && isAdmin) {
      loadBooks();
      loadMovies();
    }
  }, [user, isAdmin]);

  const loadBooks = async () => {
    try {
      const bookData = await getBooks();
      setBooks(bookData);
    } catch (error) {
      toast({
        title: "Error loading books",
        description: "Failed to load books from the database.",
        variant: "destructive"
      });
    }
  };

  const loadMovies = async () => {
    try {
      const movieData = await getMovies();
      setMovies(movieData);
    } catch (error) {
      toast({
        title: "Error loading movies",
        description: "Failed to load movies from the database.",
        variant: "destructive"
      });
    }
  };

  const handleAddBook = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      
      const bookData = {
        title: formData.get('title') as string,
        author: formData.get('author') as string,
        year: parseInt(formData.get('year') as string),
        genres: (formData.get('genres') as string).split(',').map(g => g.trim()),
        cover_url: formData.get('cover') as string,
        description: formData.get('description') as string,
      };

      await addBook(bookData);
      
      toast({
        title: "Book added",
        description: `${bookData.title} has been added to the database.`,
      });

      // Invalidate and refetch queries
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['media'] });
      
      setIsBookDialogOpen(false);
      form.reset();
      loadBooks();
    } catch (error) {
      console.error('Error adding book:', error);
      toast({
        title: "Error adding book",
        description: "There was a problem adding the book.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddMovie = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      
      const movieData = {
        title: formData.get('title') as string,
        director: formData.get('director') as string,
        year: parseInt(formData.get('year') as string),
        genres: (formData.get('genres') as string).split(',').map(g => g.trim()),
        poster_url: formData.get('poster') as string,
        description: formData.get('description') as string,
      };

      await addMovie(movieData);
      
      toast({
        title: "Movie added",
        description: `${movieData.title} has been added to the database.`,
      });

      // Invalidate and refetch queries
      queryClient.invalidateQueries({ queryKey: ['movies'] });
      queryClient.invalidateQueries({ queryKey: ['media'] });
      
      setIsMovieDialogOpen(false);
      form.reset();
      loadMovies();
    } catch (error) {
      console.error('Error adding movie:', error);
      toast({
        title: "Error adding movie",
        description: "There was a problem adding the movie.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p>Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif font-bold">Admin Dashboard</h1>
          <Button variant="outline" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>

        <Tabs defaultValue="books">
          <TabsList className="mb-6">
            <TabsTrigger value="books" className="flex items-center gap-2">
              <Book size={16} />
              Books
            </TabsTrigger>
            <TabsTrigger value="movies" className="flex items-center gap-2">
              <Film size={16} />
              Movies
            </TabsTrigger>
          </TabsList>

          <TabsContent value="books" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-medium">Manage Books</h2>
              <Dialog open={isBookDialogOpen} onOpenChange={setIsBookDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus size={16} className="mr-2" />
                    Add New Book
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px]">
                  <DialogHeader>
                    <DialogTitle>Add New Book</DialogTitle>
                    <DialogDescription>
                      Fill in the details to add a new book to the platform.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleAddBook} className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" name="title" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="author">Author</Label>
                        <Input id="author" name="author" required />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="year">Year</Label>
                        <Input id="year" name="year" type="number" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="genres">Genres (comma separated)</Label>
                        <Input id="genres" name="genres" required />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cover">Cover Image URL</Label>
                      <Input id="cover" name="cover" type="url" required />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" name="description" rows={4} required />
                    </div>
                    
                    <div className="flex justify-end gap-2 pt-2">
                      <Button type="button" variant="outline" onClick={() => setIsBookDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Adding...' : 'Add Book'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              {books.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {books.map((book) => (
                    <div key={book.id} className="border p-4 rounded-md flex gap-4">
                      <img 
                        src={book.cover_url} 
                        alt={book.title}
                        className="w-16 h-24 object-cover rounded"
                      />
                      <div>
                        <h3 className="font-medium">{book.title}</h3>
                        <p className="text-sm text-gray-500">{book.author}, {book.year}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {book.genres.join(', ')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500">No books have been added yet.</p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="movies" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-medium">Manage Movies</h2>
              <Dialog open={isMovieDialogOpen} onOpenChange={setIsMovieDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus size={16} className="mr-2" />
                    Add New Movie
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px]">
                  <DialogHeader>
                    <DialogTitle>Add New Movie</DialogTitle>
                    <DialogDescription>
                      Fill in the details to add a new movie to the platform.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleAddMovie} className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" name="title" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="director">Director</Label>
                        <Input id="director" name="director" required />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="year">Year</Label>
                        <Input id="year" name="year" type="number" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="genres">Genres (comma separated)</Label>
                        <Input id="genres" name="genres" required />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="poster">Poster Image URL</Label>
                      <Input id="poster" name="poster" type="url" required />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" name="description" rows={4} required />
                    </div>
                    
                    <div className="flex justify-end gap-2 pt-2">
                      <Button type="button" variant="outline" onClick={() => setIsMovieDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Adding...' : 'Add Movie'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              {movies.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {movies.map((movie) => (
                    <div key={movie.id} className="border p-4 rounded-md flex gap-4">
                      <img 
                        src={movie.poster_url} 
                        alt={movie.title}
                        className="w-16 h-24 object-cover rounded"
                      />
                      <div>
                        <h3 className="font-medium">{movie.title}</h3>
                        <p className="text-sm text-gray-500">{movie.director}, {movie.year}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {movie.genres.join(', ')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500">No movies have been added yet.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default Admin;
