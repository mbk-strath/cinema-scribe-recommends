
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Book, Film, Plus, Star as StarIcon } from 'lucide-react';
import Navbar from '@/components/Navbar';
import StarRating from '@/components/StarRating';
import ReviewCard from '@/components/ReviewCard';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { getMediaById, Media } from '@/lib/data';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

const Detail = () => {
  const { id } = useParams<{ id: string }>();
  const [media, setMedia] = useState<Media | undefined>(undefined);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [reviewText, setReviewText] = useState('');
  
  useEffect(() => {
    if (id) {
      const mediaItem = getMediaById(id);
      setMedia(mediaItem);
    }
  }, [id]);
  
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
  
  const { title, creator, cover, year, rating, genres, description, reviews, type } = media;
  
  const handleRatingClick = (value: number) => {
    setUserRating(value);
  };
  
  const handleSubmitReview = () => {
    // In a real app, this would submit the review to a database
    alert('Review submission would be implemented with a backend');
    setReviewText('');
    setUserRating(null);
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
                  src={cover} 
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
                  <StarRating rating={rating} size={20} />
                  <span className="text-sm text-gray-500">
                    {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                  </span>
                </div>
                <Button className="w-full mb-2 bg-navy hover:bg-navy-light">
                  <Plus size={16} className="mr-2" />
                  Add to List
                </Button>
                <Button variant="outline" className="w-full">
                  Share
                </Button>
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
              <p className="text-gray-700">{description}</p>
            </div>
            
            {/* Reviews Section */}
            <div className="mt-10">
              <h2 className="text-xl font-serif font-semibold mb-4">Reviews</h2>
              
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No reviews yet. Be the first to leave a review!</p>
              )}
              
              {/* Add Review Form */}
              <div className="mt-8 bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                <h3 className="font-medium mb-4">Write a Review</h3>
                
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
                
                <Button 
                  onClick={handleSubmitReview}
                  disabled={!userRating || !reviewText.trim()}
                  className="bg-navy hover:bg-navy-light transition-colors"
                >
                  Submit Review
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Detail;
