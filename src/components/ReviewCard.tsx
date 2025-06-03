
import { formatDistanceToNow } from 'date-fns';
import StarRating from './StarRating';
import { type Review } from '@/services/mediaService';
import { Button } from '@/components/ui/button';
import { Trash2, Edit } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ReviewCardProps {
  review: Review;
  onEdit?: (review: Review) => void;
  onDelete?: (reviewId: string) => void;
}

const ReviewCard = ({ review, onEdit, onDelete }: ReviewCardProps) => {
  const { content, rating, created_at, user, id } = review;
  const { user: currentUser, isAdmin } = useAuth();
  
  const formattedDate = created_at ? formatDistanceToNow(
    new Date(created_at),
    { addSuffix: true }
  ) : 'unknown time';
  
  const canEdit = currentUser && (currentUser.id === review.user_id);
  const canDelete = currentUser && (currentUser.id === review.user_id || isAdmin);
  
  return (
    <div className="p-5 border border-gray-200 rounded-lg mb-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
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
        
        {(canEdit || canDelete) && (
          <div className="flex gap-2">
            {canEdit && onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(review)}
                className="text-gray-500 hover:text-navy"
              >
                <Edit size={14} />
              </Button>
            )}
            {canDelete && onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(id)}
                className="text-gray-500 hover:text-red-600"
              >
                <Trash2 size={14} />
              </Button>
            )}
          </div>
        )}
      </div>
      <p className="text-gray-700">{content || 'No comment provided.'}</p>
    </div>
  );
};

export default ReviewCard;
