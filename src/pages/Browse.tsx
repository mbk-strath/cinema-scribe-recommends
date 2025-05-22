
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Book, Film, SlidersHorizontal } from 'lucide-react';
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import MediaCard from '@/components/MediaCard';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { searchMedia, getAllMedia, sampleBooks, sampleMovies, Media } from '@/lib/data';

const Browse = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const typeFilter = searchParams.get('type') || 'all';
  
  const [results, setResults] = useState<Media[]>([]);
  const [activeTab, setActiveTab] = useState(typeFilter);
  const [showFilters, setShowFilters] = useState(false);
  
  useEffect(() => {
    setActiveTab(typeFilter);
    
    if (searchQuery) {
      // Search with the query
      const searchResults = searchMedia(searchQuery);
      
      // Apply type filter if specified
      if (typeFilter !== 'all') {
        const filteredResults = searchResults.filter(item => item.type === typeFilter);
        setResults(filteredResults);
      } else {
        setResults(searchResults);
      }
    } else {
      // No search query, just show all media or filter by type
      if (typeFilter === 'book') {
        setResults(sampleBooks);
      } else if (typeFilter === 'movie') {
        setResults(sampleMovies);
      } else {
        setResults(getAllMedia());
      }
    }
  }, [searchQuery, typeFilter]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('type', value);
    window.history.pushState({}, '', `?${newSearchParams.toString()}`);
    
    // Update results based on the new tab
    if (searchQuery) {
      const searchResults = searchMedia(searchQuery);
      if (value !== 'all') {
        const filteredResults = searchResults.filter(item => item.type === value);
        setResults(filteredResults);
      } else {
        setResults(searchResults);
      }
    } else {
      if (value === 'book') {
        setResults(sampleBooks);
      } else if (value === 'movie') {
        setResults(sampleMovies);
      } else {
        setResults(getAllMedia());
      }
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 md:px-6 py-6 flex-1">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold mb-6">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'Browse'}
          </h1>
          
          <div className="mb-6">
            <SearchBar />
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <Tabs 
              defaultValue={activeTab} 
              value={activeTab}
              onValueChange={handleTabChange}
              className="w-full sm:w-auto"
            >
              <TabsList>
                <TabsTrigger value="all" className="flex items-center gap-1">
                  All
                </TabsTrigger>
                <TabsTrigger value="book" className="flex items-center gap-1">
                  <Book size={16} />
                  Books
                </TabsTrigger>
                <TabsTrigger value="movie" className="flex items-center gap-1">
                  <Film size={16} />
                  Movies
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <SlidersHorizontal size={16} />
              Filters
            </Button>
          </div>
          
          {showFilters && (
            <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50 animate-fade-in">
              <h3 className="font-medium mb-3">Filter Options</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Genre</label>
                  <select className="w-full p-2 border border-gray-300 rounded-md">
                    <option value="">All Genres</option>
                    <option value="fiction">Fiction</option>
                    <option value="scifi">Sci-Fi</option>
                    <option value="fantasy">Fantasy</option>
                    <option value="drama">Drama</option>
                    <option value="comedy">Comedy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Year</label>
                  <select className="w-full p-2 border border-gray-300 rounded-md">
                    <option value="">All Years</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                    <option value="2020">2020</option>
                    <option value="older">Older</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Rating</label>
                  <select className="w-full p-2 border border-gray-300 rounded-md">
                    <option value="">Any Rating</option>
                    <option value="4">4+ Stars</option>
                    <option value="3">3+ Stars</option>
                    <option value="2">2+ Stars</option>
                    <option value="1">1+ Star</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button size="sm">Apply Filters</Button>
              </div>
            </div>
          )}
        </div>
        
        {results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {results.map((item) => (
              <MediaCard key={item.id} media={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">No results found</p>
            <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Browse;
