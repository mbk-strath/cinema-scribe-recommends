import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Book, Film, Plus, Star as StarIcon, Edit, Trash2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import StarRating from '@/components/StarRating';
import Footer from '@/components/Footer';
import ReviewCard from '@/components/ReviewCard';
import GenreSection from '@/components/GenreSection';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { getMediaById, Media, Review, getReviewsByMediaId, addReview, updateBook, updateMovie } from '@/services/mediaService';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';

const Detail = () => {
  const { id } = useParams<{ id: string }>();
  const [media, setMedia] = useState<Media | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [reviewText, setReviewText] = useState('');
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const { toast } = useToast();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    const loadMedia = async () => {
      if (id) {
        try {
          const mediaData = await getMediaById(id);
          setMedia(mediaData);
          
          // Load reviews for this media
          if (mediaData) {
            const reviewsData = await getReviewsByMediaId(id);
            setReviews(reviewsData);
          }
        } catch (error) {
          console.error('Error loading media:', error);
          toast({
            title: 'Error',
            description: 'Could not load the requested media',
            variant: 'destructive'
          });
        }
      }
    };
    
    loadMedia();
  }, [id, toast]);
  
  if (!media) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-xl">Media not found</p>
          <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">
            Go back to home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }
  
  const { title, year, genres = [], description, type, id: mediaId } = media;
  const creator = type === 'book' ? media.author : media.director;
  const coverImage = type === 'book' ? media.cover_url : media.poster_url;
  
  const handleRatingClick = (value: number) => {
    setUserRating(value);
  };
  
  const handleSubmitReview = async () => {
    if (!user || !userRating) return;
    
    try {
      setIsSubmitting(true);
      
      await addReview({
        media_id: mediaId,
        media_type: type,
        user_id: user.id,
        rating: userRating,
        content: reviewText.trim() || null
      });
      
      // Refresh reviews
      const updatedReviews = await getReviewsByMediaId(mediaId);
      setReviews(updatedReviews);
      
      toast({
        title: 'Success',
        description: 'Your review has been submitted',
      });
      
      setReviewText('');
      setUserRating(null);
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: 'Error',
        description: 'Could not submit your review',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setUserRating(review.rating);
    setReviewText(review.content || '');
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!user) return;
    
    try {
      // You'll need to implement deleteReview in mediaService
      console.log('Delete review:', reviewId);
      
      // Refresh reviews after deletion
      const updatedReviews = await getReviewsByMediaId(mediaId);
      setReviews(updatedReviews);
      
      toast({
        title: 'Success',
        description: 'Review deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting review:', error);
      toast({
        title: 'Error',
        description: 'Could not delete review',
        variant: 'destructive'
      });
    }
  };

  const handleUpdate = async (formData: FormData) => {
    try {
      setIsSubmitting(true);
      
      const updates: any = {
        title: formData.get('title') as string,
        year: parseInt(formData.get('year') as string),
        genres: (formData.get('genres') as string).split(',').map(g => g.trim()),
        description: formData.get('description') as string,
      };
      
      if (type === 'book') {
        updates.author = formData.get('creator') as string;
        updates.cover_url = formData.get('image_url') as string;
        
        const updatedBook = await updateBook(mediaId, updates);
        setMedia(updatedBook);
      } else {
        updates.director = formData.get('creator') as string;
        updates.poster_url = formData.get('image_url') as string;
        
        const updatedMovie = await updateMovie(mediaId, updates);
        setMedia(updatedMovie);
      }
      
      toast({
        title: 'Success',
        description: `${type === 'book' ? 'Book' : 'Movie'} updated successfully`,
      });
      
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating:', error);
      toast({
        title: 'Error',
        description: `Could not update the ${type}`,
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 md:px-6 py-8">
        <Link 
          to="/browse" 
          className="inline-flex items-center text-gray-600 hover:text-navy mb-6 transition-colors duration-200"
        >
          <ChevronLeft size={16} />
          <span>Back to Browse</span>
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Media Cover & Info */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="relative">
                <img 
                  src={coverImage} 
                  alt={title}
                  className="w-full aspect-[2/3] object-cover" 
                />
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm rounded-full p-2 cursor-help">
                      {type === 'book' ? <Book size={20} /> : <Film size={20} />}
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-56">
                    <div className="font-medium">{type === 'book' ? 'Book' : 'Movie'}</div>
                    <p className="text-sm text-muted-foreground">
                      {type === 'book' ? 'Literary work' : 'Cinematic work'} by {creator} ({year})
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <StarRating rating={4} size={20} />
                  <span className="text-sm text-gray-500">
                    {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                  </span>
                </div>
                <Button className="w-full mb-2 bg-navy hover:bg-navy-light">
                  <Plus size={16} className="mr-2" />
                  Add to List
                </Button>
                
                {isAdmin && (
                  <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full mt-2">
                        <Edit size={16} className="mr-2" />
                        Edit {type === 'book' ? 'Book' : 'Movie'}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[525px]">
                      <DialogHeader>
                        <DialogTitle>Edit {type === 'book' ? 'Book' : 'Movie'}</DialogTitle>
                        <DialogDescription>
                          Make changes to the {type} information below.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        handleUpdate(new FormData(e.currentTarget));
                      }} className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Title</Label>
                          <Input id="title" name="title" defaultValue={title} required />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="creator">{type === 'book' ? 'Author' : 'Director'}</Label>
                          <Input id="creator" name="creator" defaultValue={creator} required />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="year">Year</Label>
                            <Input id="year" name="year" type="number" defaultValue={year} required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="genres">Genres (comma separated)</Label>
                            <Input id="genres" name="genres" defaultValue={genres.join(', ')} required />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="image_url">{type === 'book' ? 'Cover' : 'Poster'} Image URL</Label>
                          <Input id="image_url" name="image_url" type="url" defaultValue={coverImage} required />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea id="description" name="description" rows={4} defaultValue={description || ''} />
                        </div>
                        
                        <div className="flex justify-end gap-2 pt-2">
                          <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
          </div>
          
          {/* Media Details */}
          <div className="md:col-span-2">
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">{title}</h1>
            <div className="flex items-center gap-2 text-gray-600 mb-4">
              <span>{creator}</span>
              <span>•</span>
              <span>{year}</span>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {genres.map((genre) => (
                <span 
                  key={genre}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  {genre}
                </span>
              ))}
            </div>
            
            <div className="prose max-w-none mb-8">
              <h2 className="text-xl font-serif font-semibold mb-2">Description</h2>
              <p className="text-gray-700">{description || 'No description available.'}</p>
            </div>
            
            {/* Genre Section for Similar Content */}
            <GenreSection currentMedia={media} />
            
            {/* Reviews Section */}
            <div className="mt-10">
              <h2 className="text-xl font-serif font-semibold mb-4">Reviews</h2>
              
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <ReviewCard 
                      key={review.id} 
                      review={review}
                      onEdit={handleEditReview}
                      onDelete={handleDeleteReview}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No reviews yet. Be the first to leave a review!</p>
              )}
              
              {/* Add Review Form */}
              {user ? (
                <div className="mt-8 bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <h3 className="font-medium mb-4">
                    {editingReview ? 'Edit Your Review' : 'Write a Review'}
                  </h3>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Your Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleRatingClick(star)}
                          className={`p-1 rounded-full hover:bg-gray-200 transition-colors ${
                            userRating && userRating >= star ? 'text-gold-DEFAULT' : 'text-gray-300'
                          }`}
                        >
                          <StarIcon key={star} size={24} fill={userRating && userRating >= star ? '#e6b54a' : 'none'} />
                        </button>
                      ))}
                      {userRating && (
                        <span className="ml-2 self-center text-sm">{userRating} stars</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Your Review</label>
                    <Textarea 
                      placeholder="Write your thoughts here..."
                      rows={4}
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      className="resize-none focus:ring-navy focus:border-navy"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleSubmitReview}
                      disabled={!userRating || isSubmitting}
                      className="bg-navy hover:bg-navy-light transition-colors"
                    >
                      {isSubmitting ? 'Submitting...' : editingReview ? 'Update Review' : 'Submit Review'}
                    </Button>
                    {editingReview && (
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setEditingReview(null);
                          setUserRating(null);
                          setReviewText('');
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="mt-8 bg-gray-50 p-5 rounded-lg border border-gray-200 text-center">
                  <p className="mb-4">Please sign in to leave a review</p>
                  <Button onClick={() => navigate('/auth')}>Sign In</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Detail;
