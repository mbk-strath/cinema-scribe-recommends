
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, Film, Lock, Plus } from 'lucide-react';
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

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would validate against a database
    if (username === 'admin' && password === 'password') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid credentials');
    }
  };

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Book would be added to database');
    // Reset form or redirect
  };

  const handleAddMovie = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Movie would be added to database');
    // Reset form or redirect
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
            <div className="flex justify-center mb-6">
              <Lock className="h-12 w-12 text-navy" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-center mb-6">Admin Login</h1>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
              
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>
            
            <p className="text-sm text-center mt-4 text-gray-500">
              Admin access only. Return to <Button variant="link" className="p-0" onClick={() => navigate('/')}>homepage</Button>
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif font-bold">Admin Dashboard</h1>
          <Button variant="outline" onClick={() => setIsAuthenticated(false)}>
            Sign Out
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
              <Dialog>
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
                        <Input id="title" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="author">Author</Label>
                        <Input id="author" required />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="year">Year</Label>
                        <Input id="year" type="number" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="genres">Genres (comma separated)</Label>
                        <Input id="genres" required />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cover">Cover Image URL</Label>
                      <Input id="cover" type="url" required />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" rows={4} required />
                    </div>
                    
                    <div className="flex justify-end gap-2 pt-2">
                      <Button type="button" variant="outline">
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
              <p className="text-center text-gray-500">Book management would be implemented with a database connection</p>
            </div>
          </TabsContent>
          
          <TabsContent value="movies" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-medium">Manage Movies</h2>
              <Dialog>
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
                        <Input id="title" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="director">Director</Label>
                        <Input id="director" required />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="year">Year</Label>
                        <Input id="year" type="number" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="genres">Genres (comma separated)</Label>
                        <Input id="genres" required />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="poster">Poster Image URL</Label>
                      <Input id="poster" type="url" required />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" rows={4} required />
                    </div>
                    
                    <div className="flex justify-end gap-2 pt-2">
                      <Button type="button" variant="outline">
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
              <p className="text-center text-gray-500">Movie management would be implemented with a database connection</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default Admin;
