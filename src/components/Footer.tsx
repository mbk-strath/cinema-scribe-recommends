
import { Link } from 'react-router-dom';
import { Book, Film } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-navy text-white pt-12 pb-6">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div>
            <h3 className="font-serif text-xl font-bold mb-4">PageScreen</h3>
            <p className="text-gray-300">
              Your ultimate destination for discovering, rating, and reviewing books and movies.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Explore</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/browse?type=book" className="text-gray-300 hover:text-gold flex items-center gap-2">
                  <Book size={16} />
                  Books
                </Link>
              </li>
              <li>
                <Link to="/browse?type=movie" className="text-gray-300 hover:text-gold flex items-center gap-2">
                  <Film size={16} />
                  Movies
                </Link>
              </li>
              <li>
                <Link to="/browse" className="text-gray-300 hover:text-gold">
                  Browse All
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-300 hover:text-gold">
                  Featured
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Account</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-gold">
                  Sign In
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-gold">
                  Create Account
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-gold">
                  My Reviews
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} PageScreen. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
