
import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
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
  
  return (
    <form onSubmit={handleSubmit} className="relative flex w-full max-w-xl mx-auto">
      <Input
        type="search"
        placeholder="Search for books, movies, authors, directors..."
        className="pr-12"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button
        type="submit"
        size="icon"
        className="absolute right-0 top-0 h-full bg-transparent hover:bg-transparent text-gray-500 hover:text-navy"
      >
        <Search size={18} />
      </Button>
    </form>
  );
};

export default SearchBar;
