
import { Link } from 'react-router-dom';
import { Book, Film } from 'lucide-react';
import { Media } from '@/lib/data';
import StarRating from './StarRating';

interface MediaCardProps {
  media: Media;
}

const MediaCard = ({ media }: MediaCardProps) => {
  const { id, type, title, creator, cover, year, rating, genres } = media;
  
  return (
    <Link to={`/detail/${id}`} className="media-card block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all">
      <div className="relative aspect-[2/3] overflow-hidden">
        <img 
          src={cover} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm rounded-full p-1.5">
          {type === 'book' ? <Book size={16} /> : <Film size={16} />}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-serif font-medium text-lg line-clamp-1">{title}</h3>
        <p className="text-sm text-gray-600 mb-2">{creator} • {year}</p>
        <StarRating rating={rating} />
        <div className="mt-3 flex flex-wrap gap-1">
          {genres.slice(0, 2).map(genre => (
            <span 
              key={genre} 
              className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
            >
              {genre}
            </span>
          ))}
          {genres.length > 2 && (
            <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
              +{genres.length - 2}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default MediaCard;
