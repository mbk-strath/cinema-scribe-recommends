
import { formatDistanceToNow } from 'date-fns';
import StarRating from './StarRating';
import { type Review } from '@/services/mediaService';

interface ReviewCardProps {
  review: Review;
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  const { content, rating, created_at, user } = review;
  
  const formattedDate = created_at ? formatDistanceToNow(
    new Date(created_at),
    { addSuffix: true }
  ) : 'unknown time';
  
  return (
    <div className="p-5 border border-gray-200 rounded-lg mb-4 bg-white shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
          {user?.avatar_url ? (
            <img 
              src={user.avatar_url} 
              alt={user.username}
              className="w-full h-full object-cover" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-navy text-white">
              {user?.username?.charAt(0) || '?'}
            </div>
          )}
        </div>
        <div>
          <h4 className="font-medium">{user?.username || 'Anonymous'}</h4>
          <div className="flex items-center gap-2">
            <StarRating rating={rating} size={14} />
            <span className="text-xs text-gray-500">{formattedDate}</span>
          </div>
        </div>
      </div>
      <p className="text-gray-700">{content || 'No comment provided.'}</p>
    </div>
  );
};

export default ReviewCard;
