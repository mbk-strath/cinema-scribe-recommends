
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Book, Film, Search, User, LogOut, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile, isAdmin, signOut } = useAuth();
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getUserInitials = () => {
    if (!user) return 'GU';
    if (profile?.username) {
      return profile.username.substring(0, 2).toUpperCase();
    }
    return user.email ? user.email.substring(0, 2).toUpperCase() : 'GU';
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
              
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="rounded-full p-0 h-10 w-10 aspect-square">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={profile?.avatar_url || ""} />
                        <AvatarFallback className="bg-navy text-white text-sm">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="font-medium">
                      {profile?.username || user.email}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    
                    {isAdmin && (
                      <DropdownMenuItem onSelect={() => navigate('/admin')}>
                        <Shield className="mr-2 h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </DropdownMenuItem>
                    )}
                    
                    <DropdownMenuItem onSelect={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="outline" className="hidden md:flex gap-2" asChild>
                  <Link to="/auth">
                    <User size={16} />
                    Sign In
                  </Link>
                </Button>
              )}
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
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex flex-col items-center gap-1 py-1 h-auto bg-transparent border-none text-navy-light hover:text-navy transition-colors">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="bg-navy text-white text-xs">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs">Profile</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="font-medium">
                  {profile?.username || user.email}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                
                {isAdmin && (
                  <DropdownMenuItem onSelect={() => navigate('/admin')}>
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Admin Dashboard</span>
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuItem onSelect={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link 
              to="/auth" 
              className="flex flex-col items-center gap-1 py-1 text-navy-light hover:text-navy transition-colors"
            >
              <User size={18} />
              <span className="text-xs">Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
