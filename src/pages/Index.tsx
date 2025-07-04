
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Book, Film, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import MediaCard from '@/components/MediaCard';
import SearchBar from '@/components/SearchBar';
import Footer from '@/components/Footer';
import { 
  getFeaturedMedia,
  getBooksByGenre,
  getMoviesByGenre,
} from '@/services/mediaService';
import type { Media } from '@/services/mediaService';
import { useQuery } from '@tanstack/react-query';

const Index = () => {
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);
  
  // Fetch featured media
  const { data: featured = [], isLoading: featuredLoading } = useQuery({
    queryKey: ['featuredMedia'],
    queryFn: getFeaturedMedia,
  });
  
  // Fetch recent fiction books
  const { data: recentBooks = [], isLoading: booksLoading } = useQuery({
    queryKey: ['recentBooks', 'Fiction'],
    queryFn: () => getBooksByGenre('Fiction'),
  });
  
  // Fetch top drama movies
  const { data: topMovies = [], isLoading: moviesLoading } = useQuery({
    queryKey: ['topMovies', 'Drama'],
    queryFn: () => getMoviesByGenre('Drama'),
  });
  
  // Rotate through featured media every 8 seconds
  useEffect(() => {
    if (featured.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentFeatureIndex((prev) => (prev + 1) % featured.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, [featured]);
  
  if (featuredLoading || featured.length === 0) {
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
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero section */}
      <Hero media={featured[currentFeatureIndex]} />
      
      {/* Search section */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-2">
              Discover Your Next Favorite
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Search through thousands of books and movies to find your perfect match
            </p>
          </div>
          <SearchBar />
        </div>
      </section>
      
      {/* Recent books section */}
      <section className="py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Book size={20} className="text-navy" />
              <h2 className="text-xl md:text-2xl font-serif font-bold">Recent Books</h2>
            </div>
            <Button variant="ghost" asChild className="text-navy group">
              <Link to="/browse?type=book">
                View All 
                <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {booksLoading ? (
              <p>Loading books...</p>
            ) : recentBooks.length > 0 ? (
              recentBooks.slice(0, 4).map((book) => (
                <MediaCard key={book.id} media={book} />
              ))
            ) : (
              <p>No books found</p>
            )}
          </div>
        </div>
      </section>
      
      {/* Top movies section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Film size={20} className="text-navy" />
              <h2 className="text-xl md:text-2xl font-serif font-bold">Top Movies</h2>
            </div>
            <Button variant="ghost" asChild className="text-navy group">
              <Link to="/browse?type=movie">
                View All 
                <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {moviesLoading ? (
              <p>Loading movies...</p>
            ) : topMovies.length > 0 ? (
              topMovies.slice(0, 4).map((movie) => (
                <MediaCard key={movie.id} media={movie} />
              ))
            ) : (
              <p>No movies found</p>
            )}
          </div>
        </div>
      </section>
      
      {/* CTA section */}
      <section className="py-16 bg-navy text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4">
            Join Our Community
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            Create an account to track your reading and watching lists, leave reviews, and connect with other book and movie enthusiasts.
          </p>
          <Button className="bg-gold hover:bg-gold-light text-navy font-medium text-lg px-8">
            Create Free Account
          </Button>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
