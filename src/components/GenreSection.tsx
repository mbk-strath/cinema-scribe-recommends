
import { useState, useEffect } from 'react';
import { getBooksByGenre, getMoviesByGenre, type Media } from '@/services/mediaService';
import MediaCard from './MediaCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GenreSectionProps {
  currentMedia: Media;
}

const GenreSection = ({ currentMedia }: GenreSectionProps) => {
  const [similarMedia, setSimilarMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const loadSimilarMedia = async () => {
      try {
        setLoading(true);
        const mainGenre = currentMedia.genres[0]; // Use first genre
        
        if (currentMedia.type === 'book') {
          const books = await getBooksByGenre(mainGenre);
          // Filter out current media
          setSimilarMedia(books.filter(book => book.id !== currentMedia.id));
        } else {
          const movies = await getMoviesByGenre(mainGenre);
          // Filter out current media
          setSimilarMedia(movies.filter(movie => movie.id !== currentMedia.id));
        }
      } catch (error) {
        console.error('Error loading similar media:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentMedia.genres.length > 0) {
      loadSimilarMedia();
    }
  }, [currentMedia]);

  const itemsPerPage = 4;
  const maxIndex = Math.max(0, similarMedia.length - itemsPerPage);

  const handlePrevious = () => {
    setCurrentIndex(Math.max(0, currentIndex - itemsPerPage));
  };

  const handleNext = () => {
    setCurrentIndex(Math.min(maxIndex, currentIndex + itemsPerPage));
  };

  if (loading) {
    return (
      <div className="mt-8">
        <h2 className="text-2xl font-serif font-semibold mb-4">Similar {currentMedia.type === 'book' ? 'Books' : 'Movies'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-gray-200 animate-pulse rounded-lg aspect-[2/3]"></div>
          ))}
        </div>
      </div>
    );
  }

  if (similarMedia.length === 0) {
    return (
      <div className="mt-8">
        <h2 className="text-2xl font-serif font-semibold mb-4">Similar {currentMedia.type === 'book' ? 'Books' : 'Movies'}</h2>
        <p className="text-gray-500">No similar {currentMedia.type === 'book' ? 'books' : 'movies'} found in this genre.</p>
      </div>
    );
  }

  const visibleMedia = similarMedia.slice(currentIndex, currentIndex + itemsPerPage);

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-serif font-semibold">Similar {currentMedia.type === 'book' ? 'Books' : 'Movies'}</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            <ChevronLeft size={16} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {visibleMedia.map((media) => (
          <MediaCard key={media.id} media={media} />
        ))}
      </div>
    </div>
  );
};

export default GenreSection;
