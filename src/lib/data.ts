
export type MediaType = 'book' | 'movie';

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  content: string;
  date: string;
}

export interface Media {
  id: string;
  type: MediaType;
  title: string;
  creator: string;
  cover: string;
  year: number;
  rating: number;
  genres: string[];
  description: string;
  reviews: Review[];
  featured?: boolean;
}

export const sampleBooks: Media[] = [
  {
    id: 'b1',
    type: 'book',
    title: 'The Midnight Library',
    creator: 'Matt Haig',
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=687&auto=format&fit=crop',
    year: 2020,
    rating: 4.2,
    genres: ['Fiction', 'Fantasy', 'Self-Help'],
    description: 'Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.',
    reviews: [
      {
        id: 'r1',
        userId: 'u1',
        userName: 'BookLover42',
        userAvatar: 'https://i.pravatar.cc/150?img=1',
        rating: 5,
        content: 'A beautiful exploration of the choices we make and their impact. This book made me reflect on my own life choices.',
        date: '2023-05-15'
      },
      {
        id: 'r2',
        userId: 'u2',
        userName: 'ReadingEnthusiast',
        userAvatar: 'https://i.pravatar.cc/150?img=2',
        rating: 4,
        content: 'Thought-provoking and emotional. The concept is brilliant though I found the middle section somewhat repetitive.',
        date: '2023-04-22'
      }
    ],
    featured: true
  },
  {
    id: 'b2',
    type: 'book',
    title: 'Project Hail Mary',
    creator: 'Andy Weir',
    cover: 'https://images.unsplash.com/photo-1629992101753-56d196c8aabb?q=80&w=690&auto=format&fit=crop',
    year: 2021,
    rating: 4.7,
    genres: ['Science Fiction', 'Adventure'],
    description: 'Ryland Grace is the sole survivor on a desperate mission - and if he fails, humanity and the earth itself will perish.',
    reviews: [
      {
        id: 'r3',
        userId: 'u3',
        userName: 'SciFiReader',
        userAvatar: 'https://i.pravatar.cc/150?img=3',
        rating: 5,
        content: 'As good as The Martian, maybe even better! The scientific accuracy combined with the compelling story kept me hooked.',
        date: '2023-06-03'
      }
    ]
  },
  {
    id: 'b3',
    type: 'book',
    title: 'Where the Crawdads Sing',
    creator: 'Delia Owens',
    cover: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?q=80&w=1000&auto=format&fit=crop',
    year: 2018,
    rating: 4.5,
    genres: ['Fiction', 'Coming of Age', 'Mystery'],
    description: 'A tale of a young woman who raised herself in the marshes of the deep South, and a murder investigation that rocks her community.',
    reviews: []
  },
  {
    id: 'b4',
    type: 'book',
    title: 'Klara and the Sun',
    creator: 'Kazuo Ishiguro',
    cover: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=1042&auto=format&fit=crop',
    year: 2021,
    rating: 4.1,
    genres: ['Science Fiction', 'Literary Fiction'],
    description: 'The story of an Artificial Friend with outstanding observational qualities, who watches the behavior of those who come to browse the store.',
    reviews: [],
    featured: true
  }
];

export const sampleMovies: Media[] = [
  {
    id: 'm1',
    type: 'movie',
    title: 'Everything Everywhere All at Once',
    creator: 'Daniels',
    cover: 'https://images.unsplash.com/photo-1615414047026-98e41a97cdab?q=80&w=1064&auto=format&fit=crop',
    year: 2022,
    rating: 4.8,
    genres: ['Comedy', 'Action', 'Sci-Fi'],
    description: 'An aging Chinese immigrant is swept up in an insane adventure, where she alone can save the world by exploring other universes.',
    reviews: [
      {
        id: 'r4',
        userId: 'u1',
        userName: 'FilmBuff',
        userAvatar: 'https://i.pravatar.cc/150?img=4',
        rating: 5,
        content: 'Mind-blowing visuals and a deeply emotional core make this one of the best films of the decade.',
        date: '2023-02-11'
      },
      {
        id: 'r5',
        userId: 'u4',
        userName: 'MovieCritic',
        userAvatar: 'https://i.pravatar.cc/150?img=5',
        rating: 4.5,
        content: 'A perfect blend of action, comedy, and heart. Michelle Yeoh delivers a career-best performance.',
        date: '2023-01-30'
      }
    ],
    featured: true
  },
  {
    id: 'm2',
    type: 'movie',
    title: 'Dune',
    creator: 'Denis Villeneuve',
    cover: 'https://images.unsplash.com/photo-1631785641066-736e4c559e13?q=80&w=1064&auto=format&fit=crop',
    year: 2021,
    rating: 4.5,
    genres: ['Sci-Fi', 'Adventure', 'Drama'],
    description: 'Feature adaptation of Frank Herbert\'s science fiction novel, about the son of a noble family entrusted with the protection of the most valuable asset in the galaxy.',
    reviews: [
      {
        id: 'r6',
        userId: 'u5',
        userName: 'SciFiEnthusiast',
        userAvatar: 'https://i.pravatar.cc/150?img=6',
        rating: 5,
        content: 'Villeneuve has crafted a visual masterpiece that stays true to Herbert\'s vision. Stunning cinematography and sound design.',
        date: '2023-03-22'
      }
    ]
  },
  {
    id: 'm3',
    type: 'movie',
    title: 'The Shawshank Redemption',
    creator: 'Frank Darabont',
    cover: 'https://images.unsplash.com/photo-1591951425308-0a821cc95e35?q=80&w=1064&auto=format&fit=crop',
    year: 1994,
    rating: 4.9,
    genres: ['Drama'],
    description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    reviews: [],
    featured: true
  },
  {
    id: 'm4',
    type: 'movie',
    title: 'Parasite',
    creator: 'Bong Joon-ho',
    cover: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1025&auto=format&fit=crop',
    year: 2019,
    rating: 4.7,
    genres: ['Drama', 'Thriller', 'Comedy'],
    description: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
    reviews: []
  }
];

export const getAllMedia = (): Media[] => {
  return [...sampleBooks, ...sampleMovies];
};

export const getFeaturedMedia = (): Media[] => {
  return getAllMedia().filter(media => media.featured);
};

export const getBooksByGenre = (genre: string): Media[] => {
  return sampleBooks.filter(book => book.genres.includes(genre));
};

export const getMoviesByGenre = (genre: string): Media[] => {
  return sampleMovies.filter(movie => movie.genres.includes(genre));
};

export const getMediaById = (id: string): Media | undefined => {
  return getAllMedia().find(media => media.id === id);
};

export const searchMedia = (query: string): Media[] => {
  const lowerCaseQuery = query.toLowerCase();
  return getAllMedia().filter(
    media => 
      media.title.toLowerCase().includes(lowerCaseQuery) || 
      media.creator.toLowerCase().includes(lowerCaseQuery) ||
      media.genres.some(genre => genre.toLowerCase().includes(lowerCaseQuery))
  );
};
