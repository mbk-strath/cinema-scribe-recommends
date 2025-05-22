
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Book, Film, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center py-4 px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-navy font-serif font-bold text-2xl">PageScreen</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link 
            to="/browse?type=book" 
            className="flex items-center gap-1.5 text-navy-light hover:text-navy transition font-medium"
          >
            <Book size={18} />
            Books
          </Link>
          <Link 
            to="/browse?type=movie" 
            className="flex items-center gap-1.5 text-navy-light hover:text-navy transition font-medium"
          >
            <Film size={18} />
            Movies
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {isSearchOpen ? (
            <div className="animate-fade-in flex items-center gap-2">
              <Input 
                type="search" 
                placeholder="Search books and movies..." 
                className="w-[200px] md:w-[300px]"
                autoFocus
              />
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsSearchOpen(false)}
                className="text-gray-500"
              >
                Cancel
              </Button>
            </div>
          ) : (
            <>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsSearchOpen(true)}
                className="text-navy-light hover:text-navy hover:bg-gray-100"
              >
                <Search size={20} />
              </Button>
              <div className="hidden md:block">
                <Button className="bg-navy hover:bg-navy-light text-white">
                  Sign In
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="md:hidden border-t border-gray-100">
        <div className="flex justify-around py-2">
          <Link 
            to="/browse?type=book" 
            className="flex flex-col items-center gap-1 py-1 text-navy-light"
          >
            <Book size={18} />
            <span className="text-xs">Books</span>
          </Link>
          <Link 
            to="/browse?type=movie" 
            className="flex flex-col items-center gap-1 py-1 text-navy-light"
          >
            <Film size={18} />
            <span className="text-xs">Movies</span>
          </Link>
          <Button 
            variant="ghost" 
            className="flex flex-col items-center h-auto py-1 text-navy-light"
          >
            <span className="text-xs">Sign In</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
