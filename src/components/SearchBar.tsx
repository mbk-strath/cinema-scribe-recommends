
import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/browse?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleClear = () => {
    setQuery('');
  };
  
  return (
    <form onSubmit={handleSubmit} className="relative flex w-full max-w-xl mx-auto">
      <div className="relative flex-grow">
        <Input
          type="search"
          placeholder="Search for books, movies, authors, directors..."
          className="pr-24 pl-10 py-6 text-base shadow-sm hover:shadow transition-shadow"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <Search size={18} />
        </span>
        {query && (
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            onClick={handleClear}
            className="absolute right-12 top-1/2 transform -translate-y-1/2 h-8 w-8 text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </Button>
        )}
      </div>
      <Button
        type="submit"
        className="ml-2 bg-navy hover:bg-navy-light text-white font-medium hover:shadow-md transition-shadow"
        disabled={!query.trim()}
      >
        Search
      </Button>
    </form>
  );
};

export default SearchBar;
