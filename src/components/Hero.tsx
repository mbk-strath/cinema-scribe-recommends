
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Media } from '@/lib/data';

interface HeroProps {
  media: Media;
}

const Hero = ({ media }: HeroProps) => {
  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${media.cover})` }}
      />
      <div className="hero-gradient absolute inset-0" />
      <div className="container relative z-10 h-full flex flex-col justify-end pb-16 md:pb-24 px-4 md:px-6">
        <div className="max-w-xl animate-fade-up">
          <div className="inline-block bg-gold px-3 py-1 rounded-full text-xs font-medium text-navy mb-4">
            Featured {media.type === 'book' ? 'Book' : 'Movie'}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">{media.title}</h1>
          <p className="text-lg text-gray-200 mb-4">
            By {media.creator} • {media.year}
          </p>
          <p className="text-gray-300 mb-6 line-clamp-2 md:line-clamp-3">
            {media.description}
          </p>
          <div className="flex gap-4">
            <Button asChild className="bg-gold hover:bg-gold-light text-navy font-medium">
              <Link to={`/detail/${media.id}`}>View Details</Link>
            </Button>
            <Button variant="outline" className="text-white border-white hover:bg-white/10">
              Add to List
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
