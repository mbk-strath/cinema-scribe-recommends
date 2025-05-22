
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Book, Film, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center py-4 px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-navy font-serif font-bold text-2xl group-hover:text-navy-light transition-colors">Critique Corner</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link 
            to="/browse?type=book" 
            className="flex items-center gap-1.5 text-navy-light hover:text-navy transition font-medium hover:scale-105 transition-transform"
          >
            <Book size={18} />
            Books
          </Link>
          <Link 
            to="/browse?type=movie" 
            className="flex items-center gap-1.5 text-navy-light hover:text-navy transition font-medium hover:scale-105 transition-transform"
          >
            <Film size={18} />
            Movies
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {isSearchOpen ? (
            <form onSubmit={handleSearchSubmit} className="animate-fade-in flex items-center gap-2">
              <Input 
                type="search" 
                placeholder="Search books and movies..." 
                className="w-[200px] md:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsSearchOpen(false)}
                className="text-gray-500"
                type="button"
              >
                Cancel
              </Button>
            </form>
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
              
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="hidden md:flex gap-2">
                    <User size={16} />
                    Sign In
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Sign In</SheetTitle>
                    <SheetDescription>
                      Access your account to save reviews and manage your content.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="py-4 mt-4">
                    <form className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input type="email" placeholder="your@email.com" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Password</label>
                        <Input type="password" placeholder="••••••••" />
                      </div>
                      <Button type="button" className="w-full">Sign In</Button>
                    </form>
                    <div className="mt-4 text-center text-sm text-gray-500">
                      <p>Don't have an account? <Button variant="link" className="p-0 h-auto font-normal">Register</Button></p>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </>
          )}
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="md:hidden border-t border-gray-100">
        <div className="flex justify-around py-2">
          <Link 
            to="/browse?type=book" 
            className="flex flex-col items-center gap-1 py-1 text-navy-light hover:text-navy transition-colors"
          >
            <Book size={18} />
            <span className="text-xs">Books</span>
          </Link>
          <Link 
            to="/browse?type=movie" 
            className="flex flex-col items-center gap-1 py-1 text-navy-light hover:text-navy transition-colors"
          >
            <Film size={18} />
            <span className="text-xs">Movies</span>
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <button className="flex flex-col items-center gap-1 py-1 text-navy-light hover:text-navy transition-colors bg-transparent border-none">
                <User size={18} />
                <span className="text-xs">Sign In</span>
              </button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Sign In</SheetTitle>
                <SheetDescription>
                  Access your account to save reviews and manage your content.
                </SheetDescription>
              </SheetHeader>
              <div className="py-4 mt-4">
                <form className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input type="email" placeholder="your@email.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Password</label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                  <Button type="button" className="w-full">Sign In</Button>
                </form>
                <div className="mt-4 text-center text-sm text-gray-500">
                  <p>Don't have an account? <Button variant="link" className="p-0 h-auto font-normal">Register</Button></p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
