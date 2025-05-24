
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Media } from '@/services/mediaService';

interface HeroProps {
  media: Media;
}

const Hero = ({ media }: HeroProps) => {
  const { id, title, description, type } = media;
  const creator = type === 'book' ? media.author : media.director;
  const backgroundImage = type === 'book' ? media.cover_url : media.poster_url;
  
  return (
    <section className="relative bg-navy text-white">
      {/* Gradient overlay + background image */}
      <div 
        className="absolute inset-0 opacity-20" 
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(8px)'
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/80"></div>
      
      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4">{title}</h1>
            <p className="text-lg text-gold-light font-medium mb-4">By {creator}</p>
            <p className="text-gray-300 mb-6">
              {description ? (
                description.length > 200 
                  ? `${description.substring(0, 200)}...` 
                  : description
              ) : 'No description available'}
            </p>
            <Button asChild className="bg-gold hover:bg-gold-light text-navy">
              <Link to={`/detail/${id}`}>
                Learn More <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="hidden md:block">
            <img 
              src={backgroundImage} 
              alt={title}
              className="rounded-lg shadow-lg max-h-[500px] mx-auto"
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
