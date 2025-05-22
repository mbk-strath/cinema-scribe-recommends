
import { formatDistanceToNow } from 'date-fns';
import { Review } from '@/lib/data';
import StarRating from './StarRating';

interface ReviewCardProps {
  review: Review;
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  const { userName, userAvatar, rating, content, date } = review;
  
  const formattedDate = formatDistanceToNow(
    new Date(date),
    { addSuffix: true }
  );
  
  return (
    <div className="p-5 border border-gray-200 rounded-lg mb-4 bg-white shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
          {userAvatar ? (
            <img 
              src={userAvatar} 
              alt={userName}
              className="w-full h-full object-cover" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-navy text-white">
              {userName.charAt(0)}
            </div>
          )}
        </div>
        <div>
          <h4 className="font-medium">{userName}</h4>
          <div className="flex items-center gap-2">
            <StarRating rating={rating} size={14} />
            <span className="text-xs text-gray-500">{formattedDate}</span>
          </div>
        </div>
      </div>
      <p className="text-gray-700">{content}</p>
    </div>
  );
};

export default ReviewCard;
