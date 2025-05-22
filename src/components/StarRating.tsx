
import { Star, StarHalf } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  className?: string;
}

const StarRating = ({ 
  rating, 
  maxRating = 5, 
  size = 16,
  className = ''
}: StarRatingProps) => {
  // Generate an array for rendering stars
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <Star 
        key={`full-${i}`} 
        fill="#e6b54a" 
        strokeWidth={0} 
        size={size}
      />
    );
  }
  
  // Add half star if applicable
  if (hasHalfStar && fullStars < maxRating) {
    stars.push(
      <StarHalf 
        key="half" 
        fill="#e6b54a" 
        size={size}
      />
    );
  }
  
  // Add empty stars
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <Star 
        key={`empty-${i}`} 
        className="text-gray-300" 
        size={size}
      />
    );
  }
  
  return (
    <div className={`flex items-center ${className}`}>
      {stars}
      {rating > 0 && (
        <span className="ml-2 text-sm font-medium">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;
