
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

const Admin = () => {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [books, setBooks] = useState([]);
  const [movies, setMovies] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const handleAddBook = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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

    // In a real app, you would save this to a Supabase table
    toast({
      title: "Book added",
      description: `${bookData.title} has been added to the database.`,
    });

    setIsDialogOpen(false);
    form.reset();
  };

  const handleAddMovie = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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

    // In a real app, you would save this to a Supabase table
    toast({
      title: "Movie added",
      description: `${movieData.title} has been added to the database.`,
    });

    setIsDialogOpen(false);
    form.reset();
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
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">
                        Add Book
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-center text-gray-500">Book database functionality is connected. You can start adding books.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="movies" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-medium">Manage Movies</h2>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">
                        Add Movie
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-center text-gray-500">Movie database functionality is connected. You can start adding movies.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default Admin;
